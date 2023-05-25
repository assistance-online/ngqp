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
class CheckboxControlValueAccessorDirective {
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
export { CheckboxControlValueAccessorDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CheckboxControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][queryParamName],input[type=checkbox][queryParam]',
                providers: [NGQP_CHECKBOX_VALUE_ACCESSOR],
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { onInput: [{
            type: HostListener,
            args: ['change', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9hY2Nlc3NvcnMvY2hlY2tib3gtY29udHJvbC12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBWSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUV6RSxjQUFjO0FBQ2QsTUFBTSw0QkFBNEIsR0FBYTtJQUMzQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUNBQXFDLENBQUM7SUFDcEUsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsY0FBYztBQUNkLE1BSWEscUNBQXFDO0lBZTFCO0lBQTZCO0lBYnpDLFFBQVEsR0FBRyxDQUFDLENBQVUsRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBQzlCLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFHdEIsT0FBTyxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBRSxLQUFLLENBQUMsTUFBMkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBR00sTUFBTTtRQUNULElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsWUFBb0IsUUFBbUIsRUFBVSxVQUF3QztRQUFyRSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBOEI7SUFDekYsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFjO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsRUFBTztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0saUJBQWlCLENBQUMsRUFBTztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsVUFBbUI7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7K0ZBaENRLHFDQUFxQzs2REFBckMscUNBQXFDOzhIQUFyQyxtQkFBZSwrRkFBZixZQUFROzhDQUZOLENBQUMsNEJBQTRCLENBQUM7O1NBRWhDLHFDQUFxQzt1RkFBckMscUNBQXFDO2NBSmpELFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsdUVBQXVFO2dCQUNqRixTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQzthQUM1QztxRkFPVSxPQUFPO2tCQURiLFlBQVk7bUJBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBTTNCLE1BQU07a0JBRFosWUFBWTttQkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBIb3N0TGlzdGVuZXIsIFByb3ZpZGVyLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuY29uc3QgTkdRUF9DSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUjogUHJvdmlkZXIgPSB7XHJcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUpLFxyXG4gICAgbXVsdGk6IHRydWVcclxufTtcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPWNoZWNrYm94XVtxdWVyeVBhcmFtTmFtZV0saW5wdXRbdHlwZT1jaGVja2JveF1bcXVlcnlQYXJhbV0nLFxyXG4gICAgcHJvdmlkZXJzOiBbTkdRUF9DSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAgIHByaXZhdGUgZm5DaGFuZ2UgPSAoXzogYm9vbGVhbikgPT4ge307XHJcbiAgICBwcml2YXRlIGZuVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgb25JbnB1dChldmVudDogVUlFdmVudCkge1xyXG4gICAgICAgIHRoaXMuZm5DaGFuZ2UoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKTtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdibHVyJylcclxuICAgIHB1YmxpYyBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50Pikge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2NoZWNrZWQnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuZm5DaGFuZ2UgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==