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
export class MultiSelectControlValueAccessorDirective {
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MultiSelectControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'select[multiple][queryParamName],select[multiple][queryParam]',
                providers: [NGQP_MULTI_SELECT_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onChange: [{
            type: HostListener,
            args: ['change']
        }], onTouched: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvYWNjZXNzb3JzL211bHRpLXNlbGVjdC1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFZLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBR3pFLGNBQWM7QUFDZCxNQUFNLGdDQUFnQyxHQUFhO0lBQy9DLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx3Q0FBd0MsQ0FBQztJQUN2RSxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFFRixjQUFjO0FBS2QsTUFBTSxPQUFPLHdDQUF3QztJQXdCN0I7SUFBNkI7SUF0QnpDLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFDM0IsT0FBTyxHQUFHLElBQUksR0FBRyxFQUF5QyxDQUFDO0lBQzNELFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBRWpDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxRQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUMxQixTQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBR3RCLFFBQVE7UUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNoRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxF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RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztrR0E1RVEsd0NBQXdDOzZEQUF4Qyx3Q0FBd0M7MkhBQXhDLGNBQVUsa0dBQVYsZUFBVzs4Q0FGVCxDQUFDLGdDQUFnQyxDQUFDOztpRkFFcEMsd0NBQXdDO2NBSnBELFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsK0RBQStEO2dCQUN6RSxTQUFTLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQzthQUNoRDttRUFZVSxRQUFRO2tCQURkLFlBQVk7bUJBQUMsUUFBUTtZQVVmLFNBQVM7a0JBRGYsWUFBWTttQkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBIb3N0TGlzdGVuZXIsIFByb3ZpZGVyLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNdWx0aVNlbGVjdE9wdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4vbXVsdGktc2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUnO1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuY29uc3QgTkdRUF9NVUxUSV9TRUxFQ1RfVkFMVUVfQUNDRVNTT1I6IFByb3ZpZGVyID0ge1xyXG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNdWx0aVNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlKSxcclxuICAgIG11bHRpOiB0cnVlXHJcbn07XHJcblxyXG4vKiogQGlnbm9yZSAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnc2VsZWN0W211bHRpcGxlXVtxdWVyeVBhcmFtTmFtZV0sc2VsZWN0W211bHRpcGxlXVtxdWVyeVBhcmFtXScsXHJcbiAgICBwcm92aWRlcnM6IFtOR1FQX01VTFRJX1NFTEVDVF9WQUxVRV9BQ0NFU1NPUl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNdWx0aVNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRJZHM6IHN0cmluZ1tdID0gW107XHJcbiAgICBwcml2YXRlIG9wdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgTXVsdGlTZWxlY3RPcHRpb25EaXJlY3RpdmU8VD4+KCk7XHJcbiAgICBwcml2YXRlIG9wdGlvbk1hcCA9IG5ldyBNYXA8c3RyaW5nLCBUPigpO1xyXG5cclxuICAgIHByaXZhdGUgaWRDb3VudGVyID0gMDtcclxuICAgIHByaXZhdGUgZm5DaGFuZ2UgPSAoXzogVFtdKSA9PiB7fTtcclxuICAgIHByaXZhdGUgZm5Ub3VjaGVkID0gKCkgPT4ge307XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJylcclxuICAgIHB1YmxpYyBvbkNoYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSWRzID0gQXJyYXkuZnJvbSh0aGlzLm9wdGlvbnMuZW50cmllcygpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChbaWQsIG9wdGlvbl0pID0+IG9wdGlvbi5zZWxlY3RlZClcclxuICAgICAgICAgICAgLm1hcCgoW2lkXSkgPT4gaWQpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuc2VsZWN0ZWRJZHMubWFwKGlkID0+IHRoaXMub3B0aW9uTWFwLmdldChpZCkhKTtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlKHZhbHVlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignYmx1cicpXHJcbiAgICBwdWJsaWMgb25Ub3VjaGVkKCkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTFNlbGVjdEVsZW1lbnQ+KSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWVzOiBUW10pIHtcclxuICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMgPT09IG51bGwgPyA8VFtdPltdIDogdmFsdWVzO1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUHJvdmlkZWQgYSBub24tYXJyYXkgdmFsdWUgdG8gc2VsZWN0W211bHRpcGxlXTogJHt2YWx1ZXN9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkSWRzID0gdmFsdWVzXHJcbiAgICAgICAgICAgIC5tYXAodmFsdWUgPT4gdGhpcy5nZXRPcHRpb25JZCh2YWx1ZSkpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGlkOiBzdHJpbmcgfCBudWxsKTogaWQgaXMgc3RyaW5nID0+IGlkICE9PSBudWxsKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaCgob3B0aW9uLCBpZCkgPT4gb3B0aW9uLnNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZElkcy5pbmNsdWRlcyhpZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmZuQ2hhbmdlID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmZuVG91Y2hlZCA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPcHRpb24ob3B0aW9uOiBNdWx0aVNlbGVjdE9wdGlvbkRpcmVjdGl2ZTxUPik6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbmV3SWQgPSAodGhpcy5pZENvdW50ZXIrKykudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2V0KG5ld0lkLCBvcHRpb24pO1xyXG4gICAgICAgIHJldHVybiBuZXdJZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVyZWdpc3Rlck9wdGlvbihpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25NYXAuZGVsZXRlKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlT3B0aW9uVmFsdWUoaWQ6IHN0cmluZywgdmFsdWU6IFQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9wdGlvbk1hcC5zZXQoaWQsIHZhbHVlKTtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZElkcy5pbmNsdWRlcyhpZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE9wdGlvbklkKHZhbHVlOiBUKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBBcnJheS5mcm9tKHRoaXMub3B0aW9uTWFwLmtleXMoKSkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uTWFwLmdldChpZCkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxufSJdfQ==