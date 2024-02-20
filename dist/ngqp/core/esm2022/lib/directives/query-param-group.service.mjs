import { Inject, Injectable, isDevMode, Optional } from '@angular/core';
import { EMPTY, forkJoin, from, Subject, zip } from 'rxjs';
import { catchError, concatMap, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { compareParamMaps, filterParamMap, isMissing, isPresent, NOP } from '../util';
import { PartitionedQueryParam } from '../model/query-param';
import { NGQP_ROUTER_ADAPTER, NGQP_ROUTER_OPTIONS } from '../router-adapter/router-adapter.interface';
import * as i0 from "@angular/core";
/** @internal */
function isMultiQueryParam(queryParam) {
    return queryParam.multi;
}
/** @internal */
class NavigationData {
    params;
    synthetic;
    constructor(params, synthetic = false) {
        this.params = params;
        this.synthetic = synthetic;
    }
}
/**
 * Service implementing the synchronization logic
 *
 * This service is the key to the synchronization process by binding a {@link QueryParamGroup}
 * to the router.
 *
 * @internal
 */
export class QueryParamGroupService {
    routerAdapter;
    globalRouterOptions;
    /** The {@link QueryParamGroup} to bind. */
    queryParamGroup = null;
    /** List of {@link QueryParamAccessor} registered to this service. */
    directives = new Map();
    /**
     * Queue of navigation parameters
     *
     * A queue is used for navigations as we need to make sure all parameter changes
     * are executed in sequence as otherwise navigations might overwrite each other.
     */
    queue$ = new Subject();
    /** @ignore */
    synchronizeRouter$ = new Subject();
    /** @ignore */
    destroy$ = new Subject();
    constructor(routerAdapter, globalRouterOptions) {
        this.routerAdapter = routerAdapter;
        this.globalRouterOptions = globalRouterOptions;
        this.setupNavigationQueue();
    }
    /** @ignore */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.synchronizeRouter$.complete();
        this.queryParamGroup?._clearChangeFunctions();
        if (this.queryParamGroup?.options?.clearOnDestroy) {
            const nullParams = Object.values(this.queryParamGroup.queryParams)
                .map(queryParam => this.wrapIntoPartition(queryParam))
                .map(partitionedQueryParam => partitionedQueryParam.queryParams.map(queryParam => queryParam.urlParam))
                .reduce((a, b) => [...a, ...b], [])
                .map(urlParam => ({ [urlParam]: null }))
                .reduce((a, b) => ({ ...a, ...b }), {});
            this.routerAdapter.navigate(nullParams, {
                replaceUrl: true,
            }).then();
        }
    }
    /**
     * Uses the given {@link QueryParamGroup} for synchronization.
     */
    setQueryParamGroup(queryParamGroup) {
        // FIXME: If this is called when we already have a group, we probably need to do
        //        some cleanup first.
        if (this.queryParamGroup) {
            throw new Error(`A QueryParamGroup has already been setup. Changing the group is currently not supported.`);
        }
        this.queryParamGroup = queryParamGroup;
        this.startSynchronization();
    }
    /**
     * Registers a {@link QueryParamAccessor}.
     */
    registerQueryParamDirective(directive) {
        if (!directive.valueAccessor) {
            throw new Error(`No value accessor found for the form control. Please make sure to implement ControlValueAccessor on this component.`);
        }
        // Capture the name here, particularly for the queue below to avoid re-evaluating
        // it as it might change over time.
        const queryParamName = directive.name;
        const partitionedQueryParam = this.getQueryParamAsPartition(queryParamName);
        // Chances are that we read the initial route before a directive has been registered here.
        // The value in the model will be correct, but we need to sync it to the view once initially.
        directive.valueAccessor.writeValue(partitionedQueryParam.value);
        // Proxy updates from the view to debounce them (if needed).
        const queues = partitionedQueryParam.queryParams.map(() => new Subject());
        zip(...queues.map((queue$, index) => {
            const queryParam = partitionedQueryParam.queryParams[index];
            return queue$.pipe(isPresent(queryParam.debounceTime) ? debounceTime(queryParam.debounceTime) : tap());
        })).pipe(
        // Do not synchronize while the param is detached from the group
        filter(() => !!this.getQueryParamGroup().get(queryParamName)), map((newValue) => this.getParamsForValue(partitionedQueryParam, partitionedQueryParam.reduce(newValue))), takeUntil(this.destroy$)).subscribe(params => this.enqueueNavigation(new NavigationData(params)));
        directive.valueAccessor.registerOnChange((newValue) => {
            const partitioned = partitionedQueryParam.partition(newValue);
            queues.forEach((queue$, index) => queue$.next(partitioned[index]));
        });
        this.directives.set(queryParamName, [...(this.directives.get(queryParamName) || []), directive]);
    }
    /**
     * Deregisters a {@link QueryParamAccessor} by referencing its name.
     */
    deregisterQueryParamDirective(queryParamName) {
        if (!queryParamName) {
            return;
        }
        const directives = this.directives.get(queryParamName);
        if (!directives) {
            return;
        }
        directives.forEach(directive => {
            directive.valueAccessor.registerOnChange(NOP);
            directive.valueAccessor.registerOnTouched(NOP);
        });
        this.directives.delete(queryParamName);
        const queryParam = this.getQueryParamGroup().get(queryParamName);
        if (queryParam) {
            queryParam._clearChangeFunctions();
        }
    }
    startSynchronization() {
        this.setupGroupChangeListener();
        this.setupParamChangeListeners();
        this.setupRouterListener();
        this.watchNewParams();
    }
    /** Listens for programmatic changes on group level and synchronizes to the router. */
    setupGroupChangeListener() {
        this.getQueryParamGroup()._registerOnChange((newValue) => {
            if (newValue === null) {
                throw new Error(`Received null value from QueryParamGroup.`);
            }
            let params = {};
            Object.keys(newValue).forEach(queryParamName => {
                const queryParam = this.getQueryParamGroup().get(queryParamName);
                if (isMissing(queryParam)) {
                    return;
                }
                params = { ...params, ...this.getParamsForValue(queryParam, newValue[queryParamName]) };
            });
            this.enqueueNavigation(new NavigationData(params, true));
        });
    }
    /** Listens for programmatic changes on parameter level and synchronizes to the router. */
    setupParamChangeListeners() {
        Object.keys(this.getQueryParamGroup().queryParams)
            .forEach(queryParamName => this.setupParamChangeListener(queryParamName));
    }
    setupParamChangeListener(queryParamName) {
        const queryParam = this.getQueryParamGroup().get(queryParamName);
        if (!queryParam) {
            throw new Error(`No param in group found for name ${queryParamName}`);
        }
        queryParam._registerOnChange((newValue) => this.enqueueNavigation(new NavigationData(this.getParamsForValue(queryParam, newValue), true)));
    }
    /** Listens for changes in the router and synchronizes to the model. */
    setupRouterListener() {
        this.synchronizeRouter$.pipe(startWith(undefined), switchMap(() => this.routerAdapter.queryParamMap.pipe(
        // We want to ignore changes to query parameters which aren't related to this
        // particular group; however, we do need to react if one of our parameters has
        // vanished when it was set before.
        distinctUntilChanged((previousMap, currentMap) => {
            const keys = Object.values(this.getQueryParamGroup().queryParams)
                .map(queryParam => this.wrapIntoPartition(queryParam))
                .map(partitionedQueryParam => partitionedQueryParam.queryParams.map(queryParam => queryParam.urlParam))
                .reduce((a, b) => [...a, ...b], []);
            // It is important that we filter the maps only here so that both are filtered
            // with the same set of keys; otherwise, e.g. removing a parameter from the group
            // would interfere.
            return compareParamMaps(filterParamMap(previousMap, keys), filterParamMap(currentMap, keys));
        }))), switchMap(queryParamMap => {
            // We need to capture this right here since this is only set during the on-going navigation.
            const synthetic = this.isSyntheticNavigation();
            const queryParamNames = Object.keys(this.getQueryParamGroup().queryParams);
            return forkJoin([...queryParamNames]
                .map(queryParamName => {
                const partitionedQueryParam = this.getQueryParamAsPartition(queryParamName);
                return forkJoin([...partitionedQueryParam.queryParams]
                    .map(queryParam => isMultiQueryParam(queryParam)
                    ? queryParam.deserializeValue(queryParamMap.getAll(queryParam.urlParam))
                    : queryParam.deserializeValue(queryParamMap.get(queryParam.urlParam)))).pipe(map(newValues => partitionedQueryParam.reduce(newValues)), tap(newValue => {
                    const directives = this.directives.get(queryParamName);
                    if (directives) {
                        directives.forEach(directive => directive.valueAccessor.writeValue(newValue));
                    }
                }), map(newValue => {
                    return { [queryParamName]: newValue };
                }), takeUntil(this.destroy$));
            })).pipe(map((values) => values.reduce((groupValue, value) => {
                return {
                    ...groupValue,
                    ...value,
                };
            }, {})), tap(groupValue => this.getQueryParamGroup().setValue(groupValue, {
                emitEvent: !synthetic,
                emitModelToViewChange: false,
            })));
        }), takeUntil(this.destroy$)).subscribe();
    }
    /** Listens for newly added parameters and starts synchronization for them. */
    watchNewParams() {
        this.getQueryParamGroup().queryParamAdded$.pipe(takeUntil(this.destroy$)).subscribe(queryParamName => {
            this.setupParamChangeListener(queryParamName);
            this.synchronizeRouter$.next();
        });
    }
    /** Returns true if the current navigation is synthetic. */
    isSyntheticNavigation() {
        const navigation = this.routerAdapter.getCurrentNavigation();
        if (!navigation || navigation.trigger !== 'imperative') {
            // When using the back / forward buttons, the state is passed along with it, even though
            // for us it's now a navigation initiated by the user. Therefore, a navigation can only
            // be synthetic if it has been triggered imperatively.
            // See https://github.com/angular/angular/issues/28108.
            return false;
        }
        return navigation.extras && navigation.extras.state && navigation.extras.state['synthetic'];
    }
    /** Subscribes to the parameter queue and executes navigations in sequence. */
    setupNavigationQueue() {
        this.queue$.pipe(takeUntil(this.destroy$), concatMap(data => this.navigateSafely(data))).subscribe();
    }
    navigateSafely(data) {
        return from(this.routerAdapter.navigate(data.params, {
            ...this.routerOptions,
            state: { synthetic: data.synthetic },
        })).pipe(catchError((err) => {
            if (isDevMode()) {
                console.error(`There was an error while navigating`, err);
            }
            return EMPTY;
        }));
    }
    /** Sends a change of parameters to the queue. */
    enqueueNavigation(data) {
        this.queue$.next(data);
    }
    /**
     * Returns the full set of parameters given a value for a parameter model.
     *
     * This consists mainly of properly serializing the model value and ensuring to take
     * side effect changes into account that may have been configured.
     */
    getParamsForValue(queryParam, value) {
        const partitionedQueryParam = this.wrapIntoPartition(queryParam);
        const partitioned = partitionedQueryParam.partition(value);
        const combinedParams = partitionedQueryParam.queryParams
            .map((current, index) => isMissing(current.combineWith) ? null : current.combineWith(partitioned[index]))
            .reduce((a, b) => {
            return { ...(a || {}), ...(b || {}) };
        }, {});
        const newValues = partitionedQueryParam.queryParams
            .map((current, index) => {
            return {
                [current.urlParam]: current.serializeValue(partitioned[index]),
            };
        })
            .reduce((a, b) => {
            return { ...a, ...b };
        }, {});
        // Note that we list the side-effect parameters first so that our actual parameter can't be
        // overridden by it.
        return {
            ...combinedParams,
            ...newValues,
        };
    }
    /**
     * Returns the current set of options to pass to the router.
     *
     * This merges the global configuration with the group specific configuration.
     */
    get routerOptions() {
        const groupOptions = this.getQueryParamGroup().routerOptions;
        return {
            ...(this.globalRouterOptions || {}),
            ...(groupOptions || {}),
        };
    }
    /**
     * Returns the query parameter with the given name as a partition.
     *
     * If the query parameter is partitioned, it is returned unchanged. Otherwise
     * it is wrapped into a noop partition. This makes it easy to operate on
     * query parameters independent of whether they are partitioned.
     */
    getQueryParamAsPartition(queryParamName) {
        const queryParam = this.getQueryParamGroup().get(queryParamName);
        if (!queryParam) {
            throw new Error(`Could not find query param with name ${queryParamName}. Did you forget to add it to your QueryParamGroup?`);
        }
        return this.wrapIntoPartition(queryParam);
    }
    /**
     * Wraps a query parameter into a partition if it isn't already.
     */
    wrapIntoPartition(queryParam) {
        if (queryParam instanceof PartitionedQueryParam) {
            return queryParam;
        }
        return new PartitionedQueryParam([queryParam], {
            partition: value => [value],
            reduce: values => values[0],
        });
    }
    getQueryParamGroup() {
        if (!this.queryParamGroup) {
            throw new Error(`No QueryParamGroup has been registered yet.`);
        }
        return this.queryParamGroup;
    }
    static ɵfac = function QueryParamGroupService_Factory(t) { return new (t || QueryParamGroupService)(i0.ɵɵinject(NGQP_ROUTER_ADAPTER), i0.ɵɵinject(NGQP_ROUTER_OPTIONS, 8)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QueryParamGroupService, factory: QueryParamGroupService.ɵfac });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamGroupService, [{
        type: Injectable
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: [NGQP_ROUTER_ADAPTER]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NGQP_ROUTER_OPTIONS]
            }] }], null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tZ3JvdXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25ncXAvY29yZS9zcmMvbGliL2RpcmVjdGl2ZXMvcXVlcnktcGFyYW0tZ3JvdXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQWEsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5GLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBYyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZFLE9BQU8sRUFDSCxVQUFVLEVBQ1YsU0FBUyxFQUNULFlBQVksRUFDWixvQkFBb0IsRUFDcEIsTUFBTSxFQUNOLEdBQUcsRUFDSCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxHQUFHLEVBQ04sTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXRGLE9BQU8sRUFBbUIscUJBQXFCLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQWdDLE1BQU0sNENBQTRDLENBQUM7O0FBR3BJLGdCQUFnQjtBQUNoQixTQUFTLGlCQUFpQixDQUFJLFVBQThDO0lBQ3hFLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQztBQUM1QixDQUFDO0FBRUQsZ0JBQWdCO0FBQ2hCLE1BQU0sY0FBYztJQUNHO0lBQXVCO0lBQTFDLFlBQW1CLE1BQWMsRUFBUyxZQUFxQixLQUFLO1FBQWpELFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFpQjtJQUNwRSxDQUFDO0NBQ0o7QUFFRDs7Ozs7OztH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Q0FBd0MsY0FBYyxxREFBcUQsQ0FBQyxDQUFDO1FBQ2pJLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7O09BRUc7SUFDSyxpQkFBaUIsQ0FDckIsVUFBMkY7UUFFM0YsSUFBSSxVQUFVLFlBQVkscUJBQXFCLEVBQUUsQ0FBQztZQUM5QyxPQUFPLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBRUQsT0FBTyxJQUFJLHFCQUFxQixDQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDcEQsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDM0IsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUM5QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDaEMsQ0FBQztnRkE1WFEsc0JBQXNCLGNBdUJuQixtQkFBbUIsZUFDUCxtQkFBbUI7Z0VBeEJsQyxzQkFBc0IsV0FBdEIsc0JBQXNCOztpRkFBdEIsc0JBQXNCO2NBRGxDLFVBQVU7O3NCQXdCRixNQUFNO3VCQUFDLG1CQUFtQjs7c0JBQzFCLFFBQVE7O3NCQUFJLE1BQU07dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBpc0Rldk1vZGUsIE9uRGVzdHJveSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgRU1QVFksIGZvcmtKb2luLCBmcm9tLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCB6aXAgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtcclxuICAgIGNhdGNoRXJyb3IsXHJcbiAgICBjb25jYXRNYXAsXHJcbiAgICBkZWJvdW5jZVRpbWUsXHJcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcclxuICAgIGZpbHRlcixcclxuICAgIG1hcCxcclxuICAgIHN0YXJ0V2l0aCxcclxuICAgIHN3aXRjaE1hcCxcclxuICAgIHRha2VVbnRpbCxcclxuICAgIHRhcFxyXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgY29tcGFyZVBhcmFtTWFwcywgZmlsdGVyUGFyYW1NYXAsIGlzTWlzc2luZywgaXNQcmVzZW50LCBOT1AgfSBmcm9tICcuLi91dGlsJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwIH0gZnJvbSAnLi4vbW9kZWwvcXVlcnktcGFyYW0tZ3JvdXAnO1xyXG5pbXBvcnQgeyBNdWx0aVF1ZXJ5UGFyYW0sIFBhcnRpdGlvbmVkUXVlcnlQYXJhbSwgUXVlcnlQYXJhbSB9IGZyb20gJy4uL21vZGVsL3F1ZXJ5LXBhcmFtJztcclxuaW1wb3J0IHsgTkdRUF9ST1VURVJfQURBUFRFUiwgTkdRUF9ST1VURVJfT1BUSU9OUywgUm91dGVyQWRhcHRlciwgUm91dGVyT3B0aW9ucyB9IGZyb20gJy4uL3JvdXRlci1hZGFwdGVyL3JvdXRlci1hZGFwdGVyLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IFF1ZXJ5UGFyYW1BY2Nlc3NvciB9IGZyb20gJy4vcXVlcnktcGFyYW0tYWNjZXNzb3IuaW50ZXJmYWNlJztcclxuXHJcbi8qKiBAaW50ZXJuYWwgKi9cclxuZnVuY3Rpb24gaXNNdWx0aVF1ZXJ5UGFyYW08VD4ocXVlcnlQYXJhbTogUXVlcnlQYXJhbTxUPiB8IE11bHRpUXVlcnlQYXJhbTxUPik6IHF1ZXJ5UGFyYW0gaXMgTXVsdGlRdWVyeVBhcmFtPFQ+IHtcclxuICAgIHJldHVybiBxdWVyeVBhcmFtLm11bHRpO1xyXG59XHJcblxyXG4vKiogQGludGVybmFsICovXHJcbmNsYXNzIE5hdmlnYXRpb25EYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJhbXM6IFBhcmFtcywgcHVibGljIHN5bnRoZXRpYzogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIGltcGxlbWVudGluZyB0aGUgc3luY2hyb25pemF0aW9uIGxvZ2ljXHJcbiAqXHJcbiAqIFRoaXMgc2VydmljZSBpcyB0aGUga2V5IHRvIHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBieSBiaW5kaW5nIGEge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH1cclxuICogdG8gdGhlIHJvdXRlci5cclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBRdWVyeVBhcmFtR3JvdXBTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuXHJcbiAgICAvKiogVGhlIHtAbGluayBRdWVyeVBhcmFtR3JvdXB9IHRvIGJpbmQuICovXHJcbiAgICBwcml2YXRlIHF1ZXJ5UGFyYW1Hcm91cDogUXVlcnlQYXJhbUdyb3VwIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqIExpc3Qgb2Yge0BsaW5rIFF1ZXJ5UGFyYW1BY2Nlc3Nvcn0gcmVnaXN0ZXJlZCB0byB0aGlzIHNlcnZpY2UuICovXHJcbiAgICBwcml2YXRlIGRpcmVjdGl2ZXMgPSBuZXcgTWFwPHN0cmluZywgUXVlcnlQYXJhbUFjY2Vzc29yW10+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBRdWV1ZSBvZiBuYXZpZ2F0aW9uIHBhcmFtZXRlcnNcclxuICAgICAqXHJcbiAgICAgKiBBIHF1ZXVlIGlzIHVzZWQgZm9yIG5hdmlnYXRpb25zIGFzIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGFsbCBwYXJhbWV0ZXIgY2hhbmdlc1xyXG4gICAgICogYXJlIGV4ZWN1dGVkIGluIHNlcXVlbmNlIGFzIG90aGVyd2lzZSBuYXZpZ2F0aW9ucyBtaWdodCBvdmVyd3JpdGUgZWFjaCBvdGhlci5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBxdWV1ZSQgPSBuZXcgU3ViamVjdDxOYXZpZ2F0aW9uRGF0YT4oKTtcclxuXHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHJpdmF0ZSBzeW5jaHJvbml6ZVJvdXRlciQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBASW5qZWN0KE5HUVBfUk9VVEVSX0FEQVBURVIpIHByaXZhdGUgcm91dGVyQWRhcHRlcjogUm91dGVyQWRhcHRlcixcclxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HUVBfUk9VVEVSX09QVElPTlMpIHByaXZhdGUgZ2xvYmFsUm91dGVyT3B0aW9uczogUm91dGVyT3B0aW9uc1xyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5zZXR1cE5hdmlnYXRpb25RdWV1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnN5bmNocm9uaXplUm91dGVyJC5jb21wbGV0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5UGFyYW1Hcm91cD8uX2NsZWFyQ2hhbmdlRnVuY3Rpb25zKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlcnlQYXJhbUdyb3VwPy5vcHRpb25zPy5jbGVhck9uRGVzdHJveSkge1xyXG4gICAgICAgICAgICBjb25zdCBudWxsUGFyYW1zID0gT2JqZWN0LnZhbHVlcyh0aGlzLnF1ZXJ5UGFyYW1Hcm91cC5xdWVyeVBhcmFtcylcclxuICAgICAgICAgICAgICAgIC5tYXAocXVlcnlQYXJhbSA9PiB0aGlzLndyYXBJbnRvUGFydGl0aW9uKHF1ZXJ5UGFyYW0pKVxyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0gPT4gcGFydGl0aW9uZWRRdWVyeVBhcmFtLnF1ZXJ5UGFyYW1zLm1hcChxdWVyeVBhcmFtID0+IHF1ZXJ5UGFyYW0udXJsUGFyYW0pKVxyXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gWy4uLmEsIC4uLmJdLCBbXSlcclxuICAgICAgICAgICAgICAgIC5tYXAodXJsUGFyYW0gPT4gKHtbdXJsUGFyYW1dOiBudWxsfSkpXHJcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoey4uLmEsIC4uLmJ9KSwge30pO1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckFkYXB0ZXIubmF2aWdhdGUobnVsbFBhcmFtcywge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZVVybDogdHJ1ZSxcclxuICAgICAgICAgICAgfSkudGhlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VzIHRoZSBnaXZlbiB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfSBmb3Igc3luY2hyb25pemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UXVlcnlQYXJhbUdyb3VwKHF1ZXJ5UGFyYW1Hcm91cDogUXVlcnlQYXJhbUdyb3VwKTogdm9pZCB7XHJcbiAgICAgICAgLy8gRklYTUU6IElmIHRoaXMgaXMgY2FsbGVkIHdoZW4gd2UgYWxyZWFkeSBoYXZlIGEgZ3JvdXAsIHdlIHByb2JhYmx5IG5lZWQgdG8gZG9cclxuICAgICAgICAvLyAgICAgICAgc29tZSBjbGVhbnVwIGZpcnN0LlxyXG4gICAgICAgIGlmICh0aGlzLnF1ZXJ5UGFyYW1Hcm91cCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgUXVlcnlQYXJhbUdyb3VwIGhhcyBhbHJlYWR5IGJlZW4gc2V0dXAuIENoYW5naW5nIHRoZSBncm91cCBpcyBjdXJyZW50bHkgbm90IHN1cHBvcnRlZC5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucXVlcnlQYXJhbUdyb3VwID0gcXVlcnlQYXJhbUdyb3VwO1xyXG4gICAgICAgIHRoaXMuc3RhcnRTeW5jaHJvbml6YXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVycyBhIHtAbGluayBRdWVyeVBhcmFtQWNjZXNzb3J9LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKGRpcmVjdGl2ZTogUXVlcnlQYXJhbUFjY2Vzc29yKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFkaXJlY3RpdmUudmFsdWVBY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHZhbHVlIGFjY2Vzc29yIGZvdW5kIGZvciB0aGUgZm9ybSBjb250cm9sLiBQbGVhc2UgbWFrZSBzdXJlIHRvIGltcGxlbWVudCBDb250cm9sVmFsdWVBY2Nlc3NvciBvbiB0aGlzIGNvbXBvbmVudC5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgdGhlIG5hbWUgaGVyZSwgcGFydGljdWxhcmx5IGZvciB0aGUgcXVldWUgYmVsb3cgdG8gYXZvaWQgcmUtZXZhbHVhdGluZ1xyXG4gICAgICAgIC8vIGl0IGFzIGl0IG1pZ2h0IGNoYW5nZSBvdmVyIHRpbWUuXHJcbiAgICAgICAgY29uc3QgcXVlcnlQYXJhbU5hbWUgPSBkaXJlY3RpdmUubmFtZTtcclxuICAgICAgICBjb25zdCBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0gPSB0aGlzLmdldFF1ZXJ5UGFyYW1Bc1BhcnRpdGlvbihxdWVyeVBhcmFtTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIENoYW5jZXMgYXJlIHRoYXQgd2UgcmVhZCB0aGUgaW5pdGlhbCByb3V0ZSBiZWZvcmUgYSBkaXJlY3RpdmUgaGFzIGJlZW4gcmVnaXN0ZXJlZCBoZXJlLlxyXG4gICAgICAgIC8vIFRoZSB2YWx1ZSBpbiB0aGUgbW9kZWwgd2lsbCBiZSBjb3JyZWN0LCBidXQgd2UgbmVlZCB0byBzeW5jIGl0IHRvIHRoZSB2aWV3IG9uY2UgaW5pdGlhbGx5LlxyXG4gICAgICAgIGRpcmVjdGl2ZS52YWx1ZUFjY2Vzc29yLndyaXRlVmFsdWUocGFydGl0aW9uZWRRdWVyeVBhcmFtLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gUHJveHkgdXBkYXRlcyBmcm9tIHRoZSB2aWV3IHRvIGRlYm91bmNlIHRoZW0gKGlmIG5lZWRlZCkuXHJcbiAgICAgICAgY29uc3QgcXVldWVzID0gcGFydGl0aW9uZWRRdWVyeVBhcmFtLnF1ZXJ5UGFyYW1zLm1hcCgoKSA9PiBuZXcgU3ViamVjdDx1bmtub3duPigpKTtcclxuICAgICAgICB6aXAoXHJcbiAgICAgICAgICAgIC4uLnF1ZXVlcy5tYXAoKHF1ZXVlJCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW0gPSBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucXVlcnlQYXJhbXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXVlJC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUHJlc2VudChxdWVyeVBhcmFtLmRlYm91bmNlVGltZSkgPyBkZWJvdW5jZVRpbWUocXVlcnlQYXJhbS5kZWJvdW5jZVRpbWUpIDogdGFwKCksXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICkucGlwZShcclxuICAgICAgICAgICAgLy8gRG8gbm90IHN5bmNocm9uaXplIHdoaWxlIHRoZSBwYXJhbSBpcyBkZXRhY2hlZCBmcm9tIHRoZSBncm91cFxyXG4gICAgICAgICAgICBmaWx0ZXIoKCkgPT4gISF0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLmdldChxdWVyeVBhcmFtTmFtZSkpLFxyXG4gICAgICAgICAgICBtYXAoKG5ld1ZhbHVlOiB1bmtub3duW10pID0+IHRoaXMuZ2V0UGFyYW1zRm9yVmFsdWUocGFydGl0aW9uZWRRdWVyeVBhcmFtLCBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucmVkdWNlKG5ld1ZhbHVlKSkpLFxyXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JCksXHJcbiAgICAgICAgKS5zdWJzY3JpYmUocGFyYW1zID0+IHRoaXMuZW5xdWV1ZU5hdmlnYXRpb24obmV3IE5hdmlnYXRpb25EYXRhKHBhcmFtcykpKTtcclxuXHJcbiAgICAgICAgZGlyZWN0aXZlLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPbkNoYW5nZSgobmV3VmFsdWU6IHVua25vd24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFydGl0aW9uZWQgPSBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucGFydGl0aW9uKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgcXVldWVzLmZvckVhY2goKHF1ZXVlJCwgaW5kZXgpID0+IHF1ZXVlJC5uZXh0KHBhcnRpdGlvbmVkW2luZGV4XSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMuc2V0KHF1ZXJ5UGFyYW1OYW1lLCBbLi4uKHRoaXMuZGlyZWN0aXZlcy5nZXQocXVlcnlQYXJhbU5hbWUpIHx8IFtdKSwgZGlyZWN0aXZlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXJlZ2lzdGVycyBhIHtAbGluayBRdWVyeVBhcmFtQWNjZXNzb3J9IGJ5IHJlZmVyZW5jaW5nIGl0cyBuYW1lLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVyZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUocXVlcnlQYXJhbU5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICghcXVlcnlQYXJhbU5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlcyA9IHRoaXMuZGlyZWN0aXZlcy5nZXQocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgIGlmICghZGlyZWN0aXZlcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXJlY3RpdmVzLmZvckVhY2goZGlyZWN0aXZlID0+IHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPbkNoYW5nZShOT1ApO1xyXG4gICAgICAgICAgICBkaXJlY3RpdmUudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uVG91Y2hlZChOT1ApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMuZGVsZXRlKHF1ZXJ5UGFyYW1OYW1lKTtcclxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtID0gdGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5nZXQocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgIGlmIChxdWVyeVBhcmFtKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW0uX2NsZWFyQ2hhbmdlRnVuY3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRTeW5jaHJvbml6YXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwQ2hhbmdlTGlzdGVuZXIoKTtcclxuICAgICAgICB0aGlzLnNldHVwUGFyYW1DaGFuZ2VMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLnNldHVwUm91dGVyTGlzdGVuZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy53YXRjaE5ld1BhcmFtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBMaXN0ZW5zIGZvciBwcm9ncmFtbWF0aWMgY2hhbmdlcyBvbiBncm91cCBsZXZlbCBhbmQgc3luY2hyb25pemVzIHRvIHRoZSByb3V0ZXIuICovXHJcbiAgICBwcml2YXRlIHNldHVwR3JvdXBDaGFuZ2VMaXN0ZW5lcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLl9yZWdpc3Rlck9uQ2hhbmdlKChuZXdWYWx1ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZWNlaXZlZCBudWxsIHZhbHVlIGZyb20gUXVlcnlQYXJhbUdyb3VwLmApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFyYW1zOiBQYXJhbXMgPSB7fTtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMobmV3VmFsdWUpLmZvckVhY2gocXVlcnlQYXJhbU5hbWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnlQYXJhbSA9IHRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkuZ2V0KHF1ZXJ5UGFyYW1OYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01pc3NpbmcocXVlcnlQYXJhbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0geyAuLi5wYXJhbXMsIC4uLnRoaXMuZ2V0UGFyYW1zRm9yVmFsdWUocXVlcnlQYXJhbSwgbmV3VmFsdWVbIHF1ZXJ5UGFyYW1OYW1lIF0pIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnF1ZXVlTmF2aWdhdGlvbihuZXcgTmF2aWdhdGlvbkRhdGEocGFyYW1zLCB0cnVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIExpc3RlbnMgZm9yIHByb2dyYW1tYXRpYyBjaGFuZ2VzIG9uIHBhcmFtZXRlciBsZXZlbCBhbmQgc3luY2hyb25pemVzIHRvIHRoZSByb3V0ZXIuICovXHJcbiAgICBwcml2YXRlIHNldHVwUGFyYW1DaGFuZ2VMaXN0ZW5lcnMoKTogdm9pZCB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5xdWVyeVBhcmFtcylcclxuICAgICAgICAgICAgLmZvckVhY2gocXVlcnlQYXJhbU5hbWUgPT4gdGhpcy5zZXR1cFBhcmFtQ2hhbmdlTGlzdGVuZXIocXVlcnlQYXJhbU5hbWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwUGFyYW1DaGFuZ2VMaXN0ZW5lcihxdWVyeVBhcmFtTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcXVlcnlQYXJhbSA9IHRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkuZ2V0KHF1ZXJ5UGFyYW1OYW1lKTtcclxuICAgICAgICBpZiAoIXF1ZXJ5UGFyYW0pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBwYXJhbSBpbiBncm91cCBmb3VuZCBmb3IgbmFtZSAke3F1ZXJ5UGFyYW1OYW1lfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcXVlcnlQYXJhbS5fcmVnaXN0ZXJPbkNoYW5nZSgobmV3VmFsdWU6IHVua25vd24pID0+XHJcbiAgICAgICAgICAgIHRoaXMuZW5xdWV1ZU5hdmlnYXRpb24obmV3IE5hdmlnYXRpb25EYXRhKHRoaXMuZ2V0UGFyYW1zRm9yVmFsdWUocXVlcnlQYXJhbSwgbmV3VmFsdWUpLCB0cnVlKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBMaXN0ZW5zIGZvciBjaGFuZ2VzIGluIHRoZSByb3V0ZXIgYW5kIHN5bmNocm9uaXplcyB0byB0aGUgbW9kZWwuICovXHJcbiAgICBwcml2YXRlIHNldHVwUm91dGVyTGlzdGVuZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zeW5jaHJvbml6ZVJvdXRlciQucGlwZShcclxuICAgICAgICAgICAgc3RhcnRXaXRoKHVuZGVmaW5lZCksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLnJvdXRlckFkYXB0ZXIucXVlcnlQYXJhbU1hcC5waXBlKFxyXG4gICAgICAgICAgICAgICAgLy8gV2Ugd2FudCB0byBpZ25vcmUgY2hhbmdlcyB0byBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZW4ndCByZWxhdGVkIHRvIHRoaXNcclxuICAgICAgICAgICAgICAgIC8vIHBhcnRpY3VsYXIgZ3JvdXA7IGhvd2V2ZXIsIHdlIGRvIG5lZWQgdG8gcmVhY3QgaWYgb25lIG9mIG91ciBwYXJhbWV0ZXJzIGhhc1xyXG4gICAgICAgICAgICAgICAgLy8gdmFuaXNoZWQgd2hlbiBpdCB3YXMgc2V0IGJlZm9yZS5cclxuICAgICAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKChwcmV2aW91c01hcCwgY3VycmVudE1hcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QudmFsdWVzKHRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkucXVlcnlQYXJhbXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocXVlcnlQYXJhbSA9PiB0aGlzLndyYXBJbnRvUGFydGl0aW9uKHF1ZXJ5UGFyYW0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHBhcnRpdGlvbmVkUXVlcnlQYXJhbSA9PiBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucXVlcnlQYXJhbXMubWFwKHF1ZXJ5UGFyYW0gPT4gcXVlcnlQYXJhbS51cmxQYXJhbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IFsuLi5hLCAuLi5iXSwgW10pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJdCBpcyBpbXBvcnRhbnQgdGhhdCB3ZSBmaWx0ZXIgdGhlIG1hcHMgb25seSBoZXJlIHNvIHRoYXQgYm90aCBhcmUgZmlsdGVyZWRcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIHRoZSBzYW1lIHNldCBvZiBrZXlzOyBvdGhlcndpc2UsIGUuZy4gcmVtb3ZpbmcgYSBwYXJhbWV0ZXIgZnJvbSB0aGUgZ3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAvLyB3b3VsZCBpbnRlcmZlcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVQYXJhbU1hcHMoZmlsdGVyUGFyYW1NYXAocHJldmlvdXNNYXAsIGtleXMpLCBmaWx0ZXJQYXJhbU1hcChjdXJyZW50TWFwLCBrZXlzKSk7XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgKSksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcChxdWVyeVBhcmFtTWFwID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gY2FwdHVyZSB0aGlzIHJpZ2h0IGhlcmUgc2luY2UgdGhpcyBpcyBvbmx5IHNldCBkdXJpbmcgdGhlIG9uLWdvaW5nIG5hdmlnYXRpb24uXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzeW50aGV0aWMgPSB0aGlzLmlzU3ludGhldGljTmF2aWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnlQYXJhbU5hbWVzID0gT2JqZWN0LmtleXModGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5xdWVyeVBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcmtKb2luKFsuLi5xdWVyeVBhcmFtTmFtZXNdXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChxdWVyeVBhcmFtTmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRpdGlvbmVkUXVlcnlQYXJhbSA9IHRoaXMuZ2V0UXVlcnlQYXJhbUFzUGFydGl0aW9uKHF1ZXJ5UGFyYW1OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JrSm9pbjx1bmtub3duW10+KFsuLi5wYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucXVlcnlQYXJhbXNdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHF1ZXJ5UGFyYW0gPT4gaXNNdWx0aVF1ZXJ5UGFyYW08dW5rbm93bj4ocXVlcnlQYXJhbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHF1ZXJ5UGFyYW0uZGVzZXJpYWxpemVWYWx1ZShxdWVyeVBhcmFtTWFwLmdldEFsbChxdWVyeVBhcmFtLnVybFBhcmFtKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHF1ZXJ5UGFyYW0uZGVzZXJpYWxpemVWYWx1ZShxdWVyeVBhcmFtTWFwLmdldChxdWVyeVBhcmFtLnVybFBhcmFtKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwKG5ld1ZhbHVlcyA9PiBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucmVkdWNlKG5ld1ZhbHVlcykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwKG5ld1ZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3RpdmVzID0gdGhpcy5kaXJlY3RpdmVzLmdldChxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5mb3JFYWNoKGRpcmVjdGl2ZSA9PiBkaXJlY3RpdmUudmFsdWVBY2Nlc3Nvci53cml0ZVZhbHVlKG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAobmV3VmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFsgcXVlcnlQYXJhbU5hbWUgXTogbmV3VmFsdWUgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKCh2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+W10pID0+IHZhbHVlcy5yZWR1Y2UoKGdyb3VwVmFsdWUsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5ncm91cFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSwge30pKSxcclxuICAgICAgICAgICAgICAgICAgICB0YXAoZ3JvdXBWYWx1ZSA9PiB0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLnNldFZhbHVlKGdyb3VwVmFsdWUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdEV2ZW50OiAhc3ludGhldGljLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JCksXHJcbiAgICAgICAgKS5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogTGlzdGVucyBmb3IgbmV3bHkgYWRkZWQgcGFyYW1ldGVycyBhbmQgc3RhcnRzIHN5bmNocm9uaXphdGlvbiBmb3IgdGhlbS4gKi9cclxuICAgIHByaXZhdGUgd2F0Y2hOZXdQYXJhbXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5xdWVyeVBhcmFtQWRkZWQkLnBpcGUoXHJcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKVxyXG4gICAgICAgICkuc3Vic2NyaWJlKHF1ZXJ5UGFyYW1OYW1lID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXR1cFBhcmFtQ2hhbmdlTGlzdGVuZXIocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLnN5bmNocm9uaXplUm91dGVyJC5uZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY3VycmVudCBuYXZpZ2F0aW9uIGlzIHN5bnRoZXRpYy4gKi9cclxuICAgIHByaXZhdGUgaXNTeW50aGV0aWNOYXZpZ2F0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb24gPSB0aGlzLnJvdXRlckFkYXB0ZXIuZ2V0Q3VycmVudE5hdmlnYXRpb24oKTtcclxuICAgICAgICBpZiAoIW5hdmlnYXRpb24gfHwgbmF2aWdhdGlvbi50cmlnZ2VyICE9PSAnaW1wZXJhdGl2ZScpIHtcclxuICAgICAgICAgICAgLy8gV2hlbiB1c2luZyB0aGUgYmFjayAvIGZvcndhcmQgYnV0dG9ucywgdGhlIHN0YXRlIGlzIHBhc3NlZCBhbG9uZyB3aXRoIGl0LCBldmVuIHRob3VnaFxyXG4gICAgICAgICAgICAvLyBmb3IgdXMgaXQncyBub3cgYSBuYXZpZ2F0aW9uIGluaXRpYXRlZCBieSB0aGUgdXNlci4gVGhlcmVmb3JlLCBhIG5hdmlnYXRpb24gY2FuIG9ubHlcclxuICAgICAgICAgICAgLy8gYmUgc3ludGhldGljIGlmIGl0IGhhcyBiZWVuIHRyaWdnZXJlZCBpbXBlcmF0aXZlbHkuXHJcbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yODEwOC5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24uZXh0cmFzICYmIG5hdmlnYXRpb24uZXh0cmFzLnN0YXRlICYmIG5hdmlnYXRpb24uZXh0cmFzLnN0YXRlWydzeW50aGV0aWMnXTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogU3Vic2NyaWJlcyB0byB0aGUgcGFyYW1ldGVyIHF1ZXVlIGFuZCBleGVjdXRlcyBuYXZpZ2F0aW9ucyBpbiBzZXF1ZW5jZS4gKi9cclxuICAgIHByaXZhdGUgc2V0dXBOYXZpZ2F0aW9uUXVldWUoKSB7XHJcbiAgICAgICAgdGhpcy5xdWV1ZSQucGlwZShcclxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpLFxyXG4gICAgICAgICAgICBjb25jYXRNYXAoZGF0YSA9PiB0aGlzLm5hdmlnYXRlU2FmZWx5KGRhdGEpKSxcclxuICAgICAgICApLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbmF2aWdhdGVTYWZlbHkoZGF0YTogTmF2aWdhdGlvbkRhdGEpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnJvdXRlckFkYXB0ZXIubmF2aWdhdGUoZGF0YS5wYXJhbXMsIHtcclxuICAgICAgICAgICAgLi4udGhpcy5yb3V0ZXJPcHRpb25zLFxyXG4gICAgICAgICAgICBzdGF0ZTogeyBzeW50aGV0aWM6IGRhdGEuc3ludGhldGljIH0sXHJcbiAgICAgICAgfSkpLnBpcGUoXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycjogdW5rbm93bikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIHdoaWxlIG5hdmlnYXRpbmdgLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBFTVBUWTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBTZW5kcyBhIGNoYW5nZSBvZiBwYXJhbWV0ZXJzIHRvIHRoZSBxdWV1ZS4gKi9cclxuICAgIHByaXZhdGUgZW5xdWV1ZU5hdmlnYXRpb24oZGF0YTogTmF2aWdhdGlvbkRhdGEpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnF1ZXVlJC5uZXh0KGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZnVsbCBzZXQgb2YgcGFyYW1ldGVycyBnaXZlbiBhIHZhbHVlIGZvciBhIHBhcmFtZXRlciBtb2RlbC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGNvbnNpc3RzIG1haW5seSBvZiBwcm9wZXJseSBzZXJpYWxpemluZyB0aGUgbW9kZWwgdmFsdWUgYW5kIGVuc3VyaW5nIHRvIHRha2VcclxuICAgICAqIHNpZGUgZWZmZWN0IGNoYW5nZXMgaW50byBhY2NvdW50IHRoYXQgbWF5IGhhdmUgYmVlbiBjb25maWd1cmVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldFBhcmFtc0ZvclZhbHVlKHF1ZXJ5UGFyYW06IFF1ZXJ5UGFyYW08dW5rbm93bj4gfCBNdWx0aVF1ZXJ5UGFyYW08dW5rbm93bj4gfCBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4sIHZhbHVlOiBhbnkpOiBQYXJhbXMge1xyXG4gICAgICAgIGNvbnN0IHBhcnRpdGlvbmVkUXVlcnlQYXJhbSA9IHRoaXMud3JhcEludG9QYXJ0aXRpb24ocXVlcnlQYXJhbSk7XHJcbiAgICAgICAgY29uc3QgcGFydGl0aW9uZWQgPSBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucGFydGl0aW9uKHZhbHVlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29tYmluZWRQYXJhbXMgPSBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucXVlcnlQYXJhbXNcclxuICAgICAgICAgICAgLm1hcCgoY3VycmVudCwgaW5kZXgpID0+IGlzTWlzc2luZyhjdXJyZW50LmNvbWJpbmVXaXRoKSA/IG51bGwgOiBjdXJyZW50LmNvbWJpbmVXaXRoKHBhcnRpdGlvbmVkW2luZGV4XSBhcyBhbnkpKVxyXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi4oYSB8fCB7fSksIC4uLihiIHx8IHt9KSB9O1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlcyA9IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5xdWVyeVBhcmFtc1xyXG4gICAgICAgICAgICAubWFwKChjdXJyZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBbIGN1cnJlbnQudXJsUGFyYW0gXTogY3VycmVudC5zZXJpYWxpemVWYWx1ZShwYXJ0aXRpb25lZFtpbmRleF0gYXMgYW55KSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmEsIC4uLmIgfTtcclxuICAgICAgICAgICAgfSwge30pO1xyXG5cclxuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgbGlzdCB0aGUgc2lkZS1lZmZlY3QgcGFyYW1ldGVycyBmaXJzdCBzbyB0aGF0IG91ciBhY3R1YWwgcGFyYW1ldGVyIGNhbid0IGJlXHJcbiAgICAgICAgLy8gb3ZlcnJpZGRlbiBieSBpdC5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5jb21iaW5lZFBhcmFtcyxcclxuICAgICAgICAgICAgLi4ubmV3VmFsdWVzLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHNldCBvZiBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHJvdXRlci5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIG1lcmdlcyB0aGUgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gd2l0aCB0aGUgZ3JvdXAgc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXQgcm91dGVyT3B0aW9ucygpOiBSb3V0ZXJPcHRpb25zIHtcclxuICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSB0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLnJvdXRlck9wdGlvbnM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLih0aGlzLmdsb2JhbFJvdXRlck9wdGlvbnMgfHwge30pLFxyXG4gICAgICAgICAgICAuLi4oZ3JvdXBPcHRpb25zIHx8IHt9KSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcXVlcnkgcGFyYW1ldGVyIHdpdGggdGhlIGdpdmVuIG5hbWUgYXMgYSBwYXJ0aXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIHF1ZXJ5IHBhcmFtZXRlciBpcyBwYXJ0aXRpb25lZCwgaXQgaXMgcmV0dXJuZWQgdW5jaGFuZ2VkLiBPdGhlcndpc2VcclxuICAgICAqIGl0IGlzIHdyYXBwZWQgaW50byBhIG5vb3AgcGFydGl0aW9uLiBUaGlzIG1ha2VzIGl0IGVhc3kgdG8gb3BlcmF0ZSBvblxyXG4gICAgICogcXVlcnkgcGFyYW1ldGVycyBpbmRlcGVuZGVudCBvZiB3aGV0aGVyIHRoZXkgYXJlIHBhcnRpdGlvbmVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldFF1ZXJ5UGFyYW1Bc1BhcnRpdGlvbihxdWVyeVBhcmFtTmFtZTogc3RyaW5nKTogUGFydGl0aW9uZWRRdWVyeVBhcmFtPHVua25vd24+IHtcclxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtID0gdGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5nZXQocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgIGlmICghcXVlcnlQYXJhbSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHF1ZXJ5IHBhcmFtIHdpdGggbmFtZSAke3F1ZXJ5UGFyYW1OYW1lfS4gRGlkIHlvdSBmb3JnZXQgdG8gYWRkIGl0IHRvIHlvdXIgUXVlcnlQYXJhbUdyb3VwP2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud3JhcEludG9QYXJ0aXRpb24ocXVlcnlQYXJhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwcyBhIHF1ZXJ5IHBhcmFtZXRlciBpbnRvIGEgcGFydGl0aW9uIGlmIGl0IGlzbid0IGFscmVhZHkuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgd3JhcEludG9QYXJ0aXRpb24oXHJcbiAgICAgICAgcXVlcnlQYXJhbTogUXVlcnlQYXJhbTx1bmtub3duPiB8IE11bHRpUXVlcnlQYXJhbTx1bmtub3duPiB8IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTx1bmtub3duPlxyXG4gICAgKTogUGFydGl0aW9uZWRRdWVyeVBhcmFtPHVua25vd24+IHtcclxuICAgICAgICBpZiAocXVlcnlQYXJhbSBpbnN0YW5jZW9mIFBhcnRpdGlvbmVkUXVlcnlQYXJhbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlQYXJhbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUGFydGl0aW9uZWRRdWVyeVBhcmFtPHVua25vd24+KFtxdWVyeVBhcmFtXSwge1xyXG4gICAgICAgICAgICBwYXJ0aXRpb246IHZhbHVlID0+IFt2YWx1ZV0sXHJcbiAgICAgICAgICAgIHJlZHVjZTogdmFsdWVzID0+IHZhbHVlc1swXSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFF1ZXJ5UGFyYW1Hcm91cCgpOiBRdWVyeVBhcmFtR3JvdXAge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVyeVBhcmFtR3JvdXApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBRdWVyeVBhcmFtR3JvdXAgaGFzIGJlZW4gcmVnaXN0ZXJlZCB5ZXQuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5xdWVyeVBhcmFtR3JvdXA7XHJcbiAgICB9XHJcblxyXG59Il19