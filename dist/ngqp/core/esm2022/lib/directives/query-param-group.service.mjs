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
class QueryParamGroupService {
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
export { QueryParamGroupService };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamGroupService, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [NGQP_ROUTER_ADAPTER]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NGQP_ROUTER_OPTIONS]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tZ3JvdXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25ncXAvY29yZS9zcmMvbGliL2RpcmVjdGl2ZXMvcXVlcnktcGFyYW0tZ3JvdXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQWEsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5GLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBYyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZFLE9BQU8sRUFDSCxVQUFVLEVBQ1YsU0FBUyxFQUNULFlBQVksRUFDWixvQkFBb0IsRUFDcEIsTUFBTSxFQUNOLEdBQUcsRUFDSCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxHQUFHLEVBQ04sTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXRGLE9BQU8sRUFBbUIscUJBQXFCLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQWdDLE1BQU0sNENBQTRDLENBQUM7O0FBR3BJLGdCQUFnQjtBQUNoQixTQUFTLGlCQUFpQixDQUFJLFVBQThDO0lBQ3hFLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQztBQUM1QixDQUFDO0FBRUQsZ0JBQWdCO0FBQ2hCLE1BQU0sY0FBYztJQUNHO0lBQXVCO0lBQTFDLFlBQW1CLE1BQWMsRUFBUyxZQUFxQixLQUFLO1FBQWpELFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFpQjtJQUNwRSxDQUFDO0NBQ0o7QUFFRDs7Ozs7OztH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M0YsSUFBSSxVQUFVLFlBQVkscUJBQXFCLEVBQUU7WUFDN0MsT0FBTyxVQUFVLENBQUM7U0FDckI7UUFFRCxPQUFPLElBQUkscUJBQXFCLENBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNwRCxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMzQixNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQzlCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxrQkFBa0I7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQ2hDLENBQUM7Z0ZBNVhRLHNCQUFzQixjQXVCbkIsbUJBQW1CLGVBQ1AsbUJBQW1CO2dFQXhCbEMsc0JBQXNCLFdBQXRCLHNCQUFzQjs7U0FBdEIsc0JBQXNCO3VGQUF0QixzQkFBc0I7Y0FEbEMsVUFBVTs7c0JBd0JGLE1BQU07dUJBQUMsbUJBQW1COztzQkFDMUIsUUFBUTs7c0JBQUksTUFBTTt1QkFBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIGlzRGV2TW9kZSwgT25EZXN0cm95LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBFTVBUWSwgZm9ya0pvaW4sIGZyb20sIE9ic2VydmFibGUsIFN1YmplY3QsIHppcCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1xyXG4gICAgY2F0Y2hFcnJvcixcclxuICAgIGNvbmNhdE1hcCxcclxuICAgIGRlYm91bmNlVGltZSxcclxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxyXG4gICAgZmlsdGVyLFxyXG4gICAgbWFwLFxyXG4gICAgc3RhcnRXaXRoLFxyXG4gICAgc3dpdGNoTWFwLFxyXG4gICAgdGFrZVVudGlsLFxyXG4gICAgdGFwXHJcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBjb21wYXJlUGFyYW1NYXBzLCBmaWx0ZXJQYXJhbU1hcCwgaXNNaXNzaW5nLCBpc1ByZXNlbnQsIE5PUCB9IGZyb20gJy4uL3V0aWwnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtR3JvdXAgfSBmcm9tICcuLi9tb2RlbC9xdWVyeS1wYXJhbS1ncm91cCc7XHJcbmltcG9ydCB7IE11bHRpUXVlcnlQYXJhbSwgUGFydGl0aW9uZWRRdWVyeVBhcmFtLCBRdWVyeVBhcmFtIH0gZnJvbSAnLi4vbW9kZWwvcXVlcnktcGFyYW0nO1xyXG5pbXBvcnQgeyBOR1FQX1JPVVRFUl9BREFQVEVSLCBOR1FQX1JPVVRFUl9PUFRJT05TLCBSb3V0ZXJBZGFwdGVyLCBSb3V0ZXJPcHRpb25zIH0gZnJvbSAnLi4vcm91dGVyLWFkYXB0ZXIvcm91dGVyLWFkYXB0ZXIuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUFjY2Vzc29yIH0gZnJvbSAnLi9xdWVyeS1wYXJhbS1hY2Nlc3Nvci5pbnRlcmZhY2UnO1xyXG5cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5mdW5jdGlvbiBpc011bHRpUXVlcnlQYXJhbTxUPihxdWVyeVBhcmFtOiBRdWVyeVBhcmFtPFQ+IHwgTXVsdGlRdWVyeVBhcmFtPFQ+KTogcXVlcnlQYXJhbSBpcyBNdWx0aVF1ZXJ5UGFyYW08VD4ge1xyXG4gICAgcmV0dXJuIHF1ZXJ5UGFyYW0ubXVsdGk7XHJcbn1cclxuXHJcbi8qKiBAaW50ZXJuYWwgKi9cclxuY2xhc3MgTmF2aWdhdGlvbkRhdGEge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhcmFtczogUGFyYW1zLCBwdWJsaWMgc3ludGhldGljOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFNlcnZpY2UgaW1wbGVtZW50aW5nIHRoZSBzeW5jaHJvbml6YXRpb24gbG9naWNcclxuICpcclxuICogVGhpcyBzZXJ2aWNlIGlzIHRoZSBrZXkgdG8gdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGJ5IGJpbmRpbmcgYSB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfVxyXG4gKiB0byB0aGUgcm91dGVyLlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG5cclxuICAgIC8qKiBUaGUge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH0gdG8gYmluZC4gKi9cclxuICAgIHByaXZhdGUgcXVlcnlQYXJhbUdyb3VwOiBRdWVyeVBhcmFtR3JvdXAgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKiogTGlzdCBvZiB7QGxpbmsgUXVlcnlQYXJhbUFjY2Vzc29yfSByZWdpc3RlcmVkIHRvIHRoaXMgc2VydmljZS4gKi9cclxuICAgIHByaXZhdGUgZGlyZWN0aXZlcyA9IG5ldyBNYXA8c3RyaW5nLCBRdWVyeVBhcmFtQWNjZXNzb3JbXT4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFF1ZXVlIG9mIG5hdmlnYXRpb24gcGFyYW1ldGVyc1xyXG4gICAgICpcclxuICAgICAqIEEgcXVldWUgaXMgdXNlZCBmb3IgbmF2aWdhdGlvbnMgYXMgd2UgbmVlZCB0byBtYWtlIHN1cmUgYWxsIHBhcmFtZXRlciBjaGFuZ2VzXHJcbiAgICAgKiBhcmUgZXhlY3V0ZWQgaW4gc2VxdWVuY2UgYXMgb3RoZXJ3aXNlIG5hdmlnYXRpb25zIG1pZ2h0IG92ZXJ3cml0ZSBlYWNoIG90aGVyLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHF1ZXVlJCA9IG5ldyBTdWJqZWN0PE5hdmlnYXRpb25EYXRhPigpO1xyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwcml2YXRlIHN5bmNocm9uaXplUm91dGVyJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBJbmplY3QoTkdRUF9ST1VURVJfQURBUFRFUikgcHJpdmF0ZSByb3V0ZXJBZGFwdGVyOiBSb3V0ZXJBZGFwdGVyLFxyXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTkdRUF9ST1VURVJfT1BUSU9OUykgcHJpdmF0ZSBnbG9iYWxSb3V0ZXJPcHRpb25zOiBSb3V0ZXJPcHRpb25zXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnNldHVwTmF2aWdhdGlvblF1ZXVlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3luY2hyb25pemVSb3V0ZXIkLmNvbXBsZXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucXVlcnlQYXJhbUdyb3VwPy5fY2xlYXJDaGFuZ2VGdW5jdGlvbnMoKTtcclxuICAgICAgICBpZiAodGhpcy5xdWVyeVBhcmFtR3JvdXA/Lm9wdGlvbnM/LmNsZWFyT25EZXN0cm95KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG51bGxQYXJhbXMgPSBPYmplY3QudmFsdWVzKHRoaXMucXVlcnlQYXJhbUdyb3VwLnF1ZXJ5UGFyYW1zKVxyXG4gICAgICAgICAgICAgICAgLm1hcChxdWVyeVBhcmFtID0+IHRoaXMud3JhcEludG9QYXJ0aXRpb24ocXVlcnlQYXJhbSkpXHJcbiAgICAgICAgICAgICAgICAubWFwKHBhcnRpdGlvbmVkUXVlcnlQYXJhbSA9PiBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucXVlcnlQYXJhbXMubWFwKHF1ZXJ5UGFyYW0gPT4gcXVlcnlQYXJhbS51cmxQYXJhbSkpXHJcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBbLi4uYSwgLi4uYl0sIFtdKVxyXG4gICAgICAgICAgICAgICAgLm1hcCh1cmxQYXJhbSA9PiAoe1t1cmxQYXJhbV06IG51bGx9KSlcclxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7Li4uYSwgLi4uYn0pLCB7fSk7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyQWRhcHRlci5uYXZpZ2F0ZShudWxsUGFyYW1zLCB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlVXJsOiB0cnVlLFxyXG4gICAgICAgICAgICB9KS50aGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVzZXMgdGhlIGdpdmVuIHtAbGluayBRdWVyeVBhcmFtR3JvdXB9IGZvciBzeW5jaHJvbml6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRRdWVyeVBhcmFtR3JvdXAocXVlcnlQYXJhbUdyb3VwOiBRdWVyeVBhcmFtR3JvdXApOiB2b2lkIHtcclxuICAgICAgICAvLyBGSVhNRTogSWYgdGhpcyBpcyBjYWxsZWQgd2hlbiB3ZSBhbHJlYWR5IGhhdmUgYSBncm91cCwgd2UgcHJvYmFibHkgbmVlZCB0byBkb1xyXG4gICAgICAgIC8vICAgICAgICBzb21lIGNsZWFudXAgZmlyc3QuXHJcbiAgICAgICAgaWYgKHRoaXMucXVlcnlQYXJhbUdyb3VwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBRdWVyeVBhcmFtR3JvdXAgaGFzIGFscmVhZHkgYmVlbiBzZXR1cC4gQ2hhbmdpbmcgdGhlIGdyb3VwIGlzIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeVBhcmFtR3JvdXAgPSBxdWVyeVBhcmFtR3JvdXA7XHJcbiAgICAgICAgdGhpcy5zdGFydFN5bmNocm9uaXphdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXJzIGEge0BsaW5rIFF1ZXJ5UGFyYW1BY2Nlc3Nvcn0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUoZGlyZWN0aXZlOiBRdWVyeVBhcmFtQWNjZXNzb3IpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWRpcmVjdGl2ZS52YWx1ZUFjY2Vzc29yKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gdmFsdWUgYWNjZXNzb3IgZm91bmQgZm9yIHRoZSBmb3JtIGNvbnRyb2wuIFBsZWFzZSBtYWtlIHN1cmUgdG8gaW1wbGVtZW50IENvbnRyb2xWYWx1ZUFjY2Vzc29yIG9uIHRoaXMgY29tcG9uZW50LmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2FwdHVyZSB0aGUgbmFtZSBoZXJlLCBwYXJ0aWN1bGFybHkgZm9yIHRoZSBxdWV1ZSBiZWxvdyB0byBhdm9pZCByZS1ldmFsdWF0aW5nXHJcbiAgICAgICAgLy8gaXQgYXMgaXQgbWlnaHQgY2hhbmdlIG92ZXIgdGltZS5cclxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtTmFtZSA9IGRpcmVjdGl2ZS5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhcnRpdGlvbmVkUXVlcnlQYXJhbSA9IHRoaXMuZ2V0UXVlcnlQYXJhbUFzUGFydGl0aW9uKHF1ZXJ5UGFyYW1OYW1lKTtcclxuXHJcbiAgICAgICAgLy8gQ2hhbmNlcyBhcmUgdGhhdCB3ZSByZWFkIHRoZSBpbml0aWFsIHJvdXRlIGJlZm9yZSBhIGRpcmVjdGl2ZSBoYXMgYmVlbiByZWdpc3RlcmVkIGhlcmUuXHJcbiAgICAgICAgLy8gVGhlIHZhbHVlIGluIHRoZSBtb2RlbCB3aWxsIGJlIGNvcnJlY3QsIGJ1dCB3ZSBuZWVkIHRvIHN5bmMgaXQgdG8gdGhlIHZpZXcgb25jZSBpbml0aWFsbHkuXHJcbiAgICAgICAgZGlyZWN0aXZlLnZhbHVlQWNjZXNzb3Iud3JpdGVWYWx1ZShwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0udmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBQcm94eSB1cGRhdGVzIGZyb20gdGhlIHZpZXcgdG8gZGVib3VuY2UgdGhlbSAoaWYgbmVlZGVkKS5cclxuICAgICAgICBjb25zdCBxdWV1ZXMgPSBwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0ucXVlcnlQYXJhbXMubWFwKCgpID0+IG5ldyBTdWJqZWN0PHVua25vd24+KCkpO1xyXG4gICAgICAgIHppcChcclxuICAgICAgICAgICAgLi4ucXVldWVzLm1hcCgocXVldWUkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnlQYXJhbSA9IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5xdWVyeVBhcmFtc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVldWUkLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgaXNQcmVzZW50KHF1ZXJ5UGFyYW0uZGVib3VuY2VUaW1lKSA/IGRlYm91bmNlVGltZShxdWVyeVBhcmFtLmRlYm91bmNlVGltZSkgOiB0YXAoKSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKS5waXBlKFxyXG4gICAgICAgICAgICAvLyBEbyBub3Qgc3luY2hyb25pemUgd2hpbGUgdGhlIHBhcmFtIGlzIGRldGFjaGVkIGZyb20gdGhlIGdyb3VwXHJcbiAgICAgICAgICAgIGZpbHRlcigoKSA9PiAhIXRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkuZ2V0KHF1ZXJ5UGFyYW1OYW1lKSksXHJcbiAgICAgICAgICAgIG1hcCgobmV3VmFsdWU6IHVua25vd25bXSkgPT4gdGhpcy5nZXRQYXJhbXNGb3JWYWx1ZShwYXJ0aXRpb25lZFF1ZXJ5UGFyYW0sIHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5yZWR1Y2UobmV3VmFsdWUpKSksXHJcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSxcclxuICAgICAgICApLnN1YnNjcmliZShwYXJhbXMgPT4gdGhpcy5lbnF1ZXVlTmF2aWdhdGlvbihuZXcgTmF2aWdhdGlvbkRhdGEocGFyYW1zKSkpO1xyXG5cclxuICAgICAgICBkaXJlY3RpdmUudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uQ2hhbmdlKChuZXdWYWx1ZTogdW5rbm93bikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJ0aXRpb25lZCA9IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5wYXJ0aXRpb24obmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBxdWV1ZXMuZm9yRWFjaCgocXVldWUkLCBpbmRleCkgPT4gcXVldWUkLm5leHQocGFydGl0aW9uZWRbaW5kZXhdKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlcy5zZXQocXVlcnlQYXJhbU5hbWUsIFsuLi4odGhpcy5kaXJlY3RpdmVzLmdldChxdWVyeVBhcmFtTmFtZSkgfHwgW10pLCBkaXJlY3RpdmVdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlcmVnaXN0ZXJzIGEge0BsaW5rIFF1ZXJ5UGFyYW1BY2Nlc3Nvcn0gYnkgcmVmZXJlbmNpbmcgaXRzIG5hbWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXJlZ2lzdGVyUXVlcnlQYXJhbURpcmVjdGl2ZShxdWVyeVBhcmFtTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFxdWVyeVBhcmFtTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkaXJlY3RpdmVzID0gdGhpcy5kaXJlY3RpdmVzLmdldChxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICAgICAgaWYgKCFkaXJlY3RpdmVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXJlY3RpdmUgPT4ge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmUudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uQ2hhbmdlKE5PUCk7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZS52YWx1ZUFjY2Vzc29yLnJlZ2lzdGVyT25Ub3VjaGVkKE5PUCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlcy5kZWxldGUocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW0gPSB0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLmdldChxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICAgICAgaWYgKHF1ZXJ5UGFyYW0pIHtcclxuICAgICAgICAgICAgcXVlcnlQYXJhbS5fY2xlYXJDaGFuZ2VGdW5jdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGFydFN5bmNocm9uaXphdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBDaGFuZ2VMaXN0ZW5lcigpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBQYXJhbUNoYW5nZUxpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSb3V0ZXJMaXN0ZW5lcigpO1xyXG5cclxuICAgICAgICB0aGlzLndhdGNoTmV3UGFyYW1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIExpc3RlbnMgZm9yIHByb2dyYW1tYXRpYyBjaGFuZ2VzIG9uIGdyb3VwIGxldmVsIGFuZCBzeW5jaHJvbml6ZXMgdG8gdGhlIHJvdXRlci4gKi9cclxuICAgIHByaXZhdGUgc2V0dXBHcm91cENoYW5nZUxpc3RlbmVyKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkuX3JlZ2lzdGVyT25DaGFuZ2UoKG5ld1ZhbHVlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlY2VpdmVkIG51bGwgdmFsdWUgZnJvbSBRdWVyeVBhcmFtR3JvdXAuYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwYXJhbXM6IFBhcmFtcyA9IHt9O1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhuZXdWYWx1ZSkuZm9yRWFjaChxdWVyeVBhcmFtTmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeVBhcmFtID0gdGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5nZXQocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTWlzc2luZyhxdWVyeVBhcmFtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7IC4uLnBhcmFtcywgLi4udGhpcy5nZXRQYXJhbXNGb3JWYWx1ZShxdWVyeVBhcmFtLCBuZXdWYWx1ZVsgcXVlcnlQYXJhbU5hbWUgXSkgfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVucXVldWVOYXZpZ2F0aW9uKG5ldyBOYXZpZ2F0aW9uRGF0YShwYXJhbXMsIHRydWUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogTGlzdGVucyBmb3IgcHJvZ3JhbW1hdGljIGNoYW5nZXMgb24gcGFyYW1ldGVyIGxldmVsIGFuZCBzeW5jaHJvbml6ZXMgdG8gdGhlIHJvdXRlci4gKi9cclxuICAgIHByaXZhdGUgc2V0dXBQYXJhbUNoYW5nZUxpc3RlbmVycygpOiB2b2lkIHtcclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLnF1ZXJ5UGFyYW1zKVxyXG4gICAgICAgICAgICAuZm9yRWFjaChxdWVyeVBhcmFtTmFtZSA9PiB0aGlzLnNldHVwUGFyYW1DaGFuZ2VMaXN0ZW5lcihxdWVyeVBhcmFtTmFtZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBQYXJhbUNoYW5nZUxpc3RlbmVyKHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtID0gdGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5nZXQocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgIGlmICghcXVlcnlQYXJhbSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHBhcmFtIGluIGdyb3VwIGZvdW5kIGZvciBuYW1lICR7cXVlcnlQYXJhbU5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBxdWVyeVBhcmFtLl9yZWdpc3Rlck9uQ2hhbmdlKChuZXdWYWx1ZTogdW5rbm93bikgPT5cclxuICAgICAgICAgICAgdGhpcy5lbnF1ZXVlTmF2aWdhdGlvbihuZXcgTmF2aWdhdGlvbkRhdGEodGhpcy5nZXRQYXJhbXNGb3JWYWx1ZShxdWVyeVBhcmFtLCBuZXdWYWx1ZSksIHRydWUpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIExpc3RlbnMgZm9yIGNoYW5nZXMgaW4gdGhlIHJvdXRlciBhbmQgc3luY2hyb25pemVzIHRvIHRoZSBtb2RlbC4gKi9cclxuICAgIHByaXZhdGUgc2V0dXBSb3V0ZXJMaXN0ZW5lcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN5bmNocm9uaXplUm91dGVyJC5waXBlKFxyXG4gICAgICAgICAgICBzdGFydFdpdGgodW5kZWZpbmVkKSxcclxuICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMucm91dGVyQWRhcHRlci5xdWVyeVBhcmFtTWFwLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAvLyBXZSB3YW50IHRvIGlnbm9yZSBjaGFuZ2VzIHRvIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlbid0IHJlbGF0ZWQgdG8gdGhpc1xyXG4gICAgICAgICAgICAgICAgLy8gcGFydGljdWxhciBncm91cDsgaG93ZXZlciwgd2UgZG8gbmVlZCB0byByZWFjdCBpZiBvbmUgb2Ygb3VyIHBhcmFtZXRlcnMgaGFzXHJcbiAgICAgICAgICAgICAgICAvLyB2YW5pc2hlZCB3aGVuIGl0IHdhcyBzZXQgYmVmb3JlLlxyXG4gICAgICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHByZXZpb3VzTWFwLCBjdXJyZW50TWFwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC52YWx1ZXModGhpcy5nZXRRdWVyeVBhcmFtR3JvdXAoKS5xdWVyeVBhcmFtcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChxdWVyeVBhcmFtID0+IHRoaXMud3JhcEludG9QYXJ0aXRpb24ocXVlcnlQYXJhbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocGFydGl0aW9uZWRRdWVyeVBhcmFtID0+IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5xdWVyeVBhcmFtcy5tYXAocXVlcnlQYXJhbSA9PiBxdWVyeVBhcmFtLnVybFBhcmFtKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gWy4uLmEsIC4uLmJdLCBbXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEl0IGlzIGltcG9ydGFudCB0aGF0IHdlIGZpbHRlciB0aGUgbWFwcyBvbmx5IGhlcmUgc28gdGhhdCBib3RoIGFyZSBmaWx0ZXJlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpdGggdGhlIHNhbWUgc2V0IG9mIGtleXM7IG90aGVyd2lzZSwgZS5nLiByZW1vdmluZyBhIHBhcmFtZXRlciBmcm9tIHRoZSBncm91cFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdvdWxkIGludGVyZmVyZS5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyZVBhcmFtTWFwcyhmaWx0ZXJQYXJhbU1hcChwcmV2aW91c01hcCwga2V5cyksIGZpbHRlclBhcmFtTWFwKGN1cnJlbnRNYXAsIGtleXMpKTtcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICApKSxcclxuICAgICAgICAgICAgc3dpdGNoTWFwKHF1ZXJ5UGFyYW1NYXAgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBjYXB0dXJlIHRoaXMgcmlnaHQgaGVyZSBzaW5jZSB0aGlzIGlzIG9ubHkgc2V0IGR1cmluZyB0aGUgb24tZ29pbmcgbmF2aWdhdGlvbi5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN5bnRoZXRpYyA9IHRoaXMuaXNTeW50aGV0aWNOYXZpZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeVBhcmFtTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLnF1ZXJ5UGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ya0pvaW4oWy4uLnF1ZXJ5UGFyYW1OYW1lc11cclxuICAgICAgICAgICAgICAgICAgICAubWFwKHF1ZXJ5UGFyYW1OYW1lID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydGl0aW9uZWRRdWVyeVBhcmFtID0gdGhpcy5nZXRRdWVyeVBhcmFtQXNQYXJ0aXRpb24ocXVlcnlQYXJhbU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcmtKb2luPHVua25vd25bXT4oWy4uLnBhcnRpdGlvbmVkUXVlcnlQYXJhbS5xdWVyeVBhcmFtc11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocXVlcnlQYXJhbSA9PiBpc011bHRpUXVlcnlQYXJhbTx1bmtub3duPihxdWVyeVBhcmFtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcXVlcnlQYXJhbS5kZXNlcmlhbGl6ZVZhbHVlKHF1ZXJ5UGFyYW1NYXAuZ2V0QWxsKHF1ZXJ5UGFyYW0udXJsUGFyYW0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcXVlcnlQYXJhbS5kZXNlcmlhbGl6ZVZhbHVlKHF1ZXJ5UGFyYW1NYXAuZ2V0KHF1ZXJ5UGFyYW0udXJsUGFyYW0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAobmV3VmFsdWVzID0+IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5yZWR1Y2UobmV3VmFsdWVzKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXAobmV3VmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSB0aGlzLmRpcmVjdGl2ZXMuZ2V0KHF1ZXJ5UGFyYW1OYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aXZlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzLmZvckVhY2goZGlyZWN0aXZlID0+IGRpcmVjdGl2ZS52YWx1ZUFjY2Vzc29yLndyaXRlVmFsdWUobmV3VmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcChuZXdWYWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgWyBxdWVyeVBhcmFtTmFtZSBdOiBuZXdWYWx1ZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICkucGlwZShcclxuICAgICAgICAgICAgICAgICAgICBtYXAoKHZhbHVlczogUmVjb3JkPHN0cmluZywgdW5rbm93bj5bXSkgPT4gdmFsdWVzLnJlZHVjZSgoZ3JvdXBWYWx1ZSwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmdyb3VwVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB7fSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcChncm91cFZhbHVlID0+IHRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkuc2V0VmFsdWUoZ3JvdXBWYWx1ZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0RXZlbnQ6ICFzeW50aGV0aWMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSxcclxuICAgICAgICApLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBMaXN0ZW5zIGZvciBuZXdseSBhZGRlZCBwYXJhbWV0ZXJzIGFuZCBzdGFydHMgc3luY2hyb25pemF0aW9uIGZvciB0aGVtLiAqL1xyXG4gICAgcHJpdmF0ZSB3YXRjaE5ld1BhcmFtcygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLnF1ZXJ5UGFyYW1BZGRlZCQucGlwZShcclxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpXHJcbiAgICAgICAgKS5zdWJzY3JpYmUocXVlcnlQYXJhbU5hbWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldHVwUGFyYW1DaGFuZ2VMaXN0ZW5lcihxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3luY2hyb25pemVSb3V0ZXIkLm5leHQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBjdXJyZW50IG5hdmlnYXRpb24gaXMgc3ludGhldGljLiAqL1xyXG4gICAgcHJpdmF0ZSBpc1N5bnRoZXRpY05hdmlnYXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbiA9IHRoaXMucm91dGVyQWRhcHRlci5nZXRDdXJyZW50TmF2aWdhdGlvbigpO1xyXG4gICAgICAgIGlmICghbmF2aWdhdGlvbiB8fCBuYXZpZ2F0aW9uLnRyaWdnZXIgIT09ICdpbXBlcmF0aXZlJykge1xyXG4gICAgICAgICAgICAvLyBXaGVuIHVzaW5nIHRoZSBiYWNrIC8gZm9yd2FyZCBidXR0b25zLCB0aGUgc3RhdGUgaXMgcGFzc2VkIGFsb25nIHdpdGggaXQsIGV2ZW4gdGhvdWdoXHJcbiAgICAgICAgICAgIC8vIGZvciB1cyBpdCdzIG5vdyBhIG5hdmlnYXRpb24gaW5pdGlhdGVkIGJ5IHRoZSB1c2VyLiBUaGVyZWZvcmUsIGEgbmF2aWdhdGlvbiBjYW4gb25seVxyXG4gICAgICAgICAgICAvLyBiZSBzeW50aGV0aWMgaWYgaXQgaGFzIGJlZW4gdHJpZ2dlcmVkIGltcGVyYXRpdmVseS5cclxuICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI4MTA4LlxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmF2aWdhdGlvbi5leHRyYXMgJiYgbmF2aWdhdGlvbi5leHRyYXMuc3RhdGUgJiYgbmF2aWdhdGlvbi5leHRyYXMuc3RhdGVbJ3N5bnRoZXRpYyddO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBTdWJzY3JpYmVzIHRvIHRoZSBwYXJhbWV0ZXIgcXVldWUgYW5kIGV4ZWN1dGVzIG5hdmlnYXRpb25zIGluIHNlcXVlbmNlLiAqL1xyXG4gICAgcHJpdmF0ZSBzZXR1cE5hdmlnYXRpb25RdWV1ZSgpIHtcclxuICAgICAgICB0aGlzLnF1ZXVlJC5waXBlKFxyXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JCksXHJcbiAgICAgICAgICAgIGNvbmNhdE1hcChkYXRhID0+IHRoaXMubmF2aWdhdGVTYWZlbHkoZGF0YSkpLFxyXG4gICAgICAgICkuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBuYXZpZ2F0ZVNhZmVseShkYXRhOiBOYXZpZ2F0aW9uRGF0YSk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMucm91dGVyQWRhcHRlci5uYXZpZ2F0ZShkYXRhLnBhcmFtcywge1xyXG4gICAgICAgICAgICAuLi50aGlzLnJvdXRlck9wdGlvbnMsXHJcbiAgICAgICAgICAgIHN0YXRlOiB7IHN5bnRoZXRpYzogZGF0YS5zeW50aGV0aWMgfSxcclxuICAgICAgICB9KSkucGlwZShcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyOiB1bmtub3duKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBUaGVyZSB3YXMgYW4gZXJyb3Igd2hpbGUgbmF2aWdhdGluZ2AsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEVNUFRZO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNlbmRzIGEgY2hhbmdlIG9mIHBhcmFtZXRlcnMgdG8gdGhlIHF1ZXVlLiAqL1xyXG4gICAgcHJpdmF0ZSBlbnF1ZXVlTmF2aWdhdGlvbihkYXRhOiBOYXZpZ2F0aW9uRGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucXVldWUkLm5leHQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmdWxsIHNldCBvZiBwYXJhbWV0ZXJzIGdpdmVuIGEgdmFsdWUgZm9yIGEgcGFyYW1ldGVyIG1vZGVsLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgY29uc2lzdHMgbWFpbmx5IG9mIHByb3Blcmx5IHNlcmlhbGl6aW5nIHRoZSBtb2RlbCB2YWx1ZSBhbmQgZW5zdXJpbmcgdG8gdGFrZVxyXG4gICAgICogc2lkZSBlZmZlY3QgY2hhbmdlcyBpbnRvIGFjY291bnQgdGhhdCBtYXkgaGF2ZSBiZWVuIGNvbmZpZ3VyZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0UGFyYW1zRm9yVmFsdWUocXVlcnlQYXJhbTogUXVlcnlQYXJhbTx1bmtub3duPiB8IE11bHRpUXVlcnlQYXJhbTx1bmtub3duPiB8IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTx1bmtub3duPiwgdmFsdWU6IGFueSk6IFBhcmFtcyB7XHJcbiAgICAgICAgY29uc3QgcGFydGl0aW9uZWRRdWVyeVBhcmFtID0gdGhpcy53cmFwSW50b1BhcnRpdGlvbihxdWVyeVBhcmFtKTtcclxuICAgICAgICBjb25zdCBwYXJ0aXRpb25lZCA9IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5wYXJ0aXRpb24odmFsdWUpO1xyXG5cclxuICAgICAgICBjb25zdCBjb21iaW5lZFBhcmFtcyA9IHBhcnRpdGlvbmVkUXVlcnlQYXJhbS5xdWVyeVBhcmFtc1xyXG4gICAgICAgICAgICAubWFwKChjdXJyZW50LCBpbmRleCkgPT4gaXNNaXNzaW5nKGN1cnJlbnQuY29tYmluZVdpdGgpID8gbnVsbCA6IGN1cnJlbnQuY29tYmluZVdpdGgocGFydGl0aW9uZWRbaW5kZXhdIGFzIGFueSkpXHJcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLihhIHx8IHt9KSwgLi4uKGIgfHwge30pIH07XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gcGFydGl0aW9uZWRRdWVyeVBhcmFtLnF1ZXJ5UGFyYW1zXHJcbiAgICAgICAgICAgIC5tYXAoKGN1cnJlbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIFsgY3VycmVudC51cmxQYXJhbSBdOiBjdXJyZW50LnNlcmlhbGl6ZVZhbHVlKHBhcnRpdGlvbmVkW2luZGV4XSBhcyBhbnkpLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYSwgLi4uYiB9O1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcblxyXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBsaXN0IHRoZSBzaWRlLWVmZmVjdCBwYXJhbWV0ZXJzIGZpcnN0IHNvIHRoYXQgb3VyIGFjdHVhbCBwYXJhbWV0ZXIgY2FuJ3QgYmVcclxuICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGl0LlxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLmNvbWJpbmVkUGFyYW1zLFxyXG4gICAgICAgICAgICAuLi5uZXdWYWx1ZXMsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2V0IG9mIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgcm91dGVyLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgbWVyZ2VzIHRoZSBnbG9iYWwgY29uZmlndXJhdGlvbiB3aXRoIHRoZSBncm91cCBzcGVjaWZpYyBjb25maWd1cmF0aW9uLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldCByb3V0ZXJPcHRpb25zKCk6IFJvdXRlck9wdGlvbnMge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IHRoaXMuZ2V0UXVlcnlQYXJhbUdyb3VwKCkucm91dGVyT3B0aW9ucztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4uKHRoaXMuZ2xvYmFsUm91dGVyT3B0aW9ucyB8fCB7fSksXHJcbiAgICAgICAgICAgIC4uLihncm91cE9wdGlvbnMgfHwge30pLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBxdWVyeSBwYXJhbWV0ZXIgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhcyBhIHBhcnRpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgcXVlcnkgcGFyYW1ldGVyIGlzIHBhcnRpdGlvbmVkLCBpdCBpcyByZXR1cm5lZCB1bmNoYW5nZWQuIE90aGVyd2lzZVxyXG4gICAgICogaXQgaXMgd3JhcHBlZCBpbnRvIGEgbm9vcCBwYXJ0aXRpb24uIFRoaXMgbWFrZXMgaXQgZWFzeSB0byBvcGVyYXRlIG9uXHJcbiAgICAgKiBxdWVyeSBwYXJhbWV0ZXJzIGluZGVwZW5kZW50IG9mIHdoZXRoZXIgdGhleSBhcmUgcGFydGl0aW9uZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0UXVlcnlQYXJhbUFzUGFydGl0aW9uKHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcpOiBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4ge1xyXG4gICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW0gPSB0aGlzLmdldFF1ZXJ5UGFyYW1Hcm91cCgpLmdldChxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICAgICAgaWYgKCFxdWVyeVBhcmFtKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcXVlcnkgcGFyYW0gd2l0aCBuYW1lICR7cXVlcnlQYXJhbU5hbWV9LiBEaWQgeW91IGZvcmdldCB0byBhZGQgaXQgdG8geW91ciBRdWVyeVBhcmFtR3JvdXA/YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy53cmFwSW50b1BhcnRpdGlvbihxdWVyeVBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdyYXBzIGEgcXVlcnkgcGFyYW1ldGVyIGludG8gYSBwYXJ0aXRpb24gaWYgaXQgaXNuJ3QgYWxyZWFkeS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB3cmFwSW50b1BhcnRpdGlvbihcclxuICAgICAgICBxdWVyeVBhcmFtOiBRdWVyeVBhcmFtPHVua25vd24+IHwgTXVsdGlRdWVyeVBhcmFtPHVua25vd24+IHwgUGFydGl0aW9uZWRRdWVyeVBhcmFtPHVua25vd24+XHJcbiAgICApOiBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4ge1xyXG4gICAgICAgIGlmIChxdWVyeVBhcmFtIGluc3RhbmNlb2YgUGFydGl0aW9uZWRRdWVyeVBhcmFtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVBhcmFtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4oW3F1ZXJ5UGFyYW1dLCB7XHJcbiAgICAgICAgICAgIHBhcnRpdGlvbjogdmFsdWUgPT4gW3ZhbHVlXSxcclxuICAgICAgICAgICAgcmVkdWNlOiB2YWx1ZXMgPT4gdmFsdWVzWzBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UXVlcnlQYXJhbUdyb3VwKCk6IFF1ZXJ5UGFyYW1Hcm91cCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXJ5UGFyYW1Hcm91cCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIFF1ZXJ5UGFyYW1Hcm91cCBoYXMgYmVlbiByZWdpc3RlcmVkIHlldC5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5UGFyYW1Hcm91cDtcclxuICAgIH1cclxuXHJcbn0iXX0=