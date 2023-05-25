import { OnDestroy } from '@angular/core';
import { QueryParamGroup } from '../model/query-param-group';
import { RouterAdapter, RouterOptions } from '../router-adapter/router-adapter.interface';
import { QueryParamAccessor } from './query-param-accessor.interface';
import * as i0 from "@angular/core";
/**
 * Service implementing the synchronization logic
 *
 * This service is the key to the synchronization process by binding a {@link QueryParamGroup}
 * to the router.
 *
 * @internal
 */
export declare class QueryParamGroupService implements OnDestroy {
    private routerAdapter;
    private globalRouterOptions;
    /** The {@link QueryParamGroup} to bind. */
    private queryParamGroup;
    /** List of {@link QueryParamAccessor} registered to this service. */
    private directives;
    /**
     * Queue of navigation parameters
     *
     * A queue is used for navigations as we need to make sure all parameter changes
     * are executed in sequence as otherwise navigations might overwrite each other.
     */
    private queue$;
    /** @ignore */
    private synchronizeRouter$;
    /** @ignore */
    private destroy$;
    constructor(routerAdapter: RouterAdapter, globalRouterOptions: RouterOptions);
    /** @ignore */
    ngOnDestroy(): void;
    /**
     * Uses the given {@link QueryParamGroup} for synchronization.
     */
    setQueryParamGroup(queryParamGroup: QueryParamGroup): void;
    /**
     * Registers a {@link QueryParamAccessor}.
     */
    registerQueryParamDirective(directive: QueryParamAccessor): void;
    /**
     * Deregisters a {@link QueryParamAccessor} by referencing its name.
     */
    deregisterQueryParamDirective(queryParamName: string): void;
    private startSynchronization;
    /** Listens for programmatic changes on group level and synchronizes to the router. */
    private setupGroupChangeListener;
    /** Listens for programmatic changes on parameter level and synchronizes to the router. */
    private setupParamChangeListeners;
    private setupParamChangeListener;
    /** Listens for changes in the router and synchronizes to the model. */
    private setupRouterListener;
    /** Listens for newly added parameters and starts synchronization for them. */
    private watchNewParams;
    /** Returns true if the current navigation is synthetic. */
    private isSyntheticNavigation;
    /** Subscribes to the parameter queue and executes navigations in sequence. */
    private setupNavigationQueue;
    private navigateSafely;
    /** Sends a change of parameters to the queue. */
    private enqueueNavigation;
    /**
     * Returns the full set of parameters given a value for a parameter model.
     *
     * This consists mainly of properly serializing the model value and ensuring to take
     * side effect changes into account that may have been configured.
     */
    private getParamsForValue;
    /**
     * Returns the current set of options to pass to the router.
     *
     * This merges the global configuration with the group specific configuration.
     */
    private get routerOptions();
    /**
     * Returns the query parameter with the given name as a partition.
     *
     * If the query parameter is partitioned, it is returned unchanged. Otherwise
     * it is wrapped into a noop partition. This makes it easy to operate on
     * query parameters independent of whether they are partitioned.
     */
    private getQueryParamAsPartition;
    /**
     * Wraps a query parameter into a partition if it isn't already.
     */
    private wrapIntoPartition;
    private getQueryParamGroup;
    static ɵfac: i0.ɵɵFactoryDeclaration<QueryParamGroupService, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<QueryParamGroupService>;
}
