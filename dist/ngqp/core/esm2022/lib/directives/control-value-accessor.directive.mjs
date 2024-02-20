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
export class ControlValueAccessorDirective {
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ControlValueAccessorDirective, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9kaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUV6RTs7Ozs7Ozs7Ozs7O0dBWUc7QUFZSCxNQUFNLE9BQU8sNkJBQTZCO0lBRXRDOzs7Ozs7T0FNRztJQUVJLGtCQUFrQixHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7SUFFbEQ7Ozs7Ozs7T0FPRztJQUVJLGNBQWMsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO0lBRTVDLFFBQVEsR0FBRyxDQUFDLENBQUksRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBQ3hCLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFFN0I7Ozs7O09BS0c7SUFDSSxZQUFZLENBQUMsS0FBUTtRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksYUFBYTtRQUNoQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGdCQUFnQjtJQUNULFVBQVUsQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGdCQUFnQjtJQUNULGdCQUFnQixDQUFDLEVBQXFCO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxpQkFBaUIsQ0FBQyxFQUFhO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO3VGQS9EUSw2QkFBNkI7NkRBQTdCLDZCQUE2QiwrTUFSM0I7Z0JBQ1A7b0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztvQkFDNUQsS0FBSyxFQUFFLElBQUk7aUJBQ2Q7YUFDSjs7aUZBRVEsNkJBQTZCO2NBWHpDLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxTQUFTLEVBQUU7b0JBQ1A7d0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUM7d0JBQzVELEtBQUssRUFBRSxJQUFJO3FCQUNkO2lCQUNKO2FBQ0o7Z0JBV1Usa0JBQWtCO2tCQUR4QixNQUFNO21CQUFDLG9CQUFvQjtZQVlyQixjQUFjO2tCQURwQixNQUFNO21CQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBmb3J3YXJkUmVmLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuLyoqXHJcbiAqIFByb3ZpZGVzIGFuIGFkLWhvYyBDb250cm9sVmFsdWVBY2Nlc3NvciB0byBhIGNvbXBvbmVudC5cclxuICpcclxuICogVGhpcyBkaXJlY3RpdmUgcHJvdmlkZXMgYSBDb250cm9sVmFsdWVBY2Nlc3NvciBmb3IgdGhlIGhvc3Qgb24gd2hpY2ggaXQgaXMgYXBwbGllZFxyXG4gKiBieSBwcm94eWluZyB0aGUgcmVxdWlyZWQgaW50ZXJmYWNlIHRocm91Z2ggZXZlbnRzIGFuZCBhbiBBUEkuXHJcbiAqXHJcbiAqXHJcbiAqICAgICA8YXBwLWl0ZW0tc2VsZWN0b3IgI2N0cmxcclxuICogICAgICAgICAgICAgIGNvbnRyb2xWYWx1ZUFjY2Vzc29yICNhY2Nlc3Nvcj1cImNvbnRyb2xWYWx1ZUFjY2Vzc29yXCJcclxuICogICAgICAgICAgICAgIChpdGVtQ2hhbmdlKT1cImFjY2Vzc29yLm5vdGlmeUNoYW5nZSgkZXZlbnQpXCJcclxuICogICAgICAgICAgICAgIChjb250cm9sVmFsdWVDaGFuZ2UpPVwiY3RybC5pdGVtID0gJGV2ZW50XCI+XHJcbiAqICAgICA8L2FwcC1pdGVtLXNlbGVjdG9yPlxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tjb250cm9sVmFsdWVBY2Nlc3Nvcl0nLFxyXG4gICAgZXhwb3J0QXM6ICdjb250cm9sVmFsdWVBY2Nlc3NvcicsXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSksXHJcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmlyZWQgd2hlbiBhIHZhbHVlIHNob3VsZCBiZSB3cml0dGVuIChtb2RlbCAtPiB2aWV3KS5cclxuICAgICAqXHJcbiAgICAgKiBGcm9tIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBwZXJzcGVjdGl2ZSwgdGhpcyBpcyB0aGUgZXF1aXZhbGVudCBvZlxyXG4gICAgICogd3JpdGVWYWx1ZS4gWW91IHNob3VsZCBiaW5kIHRvIHRoaXMgZXZlbnQgYW5kIHVwZGF0ZSB5b3VyIGNvbXBvbmVudCdzXHJcbiAgICAgKiBzdGF0ZSB3aXRoIHRoZSBnaXZlbiB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgQE91dHB1dCgnY29udHJvbFZhbHVlQ2hhbmdlJylcclxuICAgIHB1YmxpYyBjb250cm9sVmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXJlZCB3aGVuIHRoZSBjb250cm9sJ3MgZGlzYWJsZWQgY2hhbmdlIHNob3VsZCBjaGFuZ2UuXHJcbiAgICAgKlxyXG4gICAgICogRnJvbSB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgcGVyc3BlY3RpdmUsIHRoaXMgaXMgdGhlIGVxdWl2YWxlbnQgb2ZcclxuICAgICAqIHNldERpc2FibGVkU3RhdGUuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBpcyBjdXJyZW50bHkgbm90IHVzZWQgYnkgbmdxcC5cclxuICAgICAqL1xyXG4gICAgQE91dHB1dCgnZGlzYWJsZWRDaGFuZ2UnKVxyXG4gICAgcHVibGljIGRpc2FibGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG5cclxuICAgIHByaXZhdGUgZm5DaGFuZ2UgPSAoXzogVCkgPT4ge307XHJcbiAgICBwcml2YXRlIGZuVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV3JpdGUgYSBuZXcgdmFsdWUgdG8gdGhlIG1vZGVsICh2aWV3IC0+IG1vZGVsKVxyXG4gICAgICpcclxuICAgICAqIFdoZW4geW91ciBjb21wb25lbnQncyB2YWx1ZSBjaGFuZ2VzLCBjYWxsIHRoaXMgbWV0aG9kIHRvIGluZm9ybVxyXG4gICAgICogdGhlIG1vZGVsIGFib3V0IHRoZSBjaGFuZ2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBub3RpZnlDaGFuZ2UodmFsdWU6IFQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluZm9ybSB0aGF0IHRoZSBjb21wb25lbnQgaGFzIGJlZW4gdG91Y2hlZCBieSB0aGUgdXNlci5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGlzIGN1cnJlbnRseSBub3QgdXNlZCBieSBuZ3FwLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbm90aWZ5VG91Y2hlZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBUKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9sVmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogVCkgPT4gYW55KSB7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZENoYW5nZS5lbWl0KGlzRGlzYWJsZWQpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==