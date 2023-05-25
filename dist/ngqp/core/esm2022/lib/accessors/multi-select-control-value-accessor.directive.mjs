import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
const NGQP_MULTI_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class MultiSelectControlValueAccessorDirective {
    renderer;
    elementRef;
    selectedIds = [];
    options = new Map();
    optionMap = new Map();
    idCounter = 0;
    fnChange = (_) => { };
    fnTouched = () => { };
    onChange() {
        this.selectedIds = Array.from(this.options.entries())
            .filter(([id, option]) => option.selected)
            .map(([id]) => id);
        const values = this.selectedIds.map(id => this.optionMap.get(id));
        this.fnChange(values);
    }
    onTouched() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(values) {
        values = values === null ? [] : values;
        if (!Array.isArray(values)) {
            throw new Error(`Provided a non-array value to select[multiple]: ${values}`);
        }
        this.selectedIds = values
            .map(value => this.getOptionId(value))
            .filter((id) => id !== null);
        this.options.forEach((option, id) => option.selected = this.selectedIds.includes(id));
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
    registerOption(option) {
        const newId = (this.idCounter++).toString();
        this.options.set(newId, option);
        return newId;
    }
    deregisterOption(id) {
        this.optionMap.delete(id);
    }
    updateOptionValue(id, value) {
        this.optionMap.set(id, value);
        if (this.selectedIds.includes(id)) {
            this.onChange();
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
    static ɵfac = function MultiSelectControlValueAccessorDirective_Factory(t) { return new (t || MultiSelectControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: MultiSelectControlValueAccessorDirective, selectors: [["select", "multiple", "", "queryParamName", ""], ["select", "multiple", "", "queryParam", ""]], hostBindings: function MultiSelectControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function MultiSelectControlValueAccessorDirective_change_HostBindingHandler() { return ctx.onChange(); })("blur", function MultiSelectControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onTouched(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_MULTI_SELECT_VALUE_ACCESSOR])] });
}
export { MultiSelectControlValueAccessorDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MultiSelectControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'select[multiple][queryParamName],select[multiple][queryParam]',
                providers: [NGQP_MULTI_SELECT_VALUE_ACCESSOR],
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { onChange: [{
            type: HostListener,
            args: ['change']
        }], onTouched: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvYWNjZXNzb3JzL211bHRpLXNlbGVjdC1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFZLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBR3pFLGNBQWM7QUFDZCxNQUFNLGdDQUFnQyxHQUFhO0lBQy9DLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx3Q0FBd0MsQ0FBQztJQUN2RSxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFFRixjQUFjO0FBQ2QsTUFJYSx3Q0FBd0M7SUF3QjdCO0lBQTZCO0lBdEJ6QyxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBQzNCLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBeUMsQ0FBQztJQUMzRCxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWEsQ0FBQztJQUVqQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsUUFBUSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFDMUIsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUd0QixRQUFRO1FBQ1gsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDaEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDekMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUdNLFNBQVM7UUFDWixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFlBQW9CLFFBQW1CLEVBQVUsVUFBeUM7UUFBdEUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLGVBQVUsR0FBVixVQUFVLENBQStCO0lBQzFGLENBQUM7SUFFTSxVQUFVLENBQUMsTUFBVztRQUN6QixNQUFNLEdBQUcsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUNoRjtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTTthQUNwQixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3JDLE1BQU0sQ0FBQyxDQUFDLEVBQWlCLEVBQWdCLEVBQUUsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEVBQU87UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEVBQU87UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFVBQW1CO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRU0sY0FBYyxDQUFDLE1BQXFDO1FBQ3ZELE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFVO1FBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxFQUFVLEVBQUUsS0FBUTtRQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDbkI7SUFDTCxDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQVE7UUFDeEIsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNoRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRTtnQkFDbEMsT0FBTyxFQUFFLENBQUM7YUFDYjtTQUNKO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztrR0E1RVEsd0NBQXdDOzZEQUF4Qyx3Q0FBd0M7MkhBQXhDLGNBQVUsa0dBQVYsZUFBVzs4Q0FGVCxDQUFDLGdDQUFnQyxDQUFDOztTQUVwQyx3Q0FBd0M7dUZBQXhDLHdDQUF3QztjQUpwRCxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLCtEQUErRDtnQkFDekUsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7YUFDaEQ7cUZBWVUsUUFBUTtrQkFEZCxZQUFZO21CQUFDLFFBQVE7WUFVZixTQUFTO2tCQURmLFlBQVk7bUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBQcm92aWRlciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTXVsdGlTZWxlY3RPcHRpb25EaXJlY3RpdmUgfSBmcm9tICcuL211bHRpLXNlbGVjdC1vcHRpb24uZGlyZWN0aXZlJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbmNvbnN0IE5HUVBfTVVMVElfU0VMRUNUX1ZBTFVFX0FDQ0VTU09SOiBQcm92aWRlciA9IHtcclxuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTXVsdGlTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSksXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG59O1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ3NlbGVjdFttdWx0aXBsZV1bcXVlcnlQYXJhbU5hbWVdLHNlbGVjdFttdWx0aXBsZV1bcXVlcnlQYXJhbV0nLFxyXG4gICAgcHJvdmlkZXJzOiBbTkdRUF9NVUxUSV9TRUxFQ1RfVkFMVUVfQUNDRVNTT1JdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXVsdGlTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZTxUPiBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkSWRzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IE1hcDxzdHJpbmcsIE11bHRpU2VsZWN0T3B0aW9uRGlyZWN0aXZlPFQ+PigpO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25NYXAgPSBuZXcgTWFwPHN0cmluZywgVD4oKTtcclxuXHJcbiAgICBwcml2YXRlIGlkQ291bnRlciA9IDA7XHJcbiAgICBwcml2YXRlIGZuQ2hhbmdlID0gKF86IFRbXSkgPT4ge307XHJcbiAgICBwcml2YXRlIGZuVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScpXHJcbiAgICBwdWJsaWMgb25DaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZElkcyA9IEFycmF5LmZyb20odGhpcy5vcHRpb25zLmVudHJpZXMoKSlcclxuICAgICAgICAgICAgLmZpbHRlcigoW2lkLCBvcHRpb25dKSA9PiBvcHRpb24uc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgIC5tYXAoKFtpZF0pID0+IGlkKTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnNlbGVjdGVkSWRzLm1hcChpZCA9PiB0aGlzLm9wdGlvbk1hcC5nZXQoaWQpISk7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSh2YWx1ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxyXG4gICAgcHVibGljIG9uVG91Y2hlZCgpIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxTZWxlY3RFbGVtZW50Pikge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlczogVFtdKSB7XHJcbiAgICAgICAgdmFsdWVzID0gdmFsdWVzID09PSBudWxsID8gPFRbXT5bXSA6IHZhbHVlcztcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb3ZpZGVkIGEgbm9uLWFycmF5IHZhbHVlIHRvIHNlbGVjdFttdWx0aXBsZV06ICR7dmFsdWVzfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZElkcyA9IHZhbHVlc1xyXG4gICAgICAgICAgICAubWFwKHZhbHVlID0+IHRoaXMuZ2V0T3B0aW9uSWQodmFsdWUpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChpZDogc3RyaW5nIHwgbnVsbCk6IGlkIGlzIHN0cmluZyA9PiBpZCAhPT0gbnVsbCk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2goKG9wdGlvbiwgaWQpID0+IG9wdGlvbi5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRJZHMuaW5jbHVkZXMoaWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT3B0aW9uKG9wdGlvbjogTXVsdGlTZWxlY3RPcHRpb25EaXJlY3RpdmU8VD4pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG5ld0lkID0gKHRoaXMuaWRDb3VudGVyKyspLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNldChuZXdJZCwgb3B0aW9uKTtcclxuICAgICAgICByZXR1cm4gbmV3SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlcmVnaXN0ZXJPcHRpb24oaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3B0aW9uTWFwLmRlbGV0ZShpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZU9wdGlvblZhbHVlKGlkOiBzdHJpbmcsIHZhbHVlOiBUKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25NYXAuc2V0KGlkLCB2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJZHMuaW5jbHVkZXMoaWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRPcHRpb25JZCh2YWx1ZTogVCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgQXJyYXkuZnJvbSh0aGlzLm9wdGlvbk1hcC5rZXlzKCkpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbk1hcC5nZXQoaWQpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbn0iXX0=