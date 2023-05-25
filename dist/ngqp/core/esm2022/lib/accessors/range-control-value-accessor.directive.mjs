import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
const NGQP_RANGE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangeControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class RangeControlValueAccessorDirective {
    renderer;
    elementRef;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        const value = event.target.value;
        this.fnChange(value === '' ? null : parseFloat(value));
    }
    onBlur() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', parseFloat(value));
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    static ɵfac = function RangeControlValueAccessorDirective_Factory(t) { return new (t || RangeControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: RangeControlValueAccessorDirective, selectors: [["input", "type", "range", "queryParamName", ""], ["input", "type", "range", "queryParam", ""]], hostBindings: function RangeControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function RangeControlValueAccessorDirective_input_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function RangeControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_RANGE_VALUE_ACCESSOR])] });
}
export { RangeControlValueAccessorDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RangeControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=range][queryParamName],input[type=range][queryParam]',
                providers: [NGQP_RANGE_VALUE_ACCESSOR],
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { onInput: [{
            type: HostListener,
            args: ['input', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9hY2Nlc3NvcnMvcmFuZ2UtY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBWSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUV6RSxjQUFjO0FBQ2QsTUFBTSx5QkFBeUIsR0FBYTtJQUN4QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0NBQWtDLENBQUM7SUFDakUsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsY0FBYztBQUNkLE1BSWEsa0NBQWtDO0lBZ0J2QjtJQUE2QjtJQWR6QyxRQUFRLEdBQUcsQ0FBQyxDQUFnQixFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFDcEMsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUd0QixPQUFPLENBQUMsS0FBYztRQUN6QixNQUFNLEtBQUssR0FBSSxLQUFLLENBQUMsTUFBMkIsQ0FBQyxLQUFLLENBQUM7UUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFHTSxNQUFNO1FBQ1QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxZQUFvQixRQUFtQixFQUFVLFVBQXdDO1FBQXJFLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUE4QjtJQUN6RixDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQVU7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFPO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxFQUFPO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckYsQ0FBQzs0RkFqQ1Esa0NBQWtDOzZEQUFsQyxrQ0FBa0M7eUhBQWxDLG1CQUFlLDRGQUFmLFlBQVE7OENBRk4sQ0FBQyx5QkFBeUIsQ0FBQzs7U0FFN0Isa0NBQWtDO3VGQUFsQyxrQ0FBa0M7Y0FKOUMsU0FBUztlQUFDO2dCQUNQLFFBQVEsRUFBRSxpRUFBaUU7Z0JBQzNFLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO2FBQ3pDO3FGQU9VLE9BQU87a0JBRGIsWUFBWTttQkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFPMUIsTUFBTTtrQkFEWixZQUFZO21CQUFDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEhvc3RMaXN0ZW5lciwgUHJvdmlkZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG4vKiogQGlnbm9yZSAqL1xyXG5jb25zdCBOR1FQX1JBTkdFX1ZBTFVFX0FDQ0VTU09SOiBQcm92aWRlciA9IHtcclxuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmFuZ2VDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSksXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG59O1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9cmFuZ2VdW3F1ZXJ5UGFyYW1OYW1lXSxpbnB1dFt0eXBlPXJhbmdlXVtxdWVyeVBhcmFtXScsXHJcbiAgICBwcm92aWRlcnM6IFtOR1FQX1JBTkdFX1ZBTFVFX0FDQ0VTU09SXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFJhbmdlQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcblxyXG4gICAgcHJpdmF0ZSBmbkNoYW5nZSA9IChfOiBudW1iZXIgfCBudWxsKSA9PiB7fTtcclxuICAgIHByaXZhdGUgZm5Ub3VjaGVkID0gKCkgPT4ge307XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudCddKVxyXG4gICAgcHVibGljIG9uSW5wdXQoZXZlbnQ6IFVJRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSh2YWx1ZSA9PT0gJycgPyBudWxsIDogcGFyc2VGbG9hdCh2YWx1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxyXG4gICAgcHVibGljIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+KSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHBhcnNlRmxvYXQodmFsdWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XHJcbiAgICB9XHJcblxyXG59Il19