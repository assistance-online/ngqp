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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9tb2RlbC9xdWVyeS1wYXJhbS1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBTXJEOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBRXhCLGdCQUFnQjtJQUNDLGFBQWEsR0FBRyxJQUFJLE9BQU8sRUFBdUIsQ0FBQztJQUVwRTs7Ozs7Ozs7T0FRRztJQUNhLFlBQVksR0FBb0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVsRyxnQkFBZ0I7SUFDQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO0lBRTNELGdCQUFnQjtJQUNBLGdCQUFnQixHQUF1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFN0YsZ0JBQWdCO0lBQ0EsV0FBVyxDQUFrSDtJQUU3SSxnQkFBZ0I7SUFDQSxhQUFhLENBQWdCO0lBRTdDLGdCQUFnQjtJQUNBLE9BQU8sQ0FBc0I7SUFFckMsZUFBZSxHQUE0QyxFQUFFLENBQUM7SUFFdEUsWUFDSSxXQUE0SCxFQUM1SCxTQUE4QyxFQUFFO1FBRWhELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENB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QUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ25ELElBQUksQ0FBQyxXQUFXLENBQUUsY0FBYyxDQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBRSxjQUFjLENBQUUsQ0FBQyxFQUFFO2dCQUNwRixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLHFCQUFxQixFQUFFLEtBQUs7YUFDL0IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxZQUFZLENBQUMsT0FHaEIsRUFBRTtRQUNGLElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUM7SUFDTCxDQUFDO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGlzTWlzc2luZywgdW5kZWZpbmVkVG9OdWxsIH0gZnJvbSAnLi4vdXRpbCc7XHJcbmltcG9ydCB7IE9uQ2hhbmdlRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IE11bHRpUXVlcnlQYXJhbSwgUXVlcnlQYXJhbSwgUGFydGl0aW9uZWRRdWVyeVBhcmFtIH0gZnJvbSAnLi9xdWVyeS1wYXJhbSc7XHJcbmltcG9ydCB7IFJvdXRlck9wdGlvbnMgfSBmcm9tICcuLi9yb3V0ZXItYWRhcHRlci9yb3V0ZXItYWRhcHRlci5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1F1ZXJ5UGFyYW1Hcm91cE9wdHN9IGZyb20gJy4vcXVlcnktcGFyYW0tb3B0cyc7XHJcblxyXG4vKipcclxuICogR3JvdXBzIG11bHRpcGxlIHtAbGluayBRdWVyeVBhcmFtfSBpbnN0YW5jZXMgdG8gYSBzaW5nbGUgdW5pdC5cclxuICpcclxuICogVGhpcyBcImJ1bmRsZXNcIiBtdWx0aXBsZSBwYXJhbWV0ZXJzIHRvZ2V0aGVyIHN1Y2ggdGhhdCBjaGFuZ2VzIGNhbiBiZSBlbWl0dGVkIGFzIGFcclxuICogY29tcGxldGUgdW5pdC4gQ29sbGVjdGluZyBwYXJhbWV0ZXJzIGludG8gYSBncm91cCBpcyByZXF1aXJlZCBmb3IgdGhlIHN5bmNocm9uaXphdGlvblxyXG4gKiB0byBhbmQgZnJvbSB0aGUgVVJMLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1ZXJ5UGFyYW1Hcm91cCB7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdmFsdWVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8UmVjb3JkPHN0cmluZywgYW55Pj4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVtaXRzIHRoZSB2YWx1ZXMgb2YgYWxsIHBhcmFtZXRlcnMgaW4gdGhpcyBncm91cCB3aGVuZXZlciBhdCBsZWFzdCBvbmUgY2hhbmdlcy5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIG9ic2VydmFibGUgZW1pdHMgYW4gb2JqZWN0IGtleWVkIGJ5IHRoZSB7QFF1ZXJ5UGFyYW19IG5hbWVzIHdoZXJlIGVhY2gga2V5XHJcbiAgICAgKiBjYXJyaWVzIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSByZXByZXNlbnRlZCBwYXJhbWV0ZXIuIEl0IGVtaXRzIHdoZW5ldmVyIGF0IGxlYXN0XHJcbiAgICAgKiBvbmUgcGFyYW1ldGVyJ3MgdmFsdWUgaXMgY2hhbmdlZC5cclxuICAgICAqXHJcbiAgICAgKiBOT1RFOiBUaGlzIG9ic2VydmFibGUgZG9lcyBub3QgY29tcGxldGUgb24gaXRzIG93biwgc28gZW5zdXJlIHRvIHVuc3Vic2NyaWJlIGZyb20gaXQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXM6IE9ic2VydmFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4gPSB0aGlzLl92YWx1ZUNoYW5nZXMuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcXVlcnlQYXJhbUFkZGVkJCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcXVlcnlQYXJhbUFkZGVkJDogT2JzZXJ2YWJsZTxzdHJpbmc+ID0gdGhpcy5fcXVlcnlQYXJhbUFkZGVkJC5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcXVlcnlQYXJhbXM6IHsgWyBxdWVyeVBhcmFtTmFtZTogc3RyaW5nIF06IFF1ZXJ5UGFyYW08dW5rbm93bj4gfCBNdWx0aVF1ZXJ5UGFyYW08dW5rbm93bj4gfCBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4gfTtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm91dGVyT3B0aW9uczogUm91dGVyT3B0aW9ucztcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3B0aW9uczogUXVlcnlQYXJhbUdyb3VwT3B0cztcclxuXHJcbiAgICBwcml2YXRlIGNoYW5nZUZ1bmN0aW9uczogT25DaGFuZ2VGdW5jdGlvbjxSZWNvcmQ8c3RyaW5nLCBhbnk+PltdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcXVlcnlQYXJhbXM6IHsgWyBxdWVyeVBhcmFtTmFtZTogc3RyaW5nIF06IFF1ZXJ5UGFyYW08dW5rbm93bj4gfCBNdWx0aVF1ZXJ5UGFyYW08dW5rbm93bj4gfCBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4gfSxcclxuICAgICAgICBleHRyYXM6IFJvdXRlck9wdGlvbnMgJiBRdWVyeVBhcmFtR3JvdXBPcHRzID0ge31cclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucXVlcnlQYXJhbXMgPSBxdWVyeVBhcmFtcztcclxuICAgICAgICB0aGlzLnJvdXRlck9wdGlvbnMgPSBleHRyYXM7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gZXh0cmFzO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMucXVlcnlQYXJhbXMpLmZvckVhY2gocXVlcnlQYXJhbSA9PiBxdWVyeVBhcmFtLl9zZXRQYXJlbnQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBfcmVnaXN0ZXJPbkNoYW5nZShmbjogT25DaGFuZ2VGdW5jdGlvbjxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlRnVuY3Rpb25zLnB1c2goZm4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBfY2xlYXJDaGFuZ2VGdW5jdGlvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VGdW5jdGlvbnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyBhIHNwZWNpZmljIHBhcmFtZXRlciBmcm9tIHRoaXMgZ3JvdXAgYnkgbmFtZS5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgZWl0aGVyIHtAbGluayBRdWVyeVBhcmFtfSwge0BsaW5rIE11bHRpUXVlcnlQYXJhbX1cclxuICAgICAqIG9yIHtAbGluayBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW19IGRlcGVuZGluZyBvbiB0aGUgY29uZmlndXJhdGlvbiwgb3IgYG51bGxgXHJcbiAgICAgKiBpZiBubyBwYXJhbWV0ZXIgd2l0aCB0aGF0IG5hbWUgaXMgZm91bmQgaW4gdGhpcyBncm91cC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcXVlcnlQYXJhbU5hbWUgVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciBpbnN0YW5jZSB0byByZXRyaWV2ZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldChxdWVyeVBhcmFtTmFtZTogc3RyaW5nKTogUXVlcnlQYXJhbTx1bmtub3duPiB8IE11bHRpUXVlcnlQYXJhbTx1bmtub3duPiB8IFBhcnRpdGlvbmVkUXVlcnlQYXJhbTx1bmtub3duPiB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5xdWVyeVBhcmFtc1sgcXVlcnlQYXJhbU5hbWUgXTtcclxuICAgICAgICBpZiAoIXBhcmFtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIG5ldyB7QGxpbmsgUXVlcnlQYXJhbX0gdG8gdGhpcyBncm91cC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGFkZHMgdGhlIHBhcmFtZXRlciB1bmRlciB0aGUgZ2l2ZW4gbmFtZSB0byB0aGlzIGdyb3VwLiBUaGUgY3VycmVudFxyXG4gICAgICogVVJMIHdpbGwgYmUgZXZhbHVhdGVkIHRvIHN5bmNocm9uaXplIGl0cyB2YWx1ZSBpbml0aWFsbHkuIEFmdGVyd2FyZHNcclxuICAgICAqIGl0IGlzIHRyZWF0ZWQganVzdCBsaWtlIGFueSBvdGhlciBwYXJhbWV0ZXIgaW4gdGhpcyBncm91cC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcXVlcnlQYXJhbU5hbWUgTmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRvIHJlZmVyZW5jZSBpdCB3aXRoLlxyXG4gICAgICogQHBhcmFtIHF1ZXJ5UGFyYW0gVGhlIG5ldyBwYXJhbWV0ZXIgdG8gYWRkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkKHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcsIHF1ZXJ5UGFyYW06IFF1ZXJ5UGFyYW08dW5rbm93bj4gfCBNdWx0aVF1ZXJ5UGFyYW08dW5rbm93bj4gfCBQYXJ0aXRpb25lZFF1ZXJ5UGFyYW08dW5rbm93bj4pOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQocXVlcnlQYXJhbU5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBwYXJhbWV0ZXIgd2l0aCBuYW1lICR7cXVlcnlQYXJhbU5hbWV9IGFscmVhZHkgZXhpc3RzLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeVBhcmFtc1sgcXVlcnlQYXJhbU5hbWUgXSA9IHF1ZXJ5UGFyYW07XHJcbiAgICAgICAgcXVlcnlQYXJhbS5fc2V0UGFyZW50KHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3F1ZXJ5UGFyYW1BZGRlZCQubmV4dChxdWVyeVBhcmFtTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGEge0BsaW5rIFF1ZXJ5UGFyYW19IGZyb20gdGhpcyBncm91cC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHJlbW92ZXMgdGhlIHBhcmFtZXRlciBkZWZpbmVkIGJ5IHRoZSBwcm92aWRlZCBuYW1lIGZyb20gdGhpcyBncm91cC5cclxuICAgICAqIE5vIGZ1cnRoZXIgc3luY2hyb25pemF0aW9uIHdpdGggdGhpcyBwYXJhbWV0ZXIgd2lsbCBvY2N1ciBhbmQgaXQgd2lsbCBub3RcclxuICAgICAqIGJlIHJlcG9ydGVkIGluIHRoZSB2YWx1ZSBvZiB0aGlzIGdyb3VwIGFueW1vcmUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHF1ZXJ5UGFyYW1OYW1lIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlKHF1ZXJ5UGFyYW1OYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtID0gdGhpcy5nZXQocXVlcnlQYXJhbU5hbWUpO1xyXG4gICAgICAgIGlmICghcXVlcnlQYXJhbSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHBhcmFtZXRlciB3aXRoIG5hbWUgJHtxdWVyeVBhcmFtTmFtZX0gZm91bmQuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgdGhpcy5xdWVyeVBhcmFtc1sgcXVlcnlQYXJhbU5hbWUgXTtcclxuICAgICAgICBxdWVyeVBhcmFtLl9zZXRQYXJlbnQobnVsbCk7XHJcbiAgICAgICAgcXVlcnlQYXJhbS5fY2xlYXJDaGFuZ2VGdW5jdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoaXMgZ3JvdXAuXHJcbiAgICAgKlxyXG4gICAgICogU2VlIHtAbGluayBRdWVyeVBhcmFtR3JvdXAjdmFsdWVDaGFuZ2VzfSBmb3IgYSBkZXNjcmlwdGlvbiBvZiB0aGUgZm9ybWF0IG9mXHJcbiAgICAgKiB0aGUgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogUmVjb3JkPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWU6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5UGFyYW1zKS5mb3JFYWNoKHF1ZXJ5UGFyYW1OYW1lID0+IHZhbHVlWyBxdWVyeVBhcmFtTmFtZSBdID0gdGhpcy5xdWVyeVBhcmFtc1sgcXVlcnlQYXJhbU5hbWUgXS52YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIHRoaXMgZ3JvdXAgYnkgbWVyZ2luZyBpdCBpbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHNldHMgdGhlIHZhbHVlIG9mIGVhY2ggcHJvdmlkZWQgcGFyYW1ldGVyIHRvIHRoZSByZXNwZWN0aXZlIHByb3ZpZGVkXHJcbiAgICAgKiB2YWx1ZS4gSWYgYSBwYXJhbWV0ZXIgaXMgbm90IGxpc3RlZCwgaXRzIHZhbHVlIHJlbWFpbnMgdW5jaGFuZ2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBTZWUge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cCN2YWx1ZUNoYW5nZXN9IGZvciBhIGRlc2NyaXB0aW9uIG9mIHRoZSBmb3JtYXQuXHJcbiAgICAgKiBAcGFyYW0gb3B0cyBBZGRpdGlvbmFsIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdGNoVmFsdWUodmFsdWU6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IHtcclxuICAgICAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxyXG4gICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXHJcbiAgICB9ID0ge30pOiB2b2lkIHtcclxuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChxdWVyeVBhcmFtTmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW0gPSB0aGlzLnF1ZXJ5UGFyYW1zWyBxdWVyeVBhcmFtTmFtZSBdO1xyXG4gICAgICAgICAgICBpZiAoaXNNaXNzaW5nKHF1ZXJ5UGFyYW0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW0uc2V0VmFsdWUodmFsdWVbIHF1ZXJ5UGFyYW1OYW1lIF0sIHtcclxuICAgICAgICAgICAgICAgIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQsXHJcbiAgICAgICAgICAgICAgICBvbmx5U2VsZjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZShvcHRzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIHRoaXMgZ3JvdXAgYnkgb3ZlcndyaXRpbmcgaXQuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBzZXRzIHRoZSB2YWx1ZSBvZiBlYWNoIHByb3ZpZGVkIHBhcmFtZXRlciB0byB0aGUgcmVzcGVjdGl2ZSBwcm92aWRlZFxyXG4gICAgICogdmFsdWUuIElmIGEgcGFyYW1ldGVyIGlzIG5vdCBsaXN0ZWQsIGl0cyB2YWx1ZSBpcyBzZXQgdG8gYHVuZGVmaW5lZGAuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIFNlZSB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwI3ZhbHVlQ2hhbmdlc30gZm9yIGEgZGVzY3JpcHRpb24gb2YgdGhlIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSBvcHRzIEFkZGl0aW9uYWwgb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VmFsdWUodmFsdWU6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsLCBvcHRzOiB7XHJcbiAgICAgICAgZW1pdEV2ZW50PzogYm9vbGVhbixcclxuICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxyXG4gICAgfSA9IHt9KTogdm9pZCB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5xdWVyeVBhcmFtcykuZm9yRWFjaChxdWVyeVBhcmFtTmFtZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlcnlQYXJhbXNbIHF1ZXJ5UGFyYW1OYW1lIF0uc2V0VmFsdWUodW5kZWZpbmVkVG9OdWxsKHZhbHVlPy5bIHF1ZXJ5UGFyYW1OYW1lIF0pLCB7XHJcbiAgICAgICAgICAgICAgICBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50LFxyXG4gICAgICAgICAgICAgICAgb25seVNlbGY6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUob3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIF91cGRhdGVWYWx1ZShvcHRzOiB7XHJcbiAgICAgICAgZW1pdEV2ZW50PzogYm9vbGVhbixcclxuICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxyXG4gICAgfSA9IHt9KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG9wdHMuZW1pdE1vZGVsVG9WaWV3Q2hhbmdlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUZ1bmN0aW9ucy5mb3JFYWNoKGNoYW5nZUZuID0+IGNoYW5nZUZuKHRoaXMudmFsdWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWVDaGFuZ2VzLm5leHQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==