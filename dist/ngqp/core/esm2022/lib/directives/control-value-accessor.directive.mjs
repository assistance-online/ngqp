import { Directive, EventEmitter, forwardRef, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * Provides an ad-hoc ControlValueAccessor to a component.
 *
 * This directive provides a ControlValueAccessor for the host on which it is applied
 * by proxying the required interface through events and an API.
 *
 *
 *     <app-item-selector #ctrl
 *              controlValueAccessor #accessor="controlValueAccessor"
 *              (itemChange)="accessor.notifyChange($event)"
 *              (controlValueChange)="ctrl.item = $event">
 *     </app-item-selector>
 */
class ControlValueAccessorDirective {
    /**
     * Fired when a value should be written (model -> view).
     *
     * From the ControlValueAccessor perspective, this is the equivalent of
     * writeValue. You should bind to this event and update your component's
     * state with the given value.
     */
    controlValueChange = new EventEmitter();
    /**
     * Fired when the control's disabled change should change.
     *
     * From the ControlValueAccessor perspective, this is the equivalent of
     * setDisabledState.
     *
     * This is currently not used by ngqp.
     */
    disabledChange = new EventEmitter();
    fnChange = (_) => { };
    fnTouched = () => { };
    /**
     * Write a new value to the model (view -> model)
     *
     * When your component's value changes, call this method to inform
     * the model about the change.
     */
    notifyChange(value) {
        this.fnChange(value);
    }
    /**
     * Inform that the component has been touched by the user.
     *
     * This is currently not used by ngqp.
     */
    notifyTouched() {
        this.fnTouched();
    }
    /** @internal */
    writeValue(value) {
        this.controlValueChange.emit(value);
    }
    /** @internal */
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    /** @internal */
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    /** @internal */
    setDisabledState(isDisabled) {
        this.disabledChange.emit(isDisabled);
    }
    static ɵfac = function ControlValueAccessorDirective_Factory(t) { return new (t || ControlValueAccessorDirective)(); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: ControlValueAccessorDirective, selectors: [["", "controlValueAccessor", ""]], outputs: { controlValueChange: "controlValueChange", disabledChange: "disabledChange" }, exportAs: ["controlValueAccessor"], features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(() => ControlValueAccessorDirective),
                    multi: true
                }
            ])] });
}
export { ControlValueAccessorDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: '[controlValueAccessor]',
                exportAs: 'controlValueAccessor',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => ControlValueAccessorDirective),
                        multi: true
                    }
                ],
            }]
    }], null, { controlValueChange: [{
            type: Output,
            args: ['controlValueChange']
        }], disabledChange: [{
            type: Output,
            args: ['disabledChange']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9kaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUV6RTs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQVdhLDZCQUE2QjtJQUV0Qzs7Ozs7O09BTUc7SUFFSSxrQkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBSyxDQUFDO0lBRWxEOzs7Ozs7O09BT0c7SUFFSSxjQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztJQUU1QyxRQUFRLEdBQUcsQ0FBQyxDQUFJLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUN4QixTQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBRTdCOzs7OztPQUtHO0lBQ0ksWUFBWSxDQUFDLEtBQVE7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGFBQWE7UUFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxVQUFVLENBQUMsS0FBUTtRQUN0QixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxnQkFBZ0IsQ0FBQyxFQUFxQjtRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsZ0JBQWdCO0lBQ1QsaUJBQWlCLENBQUMsRUFBYTtRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0JBQWdCO0lBQ1QsZ0JBQWdCLENBQUMsVUFBbUI7UUFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQzt1RkEvRFEsNkJBQTZCOzZEQUE3Qiw2QkFBNkIsK01BUjNCO2dCQUNQO29CQUNJLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUM7b0JBQzVELEtBQUssRUFBRSxJQUFJO2lCQUNkO2FBQ0o7O1NBRVEsNkJBQTZCO3VGQUE3Qiw2QkFBNkI7Y0FYekMsU0FBUztlQUFDO2dCQUNQLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFNBQVMsRUFBRTtvQkFDUDt3QkFDSSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQzt3QkFDNUQsS0FBSyxFQUFFLElBQUk7cUJBQ2Q7aUJBQ0o7YUFDSjtnQkFXVSxrQkFBa0I7a0JBRHhCLE1BQU07bUJBQUMsb0JBQW9CO1lBWXJCLGNBQWM7a0JBRHBCLE1BQU07bUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG4vKipcclxuICogUHJvdmlkZXMgYW4gYWQtaG9jIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHRvIGEgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBUaGlzIGRpcmVjdGl2ZSBwcm92aWRlcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGZvciB0aGUgaG9zdCBvbiB3aGljaCBpdCBpcyBhcHBsaWVkXHJcbiAqIGJ5IHByb3h5aW5nIHRoZSByZXF1aXJlZCBpbnRlcmZhY2UgdGhyb3VnaCBldmVudHMgYW5kIGFuIEFQSS5cclxuICpcclxuICpcclxuICogICAgIDxhcHAtaXRlbS1zZWxlY3RvciAjY3RybFxyXG4gKiAgICAgICAgICAgICAgY29udHJvbFZhbHVlQWNjZXNzb3IgI2FjY2Vzc29yPVwiY29udHJvbFZhbHVlQWNjZXNzb3JcIlxyXG4gKiAgICAgICAgICAgICAgKGl0ZW1DaGFuZ2UpPVwiYWNjZXNzb3Iubm90aWZ5Q2hhbmdlKCRldmVudClcIlxyXG4gKiAgICAgICAgICAgICAgKGNvbnRyb2xWYWx1ZUNoYW5nZSk9XCJjdHJsLml0ZW0gPSAkZXZlbnRcIj5cclxuICogICAgIDwvYXBwLWl0ZW0tc2VsZWN0b3I+XHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW2NvbnRyb2xWYWx1ZUFjY2Vzc29yXScsXHJcbiAgICBleHBvcnRBczogJ2NvbnRyb2xWYWx1ZUFjY2Vzc29yJyxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlKSxcclxuICAgICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmU8VD4gaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXJlZCB3aGVuIGEgdmFsdWUgc2hvdWxkIGJlIHdyaXR0ZW4gKG1vZGVsIC0+IHZpZXcpLlxyXG4gICAgICpcclxuICAgICAqIEZyb20gdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHBlcnNwZWN0aXZlLCB0aGlzIGlzIHRoZSBlcXVpdmFsZW50IG9mXHJcbiAgICAgKiB3cml0ZVZhbHVlLiBZb3Ugc2hvdWxkIGJpbmQgdG8gdGhpcyBldmVudCBhbmQgdXBkYXRlIHlvdXIgY29tcG9uZW50J3NcclxuICAgICAqIHN0YXRlIHdpdGggdGhlIGdpdmVuIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBAT3V0cHV0KCdjb250cm9sVmFsdWVDaGFuZ2UnKVxyXG4gICAgcHVibGljIGNvbnRyb2xWYWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpcmVkIHdoZW4gdGhlIGNvbnRyb2wncyBkaXNhYmxlZCBjaGFuZ2Ugc2hvdWxkIGNoYW5nZS5cclxuICAgICAqXHJcbiAgICAgKiBGcm9tIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBwZXJzcGVjdGl2ZSwgdGhpcyBpcyB0aGUgZXF1aXZhbGVudCBvZlxyXG4gICAgICogc2V0RGlzYWJsZWRTdGF0ZS5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGlzIGN1cnJlbnRseSBub3QgdXNlZCBieSBuZ3FwLlxyXG4gICAgICovXHJcbiAgICBAT3V0cHV0KCdkaXNhYmxlZENoYW5nZScpXHJcbiAgICBwdWJsaWMgZGlzYWJsZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSBmbkNoYW5nZSA9IChfOiBUKSA9PiB7fTtcclxuICAgIHByaXZhdGUgZm5Ub3VjaGVkID0gKCkgPT4ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXcml0ZSBhIG5ldyB2YWx1ZSB0byB0aGUgbW9kZWwgKHZpZXcgLT4gbW9kZWwpXHJcbiAgICAgKlxyXG4gICAgICogV2hlbiB5b3VyIGNvbXBvbmVudCdzIHZhbHVlIGNoYW5nZXMsIGNhbGwgdGhpcyBtZXRob2QgdG8gaW5mb3JtXHJcbiAgICAgKiB0aGUgbW9kZWwgYWJvdXQgdGhlIGNoYW5nZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIG5vdGlmeUNoYW5nZSh2YWx1ZTogVCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm5DaGFuZ2UodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5mb3JtIHRoYXQgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiB0b3VjaGVkIGJ5IHRoZSB1c2VyLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgaXMgY3VycmVudGx5IG5vdCB1c2VkIGJ5IG5ncXAuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBub3RpZnlUb3VjaGVkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IFQpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xWYWx1ZUNoYW5nZS5lbWl0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBUKSA9PiBhbnkpIHtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmRpc2FibGVkQ2hhbmdlLmVtaXQoaXNEaXNhYmxlZCk7XHJcbiAgICB9XHJcblxyXG59Il19