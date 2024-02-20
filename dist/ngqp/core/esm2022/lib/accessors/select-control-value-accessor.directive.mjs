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
export class SelectControlValueAccessorDirective {
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'select:not([multiple])[queryParamName],select:not([multiple])[queryParam]',
                providers: [NGQP_SELECT_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onChange: [{
            type: HostListener,
            args: ['change', ['$event']]
        }], onTouched: [{
            type: HostListener,
            args: ['blur']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvYWNjZXNzb3JzL3NlbGVjdC1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFZLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFFMUMsY0FBYztBQUNkLE1BQU0sMEJBQTBCLEdBQWE7SUFDekMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO0lBQ2xFLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUVGLGNBQWM7QUFLZCxNQUFNLE9BQU8sbUNBQW1DO0lBc0J4QjtJQUE2QjtJQXBCMUMsS0FBSyxHQUFhLElBQUksQ0FBQztJQUN0QixVQUFVLEdBQWtCLElBQUksQ0FBQztJQUNqQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWEsQ0FBQztJQUVqQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsUUFBUSxHQUFHLENBQUMsQ0FBVyxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFDL0IsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUd0QixRQUFRLENBQUMsS0FBYztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFJLEtBQUssQ0FBQyxNQUE0QixDQUFDLEtBQUssQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMs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U0FBUztrQkFEZixZQUFZO21CQUFDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEhvc3RMaXN0ZW5lciwgUHJvdmlkZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IHVuZGVmaW5lZFRvTnVsbCB9IGZyb20gJy4uL3V0aWwnO1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuY29uc3QgTkdRUF9TRUxFQ1RfVkFMVUVfQUNDRVNTT1I6IFByb3ZpZGVyID0ge1xyXG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSksXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG59O1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ3NlbGVjdDpub3QoW211bHRpcGxlXSlbcXVlcnlQYXJhbU5hbWVdLHNlbGVjdDpub3QoW211bHRpcGxlXSlbcXVlcnlQYXJhbV0nLFxyXG4gICAgcHJvdmlkZXJzOiBbTkdRUF9TRUxFQ1RfVkFMVUVfQUNDRVNTT1JdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmU8VD4gaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcblxyXG4gICAgcHVibGljIHZhbHVlOiBUIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25NYXAgPSBuZXcgTWFwPHN0cmluZywgVD4oKTtcclxuXHJcbiAgICBwcml2YXRlIGlkQ291bnRlciA9IDA7XHJcbiAgICBwcml2YXRlIGZuQ2hhbmdlID0gKF86IFQgfCBudWxsKSA9PiB7fTtcclxuICAgIHByaXZhdGUgZm5Ub3VjaGVkID0gKCkgPT4ge307XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQnXSlcclxuICAgIHB1YmxpYyBvbkNoYW5nZShldmVudDogVUlFdmVudCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJZCA9IChldmVudC50YXJnZXQgYXMgSFRNTE9wdGlvbkVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWRUb051bGwodGhpcy5vcHRpb25NYXAuZ2V0KHRoaXMuc2VsZWN0ZWRJZCkpO1xyXG4gICAgICAgIHRoaXMuZm5DaGFuZ2UodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignYmx1cicpXHJcbiAgICBwdWJsaWMgb25Ub3VjaGVkKCkge1xyXG4gICAgICAgIHRoaXMuZm5Ub3VjaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTFNlbGVjdEVsZW1lbnQ+KSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IFQgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkSWQgPSB2YWx1ZSA9PT0gbnVsbCA/IG51bGwgOiB0aGlzLmdldE9wdGlvbklkKHZhbHVlKTtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZElkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdzZWxlY3RlZEluZGV4JywgLTEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdGhpcy5zZWxlY3RlZElkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mbkNoYW5nZSA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5mblRvdWNoZWQgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyT3B0aW9uKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmlkQ291bnRlcisrKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXJlZ2lzdGVyT3B0aW9uKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9wdGlvbk1hcC5kZWxldGUoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVPcHRpb25WYWx1ZShpZDogc3RyaW5nLCB2YWx1ZTogVCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3B0aW9uTWFwLnNldChpZCwgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZElkID09PSBpZCkge1xyXG4gICAgICAgICAgICB0aGlzLmZuQ2hhbmdlKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRPcHRpb25JZCh2YWx1ZTogVCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgQXJyYXkuZnJvbSh0aGlzLm9wdGlvbk1hcC5rZXlzKCkpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbk1hcC5nZXQoaWQpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbn0iXX0=