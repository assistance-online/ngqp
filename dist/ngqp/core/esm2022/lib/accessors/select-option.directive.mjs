import { Directive, ElementRef, Host, Input, Optional, Renderer2 } from '@angular/core';
import { SelectControlValueAccessorDirective } from './select-control-value-accessor.directive';
import * as i0 from "@angular/core";
import * as i1 from "./select-control-value-accessor.directive";
/** @ignore */
class SelectOptionDirective {
    parent;
    renderer;
    elementRef;
    id = null;
    constructor(parent, renderer, elementRef) {
        this.parent = parent;
        this.renderer = renderer;
        this.elementRef = elementRef;
        if (this.parent) {
            this.id = this.parent.registerOption();
        }
    }
    ngOnInit() {
        if (this.parent) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.id);
        }
    }
    ngOnDestroy() {
        if (this.parent) {
            this.parent.deregisterOption(this.id);
            this.parent.writeValue(this.parent.value);
        }
    }
    set value(value) {
        if (this.parent) {
            this.parent.updateOptionValue(this.id, value);
            this.parent.writeValue(this.parent.value);
        }
    }
    static ɵfac = function SelectOptionDirective_Factory(t) { return new (t || SelectOptionDirective)(i0.ɵɵdirectiveInject(i1.SelectControlValueAccessorDirective, 9), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: SelectOptionDirective, selectors: [["option"]], inputs: { value: "value" } });
}
export { SelectOptionDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectOptionDirective, [{
        type: Directive,
        args: [{
                selector: 'option',
            }]
    }], function () { return [{ type: i1.SelectControlValueAccessorDirective, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { value: [{
            type: Input,
            args: ['value']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9hY2Nlc3NvcnMvc2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRyxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7O0FBRWhHLGNBQWM7QUFDZCxNQUdhLHFCQUFxQjtJQUtFO0lBQ3BCO0lBQ0E7SUFMSyxFQUFFLEdBQWtCLElBQUksQ0FBQztJQUUxQyxZQUNnQyxNQUE4QyxFQUNsRSxRQUFtQixFQUNuQixVQUFzQjtRQUZGLFdBQU0sR0FBTixNQUFNLENBQXdDO1FBQ2xFLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUU5QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDMUM7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDOUU7SUFDTCxDQUFDO0lBRU0sV0FBVztRQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0M7SUFDTCxDQUFDO0lBRUQsSUFDVyxLQUFLLENBQUMsS0FBUTtRQUNyQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7K0VBakNRLHFCQUFxQjs2REFBckIscUJBQXFCOztTQUFyQixxQkFBcUI7dUZBQXJCLHFCQUFxQjtjQUhqQyxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLFFBQVE7YUFDckI7O3NCQU1RLFFBQVE7O3NCQUFJLElBQUk7eUVBdUJWLEtBQUs7a0JBRGYsS0FBSzttQkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUgfSBmcm9tICcuL3NlbGVjdC1jb250cm9sLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZSc7XHJcblxyXG4vKiogQGlnbm9yZSAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnb3B0aW9uJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNlbGVjdE9wdGlvbkRpcmVjdGl2ZTxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHByaXZhdGUgcGFyZW50OiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZTxUPixcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnBhcmVudC5yZWdpc3Rlck9wdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHRoaXMuaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmRlcmVnaXN0ZXJPcHRpb24odGhpcy5pZCEpO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC53cml0ZVZhbHVlKHRoaXMucGFyZW50LnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCd2YWx1ZScpXHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBUKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnVwZGF0ZU9wdGlvblZhbHVlKHRoaXMuaWQhLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LndyaXRlVmFsdWUodGhpcy5wYXJlbnQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXX0=