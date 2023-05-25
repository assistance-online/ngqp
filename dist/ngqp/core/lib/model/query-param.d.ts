import { Observable, Subject } from 'rxjs';
import { Comparator, MultiParamDeserializer, MultiParamSerializer, OnChangeFunction, ParamCombinator, ParamDeserializer, ParamSerializer, Partitioner, Reducer } from '../types';
import { QueryParamGroup } from './query-param-group';
import { MultiQueryParamOpts, PartitionedQueryParamOpts, QueryParamOpts, QueryParamOptsBase } from './query-param-opts';
/** @internal */
declare abstract class AbstractQueryParamBase<T> {
    abstract value: T | null;
    protected parent: QueryParamGroup | null;
    protected readonly _valueChanges: Subject<T | null>;
    protected changeFunctions: OnChangeFunction<T>[];
    /**
     * Emits the current value of this parameter whenever it changes.
     *
     * NOTE: This observable does not complete on its own, so ensure to unsubscribe from it.
     */
    readonly valueChanges: Observable<T | null>;
    _registerOnChange(fn: OnChangeFunction<T>): void;
    _clearChangeFunctions(): void;
    abstract setValue(value: T | null, opts: {
        emitEvent?: boolean;
        onlySelf?: boolean;
        emitModelToViewChange?: boolean;
    }): void;
    _setParent(parent: QueryParamGroup | null): void;
}
/**
 * Abstract base for {@link QueryParam} and {@link MultiQueryParam}.
 *
 * This base class holds most of the parameter's options, but is unaware of
 * how to actually (de-)serialize any values.
 */
export declare abstract class AbstractQueryParam<U, T> extends AbstractQueryParamBase<T> {
    /**
     * The current value of this parameter.
     */
    value: T | null;
    /**
     * The name of the parameter to be used in the URL.
     *
     * This represents the name of the query parameter which will be
     * used in the URL (e.g., `?q=`), which differs from the name of
     * the {@link QueryParam} model used inside {@link QueryParamGroup}.
     */
    readonly urlParam: string;
    /** See {@link QueryParamOpts}. */
    readonly serialize: ParamSerializer<U>;
    /** See {@link QueryParamOpts}. */
    readonly deserialize: ParamDeserializer<U>;
    /** See {@link QueryParamOpts}. */
    readonly debounceTime: number | null;
    /** See {@link QueryParamOpts}. */
    readonly emptyOn?: T | null;
    /** See {@link QueryParamOpts}. */
    readonly compareWith?: Comparator<T | null>;
    /** See {@link QueryParamOpts}. */
    readonly combineWith?: ParamCombinator<T>;
    protected constructor(urlParam: string, opts?: QueryParamOptsBase<U, T>);
    /**
     * Updates the value of this parameter.
     *
     * If wired up with a {@link QueryParamGroup}, this will also synchronize
     * the value to the URL.
     */
    setValue(value: T | null, opts?: {
        emitEvent?: boolean;
        onlySelf?: boolean;
        emitModelToViewChange?: boolean;
    }): void;
}
/**
 * Describes a single parameter.
 *
 * This is the description of a single parameter and essentially serves
 * as the glue between its representation in the URL and its connection
 * to a form control.
 */
export declare class QueryParam<T> extends AbstractQueryParam<T | null, T | null> implements Readonly<QueryParamOpts<T>> {
    /** See {@link QueryParamOpts}. */
    readonly multi = false;
    constructor(urlParam: string, opts: QueryParamOpts<T>);
    /** @internal */
    serializeValue(value: T | null): string | null;
    /** @internal */
    deserializeValue(value: string | null): Observable<T | null>;
}
/**
 * Like {@link QueryParam}, but for array-typed parameters
 */
export declare class MultiQueryParam<T> extends AbstractQueryParam<T | null, (T | null)[]> implements Readonly<MultiQueryParamOpts<T>> {
    /** See {@link QueryParamOpts}. */
    readonly multi = true;
    /** See {@link MultiQueryParamOpts}. */
    readonly serializeAll?: MultiParamSerializer<T>;
    /** See {@link MultiQueryParamOpts}. */
    readonly deserializeAll?: MultiParamDeserializer<T>;
    constructor(urlParam: string, opts: MultiQueryParamOpts<T>);
    /** @internal */
    serializeValue(value: (T | null)[] | null): (string | null)[] | null;
    /** @internal */
    deserializeValue(values: (string | null)[] | null): Observable<(T | null)[] | null>;
}
/**
 * Describes a partitioned query parameter.
 *
 * This encapsulates a list of query parameters such that a single form control
 * can be bound against multiple URL parameters. To achieve this, functions must
 * be defined which can convert the models between the parameters.
 */
export declare class PartitionedQueryParam<T, G extends unknown[] = unknown[]> extends AbstractQueryParamBase<T> {
    /** @internal */
    readonly queryParams: (QueryParam<G[number]> | MultiQueryParam<G[number]>)[];
    /** @internal */
    readonly partition: Partitioner<T, G>;
    /** @internal */
    readonly reduce: Reducer<G, T>;
    constructor(queryParams: (QueryParam<G[number]> | MultiQueryParam<G[number]>)[], opts: PartitionedQueryParamOpts<T, G>);
    get value(): T;
    setValue(value: T, opts?: {
        emitEvent?: boolean;
        onlySelf?: boolean;
        emitModelToViewChange?: boolean;
    }): void;
}
export {};
