import { Directive, ElementRef, forwardRef, HostListener, Inject, Optional, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
/** @ignore */
const NGQP_DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DefaultControlValueAccessorDirective),
    multi: true
};
/** @ignore */
function isAndroid(navigator) {
    return /android (\d+)/.test(navigator.userAgent.toLowerCase());
}
/** @ignore */
export class DefaultControlValueAccessorDirective {
    platformId;
    renderer;
    elementRef;
    supportsComposition;
    composing = false;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        if (this.supportsComposition && this.composing) {
            return;
        }
        this.fnChange(event.target.value);
    }
    onBlur() {
        this.fnTouched();
    }
    onCompositionStart() {
        this.composing = true;
    }
    onCompositionEnd(event) {
        this.composing = false;
        if (this.supportsComposition) {
            this.fnChange(event.target.value);
        }
    }
    constructor(platformId, renderer, elementRef) {
        this.platformId = platformId;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.supportsComposition = isPlatformBrowser(this.platformId || '') && !isAndroid(window.navigator);
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
    static ɵfac = function DefaultControlValueAccessorDirective_Factory(t) { return new (t || DefaultControlValueAccessorDirective)(i0.ɵɵdirectiveInject(PLATFORM_ID, 8), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: DefaultControlValueAccessorDirective, selectors: [["input", "queryParamName", "", 3, "type", "checkbox", 3, "type", "radio"], ["textarea", "queryParamName", ""], ["input", "queryParam", "", 3, "type", "checkbox", 3, "type", "radio"], ["textarea", "queryParam", ""]], hostBindings: function DefaultControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function DefaultControlValueAccessorDirective_input_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function DefaultControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); })("compositionstart", function DefaultControlValueAccessorDirective_compositionstart_HostBindingHandler() { return ctx.onCompositionStart(); })("compositionend", function DefaultControlValueAccessorDirective_compositionend_HostBindingHandler($event) { return ctx.onCompositionEnd($event); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_DEFAULT_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DefaultControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input:not([type=checkbox]):not([type=radio])[queryParamName],textarea[queryParamName],' +
                    'input:not([type=checkbox]):not([type=radio])[queryParam],textarea[queryParam]',
                providers: [NGQP_DEFAULT_VALUE_ACCESSOR],
            }]
    }], () => [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], { onInput: [{
            type: HostListener,
            args: ['input', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }], onCompositionStart: [{
            type: HostListener,
            args: ['compositionstart']
        }], onCompositionEnd: [{
            type: HostListener,
            args: ['compositionend', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25ncXAvY29yZS9zcmMvbGliL2FjY2Vzc29ycy9kZWZhdWx0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQVksU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BJLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFFcEQsY0FBYztBQUNkLE1BQU0sMkJBQTJCLEdBQWE7SUFDMUMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9DQUFvQyxDQUFDO0lBQ25FLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUVGLGNBQWM7QUFDZCxTQUFTLFNBQVMsQ0FBQyxTQUFvQjtJQUNuQyxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxjQUFjO0FBTWQsTUFBTSxPQUFPLG9DQUFvQztJQW9DQTtJQUNqQztJQUNBO0lBcENLLG1CQUFtQixDQUFVO0lBQ3RDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFbEIsUUFBUSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFDN0IsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUd0QixPQUFPLENBQUMsS0FBYztRQUN6QixJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0MsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxNQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFHTSxNQUFNO1FBQ1QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFHTSxrQkFBa0I7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUdNLGdCQUFnQixDQUFDLEtBQWM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxNQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDTCxDQUFDO0lBRUQsWUFDNkMsVUFBeUIsRUFDMUQsUUFBbUIsRUFDbkIsVUFBOEQ7UUFGN0IsZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUMxRCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQW9EO1FBRXRFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQWE7UUFDM0IsTUFBTSxlQUFlLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFPO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxFQUFPO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckYsQ0FBQzs4RkExRFEsb0NBQW9DLHVCQW9DckIsV0FBVzs2REFwQzFCLG9DQUFvQzsySEFBcEMsbUJBQWUsOEZBQWYsWUFBUSxzSEFBUix3QkFBb0Isd0hBQXBCLDRCQUF3Qjs4Q0FGdEIsQ0FBQywyQkFBMkIsQ0FBQzs7aUZBRS9CLG9DQUFvQztjQUxoRCxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLHdGQUF3RjtvQkFDeEYsK0VBQStFO2dCQUN6RixTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQzthQUMzQzs7c0JBcUNRLFFBQVE7O3NCQUFJLE1BQU07dUJBQUMsV0FBVztzRUEzQjVCLE9BQU87a0JBRGIsWUFBWTttQkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFVMUIsTUFBTTtrQkFEWixZQUFZO21CQUFDLE1BQU07WUFNYixrQkFBa0I7a0JBRHhCLFlBQVk7bUJBQUMsa0JBQWtCO1lBTXpCLGdCQUFnQjtrQkFEdEIsWUFBWTttQkFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBJbmplY3QsIE9wdGlvbmFsLCBQTEFURk9STV9JRCwgUHJvdmlkZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbmNvbnN0IE5HUVBfREVGQVVMVF9WQUxVRV9BQ0NFU1NPUjogUHJvdmlkZXIgPSB7XHJcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERlZmF1bHRDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSksXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG59O1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuZnVuY3Rpb24gaXNBbmRyb2lkKG5hdmlnYXRvcjogTmF2aWdhdG9yKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcbn1cclxuXHJcbi8qKiBAaWdub3JlICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKTpub3QoW3R5cGU9cmFkaW9dKVtxdWVyeVBhcmFtTmFtZV0sdGV4dGFyZWFbcXVlcnlQYXJhbU5hbWVdLCcgK1xyXG4gICAgICAgICAgICAgICdpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKTpub3QoW3R5cGU9cmFkaW9dKVtxdWVyeVBhcmFtXSx0ZXh0YXJlYVtxdWVyeVBhcmFtXScsXHJcbiAgICBwcm92aWRlcnM6IFtOR1FQX0RFRkFVTFRfVkFMVUVfQUNDRVNTT1JdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3VwcG9ydHNDb21wb3NpdGlvbjogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgY29tcG9zaW5nID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBmbkNoYW5nZSA9IChfOiBzdHJpbmcpID0+IHt9O1xyXG4gICAgcHJpdmF0ZSBmblRvdWNoZWQgPSAoKSA9PiB7fTtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgb25JbnB1dChldmVudDogVUlFdmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnRzQ29tcG9zaXRpb24gJiYgdGhpcy5jb21wb3NpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSgoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdibHVyJylcclxuICAgIHB1YmxpYyBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JylcclxuICAgIHB1YmxpYyBvbkNvbXBvc2l0aW9uU3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb3NpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgWyckZXZlbnQnXSlcclxuICAgIHB1YmxpYyBvbkNvbXBvc2l0aW9uRW5kKGV2ZW50OiBVSUV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5jb21wb3NpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5zdXBwb3J0c0NvbXBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm5DaGFuZ2UoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogc3RyaW5nIHwgbnVsbCxcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50PlxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0c0NvbXBvc2l0aW9uID0gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkIHx8ICcnKSAmJiAhaXNBbmRyb2lkKHdpbmRvdy5uYXZpZ2F0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgbm9ybWFsaXplZFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XHJcbiAgICB9XHJcblxyXG59Il19