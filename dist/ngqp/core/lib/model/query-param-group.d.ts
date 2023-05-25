import { Observable } from 'rxjs';
import { OnChangeFunction } from '../types';
import { MultiQueryParam, QueryParam, PartitionedQueryParam } from './query-param';
import { RouterOptions } from '../router-adapter/router-adapter.interface';
import { QueryParamGroupOpts } from './query-param-opts';
/**
 * Groups multiple {@link QueryParam} instances to a single unit.
 *
 * This "bundles" multiple parameters together such that changes can be emitted as a
 * complete unit. Collecting parameters into a group is required for the synchronization
 * to and from the URL.
 */
export declare class QueryParamGroup {
    /** @internal */
    private readonly _valueChanges;
    /**
     * Emits the values of all parameters in this group whenever at least one changes.
     *
     * This observable emits an object keyed by the {@QueryParam} names where each key
     * carries the current value of the represented parameter. It emits whenever at least
     * one parameter's value is changed.
     *
     * NOTE: This observable does not complete on its own, so ensure to unsubscribe from it.
     */
    readonly valueChanges: Observable<Record<string, any>>;
    /** @internal */
    private readonly _queryParamAdded$;
    /** @internal */
    readonly queryParamAdded$: Observable<string>;
    /** @internal */
    readonly queryParams: {
        [queryParamName: string]: QueryParam<unknown> | MultiQueryParam<unknown> | PartitionedQueryParam<unknown>;
    };
    /** @internal */
    readonly routerOptions: RouterOptions;
    /** @internal */
    readonly options: QueryParamGroupOpts;
    private changeFunctions;
    constructor(queryParams: {
        [queryParamName: string]: QueryParam<unknown> | MultiQueryParam<unknown> | PartitionedQueryParam<unknown>;
    }, extras?: RouterOptions & QueryParamGroupOpts);
    /** @internal */
    _registerOnChange(fn: OnChangeFunction<Record<string, any>>): void;
    /** @internal */
    _clearChangeFunctions(): void;
    /**
     * Retrieves a specific parameter from this group by name.
     *
     * This returns an instance of either {@link QueryParam}, {@link MultiQueryParam}
     * or {@link PartitionedQueryParam} depending on the configuration, or `null`
     * if no parameter with that name is found in this group.
     *
     * @param queryParamName The name of the parameter instance to retrieve.
     */
    get(queryParamName: string): QueryParam<unknown> | MultiQueryParam<unknown> | PartitionedQueryParam<unknown> | null;
    /**
     * Adds a new {@link QueryParam} to this group.
     *
     * This adds the parameter under the given name to this group. The current
     * URL will be evaluated to synchronize its value initially. Afterwards
     * it is treated just like any other parameter in this group.
     *
     * @param queryParamName Name of the parameter to reference it with.
     * @param queryParam The new parameter to add.
     */
    add(queryParamName: string, queryParam: QueryParam<unknown> | MultiQueryParam<unknown> | PartitionedQueryParam<unknown>): void;
    /**
     * Removes a {@link QueryParam} from this group.
     *
     * This removes the parameter defined by the provided name from this group.
     * No further synchronization with this parameter will occur and it will not
     * be reported in the value of this group anymore.
     *
     * @param queryParamName The name of the parameter to remove.
     */
    remove(queryParamName: string): void;
    /**
     * The current value of this group.
     *
     * See {@link QueryParamGroup#valueChanges} for a description of the format of
     * the value.
     */
    get value(): Record<string, any>;
    /**
     * Updates the value of this group by merging it in.
     *
     * This sets the value of each provided parameter to the respective provided
     * value. If a parameter is not listed, its value remains unchanged.
     *
     * @param value See {@link QueryParamGroup#valueChanges} for a description of the format.
     * @param opts Additional options
     */
    patchValue(value: Record<string, any>, opts?: {
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
    }): void;
    /**
     * Updates the value of this group by overwriting it.
     *
     * This sets the value of each provided parameter to the respective provided
     * value. If a parameter is not listed, its value is set to `undefined`.
     *
     * @param value See {@link QueryParamGroup#valueChanges} for a description of the format.
     * @param opts Additional options
     */
    setValue(value: Record<string, any> | null, opts?: {
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
    }): void;
    /** @internal */
    _updateValue(opts?: {
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
    }): void;
}
