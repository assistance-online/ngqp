import { RouterOptions } from './router-adapter/router-adapter.interface';
import { MultiQueryParam, QueryParam, PartitionedQueryParam } from './model/query-param';
import { QueryParamGroup } from './model/query-param-group';
import { MultiQueryParamOpts, PartitionedQueryParamOpts, QueryParamGroupOpts, QueryParamOpts } from './model/query-param-opts';
import * as i0 from "@angular/core";
/**
 * Service to create parameters and groups.
 *
 * This service provides a simple API to create {@link QueryParamGroup} and {@link QueryParam}
 * instances and is the recommended way to set them up.
 */
export declare class QueryParamBuilder {
    /**
     * Creates a new {@link QueryParamGroup}.
     *
     * This is the primary method to create a new group of parameters. Pass a list of
     * {@link QueryParam} instances by using the `xxxParam` methods.
     *
     * @param queryParams List of {@link QueryParam}s keyed by a unique name.
     * @param extras Additional parameters for this group, overriding global configuration.
     * @returns The new {@link QueryParamGroup}.
     */
    group(queryParams: {
        [name: string]: QueryParam<any> | MultiQueryParam<any> | PartitionedQueryParam<any>;
    }, extras?: RouterOptions & QueryParamGroupOpts): QueryParamGroup;
    /** @ignore */
    partition<T, G1>(queryParams: [QueryParam<G1> | MultiQueryParam<G1>], opts: PartitionedQueryParamOpts<T, [G1]>): PartitionedQueryParam<T, [G1]>;
    /** @ignore */
    partition<T, G1, G2>(queryParams: [QueryParam<G1> | MultiQueryParam<G1>, QueryParam<G2> | MultiQueryParam<G2>], opts: PartitionedQueryParamOpts<T, [G1, G2]>): PartitionedQueryParam<T, [G1, G2]>;
    /** @ignore */
    partition<T, G1, G2, G3>(queryParams: [QueryParam<G1> | MultiQueryParam<G1>, QueryParam<G2> | MultiQueryParam<G2>, QueryParam<G3> | MultiQueryParam<G3>], opts: PartitionedQueryParamOpts<T, [G1, G2, G3]>): PartitionedQueryParam<T, [G1, G2, G3]>;
    /** @ignore */
    stringParam(urlParam: string, opts: MultiQueryParamOpts<string>): MultiQueryParam<string>;
    /** @ignore */
    stringParam(urlParam: string, opts?: QueryParamOpts<string>): QueryParam<string>;
    /** @ignore */
    numberParam(urlParam: string, opts: MultiQueryParamOpts<number>): MultiQueryParam<number>;
    /** @ignore */
    numberParam(urlParam: string, opts?: QueryParamOpts<number>): QueryParam<number>;
    /** @ignore */
    booleanParam(urlParam: string, opts: MultiQueryParamOpts<boolean>): MultiQueryParam<boolean>;
    /** @ignore */
    booleanParam(urlParam: string, opts?: QueryParamOpts<boolean>): QueryParam<boolean>;
    /** @ignore */
    param<T>(urlParam: string, opts: MultiQueryParamOpts<T>): MultiQueryParam<T>;
    /** @ignore */
    param<T>(urlParam: string, opts?: QueryParamOpts<T>): QueryParam<T>;
    static ɵfac: i0.ɵɵFactoryDeclaration<QueryParamBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<QueryParamBuilder>;
}
