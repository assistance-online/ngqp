import { Injectable } from '@angular/core';
import { DEFAULT_BOOLEAN_DESERIALIZER, DEFAULT_BOOLEAN_SERIALIZER, DEFAULT_NUMBER_DESERIALIZER, DEFAULT_NUMBER_SERIALIZER, DEFAULT_STRING_DESERIALIZER, DEFAULT_STRING_SERIALIZER } from './serializers';
import { LOOSE_IDENTITY_COMPARATOR } from './util';
import { MultiQueryParam, QueryParam, PartitionedQueryParam } from './model/query-param';
import { QueryParamGroup } from './model/query-param-group';
import * as i0 from "@angular/core";
function isMultiOpts(opts) {
    return opts.multi === true;
}
/**
 * Service to create parameters and groups.
 *
 * This service provides a simple API to create {@link QueryParamGroup} and {@link QueryParam}
 * instances and is the recommended way to set them up.
 */
export class QueryParamBuilder {
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
    group(queryParams, extras = {}) {
        // TODO Maybe we should first validate that no two queryParams defined the same "param".
        return new QueryParamGroup(queryParams, extras);
    }
    /**
     * Partition a query parameter into multiple others.
     *
     * Partitioning is useful if you need to bind a single form control to multiple query parameters.
     * For example, consider a {@code <select>} which represents both a field to sort by and the
     * direction to sort in. If you want to encode these two information on separate URL parameters,
     * you can define a single query parameter that is partitioned into two others.
     *
     * @param queryParams The query parameters making up this partition.
     * @param opts See {@link PartitionedQueryParamOpts}.
     */
    partition(queryParams, opts) {
        return new PartitionedQueryParam(queryParams, opts);
    }
    /**
     * Create a new parameter of type `string`.
     *
     * See {@link QueryParamOpts}.
     */
    stringParam(urlParam, opts = {}) {
        opts = {
            serialize: DEFAULT_STRING_SERIALIZER,
            deserialize: DEFAULT_STRING_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    /**
     * Create a new parameter of type `number`.
     *
     * See {@link QueryParamOpts}.
     */
    numberParam(urlParam, opts = {}) {
        opts = {
            serialize: DEFAULT_NUMBER_SERIALIZER,
            deserialize: DEFAULT_NUMBER_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    /**
     * Create a new parameter of type `boolean`.
     *
     * See {@link QueryParamOpts}.
     */
    booleanParam(urlParam, opts = {}) {
        opts = {
            serialize: DEFAULT_BOOLEAN_SERIALIZER,
            deserialize: DEFAULT_BOOLEAN_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    /**
     * Create a new parameter for a complex type.
     *
     * See {@link QueryParamOpts}.
     */
    param(urlParam, opts = {}) {
        opts = {
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    static ɵfac = function QueryParamBuilder_Factory(t) { return new (t || QueryParamBuilder)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QueryParamBuilder, factory: QueryParamBuilder.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamBuilder, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tYnVpbGRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvcXVlcnktcGFyYW0tYnVpbGRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUNILDRCQUE0QixFQUM1QiwwQkFBMEIsRUFDMUIsMkJBQTJCLEVBQzNCLHlCQUF5QixFQUN6QiwyQkFBMkIsRUFDM0IseUJBQXlCLEVBQzVCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVuRCxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFRNUQsU0FBUyxXQUFXLENBQUksSUFBZ0Q7SUFDcEUsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQztBQUMvQixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFJSCxNQUFNLE9BQU8saUJBQWlCO0lBRTFCOzs7Ozs7Ozs7T0FTRztJQUNJLEtBQUssQ0FDUixXQUFzRyxFQUN0RyxTQUE4QyxFQUFFO1FBRWhELHdGQUF3RjtRQUN4RixPQUFPLElBQUksZUFBZSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBaUJEOzs7Ozs7Ozs7O09BVUc7SUFDSSxTQUFTLENBQ1osV0FBbUUsRUFDbkUsSUFBcUM7UUFFckMsT0FBTyxJQUFJLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBTUQ7Ozs7T0FJRztJQUNJLFdBQVcsQ0FDZCxRQUFnQixFQUNoQixPQUE2RCxFQUFFO1FBRS9ELElBQUksR0FBRztZQUNILFNBQVMsRUFBRSx5QkFBeUI7WUFDcEMsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLEdBQUcsSUFBSTtTQUNWLENBQUM7UUFFRixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sSUFBSSxlQUFlLENBQVMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZELENBQUM7YUFBTSxDQUFDO1lBQ0osT0FBTyxJQUFJLFVBQVUsQ0FBUyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7SUFNRDs7OztPQUlHO0lBQ0ksV0FBVyxDQUNkLFFBQWdCLEVBQ2hCLE9BQTZELEVBQUU7UUFFL0QsSUFBSSxHQUFHO1lBQ0gsU0FBUyxFQUFFLHlCQUF5QjtZQUNwQyxXQUFXLEVBQUUsMkJBQTJCO1lBQ3hDLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsR0FBRyxJQUFJO1NBQ1YsQ0FBQztRQUVGLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDcEIsT0FBTyxJQUFJLGVBQWUsQ0FBUyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkQsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLElBQUksVUFBVSxDQUFTLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0wsQ0FBQztJQU1EOzs7O09BSUc7SUFDSSxZQUFZLENBQ2YsUUFBZ0IsRUFDaEIsT0FBK0QsRUFBRTtRQUVqRSxJQUFJLEdBQUc7WUFDSCxTQUFTLEVBQUUsMEJBQTBCO1lBQ3JDLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxHQUFHLElBQUk7U0FDVixDQUFDO1FBRUYsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNwQixPQUFPLElBQUksZUFBZSxDQUFVLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sSUFBSSxVQUFVLENBQVUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7SUFDTCxDQUFDO0lBTUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FDUixRQUFnQixFQUNoQixPQUFtRCxFQUFFO1FBRXJELElBQUksR0FBRztZQUNILFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsR0FBRyxJQUFJO1NBQ1YsQ0FBQztRQUVGLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDcEIsT0FBTyxJQUFJLGVBQWUsQ0FBSSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLElBQUksVUFBVSxDQUFJLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDO0lBQ0wsQ0FBQzsyRUE3SlEsaUJBQWlCO2dFQUFqQixpQkFBaUIsV0FBakIsaUJBQWlCLG1CQUZkLE1BQU07O2lGQUVULGlCQUFpQjtjQUg3QixVQUFVO2VBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBERUZBVUxUX0JPT0xFQU5fREVTRVJJQUxJWkVSLFxyXG4gICAgREVGQVVMVF9CT09MRUFOX1NFUklBTElaRVIsXHJcbiAgICBERUZBVUxUX05VTUJFUl9ERVNFUklBTElaRVIsXHJcbiAgICBERUZBVUxUX05VTUJFUl9TRVJJQUxJWkVSLFxyXG4gICAgREVGQVVMVF9TVFJJTkdfREVTRVJJQUxJWkVSLFxyXG4gICAgREVGQVVMVF9TVFJJTkdfU0VSSUFMSVpFUlxyXG59IGZyb20gJy4vc2VyaWFsaXplcnMnO1xyXG5pbXBvcnQgeyBMT09TRV9JREVOVElUWV9DT01QQVJBVE9SIH0gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0IHsgUm91dGVyT3B0aW9ucyB9IGZyb20gJy4vcm91dGVyLWFkYXB0ZXIvcm91dGVyLWFkYXB0ZXIuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgTXVsdGlRdWVyeVBhcmFtLCBRdWVyeVBhcmFtLCBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW0gfSBmcm9tICcuL21vZGVsL3F1ZXJ5LXBhcmFtJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwIH0gZnJvbSAnLi9tb2RlbC9xdWVyeS1wYXJhbS1ncm91cCc7XHJcbmltcG9ydCB7XHJcbiAgICBNdWx0aVF1ZXJ5UGFyYW1PcHRzLFxyXG4gICAgUGFydGl0aW9uZWRRdWVyeVBhcmFtT3B0cyxcclxuICAgIFF1ZXJ5UGFyYW1Hcm91cE9wdHMsXHJcbiAgICBRdWVyeVBhcmFtT3B0c1xyXG59IGZyb20gJy4vbW9kZWwvcXVlcnktcGFyYW0tb3B0cyc7XHJcblxyXG5mdW5jdGlvbiBpc011bHRpT3B0czxUPihvcHRzOiBRdWVyeVBhcmFtT3B0czxUPiB8IE11bHRpUXVlcnlQYXJhbU9wdHM8VD4pOiBvcHRzIGlzIE11bHRpUXVlcnlQYXJhbU9wdHM8VD4ge1xyXG4gICAgcmV0dXJuIG9wdHMubXVsdGkgPT09IHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHRvIGNyZWF0ZSBwYXJhbWV0ZXJzIGFuZCBncm91cHMuXHJcbiAqXHJcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIHNpbXBsZSBBUEkgdG8gY3JlYXRlIHtAbGluayBRdWVyeVBhcmFtR3JvdXB9IGFuZCB7QGxpbmsgUXVlcnlQYXJhbX1cclxuICogaW5zdGFuY2VzIGFuZCBpcyB0aGUgcmVjb21tZW5kZWQgd2F5IHRvIHNldCB0aGVtIHVwLlxyXG4gKi9cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBRdWVyeVBhcmFtQnVpbGRlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHtAbGluayBRdWVyeVBhcmFtR3JvdXB9LlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgaXMgdGhlIHByaW1hcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBncm91cCBvZiBwYXJhbWV0ZXJzLiBQYXNzIGEgbGlzdCBvZlxyXG4gICAgICoge0BsaW5rIFF1ZXJ5UGFyYW19IGluc3RhbmNlcyBieSB1c2luZyB0aGUgYHh4eFBhcmFtYCBtZXRob2RzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBxdWVyeVBhcmFtcyBMaXN0IG9mIHtAbGluayBRdWVyeVBhcmFtfXMga2V5ZWQgYnkgYSB1bmlxdWUgbmFtZS5cclxuICAgICAqIEBwYXJhbSBleHRyYXMgQWRkaXRpb25hbCBwYXJhbWV0ZXJzIGZvciB0aGlzIGdyb3VwLCBvdmVycmlkaW5nIGdsb2JhbCBjb25maWd1cmF0aW9uLlxyXG4gICAgICogQHJldHVybnMgVGhlIG5ldyB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdyb3VwKFxyXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiB7IFsgbmFtZTogc3RyaW5nIF06IFF1ZXJ5UGFyYW08YW55PiB8IE11bHRpUXVlcnlQYXJhbTxhbnk+IHwgUGFydGl0aW9uZWRRdWVyeVBhcmFtPGFueT4gfSxcclxuICAgICAgICBleHRyYXM6IFJvdXRlck9wdGlvbnMgJiBRdWVyeVBhcmFtR3JvdXBPcHRzID0ge31cclxuICAgICk6IFF1ZXJ5UGFyYW1Hcm91cCB7XHJcbiAgICAgICAgLy8gVE9ETyBNYXliZSB3ZSBzaG91bGQgZmlyc3QgdmFsaWRhdGUgdGhhdCBubyB0d28gcXVlcnlQYXJhbXMgZGVmaW5lZCB0aGUgc2FtZSBcInBhcmFtXCIuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWVyeVBhcmFtR3JvdXAocXVlcnlQYXJhbXMsIGV4dHJhcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBwYXJ0aXRpb248VCwgRzE+KFxyXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBbUXVlcnlQYXJhbTxHMT4gfCBNdWx0aVF1ZXJ5UGFyYW08RzE+XSxcclxuICAgICAgICBvcHRzOiBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW1PcHRzPFQsIFtHMV0+XHJcbiAgICApOiBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08VCwgW0cxXT47XHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHVibGljIHBhcnRpdGlvbjxULCBHMSwgRzI+KFxyXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBbUXVlcnlQYXJhbTxHMT4gfCBNdWx0aVF1ZXJ5UGFyYW08RzE+LCBRdWVyeVBhcmFtPEcyPiB8IE11bHRpUXVlcnlQYXJhbTxHMj5dLFxyXG4gICAgICAgIG9wdHM6IFBhcnRpdGlvbmVkUXVlcnlQYXJhbU9wdHM8VCwgW0cxLCBHMl0+XHJcbiAgICApOiBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08VCwgW0cxLCBHMl0+O1xyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBwYXJ0aXRpb248VCwgRzEsIEcyLCBHMz4oXHJcbiAgICAgICAgcXVlcnlQYXJhbXM6IFtRdWVyeVBhcmFtPEcxPiB8IE11bHRpUXVlcnlQYXJhbTxHMT4sIFF1ZXJ5UGFyYW08RzI+IHwgTXVsdGlRdWVyeVBhcmFtPEcyPiwgUXVlcnlQYXJhbTxHMz4gfCBNdWx0aVF1ZXJ5UGFyYW08RzM+XSxcclxuICAgICAgICBvcHRzOiBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW1PcHRzPFQsIFtHMSwgRzIsIEczXT5cclxuICAgICk6IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTxULCBbRzEsIEcyLCBHM10+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJ0aXRpb24gYSBxdWVyeSBwYXJhbWV0ZXIgaW50byBtdWx0aXBsZSBvdGhlcnMuXHJcbiAgICAgKlxyXG4gICAgICogUGFydGl0aW9uaW5nIGlzIHVzZWZ1bCBpZiB5b3UgbmVlZCB0byBiaW5kIGEgc2luZ2xlIGZvcm0gY29udHJvbCB0byBtdWx0aXBsZSBxdWVyeSBwYXJhbWV0ZXJzLlxyXG4gICAgICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIGEge0Bjb2RlIDxzZWxlY3Q+fSB3aGljaCByZXByZXNlbnRzIGJvdGggYSBmaWVsZCB0byBzb3J0IGJ5IGFuZCB0aGVcclxuICAgICAqIGRpcmVjdGlvbiB0byBzb3J0IGluLiBJZiB5b3Ugd2FudCB0byBlbmNvZGUgdGhlc2UgdHdvIGluZm9ybWF0aW9uIG9uIHNlcGFyYXRlIFVSTCBwYXJhbWV0ZXJzLFxyXG4gICAgICogeW91IGNhbiBkZWZpbmUgYSBzaW5nbGUgcXVlcnkgcGFyYW1ldGVyIHRoYXQgaXMgcGFydGl0aW9uZWQgaW50byB0d28gb3RoZXJzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBxdWVyeVBhcmFtcyBUaGUgcXVlcnkgcGFyYW1ldGVycyBtYWtpbmcgdXAgdGhpcyBwYXJ0aXRpb24uXHJcbiAgICAgKiBAcGFyYW0gb3B0cyBTZWUge0BsaW5rIFBhcnRpdGlvbmVkUXVlcnlQYXJhbU9wdHN9LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGFydGl0aW9uPFQsIEcgZXh0ZW5kcyB1bmtub3duW10+KFxyXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiAoUXVlcnlQYXJhbTxHW251bWJlcl0+IHwgTXVsdGlRdWVyeVBhcmFtPEdbbnVtYmVyXT4pW10sXHJcbiAgICAgICAgb3B0czogUGFydGl0aW9uZWRRdWVyeVBhcmFtT3B0czxULCBHPlxyXG4gICAgKTogUGFydGl0aW9uZWRRdWVyeVBhcmFtPFQsIEc+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFBhcnRpdGlvbmVkUXVlcnlQYXJhbShxdWVyeVBhcmFtcywgb3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBzdHJpbmdQYXJhbSh1cmxQYXJhbTogc3RyaW5nLCBvcHRzOiBNdWx0aVF1ZXJ5UGFyYW1PcHRzPHN0cmluZz4pOiBNdWx0aVF1ZXJ5UGFyYW08c3RyaW5nPjtcclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgc3RyaW5nUGFyYW0odXJsUGFyYW06IHN0cmluZywgb3B0cz86IFF1ZXJ5UGFyYW1PcHRzPHN0cmluZz4pOiBRdWVyeVBhcmFtPHN0cmluZz47XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIG5ldyBwYXJhbWV0ZXIgb2YgdHlwZSBgc3RyaW5nYC5cclxuICAgICAqXHJcbiAgICAgKiBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1PcHRzfS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmluZ1BhcmFtKFxyXG4gICAgICAgIHVybFBhcmFtOiBzdHJpbmcsXHJcbiAgICAgICAgb3B0czogUXVlcnlQYXJhbU9wdHM8c3RyaW5nPiB8IE11bHRpUXVlcnlQYXJhbU9wdHM8c3RyaW5nPiA9IHt9XHJcbiAgICApOiBRdWVyeVBhcmFtPHN0cmluZz4gfCBNdWx0aVF1ZXJ5UGFyYW08c3RyaW5nPiB7XHJcbiAgICAgICAgb3B0cyA9IHtcclxuICAgICAgICAgICAgc2VyaWFsaXplOiBERUZBVUxUX1NUUklOR19TRVJJQUxJWkVSLFxyXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogREVGQVVMVF9TVFJJTkdfREVTRVJJQUxJWkVSLFxyXG4gICAgICAgICAgICBjb21wYXJlV2l0aDogTE9PU0VfSURFTlRJVFlfQ09NUEFSQVRPUixcclxuICAgICAgICAgICAgLi4ub3B0cyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaXNNdWx0aU9wdHMob3B0cykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aVF1ZXJ5UGFyYW08c3RyaW5nPih1cmxQYXJhbSwgb3B0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVyeVBhcmFtPHN0cmluZz4odXJsUGFyYW0sIG9wdHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHVibGljIG51bWJlclBhcmFtKHVybFBhcmFtOiBzdHJpbmcsIG9wdHM6IE11bHRpUXVlcnlQYXJhbU9wdHM8bnVtYmVyPik6IE11bHRpUXVlcnlQYXJhbTxudW1iZXI+O1xyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBudW1iZXJQYXJhbSh1cmxQYXJhbTogc3RyaW5nLCBvcHRzPzogUXVlcnlQYXJhbU9wdHM8bnVtYmVyPik6IFF1ZXJ5UGFyYW08bnVtYmVyPjtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IHBhcmFtZXRlciBvZiB0eXBlIGBudW1iZXJgLlxyXG4gICAgICpcclxuICAgICAqIFNlZSB7QGxpbmsgUXVlcnlQYXJhbU9wdHN9LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbnVtYmVyUGFyYW0oXHJcbiAgICAgICAgdXJsUGFyYW06IHN0cmluZyxcclxuICAgICAgICBvcHRzOiBRdWVyeVBhcmFtT3B0czxudW1iZXI+IHwgTXVsdGlRdWVyeVBhcmFtT3B0czxudW1iZXI+ID0ge31cclxuICAgICk6IFF1ZXJ5UGFyYW08bnVtYmVyPiB8IE11bHRpUXVlcnlQYXJhbTxudW1iZXI+IHtcclxuICAgICAgICBvcHRzID0ge1xyXG4gICAgICAgICAgICBzZXJpYWxpemU6IERFRkFVTFRfTlVNQkVSX1NFUklBTElaRVIsXHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBERUZBVUxUX05VTUJFUl9ERVNFUklBTElaRVIsXHJcbiAgICAgICAgICAgIGNvbXBhcmVXaXRoOiBMT09TRV9JREVOVElUWV9DT01QQVJBVE9SLFxyXG4gICAgICAgICAgICAuLi5vcHRzLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChpc011bHRpT3B0cyhvcHRzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE11bHRpUXVlcnlQYXJhbTxudW1iZXI+KHVybFBhcmFtLCBvcHRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXJ5UGFyYW08bnVtYmVyPih1cmxQYXJhbSwgb3B0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgYm9vbGVhblBhcmFtKHVybFBhcmFtOiBzdHJpbmcsIG9wdHM6IE11bHRpUXVlcnlQYXJhbU9wdHM8Ym9vbGVhbj4pOiBNdWx0aVF1ZXJ5UGFyYW08Ym9vbGVhbj47XHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHVibGljIGJvb2xlYW5QYXJhbSh1cmxQYXJhbTogc3RyaW5nLCBvcHRzPzogUXVlcnlQYXJhbU9wdHM8Ym9vbGVhbj4pOiBRdWVyeVBhcmFtPGJvb2xlYW4+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBuZXcgcGFyYW1ldGVyIG9mIHR5cGUgYGJvb2xlYW5gLlxyXG4gICAgICpcclxuICAgICAqIFNlZSB7QGxpbmsgUXVlcnlQYXJhbU9wdHN9LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYm9vbGVhblBhcmFtKFxyXG4gICAgICAgIHVybFBhcmFtOiBzdHJpbmcsXHJcbiAgICAgICAgb3B0czogUXVlcnlQYXJhbU9wdHM8Ym9vbGVhbj4gfCBNdWx0aVF1ZXJ5UGFyYW1PcHRzPGJvb2xlYW4+ID0ge31cclxuICAgICk6IFF1ZXJ5UGFyYW08Ym9vbGVhbj4gfCBNdWx0aVF1ZXJ5UGFyYW08Ym9vbGVhbj4ge1xyXG4gICAgICAgIG9wdHMgPSB7XHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogREVGQVVMVF9CT09MRUFOX1NFUklBTElaRVIsXHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBERUZBVUxUX0JPT0xFQU5fREVTRVJJQUxJWkVSLFxyXG4gICAgICAgICAgICBjb21wYXJlV2l0aDogTE9PU0VfSURFTlRJVFlfQ09NUEFSQVRPUixcclxuICAgICAgICAgICAgLi4ub3B0cyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaXNNdWx0aU9wdHMob3B0cykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aVF1ZXJ5UGFyYW08Ym9vbGVhbj4odXJsUGFyYW0sIG9wdHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVlcnlQYXJhbTxib29sZWFuPih1cmxQYXJhbSwgb3B0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgcGFyYW08VD4odXJsUGFyYW06IHN0cmluZywgb3B0czogTXVsdGlRdWVyeVBhcmFtT3B0czxUPik6IE11bHRpUXVlcnlQYXJhbTxUPjtcclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgcGFyYW08VD4odXJsUGFyYW06IHN0cmluZywgb3B0cz86IFF1ZXJ5UGFyYW1PcHRzPFQ+KTogUXVlcnlQYXJhbTxUPjtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IHBhcmFtZXRlciBmb3IgYSBjb21wbGV4IHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogU2VlIHtAbGluayBRdWVyeVBhcmFtT3B0c30uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXJhbTxUPihcclxuICAgICAgICB1cmxQYXJhbTogc3RyaW5nLFxyXG4gICAgICAgIG9wdHM6IFF1ZXJ5UGFyYW1PcHRzPFQ+IHwgTXVsdGlRdWVyeVBhcmFtT3B0czxUPiA9IHt9XHJcbiAgICApOiBRdWVyeVBhcmFtPFQ+IHwgTXVsdGlRdWVyeVBhcmFtPFQ+IHtcclxuICAgICAgICBvcHRzID0ge1xyXG4gICAgICAgICAgICBjb21wYXJlV2l0aDogTE9PU0VfSURFTlRJVFlfQ09NUEFSQVRPUixcclxuICAgICAgICAgICAgLi4ub3B0cyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaXNNdWx0aU9wdHMob3B0cykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aVF1ZXJ5UGFyYW08VD4odXJsUGFyYW0sIG9wdHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVlcnlQYXJhbTxUPih1cmxQYXJhbSwgb3B0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=