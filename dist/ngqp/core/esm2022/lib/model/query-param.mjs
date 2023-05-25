import { forkJoin, of, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { areEqualUsing, isFunction, isMissing, isPresent, undefinedToNull, wrapIntoObservable, wrapTryCatch } from '../util';
/** @internal */
class AbstractQueryParamBase {
    parent = null;
    _valueChanges = new Subject();
    changeFunctions = [];
    /**
     * Emits the current value of this parameter whenever it changes.
     *
     * NOTE: This observable does not complete on its own, so ensure to unsubscribe from it.
     */
    valueChanges = this._valueChanges.asObservable();
    _registerOnChange(fn) {
        this.changeFunctions.push(fn);
    }
    _clearChangeFunctions() {
        this.changeFunctions = [];
    }
    _setParent(parent) {
        if (this.parent && parent) {
            throw new Error(`Parameter already belongs to a QueryParamGroup.`);
        }
        this.parent = parent;
    }
}
/**
 * Abstract base for {@link QueryParam} and {@link MultiQueryParam}.
 *
 * This base class holds most of the parameter's options, but is unaware of
 * how to actually (de-)serialize any values.
 */
export class AbstractQueryParam extends AbstractQueryParamBase {
    /**
     * The current value of this parameter.
     */
    value = null;
    /**
     * The name of the parameter to be used in the URL.
     *
     * This represents the name of the query parameter which will be
     * used in the URL (e.g., `?q=`), which differs from the name of
     * the {@link QueryParam} model used inside {@link QueryParamGroup}.
     */
    urlParam;
    /** See {@link QueryParamOpts}. */
    serialize;
    /** See {@link QueryParamOpts}. */
    deserialize;
    /** See {@link QueryParamOpts}. */
    debounceTime;
    /** See {@link QueryParamOpts}. */
    emptyOn;
    /** See {@link QueryParamOpts}. */
    compareWith;
    /** See {@link QueryParamOpts}. */
    combineWith;
    constructor(urlParam, opts = {}) {
        super();
        const { serialize, deserialize, debounceTime, compareWith, emptyOn, combineWith } = opts;
        if (isMissing(urlParam)) {
            throw new Error(`Please provide a URL parameter name for each query parameter.`);
        }
        if (!isFunction(serialize)) {
            throw new Error(`serialize must be a function, but received ${serialize}`);
        }
        if (!isFunction(deserialize)) {
            throw new Error(`deserialize must be a function, but received ${deserialize}`);
        }
        if (emptyOn !== undefined && !isFunction(compareWith)) {
            throw new Error(`compareWith must be a function, but received ${compareWith}`);
        }
        if (isPresent(combineWith) && !isFunction(combineWith)) {
            throw new Error(`combineWith must be a function, but received ${combineWith}`);
        }
        this.urlParam = urlParam;
        this.serialize = wrapTryCatch(serialize, `Error while serializing value for ${this.urlParam}`);
        this.deserialize = wrapTryCatch(deserialize, `Error while deserializing value for ${this.urlParam}`);
        this.debounceTime = undefinedToNull(debounceTime);
        this.emptyOn = emptyOn;
        this.compareWith = compareWith;
        this.combineWith = combineWith;
    }
    /**
     * Updates the value of this parameter.
     *
     * If wired up with a {@link QueryParamGroup}, this will also synchronize
     * the value to the URL.
     */
    setValue(value, opts = {}) {
        this.value = value;
        if (opts.emitModelToViewChange !== false) {
            this.changeFunctions.forEach(changeFn => changeFn(value));
        }
        if (opts.emitEvent !== false) {
            this._valueChanges.next(this.value);
        }
        if (isPresent(this.parent) && !opts.onlySelf) {
            this.parent._updateValue({
                emitEvent: opts.emitEvent,
                emitModelToViewChange: false,
            });
        }
    }
}
/**
 * Describes a single parameter.
 *
 * This is the description of a single parameter and essentially serves
 * as the glue between its representation in the URL and its connection
 * to a form control.
 */
export class QueryParam extends AbstractQueryParam {
    /** See {@link QueryParamOpts}. */
    multi = false;
    constructor(urlParam, opts) {
        super(urlParam, opts);
    }
    /** @internal */
    serializeValue(value) {
        if (this.emptyOn !== undefined && areEqualUsing(value, this.emptyOn, this.compareWith)) {
            return null;
        }
        return this.serialize(value);
    }
    /** @internal */
    deserializeValue(value) {
        if (this.emptyOn !== undefined && value === null) {
            return of(this.emptyOn);
        }
        return wrapIntoObservable(this.deserialize(value)).pipe(first());
    }
}
/**
 * Like {@link QueryParam}, but for array-typed parameters
 */
export class MultiQueryParam extends AbstractQueryParam {
    /** See {@link QueryParamOpts}. */
    multi = true;
    /** See {@link MultiQueryParamOpts}. */
    serializeAll;
    /** See {@link MultiQueryParamOpts}. */
    deserializeAll;
    constructor(urlParam, opts) {
        super(urlParam, opts);
        const { serializeAll, deserializeAll } = opts;
        if (serializeAll !== undefined) {
            if (!isFunction(serializeAll)) {
                throw new Error(`serializeAll must be a function, but received ${serializeAll}`);
            }
            this.serializeAll = wrapTryCatch(serializeAll, `Error while serializing value for ${this.urlParam}`);
        }
        if (deserializeAll !== undefined) {
            if (!isFunction(deserializeAll)) {
                throw new Error(`deserializeAll must be a function, but received ${deserializeAll}`);
            }
            this.deserializeAll = wrapTryCatch(deserializeAll, `Error while deserializing value for ${this.urlParam}`);
        }
    }
    /** @internal */
    serializeValue(value) {
        if (this.emptyOn !== undefined && areEqualUsing(value, this.emptyOn, this.compareWith)) {
            return null;
        }
        if (this.serializeAll !== undefined) {
            return this.serializeAll(value);
        }
        return (value || []).map(this.serialize.bind(this));
    }
    /** @internal */
    deserializeValue(values) {
        if (this.emptyOn !== undefined && (values || []).length === 0) {
            return of(this.emptyOn);
        }
        if (this.deserializeAll !== undefined) {
            return wrapIntoObservable(this.deserializeAll(values));
        }
        if (!values || values.length === 0) {
            return of([]);
        }
        return forkJoin([...values.map(value => wrapIntoObservable(this.deserialize(value)).pipe(first()))]);
    }
}
/**
 * Describes a partitioned query parameter.
 *
 * This encapsulates a list of query parameters such that a single form control
 * can be bound against multiple URL parameters. To achieve this, functions must
 * be defined which can convert the models between the parameters.
 */
export class PartitionedQueryParam extends AbstractQueryParamBase {
    /** @internal */
    queryParams;
    /** @internal */
    partition;
    /** @internal */
    reduce;
    constructor(queryParams, opts) {
        super();
        if (queryParams.length === 0) {
            throw new Error(`Partitioned parameters must contain at least one parameter.`);
        }
        if (!isFunction(opts.partition)) {
            throw new Error(`partition must be a function, but received ${opts.partition}`);
        }
        if (!isFunction(opts.reduce)) {
            throw new Error(`reduce must be a function, but received ${opts.reduce}`);
        }
        this.queryParams = queryParams;
        this.partition = opts.partition;
        this.reduce = opts.reduce;
    }
    get value() {
        return this.reduce(this.queryParams.map(queryParam => queryParam.value));
    }
    setValue(value, opts = {}) {
        const partitioned = this.partition(value);
        this.queryParams.forEach((queryParam, index) => queryParam.setValue(partitioned[index], {
            emitEvent: opts.emitEvent,
            onlySelf: true,
            emitModelToViewChange: false,
        }));
        if (opts.emitModelToViewChange !== false) {
            this.changeFunctions.forEach(changeFn => changeFn(this.value));
        }
        if (opts.emitEvent !== false) {
            this._valueChanges.next(this.value);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9tb2RlbC9xdWVyeS1wYXJhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUE0QixFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFjN0gsZ0JBQWdCO0FBQ2hCLE1BQWUsc0JBQXNCO0lBSXZCLE1BQU0sR0FBMkIsSUFBSSxDQUFDO0lBQzdCLGFBQWEsR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO0lBQ2pELGVBQWUsR0FBMEIsRUFBRSxDQUFDO0lBRXREOzs7O09BSUc7SUFDYSxZQUFZLEdBQXlCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFaEYsaUJBQWlCLENBQUMsRUFBdUI7UUFDNUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLHFCQUFxQjtRQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBUU0sVUFBVSxDQUFDLE1BQThCO1FBQzVDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztDQUVKO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQWdCLGtCQUF5QixTQUFRLHNC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YSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkM7SUFDTCxDQUFDO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JrSm9pbiwgaXNPYnNlcnZhYmxlLCBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgYXJlRXF1YWxVc2luZywgaXNGdW5jdGlvbiwgaXNNaXNzaW5nLCBpc1ByZXNlbnQsIHVuZGVmaW5lZFRvTnVsbCwgd3JhcEludG9PYnNlcnZhYmxlLCB3cmFwVHJ5Q2F0Y2ggfSBmcm9tICcuLi91dGlsJztcclxuaW1wb3J0IHtcclxuICAgIENvbXBhcmF0b3IsIE11bHRpUGFyYW1EZXNlcmlhbGl6ZXIsXHJcbiAgICBNdWx0aVBhcmFtU2VyaWFsaXplcixcclxuICAgIE9uQ2hhbmdlRnVuY3Rpb24sXHJcbiAgICBQYXJhbUNvbWJpbmF0b3IsXHJcbiAgICBQYXJhbURlc2VyaWFsaXplcixcclxuICAgIFBhcmFtU2VyaWFsaXplcixcclxuICAgIFBhcnRpdGlvbmVyLFxyXG4gICAgUmVkdWNlclxyXG59IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwIH0gZnJvbSAnLi9xdWVyeS1wYXJhbS1ncm91cCc7XHJcbmltcG9ydCB7IE11bHRpUXVlcnlQYXJhbU9wdHMsIFBhcnRpdGlvbmVkUXVlcnlQYXJhbU9wdHMsIFF1ZXJ5UGFyYW1PcHRzLCBRdWVyeVBhcmFtT3B0c0Jhc2UgfSBmcm9tICcuL3F1ZXJ5LXBhcmFtLW9wdHMnO1xyXG5cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5hYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFF1ZXJ5UGFyYW1CYXNlPFQ+IHtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgdmFsdWU6IFQgfCBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBwYXJlbnQ6IFF1ZXJ5UGFyYW1Hcm91cCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IF92YWx1ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDxUIHwgbnVsbD4oKTtcclxuICAgIHByb3RlY3RlZCBjaGFuZ2VGdW5jdGlvbnM6IE9uQ2hhbmdlRnVuY3Rpb248VD5bXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW1pdHMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhpcyBwYXJhbWV0ZXIgd2hlbmV2ZXIgaXQgY2hhbmdlcy5cclxuICAgICAqXHJcbiAgICAgKiBOT1RFOiBUaGlzIG9ic2VydmFibGUgZG9lcyBub3QgY29tcGxldGUgb24gaXRzIG93biwgc28gZW5zdXJlIHRvIHVuc3Vic2NyaWJlIGZyb20gaXQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXM6IE9ic2VydmFibGU8VCB8IG51bGw+ID0gdGhpcy5fdmFsdWVDaGFuZ2VzLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgIHB1YmxpYyBfcmVnaXN0ZXJPbkNoYW5nZShmbjogT25DaGFuZ2VGdW5jdGlvbjxUPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlRnVuY3Rpb25zLnB1c2goZm4pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfY2xlYXJDaGFuZ2VGdW5jdGlvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VGdW5jdGlvbnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IFQgfCBudWxsLCBvcHRzOiB7XHJcbiAgICAgICAgZW1pdEV2ZW50PzogYm9vbGVhbixcclxuICAgICAgICBvbmx5U2VsZj86IGJvb2xlYW4sXHJcbiAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbixcclxuICAgIH0pOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBfc2V0UGFyZW50KHBhcmVudDogUXVlcnlQYXJhbUdyb3VwIHwgbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiBwYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgYWxyZWFkeSBiZWxvbmdzIHRvIGEgUXVlcnlQYXJhbUdyb3VwLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQWJzdHJhY3QgYmFzZSBmb3Ige0BsaW5rIFF1ZXJ5UGFyYW19IGFuZCB7QGxpbmsgTXVsdGlRdWVyeVBhcmFtfS5cclxuICpcclxuICogVGhpcyBiYXNlIGNsYXNzIGhvbGRzIG1vc3Qgb2YgdGhlIHBhcmFtZXRlcidzIG9wdGlvbnMsIGJ1dCBpcyB1bmF3YXJlIG9mXHJcbiAqIGhvdyB0byBhY3R1YWxseSAoZGUtKXNlcmlhbGl6ZSBhbnkgdmFsdWVzLlxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0UXVlcnlQYXJhbTxVLCBUPiBleHRlbmRzIEFic3RyYWN0UXVlcnlQYXJhbUJhc2U8VD4ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhpcyBwYXJhbWV0ZXIuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB2YWx1ZTogVCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byBiZSB1c2VkIGluIHRoZSBVUkwuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyByZXByZXNlbnRzIHRoZSBuYW1lIG9mIHRoZSBxdWVyeSBwYXJhbWV0ZXIgd2hpY2ggd2lsbCBiZVxyXG4gICAgICogdXNlZCBpbiB0aGUgVVJMIChlLmcuLCBgP3E9YCksIHdoaWNoIGRpZmZlcnMgZnJvbSB0aGUgbmFtZSBvZlxyXG4gICAgICogdGhlIHtAbGluayBRdWVyeVBhcmFtfSBtb2RlbCB1c2VkIGluc2lkZSB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHVybFBhcmFtOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFNlZSB7QGxpbmsgUXVlcnlQYXJhbU9wdHN9LiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNlcmlhbGl6ZTogUGFyYW1TZXJpYWxpemVyPFU+O1xyXG5cclxuICAgIC8qKiBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1PcHRzfS4gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBkZXNlcmlhbGl6ZTogUGFyYW1EZXNlcmlhbGl6ZXI8VT47XHJcblxyXG4gICAgLyoqIFNlZSB7QGxpbmsgUXVlcnlQYXJhbU9wdHN9LiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlYm91bmNlVGltZTogbnVtYmVyIHwgbnVsbDtcclxuXHJcbiAgICAvKiogU2VlIHtAbGluayBRdWVyeVBhcmFtT3B0c30uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZW1wdHlPbj86IFQgfCBudWxsO1xyXG5cclxuICAgIC8qKiBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1PcHRzfS4gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBjb21wYXJlV2l0aD86IENvbXBhcmF0b3I8VCB8IG51bGw+O1xyXG5cclxuICAgIC8qKiBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1PcHRzfS4gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBjb21iaW5lV2l0aD86IFBhcmFtQ29tYmluYXRvcjxUPjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IodXJsUGFyYW06IHN0cmluZywgb3B0czogUXVlcnlQYXJhbU9wdHNCYXNlPFUsIFQ+ID0ge30pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplLCBkZXNlcmlhbGl6ZSwgZGVib3VuY2VUaW1lLCBjb21wYXJlV2l0aCwgZW1wdHlPbiwgY29tYmluZVdpdGggfSA9IG9wdHM7XHJcblxyXG4gICAgICAgIGlmIChpc01pc3NpbmcodXJsUGFyYW0pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUGxlYXNlIHByb3ZpZGUgYSBVUkwgcGFyYW1ldGVyIG5hbWUgZm9yIGVhY2ggcXVlcnkgcGFyYW1ldGVyLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHNlcmlhbGl6ZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZXJpYWxpemUgbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtzZXJpYWxpemV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWlzRnVuY3Rpb24oZGVzZXJpYWxpemUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZGVzZXJpYWxpemUgbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtkZXNlcmlhbGl6ZX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbXB0eU9uICE9PSB1bmRlZmluZWQgJiYgIWlzRnVuY3Rpb24oY29tcGFyZVdpdGgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgY29tcGFyZVdpdGggbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtjb21wYXJlV2l0aH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc1ByZXNlbnQoY29tYmluZVdpdGgpICYmICFpc0Z1bmN0aW9uKGNvbWJpbmVXaXRoKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGNvbWJpbmVXaXRoIG11c3QgYmUgYSBmdW5jdGlvbiwgYnV0IHJlY2VpdmVkICR7Y29tYmluZVdpdGh9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVybFBhcmFtID0gdXJsUGFyYW07XHJcbiAgICAgICAgdGhpcy5zZXJpYWxpemUgPSB3cmFwVHJ5Q2F0Y2goc2VyaWFsaXplLCBgRXJyb3Igd2hpbGUgc2VyaWFsaXppbmcgdmFsdWUgZm9yICR7dGhpcy51cmxQYXJhbX1gKTtcclxuICAgICAgICB0aGlzLmRlc2VyaWFsaXplID0gd3JhcFRyeUNhdGNoKGRlc2VyaWFsaXplLCBgRXJyb3Igd2hpbGUgZGVzZXJpYWxpemluZyB2YWx1ZSBmb3IgJHt0aGlzLnVybFBhcmFtfWApO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2VUaW1lID0gdW5kZWZpbmVkVG9OdWxsKGRlYm91bmNlVGltZSk7XHJcbiAgICAgICAgdGhpcy5lbXB0eU9uID0gZW1wdHlPbjtcclxuICAgICAgICB0aGlzLmNvbXBhcmVXaXRoID0gY29tcGFyZVdpdGg7XHJcbiAgICAgICAgdGhpcy5jb21iaW5lV2l0aCA9IGNvbWJpbmVXaXRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgdGhpcyBwYXJhbWV0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogSWYgd2lyZWQgdXAgd2l0aCBhIHtAbGluayBRdWVyeVBhcmFtR3JvdXB9LCB0aGlzIHdpbGwgYWxzbyBzeW5jaHJvbml6ZVxyXG4gICAgICogdGhlIHZhbHVlIHRvIHRoZSBVUkwuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRWYWx1ZSh2YWx1ZTogVCB8IG51bGwsIG9wdHM6IHtcclxuICAgICAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxyXG4gICAgICAgIG9ubHlTZWxmPzogYm9vbGVhbixcclxuICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxyXG4gICAgfSA9IHt9KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5lbWl0TW9kZWxUb1ZpZXdDaGFuZ2UgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRnVuY3Rpb25zLmZvckVhY2goY2hhbmdlRm4gPT4gY2hhbmdlRm4odmFsdWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWVDaGFuZ2VzLm5leHQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNQcmVzZW50KHRoaXMucGFyZW50KSAmJiAhb3B0cy5vbmx5U2VsZikge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fdXBkYXRlVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudCxcclxuICAgICAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZXMgYSBzaW5nbGUgcGFyYW1ldGVyLlxyXG4gKlxyXG4gKiBUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvZiBhIHNpbmdsZSBwYXJhbWV0ZXIgYW5kIGVzc2VudGlhbGx5IHNlcnZlc1xyXG4gKiBhcyB0aGUgZ2x1ZSBiZXR3ZWVuIGl0cyByZXByZXNlbnRhdGlvbiBpbiB0aGUgVVJMIGFuZCBpdHMgY29ubmVjdGlvblxyXG4gKiB0byBhIGZvcm0gY29udHJvbC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBRdWVyeVBhcmFtPFQ+IGV4dGVuZHMgQWJzdHJhY3RRdWVyeVBhcmFtPFQgfCBudWxsLCBUIHwgbnVsbD4gaW1wbGVtZW50cyBSZWFkb25seTxRdWVyeVBhcmFtT3B0czxUPj4ge1xyXG5cclxuICAgIC8qKiBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1PcHRzfS4gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBtdWx0aSA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybFBhcmFtOiBzdHJpbmcsIG9wdHM6IFF1ZXJ5UGFyYW1PcHRzPFQ+KSB7XHJcbiAgICAgICAgc3VwZXIodXJsUGFyYW0sIG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBzZXJpYWxpemVWYWx1ZSh2YWx1ZTogVCB8IG51bGwpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5lbXB0eU9uICE9PSB1bmRlZmluZWQgJiYgYXJlRXF1YWxVc2luZyh2YWx1ZSwgdGhpcy5lbXB0eU9uLCB0aGlzLmNvbXBhcmVXaXRoISkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxpemUodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBkZXNlcmlhbGl6ZVZhbHVlKHZhbHVlOiBzdHJpbmcgfCBudWxsKTogT2JzZXJ2YWJsZTxUIHwgbnVsbD4ge1xyXG4gICAgICAgIGlmICh0aGlzLmVtcHR5T24gIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2YodGhpcy5lbXB0eU9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB3cmFwSW50b09ic2VydmFibGUodGhpcy5kZXNlcmlhbGl6ZSh2YWx1ZSkpLnBpcGUoZmlyc3QoKSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogTGlrZSB7QGxpbmsgUXVlcnlQYXJhbX0sIGJ1dCBmb3IgYXJyYXktdHlwZWQgcGFyYW1ldGVyc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE11bHRpUXVlcnlQYXJhbTxUPiBleHRlbmRzIEFic3RyYWN0UXVlcnlQYXJhbTxUIHwgbnVsbCwgKFQgfCBudWxsKVtdPiBpbXBsZW1lbnRzIFJlYWRvbmx5PE11bHRpUXVlcnlQYXJhbU9wdHM8VD4+IHtcclxuXHJcbiAgICAvKiogU2VlIHtAbGluayBRdWVyeVBhcmFtT3B0c30uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbXVsdGkgPSB0cnVlO1xyXG5cclxuICAgIC8qKiBTZWUge0BsaW5rIE11bHRpUXVlcnlQYXJhbU9wdHN9LiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNlcmlhbGl6ZUFsbD86IE11bHRpUGFyYW1TZXJpYWxpemVyPFQ+O1xyXG5cclxuICAgIC8qKiBTZWUge0BsaW5rIE11bHRpUXVlcnlQYXJhbU9wdHN9LiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlc2VyaWFsaXplQWxsPzogTXVsdGlQYXJhbURlc2VyaWFsaXplcjxUPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmxQYXJhbTogc3RyaW5nLCBvcHRzOiBNdWx0aVF1ZXJ5UGFyYW1PcHRzPFQ+KSB7XHJcbiAgICAgICAgc3VwZXIodXJsUGFyYW0sIG9wdHMpO1xyXG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplQWxsLCBkZXNlcmlhbGl6ZUFsbCB9ID0gb3B0cztcclxuXHJcbiAgICAgICAgaWYgKHNlcmlhbGl6ZUFsbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNGdW5jdGlvbihzZXJpYWxpemVBbGwpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlcmlhbGl6ZUFsbCBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCByZWNlaXZlZCAke3NlcmlhbGl6ZUFsbH1gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXJpYWxpemVBbGwgPSB3cmFwVHJ5Q2F0Y2goc2VyaWFsaXplQWxsLCBgRXJyb3Igd2hpbGUgc2VyaWFsaXppbmcgdmFsdWUgZm9yICR7dGhpcy51cmxQYXJhbX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkZXNlcmlhbGl6ZUFsbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNGdW5jdGlvbihkZXNlcmlhbGl6ZUFsbCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZGVzZXJpYWxpemVBbGwgbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtkZXNlcmlhbGl6ZUFsbH1gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZUFsbCA9IHdyYXBUcnlDYXRjaChkZXNlcmlhbGl6ZUFsbCwgYEVycm9yIHdoaWxlIGRlc2VyaWFsaXppbmcgdmFsdWUgZm9yICR7dGhpcy51cmxQYXJhbX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHNlcmlhbGl6ZVZhbHVlKHZhbHVlOiAoVCB8IG51bGwpW10gfCBudWxsKTogKHN0cmluZyB8IG51bGwpW10gfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5lbXB0eU9uICE9PSB1bmRlZmluZWQgJiYgYXJlRXF1YWxVc2luZyh2YWx1ZSwgdGhpcy5lbXB0eU9uLCB0aGlzLmNvbXBhcmVXaXRoISkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zZXJpYWxpemVBbGwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxpemVBbGwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSB8fCBbXSkubWFwKHRoaXMuc2VyaWFsaXplLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBkZXNlcmlhbGl6ZVZhbHVlKHZhbHVlczogKHN0cmluZyB8IG51bGwpW10gfCBudWxsKTogT2JzZXJ2YWJsZTwoVCB8IG51bGwpW10gfCBudWxsPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHlPbiAhPT0gdW5kZWZpbmVkICYmICh2YWx1ZXMgfHwgW10pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2YodGhpcy5lbXB0eU9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRlc2VyaWFsaXplQWxsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdyYXBJbnRvT2JzZXJ2YWJsZSh0aGlzLmRlc2VyaWFsaXplQWxsKHZhbHVlcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZXMgfHwgdmFsdWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2YoW10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZvcmtKb2luKFsuLi52YWx1ZXMubWFwKHZhbHVlID0+IHdyYXBJbnRvT2JzZXJ2YWJsZSh0aGlzLmRlc2VyaWFsaXplKHZhbHVlKSkucGlwZShmaXJzdCgpKSldKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZXMgYSBwYXJ0aXRpb25lZCBxdWVyeSBwYXJhbWV0ZXIuXHJcbiAqXHJcbiAqIFRoaXMgZW5jYXBzdWxhdGVzIGEgbGlzdCBvZiBxdWVyeSBwYXJhbWV0ZXJzIHN1Y2ggdGhhdCBhIHNpbmdsZSBmb3JtIGNvbnRyb2xcclxuICogY2FuIGJlIGJvdW5kIGFnYWluc3QgbXVsdGlwbGUgVVJMIHBhcmFtZXRlcnMuIFRvIGFjaGlldmUgdGhpcywgZnVuY3Rpb25zIG11c3RcclxuICogYmUgZGVmaW5lZCB3aGljaCBjYW4gY29udmVydCB0aGUgbW9kZWxzIGJldHdlZW4gdGhlIHBhcmFtZXRlcnMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGFydGl0aW9uZWRRdWVyeVBhcmFtPFQsIEcgZXh0ZW5kcyB1bmtub3duW10gPSB1bmtub3duW10+IGV4dGVuZHMgQWJzdHJhY3RRdWVyeVBhcmFtQmFzZTxUPiB7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHF1ZXJ5UGFyYW1zOiAoUXVlcnlQYXJhbTxHW251bWJlcl0+IHwgTXVsdGlRdWVyeVBhcmFtPEdbbnVtYmVyXT4pW107XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhcnRpdGlvbjogUGFydGl0aW9uZXI8VCwgRz47XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHJlZHVjZTogUmVkdWNlcjxHLCBUPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBxdWVyeVBhcmFtczogKFF1ZXJ5UGFyYW08R1tudW1iZXJdPiB8IE11bHRpUXVlcnlQYXJhbTxHW251bWJlcl0+KVtdLFxyXG4gICAgICAgIG9wdHM6IFBhcnRpdGlvbmVkUXVlcnlQYXJhbU9wdHM8VCwgRz4sXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBpZiAocXVlcnlQYXJhbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUGFydGl0aW9uZWQgcGFyYW1ldGVycyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIHBhcmFtZXRlci5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNGdW5jdGlvbihvcHRzLnBhcnRpdGlvbikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBwYXJ0aXRpb24gbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtvcHRzLnBhcnRpdGlvbn1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNGdW5jdGlvbihvcHRzLnJlZHVjZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZWR1Y2UgbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtvcHRzLnJlZHVjZX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucXVlcnlQYXJhbXMgPSBxdWVyeVBhcmFtcztcclxuICAgICAgICB0aGlzLnBhcnRpdGlvbiA9IG9wdHMucGFydGl0aW9uO1xyXG4gICAgICAgIHRoaXMucmVkdWNlID0gb3B0cy5yZWR1Y2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBUIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UodGhpcy5xdWVyeVBhcmFtcy5tYXAocXVlcnlQYXJhbSA9PiBxdWVyeVBhcmFtLnZhbHVlKSBhcyBHKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VmFsdWUodmFsdWU6IFQsIG9wdHM6IHtcclxuICAgICAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxyXG4gICAgICAgIG9ubHlTZWxmPzogYm9vbGVhbixcclxuICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxyXG4gICAgfSA9IHt9KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcGFydGl0aW9uZWQgPSB0aGlzLnBhcnRpdGlvbih2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5xdWVyeVBhcmFtcy5mb3JFYWNoKChxdWVyeVBhcmFtLCBpbmRleCkgPT4gcXVlcnlQYXJhbS5zZXRWYWx1ZShwYXJ0aXRpb25lZFtpbmRleF0gYXMgYW55LCB7XHJcbiAgICAgICAgICAgIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQsXHJcbiAgICAgICAgICAgIG9ubHlTZWxmOiB0cnVlLFxyXG4gICAgICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMuZW1pdE1vZGVsVG9WaWV3Q2hhbmdlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUZ1bmN0aW9ucy5mb3JFYWNoKGNoYW5nZUZuID0+IGNoYW5nZUZuKHRoaXMudmFsdWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWVDaGFuZ2VzLm5leHQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==