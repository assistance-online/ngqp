import { Directive, ElementRef, Host, Input, Optional, Renderer2 } from '@angular/core';
import { MultiSelectControlValueAccessorDirective } from './multi-select-control-value-accessor.directive';
import * as i0 from "@angular/core";
import * as i1 from "./multi-select-control-value-accessor.directive";
/** @ignore */
export class MultiSelectOptionDirective {
    parent;
    renderer;
    elementRef;
    id = null;
    constructor(parent, renderer, elementRef) {
        this.parent = parent;
        this.renderer = renderer;
        this.elementRef = elementRef;
        if (this.parent) {
            this.id = this.parent.registerOption(this);
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
        }
    }
    set value(value) {
        if (this.parent) {
            this.parent.updateOptionValue(this.id, value);
        }
    }
    get selected() {
        return this.elementRef.nativeElement.selected;
    }
    set selected(selected) {
        if (this.parent) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'selected', selected);
        }
    }
    static ɵfac = function MultiSelectOptionDirective_Factory(t) { return new (t || MultiSelectOptionDirective)(i0.ɵɵdirectiveInject(i1.MultiSelectControlValueAccessorDirective, 9), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: MultiSelectOptionDirective, selectors: [["option"]], inputs: { value: "value" } });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MultiSelectOptionDirective, [{
        type: Directive,
        args: [{
                selector: 'option',
            }]
    }], () => [{ type: i1.MultiSelectControlValueAccessorDirective, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], { value: [{
            type: Input,
            args: ['value']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9hY2Nlc3NvcnMvbXVsdGktc2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRyxPQUFPLEVBQUUsd0NBQXdDLEVBQUUsTUFBTSxpREFBaUQsQ0FBQzs7O0FBRTNHLGNBQWM7QUFJZCxNQUFNLE9BQU8sMEJBQTBCO0lBS0g7SUFDcEI7SUFDQTtJQUxLLEVBQUUsR0FBa0IsSUFBSSxDQUFDO0lBRTFDLFlBQ2dDLE1BQW1ELEVBQ3ZFLFFBQW1CLEVBQ25CLFVBQXNCO1FBRkYsV0FBTSxHQUFOLE1BQU0sQ0FBNkM7UUFDdkUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRTlCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQztJQUNMLENBQUM7SUFFTSxXQUFXO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFHLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQ1csS0FBSyxDQUFDLEtBQVE7UUFDckIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFXLFFBQVE7UUFDZixPQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBbUMsQ0FBQyxRQUFRLENBQUM7SUFDekUsQ0FBQztJQUVELElBQVcsUUFBUSxDQUFDLFFBQWlCO1FBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25GLENBQUM7SUFDTCxDQUFDO29GQXpDUSwwQkFBMEI7NkRBQTFCLDBCQUEwQjs7aUZBQTFCLDBCQUEwQjtjQUh0QyxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLFFBQVE7YUFDckI7O3NCQU1RLFFBQVE7O3NCQUFJLElBQUk7c0VBc0JWLEtBQUs7a0JBRGYsS0FBSzttQkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTXVsdGlTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSB9IGZyb20gJy4vbXVsdGktc2VsZWN0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdvcHRpb24nLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXVsdGlTZWxlY3RPcHRpb25EaXJlY3RpdmU8VD4gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBwcml2YXRlIHBhcmVudDogTXVsdGlTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZTxUPixcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnBhcmVudC5yZWdpc3Rlck9wdGlvbih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB0aGlzLmlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5kZXJlZ2lzdGVyT3B0aW9uKHRoaXMuaWQhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCd2YWx1ZScpXHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBUKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnVwZGF0ZU9wdGlvblZhbHVlKHRoaXMuaWQhLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MT3B0aW9uRWxlbWVudCkuc2VsZWN0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzZWxlY3RlZChzZWxlY3RlZDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnc2VsZWN0ZWQnLCBzZWxlY3RlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==