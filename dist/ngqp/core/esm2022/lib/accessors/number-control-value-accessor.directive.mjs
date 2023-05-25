import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
const NGQP_NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class NumberControlValueAccessorDirective {
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
        const normalizedValue = value === null ? '' : value;
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
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
    static ɵfac = function NumberControlValueAccessorDirective_Factory(t) { return new (t || NumberControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: NumberControlValueAccessorDirective, selectors: [["input", "type", "number", "queryParamName", ""], ["input", "type", "number", "queryParam", ""]], hostBindings: function NumberControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function NumberControlValueAccessorDirective_input_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function NumberControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_NUMBER_VALUE_ACCESSOR])] });
}
export { NumberControlValueAccessorDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NumberControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=number][queryParamName],input[type=number][queryParam]',
                providers: [NGQP_NUMBER_VALUE_ACCESSOR],
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { onInput: [{
            type: HostListener,
            args: ['input', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvYWNjZXNzb3JzL251bWJlci1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFZLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXpFLGNBQWM7QUFDZCxNQUFNLDBCQUEwQixHQUFhO0lBQ3pDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQ0FBbUMsQ0FBQztJQUNsRSxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFFRixjQUFjO0FBQ2QsTUFJYSxtQ0FBbUM7SUFnQnhCO0lBQTZCO0lBZHpDLFFBQVEsR0FBRyxDQUFDLENBQWdCLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUNwQyxTQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBR3RCLE9BQU8sQ0FBQyxLQUFjO1FBQ3pCLE1BQU0sS0FBSyxHQUFJLEtBQUssQ0FBQyxNQUEyQixDQUFDLEtBQUssQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUdNLE1BQU07UUFDVCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFlBQW9CLFFBQW1CLEVBQVUsVUFBd0M7UUFBckUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLGVBQVUsR0FBVixVQUFVLENBQThCO0lBQ3pGLENBQUM7SUFFTSxVQUFVLENBQUMsS0FBVTtRQUN4QixNQUFNLGVBQWUsR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEVBQU87UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEVBQU87UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFVBQW1CO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRixDQUFDOzZGQWxDUSxtQ0FBbUM7NkRBQW5DLG1DQUFtQzswSEFBbkMsbUJBQWUsNkZBQWYsWUFBUTs4Q0FGTixDQUFDLDBCQUEwQixDQUFDOztTQUU5QixtQ0FBbUM7dUZBQW5DLG1DQUFtQztjQUovQyxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLG1FQUFtRTtnQkFDN0UsU0FBUyxFQUFFLENBQUMsMEJBQTBCLENBQUM7YUFDMUM7cUZBT1UsT0FBTztrQkFEYixZQUFZO21CQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztZQU8xQixNQUFNO2tCQURaLFlBQVk7bUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBQcm92aWRlciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbmNvbnN0IE5HUVBfTlVNQkVSX1ZBTFVFX0FDQ0VTU09SOiBQcm92aWRlciA9IHtcclxuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTnVtYmVyQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUpLFxyXG4gICAgbXVsdGk6IHRydWVcclxufTtcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPW51bWJlcl1bcXVlcnlQYXJhbU5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVtxdWVyeVBhcmFtXScsXHJcbiAgICBwcm92aWRlcnM6IFtOR1FQX05VTUJFUl9WQUxVRV9BQ0NFU1NPUl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOdW1iZXJDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHJcbiAgICBwcml2YXRlIGZuQ2hhbmdlID0gKF86IG51bWJlciB8IG51bGwpID0+IHt9O1xyXG4gICAgcHJpdmF0ZSBmblRvdWNoZWQgPSAoKSA9PiB7fTtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgb25JbnB1dChldmVudDogVUlFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlKHZhbHVlID09PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignYmx1cicpXHJcbiAgICBwdWJsaWMgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4pIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuZm5DaGFuZ2UgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==