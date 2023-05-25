import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { undefinedToNull } from '../util';
import * as i0 from "@angular/core";
/** @ignore */
const NGQP_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class SelectControlValueAccessorDirective {
    renderer;
    elementRef;
    value = null;
    selectedId = null;
    optionMap = new Map();
    idCounter = 0;
    fnChange = (_) => { };
    fnTouched = () => { };
    onChange(event) {
        this.selectedId = event.target.value;
        this.value = undefinedToNull(this.optionMap.get(this.selectedId));
        this.fnChange(this.value);
    }
    onTouched() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.value = value;
        this.selectedId = value === null ? null : this.getOptionId(value);
        if (this.selectedId === null) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'selectedIndex', -1);
        }
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.selectedId);
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
    registerOption() {
        return (this.idCounter++).toString();
    }
    deregisterOption(id) {
        this.optionMap.delete(id);
    }
    updateOptionValue(id, value) {
        this.optionMap.set(id, value);
        if (this.selectedId === id) {
            this.fnChange(value);
        }
    }
    getOptionId(value) {
        for (const id of Array.from(this.optionMap.keys())) {
            if (this.optionMap.get(id) === value) {
                return id;
            }
        }
        return null;
    }
    static ɵfac = function SelectControlValueAccessorDirective_Factory(t) { return new (t || SelectControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: SelectControlValueAccessorDirective, selectors: [["select", "queryParamName", "", 3, "multiple", ""], ["select", "queryParam", "", 3, "multiple", ""]], hostBindings: function SelectControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function SelectControlValueAccessorDirective_change_HostBindingHandler($event) { return ctx.onChange($event); })("blur", function SelectControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onTouched(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_SELECT_VALUE_ACCESSOR])] });
}
export { SelectControlValueAccessorDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'select:not([multiple])[queryParamName],select:not([multiple])[queryParam]',
                providers: [NGQP_SELECT_VALUE_ACCESSOR],
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { onChange: [{
            type: HostListener,
            args: ['change', ['$event']]
        }], onTouched: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvYWNjZXNzb3JzL3NlbGVjdC1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFZLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFFMUMsY0FBYztBQUNkLE1BQU0sMEJBQTBCLEdBQWE7SUFDekMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO0lBQ2xFLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUVGLGNBQWM7QUFDZCxNQUlhLG1DQUFtQztJQXNCeEI7SUFBNkI7SUFwQjFDLEtBQUssR0FBYSxJQUFJLENBQUM7SUFDdEIsVUFBVSxHQUFrQixJQUFJLENBQUM7SUFDakMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFhLENBQUM7SUFFakMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNkLFFBQVEsR0FBRyxDQUFDLENBQVcsRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBQy9CLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFHdEIsUUFBUSxDQUFDLEtBQWM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBSSxLQUFLLENBQUMsTUFBNEIsQ0FBQyxLQUFLLENBQUM7UUFDNUQsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMs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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBIb3N0TGlzdGVuZXIsIFByb3ZpZGVyLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyB1bmRlZmluZWRUb051bGwgfSBmcm9tICcuLi91dGlsJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbmNvbnN0IE5HUVBfU0VMRUNUX1ZBTFVFX0FDQ0VTU09SOiBQcm92aWRlciA9IHtcclxuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUpLFxyXG4gICAgbXVsdGk6IHRydWVcclxufTtcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdzZWxlY3Q6bm90KFttdWx0aXBsZV0pW3F1ZXJ5UGFyYW1OYW1lXSxzZWxlY3Q6bm90KFttdWx0aXBsZV0pW3F1ZXJ5UGFyYW1dJyxcclxuICAgIHByb3ZpZGVyczogW05HUVBfU0VMRUNUX1ZBTFVFX0FDQ0VTU09SXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAgIHB1YmxpYyB2YWx1ZTogVCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgb3B0aW9uTWFwID0gbmV3IE1hcDxzdHJpbmcsIFQ+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSBpZENvdW50ZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBmbkNoYW5nZSA9IChfOiBUIHwgbnVsbCkgPT4ge307XHJcbiAgICBwcml2YXRlIGZuVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgb25DaGFuZ2UoZXZlbnQ6IFVJRXZlbnQpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSWQgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxPcHRpb25FbGVtZW50KS52YWx1ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkVG9OdWxsKHRoaXMub3B0aW9uTWFwLmdldCh0aGlzLnNlbGVjdGVkSWQpKTtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlKHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxyXG4gICAgcHVibGljIG9uVG91Y2hlZCgpIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxTZWxlY3RFbGVtZW50Pikge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBUIHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZElkID0gdmFsdWUgPT09IG51bGwgPyBudWxsIDogdGhpcy5nZXRPcHRpb25JZCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnc2VsZWN0ZWRJbmRleCcsIC0xKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHRoaXMuc2VsZWN0ZWRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuZm5DaGFuZ2UgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9wdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5pZENvdW50ZXIrKykudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVyZWdpc3Rlck9wdGlvbihpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25NYXAuZGVsZXRlKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlT3B0aW9uVmFsdWUoaWQ6IHN0cmluZywgdmFsdWU6IFQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9wdGlvbk1hcC5zZXQoaWQsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5mbkNoYW5nZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0T3B0aW9uSWQodmFsdWU6IFQpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIEFycmF5LmZyb20odGhpcy5vcHRpb25NYXAua2V5cygpKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25NYXAuZ2V0KGlkKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG59Il19