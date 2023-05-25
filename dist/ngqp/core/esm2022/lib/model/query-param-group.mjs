import { Subject } from 'rxjs';
import { isMissing, undefinedToNull } from '../util';
/**
 * Groups multiple {@link QueryParam} instances to a single unit.
 *
 * This "bundles" multiple parameters together such that changes can be emitted as a
 * complete unit. Collecting parameters into a group is required for the synchronization
 * to and from the URL.
 */
export class QueryParamGroup {
    /** @internal */
    _valueChanges = new Subject();
    /**
     * Emits the values of all parameters in this group whenever at least one changes.
     *
     * This observable emits an object keyed by the {@QueryParam} names where each key
     * carries the current value of the represented parameter. It emits whenever at least
     * one parameter's value is changed.
     *
     * NOTE: This observable does not complete on its own, so ensure to unsubscribe from it.
     */
    valueChanges = this._valueChanges.asObservable();
    /** @internal */
    _queryParamAdded$ = new Subject();
    /** @internal */
    queryParamAdded$ = this._queryParamAdded$.asObservable();
    /** @internal */
    queryParams;
    /** @internal */
    routerOptions;
    /** @internal */
    options;
    changeFunctions = [];
    constructor(queryParams, extras = {}) {
        this.queryParams = queryParams;
        this.routerOptions = extras;
        this.options = extras;
        Object.values(this.queryParams).forEach(queryParam => queryParam._setParent(this));
    }
    /** @internal */
    _registerOnChange(fn) {
        this.changeFunctions.push(fn);
    }
    /** @internal */
    _clearChangeFunctions() {
        this.changeFunctions = [];
    }
    /**
     * Retrieves a specific parameter from this group by name.
     *
     * This returns an instance of either {@link QueryParam}, {@link MultiQueryParam}
     * or {@link PartitionedQueryParam} depending on the configuration, or `null`
     * if no parameter with that name is found in this group.
     *
     * @param queryParamName The name of the parameter instance to retrieve.
     */
    get(queryParamName) {
        const param = this.queryParams[queryParamName];
        if (!param) {
            return null;
        }
        return param;
    }
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
    add(queryParamName, queryParam) {
        if (this.get(queryParamName)) {
            throw new Error(`A parameter with name ${queryParamName} already exists.`);
        }
        this.queryParams[queryParamName] = queryParam;
        queryParam._setParent(this);
        this._queryParamAdded$.next(queryParamName);
    }
    /**
     * Removes a {@link QueryParam} from this group.
     *
     * This removes the parameter defined by the provided name from this group.
     * No further synchronization with this parameter will occur and it will not
     * be reported in the value of this group anymore.
     *
     * @param queryParamName The name of the parameter to remove.
     */
    remove(queryParamName) {
        const queryParam = this.get(queryParamName);
        if (!queryParam) {
            throw new Error(`No parameter with name ${queryParamName} found.`);
        }
        delete this.queryParams[queryParamName];
        queryParam._setParent(null);
        queryParam._clearChangeFunctions();
    }
    /**
     * The current value of this group.
     *
     * See {@link QueryParamGroup#valueChanges} for a description of the format of
     * the value.
     */
    get value() {
        const value = {};
        Object.keys(this.queryParams).forEach(queryParamName => value[queryParamName] = this.queryParams[queryParamName].value);
        return value;
    }
    /**
     * Updates the value of this group by merging it in.
     *
     * This sets the value of each provided parameter to the respective provided
     * value. If a parameter is not listed, its value remains unchanged.
     *
     * @param value See {@link QueryParamGroup#valueChanges} for a description of the format.
     * @param opts Additional options
     */
    patchValue(value, opts = {}) {
        Object.keys(value).forEach(queryParamName => {
            const queryParam = this.queryParams[queryParamName];
            if (isMissing(queryParam)) {
                return;
            }
            queryParam.setValue(value[queryParamName], {
                emitEvent: opts.emitEvent,
                onlySelf: true,
                emitModelToViewChange: false,
            });
        });
        this._updateValue(opts);
    }
    /**
     * Updates the value of this group by overwriting it.
     *
     * This sets the value of each provided parameter to the respective provided
     * value. If a parameter is not listed, its value is set to `undefined`.
     *
     * @param value See {@link QueryParamGroup#valueChanges} for a description of the format.
     * @param opts Additional options
     */
    setValue(value, opts = {}) {
        Object.keys(this.queryParams).forEach(queryParamName => {
            this.queryParams[queryParamName].setValue(undefinedToNull(value?.[queryParamName]), {
                emitEvent: opts.emitEvent,
                onlySelf: true,
                emitModelToViewChange: false,
            });
        });
        this._updateValue(opts);
    }
    /** @internal */
    _updateValue(opts = {}) {
        if (opts.emitModelToViewChange !== false) {
            this.changeFunctions.forEach(changeFn => changeFn(this.value));
        }
        if (opts.emitEvent !== false) {
            this._valueChanges.next(this.value);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9tb2RlbC9xdWVyeS1wYXJhbS1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBTXJEOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBRXhCLGdCQUFnQjtJQUNDLGFBQWEsR0FBRyxJQUFJLE9BQU8sRUFBdUIsQ0FBQztJQUVwRTs7Ozs7Ozs7T0FRRztJQUNhLFlBQVksR0FBb0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVsRyxnQkFBZ0I7SUFDQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO0lBRTNELGdCQUFnQjtJQUNBLGdCQUFnQixHQUF1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFN0YsZ0JBQWdCO0lBQ0EsV0FBVyxDQUFrSDtJQUU3SSxnQkFBZ0I7SUFDQSxhQUFhLENBQWdCO0lBRTdDLGdCQUFnQjtJQUNBLE9BQU8sQ0FBc0I7SUFFckMsZUFBZSxHQUE0QyxFQUFFLENBQUM7SUFFdEUsWUFDSSxXQUE0SCxFQUM1SCxTQUE4QyxFQUFFO1FBRWhELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENB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RTtZQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFFLGNBQWMsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUUsY0FBYyxDQUFFLENBQUMsRUFBRTtnQkFDcEYsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixRQUFRLEVBQUUsSUFBSTtnQkFDZCxxQkFBcUIsRUFBRSxLQUFLO2FBQy9CLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsZ0JBQWdCO0lBQ1QsWUFBWSxDQUFDLE9BR2hCLEVBQUU7UUFDRixJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxLQUFLLEVBQUU7WUFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDbEU7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2QztJQUNMLENBQUM7Q0FFSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgaXNNaXNzaW5nLCB1bmRlZmluZWRUb051bGwgfSBmcm9tICcuLi91dGlsJztcclxuaW1wb3J0IHsgT25DaGFuZ2VGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgTXVsdGlRdWVyeVBhcmFtLCBRdWVyeVBhcmFtLCBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW0gfSBmcm9tICcuL3F1ZXJ5LXBhcmFtJztcclxuaW1wb3J0IHsgUm91dGVyT3B0aW9ucyB9IGZyb20gJy4uL3JvdXRlci1hZGFwdGVyL3JvdXRlci1hZGFwdGVyLmludGVyZmFjZSc7XHJcbmltcG9ydCB7UXVlcnlQYXJhbUdyb3VwT3B0c30gZnJvbSAnLi9xdWVyeS1wYXJhbS1vcHRzJztcclxuXHJcbi8qKlxyXG4gKiBHcm91cHMgbXVsdGlwbGUge0BsaW5rIFF1ZXJ5UGFyYW19IGluc3RhbmNlcyB0byBhIHNpbmdsZSB1bml0LlxyXG4gKlxyXG4gKiBUaGlzIFwiYnVuZGxlc1wiIG11bHRpcGxlIHBhcmFtZXRlcnMgdG9nZXRoZXIgc3VjaCB0aGF0IGNoYW5nZXMgY2FuIGJlIGVtaXR0ZWQgYXMgYVxyXG4gKiBjb21wbGV0ZSB1bml0LiBDb2xsZWN0aW5nIHBhcmFtZXRlcnMgaW50byBhIGdyb3VwIGlzIHJlcXVpcmVkIGZvciB0aGUgc3luY2hyb25pemF0aW9uXHJcbiAqIHRvIGFuZCBmcm9tIHRoZSBVUkwuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUXVlcnlQYXJhbUdyb3VwIHtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF92YWx1ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDxSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW1pdHMgdGhlIHZhbHVlcyBvZiBhbGwgcGFyYW1ldGVycyBpbiB0aGlzIGdyb3VwIHdoZW5ldmVyIGF0IGxlYXN0IG9uZSBjaGFuZ2VzLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgb2JzZXJ2YWJsZSBlbWl0cyBhbiBvYmplY3Qga2V5ZWQgYnkgdGhlIHtAUXVlcnlQYXJhbX0gbmFtZXMgd2hlcmUgZWFjaCBrZXlcclxuICAgICAqIGNhcnJpZXMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHJlcHJlc2VudGVkIHBhcmFtZXRlci4gSXQgZW1pdHMgd2hlbmV2ZXIgYXQgbGVhc3RcclxuICAgICAqIG9uZSBwYXJhbWV0ZXIncyB2YWx1ZSBpcyBjaGFuZ2VkLlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IFRoaXMgb2JzZXJ2YWJsZSBkb2VzIG5vdCBjb21wbGV0ZSBvbiBpdHMgb3duLCBzbyBlbnN1cmUgdG8gdW5zdWJzY3JpYmUgZnJvbSBpdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+PiA9IHRoaXMuX3ZhbHVlQ2hhbmdlcy5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9xdWVyeVBhcmFtQWRkZWQkID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBxdWVyeVBhcmFtQWRkZWQkOiBPYnNlcnZhYmxlPHN0cmluZz4gPSB0aGlzLl9xdWVyeVBhcmFtQWRkZWQkLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBxdWVyeVBhcmFtczogeyBbIHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcgXTogUXVlcnlQYXJhbTx1bmtub3duPiB8IE11bHRpUXVlcnlQYXJhbTx1bmtub3duPiB8IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTx1bmtub3duPiB9O1xyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSByb3V0ZXJPcHRpb25zOiBSb3V0ZXJPcHRpb25zO1xyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBvcHRpb25zOiBRdWVyeVBhcmFtR3JvdXBPcHRzO1xyXG5cclxuICAgIHByaXZhdGUgY2hhbmdlRnVuY3Rpb25zOiBPbkNoYW5nZUZ1bmN0aW9uPFJlY29yZDxzdHJpbmcsIGFueT4+W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBxdWVyeVBhcmFtczogeyBbIHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcgXTogUXVlcnlQYXJhbTx1bmtub3duPiB8IE11bHRpUXVlcnlQYXJhbTx1bmtub3duPiB8IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTx1bmtub3duPiB9LFxyXG4gICAgICAgIGV4dHJhczogUm91dGVyT3B0aW9ucyAmIFF1ZXJ5UGFyYW1Hcm91cE9wdHMgPSB7fVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5xdWVyeVBhcmFtcyA9IHF1ZXJ5UGFyYW1zO1xyXG4gICAgICAgIHRoaXMucm91dGVyT3B0aW9ucyA9IGV4dHJhcztcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBleHRyYXM7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5xdWVyeVBhcmFtcykuZm9yRWFjaChxdWVyeVBhcmFtID0+IHF1ZXJ5UGFyYW0uX3NldFBhcmVudCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIF9yZWdpc3Rlck9uQ2hhbmdlKGZuOiBPbkNoYW5nZUZ1bmN0aW9uPFJlY29yZDxzdHJpbmcsIGFueT4+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VGdW5jdGlvbnMucHVzaChmbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIF9jbGVhckNoYW5nZUZ1bmN0aW9ucygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoYW5nZUZ1bmN0aW9ucyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGZyb20gdGhpcyBncm91cCBieSBuYW1lLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgcmV0dXJucyBhbiBpbnN0YW5jZSBvZiBlaXRoZXIge0BsaW5rIFF1ZXJ5UGFyYW19LCB7QGxpbmsgTXVsdGlRdWVyeVBhcmFtfVxyXG4gICAgICogb3Ige0BsaW5rIFBhcnRpdGlvbmVkUXVlcnlQYXJhbX0gZGVwZW5kaW5nIG9uIHRoZSBjb25maWd1cmF0aW9uLCBvciBgbnVsbGBcclxuICAgICAqIGlmIG5vIHBhcmFtZXRlciB3aXRoIHRoYXQgbmFtZSBpcyBmb3VuZCBpbiB0aGlzIGdyb3VwLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBxdWVyeVBhcmFtTmFtZSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIGluc3RhbmNlIHRvIHJldHJpZXZlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0KHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcpOiBRdWVyeVBhcmFtPHVua25vd24+IHwgTXVsdGlRdWVyeVBhcmFtPHVua25vd24+IHwgUGFydGl0aW9uZWRRdWVyeVBhcmFtPHVua25vd24+IHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFyYW1zWyBxdWVyeVBhcmFtTmFtZSBdO1xyXG4gICAgICAgIGlmICghcGFyYW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyYW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgbmV3IHtAbGluayBRdWVyeVBhcmFtfSB0byB0aGlzIGdyb3VwLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgYWRkcyB0aGUgcGFyYW1ldGVyIHVuZGVyIHRoZSBnaXZlbiBuYW1lIHRvIHRoaXMgZ3JvdXAuIFRoZSBjdXJyZW50XHJcbiAgICAgKiBVUkwgd2lsbCBiZSBldmFsdWF0ZWQgdG8gc3luY2hyb25pemUgaXRzIHZhbHVlIGluaXRpYWxseS4gQWZ0ZXJ3YXJkc1xyXG4gICAgICogaXQgaXMgdHJlYXRlZCBqdXN0IGxpa2UgYW55IG90aGVyIHBhcmFtZXRlciBpbiB0aGlzIGdyb3VwLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBxdWVyeVBhcmFtTmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gcmVmZXJlbmNlIGl0IHdpdGguXHJcbiAgICAgKiBAcGFyYW0gcXVlcnlQYXJhbSBUaGUgbmV3IHBhcmFtZXRlciB0byBhZGQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGQocXVlcnlQYXJhbU5hbWU6IHN0cmluZywgcXVlcnlQYXJhbTogUXVlcnlQYXJhbTx1bmtub3duPiB8IE11bHRpUXVlcnlQYXJhbTx1bmtub3duPiB8IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTx1bmtub3duPik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmdldChxdWVyeVBhcmFtTmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIHBhcmFtZXRlciB3aXRoIG5hbWUgJHtxdWVyeVBhcmFtTmFtZX0gYWxyZWFkeSBleGlzdHMuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5UGFyYW1zWyBxdWVyeVBhcmFtTmFtZSBdID0gcXVlcnlQYXJhbTtcclxuICAgICAgICBxdWVyeVBhcmFtLl9zZXRQYXJlbnQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fcXVlcnlQYXJhbUFkZGVkJC5uZXh0KHF1ZXJ5UGFyYW1OYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYSB7QGxpbmsgUXVlcnlQYXJhbX0gZnJvbSB0aGlzIGdyb3VwLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgcmVtb3ZlcyB0aGUgcGFyYW1ldGVyIGRlZmluZWQgYnkgdGhlIHByb3ZpZGVkIG5hbWUgZnJvbSB0aGlzIGdyb3VwLlxyXG4gICAgICogTm8gZnVydGhlciBzeW5jaHJvbml6YXRpb24gd2l0aCB0aGlzIHBhcmFtZXRlciB3aWxsIG9jY3VyIGFuZCBpdCB3aWxsIG5vdFxyXG4gICAgICogYmUgcmVwb3J0ZWQgaW4gdGhlIHZhbHVlIG9mIHRoaXMgZ3JvdXAgYW55bW9yZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcXVlcnlQYXJhbU5hbWUgVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmUocXVlcnlQYXJhbU5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW0gPSB0aGlzLmdldChxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICAgICAgaWYgKCFxdWVyeVBhcmFtKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcGFyYW1ldGVyIHdpdGggbmFtZSAke3F1ZXJ5UGFyYW1OYW1lfSBmb3VuZC5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnF1ZXJ5UGFyYW1zWyBxdWVyeVBhcmFtTmFtZSBdO1xyXG4gICAgICAgIHF1ZXJ5UGFyYW0uX3NldFBhcmVudChudWxsKTtcclxuICAgICAgICBxdWVyeVBhcmFtLl9jbGVhckNoYW5nZUZ1bmN0aW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhpcyBncm91cC5cclxuICAgICAqXHJcbiAgICAgKiBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cCN2YWx1ZUNoYW5nZXN9IGZvciBhIGRlc2NyaXB0aW9uIG9mIHRoZSBmb3JtYXQgb2ZcclxuICAgICAqIHRoZSB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICBjb25zdCB2YWx1ZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnlQYXJhbXMpLmZvckVhY2gocXVlcnlQYXJhbU5hbWUgPT4gdmFsdWVbIHF1ZXJ5UGFyYW1OYW1lIF0gPSB0aGlzLnF1ZXJ5UGFyYW1zWyBxdWVyeVBhcmFtTmFtZSBdLnZhbHVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgdGhpcyBncm91cCBieSBtZXJnaW5nIGl0IGluLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgc2V0cyB0aGUgdmFsdWUgb2YgZWFjaCBwcm92aWRlZCBwYXJhbWV0ZXIgdG8gdGhlIHJlc3BlY3RpdmUgcHJvdmlkZWRcclxuICAgICAqIHZhbHVlLiBJZiBhIHBhcmFtZXRlciBpcyBub3QgbGlzdGVkLCBpdHMgdmFsdWUgcmVtYWlucyB1bmNoYW5nZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIFNlZSB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwI3ZhbHVlQ2hhbmdlc30gZm9yIGEgZGVzY3JpcHRpb24gb2YgdGhlIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSBvcHRzIEFkZGl0aW9uYWwgb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGF0Y2hWYWx1ZSh2YWx1ZTogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0czoge1xyXG4gICAgICAgIGVtaXRFdmVudD86IGJvb2xlYW4sXHJcbiAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbixcclxuICAgIH0gPSB7fSk6IHZvaWQge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKHF1ZXJ5UGFyYW1OYW1lID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcXVlcnlQYXJhbSA9IHRoaXMucXVlcnlQYXJhbXNbIHF1ZXJ5UGFyYW1OYW1lIF07XHJcbiAgICAgICAgICAgIGlmIChpc01pc3NpbmcocXVlcnlQYXJhbSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcXVlcnlQYXJhbS5zZXRWYWx1ZSh2YWx1ZVsgcXVlcnlQYXJhbU5hbWUgXSwge1xyXG4gICAgICAgICAgICAgICAgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudCxcclxuICAgICAgICAgICAgICAgIG9ubHlTZWxmOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlKG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgdGhpcyBncm91cCBieSBvdmVyd3JpdGluZyBpdC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHNldHMgdGhlIHZhbHVlIG9mIGVhY2ggcHJvdmlkZWQgcGFyYW1ldGVyIHRvIHRoZSByZXNwZWN0aXZlIHByb3ZpZGVkXHJcbiAgICAgKiB2YWx1ZS4gSWYgYSBwYXJhbWV0ZXIgaXMgbm90IGxpc3RlZCwgaXRzIHZhbHVlIGlzIHNldCB0byBgdW5kZWZpbmVkYC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgU2VlIHtAbGluayBRdWVyeVBhcmFtR3JvdXAjdmFsdWVDaGFuZ2VzfSBmb3IgYSBkZXNjcmlwdGlvbiBvZiB0aGUgZm9ybWF0LlxyXG4gICAgICogQHBhcmFtIG9wdHMgQWRkaXRpb25hbCBvcHRpb25zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRWYWx1ZSh2YWx1ZTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwsIG9wdHM6IHtcclxuICAgICAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxyXG4gICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXHJcbiAgICB9ID0ge30pOiB2b2lkIHtcclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5UGFyYW1zKS5mb3JFYWNoKHF1ZXJ5UGFyYW1OYW1lID0+IHtcclxuICAgICAgICAgICAgdGhpcy5xdWVyeVBhcmFtc1sgcXVlcnlQYXJhbU5hbWUgXS5zZXRWYWx1ZSh1bmRlZmluZWRUb051bGwodmFsdWU/LlsgcXVlcnlQYXJhbU5hbWUgXSksIHtcclxuICAgICAgICAgICAgICAgIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQsXHJcbiAgICAgICAgICAgICAgICBvbmx5U2VsZjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZShvcHRzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgX3VwZGF0ZVZhbHVlKG9wdHM6IHtcclxuICAgICAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxyXG4gICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXHJcbiAgICB9ID0ge30pOiB2b2lkIHtcclxuICAgICAgICBpZiAob3B0cy5lbWl0TW9kZWxUb1ZpZXdDaGFuZ2UgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRnVuY3Rpb25zLmZvckVhY2goY2hhbmdlRm4gPT4gY2hhbmdlRm4odGhpcy52YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZUNoYW5nZXMubmV4dCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59Il19