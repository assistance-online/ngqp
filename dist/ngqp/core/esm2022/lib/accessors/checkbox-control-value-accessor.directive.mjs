import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
const NGQP_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxControlValueAccessorDirective),
    multi: true
};
/** @ignore */
export class CheckboxControlValueAccessorDirective {
    renderer;
    elementRef;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        this.fnChange(event.target.checked);
    }
    onBlur() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', value);
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
    static ɵfac = function CheckboxControlValueAccessorDirective_Factory(t) { return new (t || CheckboxControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: CheckboxControlValueAccessorDirective, selectors: [["input", "type", "checkbox", "queryParamName", ""], ["input", "type", "checkbox", "queryParam", ""]], hostBindings: function CheckboxControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function CheckboxControlValueAccessorDirective_change_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function CheckboxControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_CHECKBOX_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CheckboxControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][queryParamName],input[type=checkbox][queryParam]',
                providers: [NGQP_CHECKBOX_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onInput: [{
            type: HostListener,
            args: ['change', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9hY2Nlc3NvcnMvY2hlY2tib3gtY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBWSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUV6RSxjQUFjO0FBQ2QsTUFBTSw0QkFBNEIsR0FBYTtJQUMzQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUNBQXFDLENBQUM7SUFDcEUsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsY0FBYztBQUtkLE1BQU0sT0FBTyxxQ0FBcUM7SUFlMUI7SUFBNkI7SUFiekMsUUFBUSxHQUFHLENBQUMsQ0FBVSxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFDOUIsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUd0QixPQUFPLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxNQUEyQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFHTSxNQUFNO1FBQ1QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxZQUFvQixRQUFtQixFQUFVLFVBQXdDO1FBQXJFLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUE4QjtJQUN6RixDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQWM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFPO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxFQUFPO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckYsQ0FBQzsrRkFoQ1EscUNBQXFDOzZEQUFyQyxxQ0FBcUM7OEhBQXJDLG1CQUFlLCtGQUFmLFlBQVE7OENBRk4sQ0FBQyw0QkFBNEIsQ0FBQzs7aUZBRWhDLHFDQUFxQztjQUpqRCxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLHVFQUF1RTtnQkFDakYsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7YUFDNUM7bUVBT1UsT0FBTztrQkFEYixZQUFZO21CQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQU0zQixNQUFNO2tCQURaLFlBQVk7bUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBQcm92aWRlciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbmNvbnN0IE5HUVBfQ0hFQ0tCT1hfVkFMVUVfQUNDRVNTT1I6IFByb3ZpZGVyID0ge1xyXG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlKSxcclxuICAgIG11bHRpOiB0cnVlXHJcbn07XHJcblxyXG4vKiogQGlnbm9yZSAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1jaGVja2JveF1bcXVlcnlQYXJhbU5hbWVdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3F1ZXJ5UGFyYW1dJyxcclxuICAgIHByb3ZpZGVyczogW05HUVBfQ0hFQ0tCT1hfVkFMVUVfQUNDRVNTT1JdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHJcbiAgICBwcml2YXRlIGZuQ2hhbmdlID0gKF86IGJvb2xlYW4pID0+IHt9O1xyXG4gICAgcHJpdmF0ZSBmblRvdWNoZWQgPSAoKSA9PiB7fTtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnLCBbJyRldmVudCddKVxyXG4gICAgcHVibGljIG9uSW5wdXQoZXZlbnQ6IFVJRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlKChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignYmx1cicpXHJcbiAgICBwdWJsaWMgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4pIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdjaGVja2VkJywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcclxuICAgIH1cclxuXHJcbn0iXX0=