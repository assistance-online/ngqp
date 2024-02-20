import { Directive, ElementRef, Host, Input, Optional, Renderer2 } from '@angular/core';
import { SelectControlValueAccessorDirective } from './select-control-value-accessor.directive';
import * as i0 from "@angular/core";
import * as i1 from "./select-control-value-accessor.directive";
/** @ignore */
export class SelectOptionDirective {
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectOptionDirective, [{
        type: Directive,
        args: [{
                selector: 'option',
            }]
    }], () => [{ type: i1.SelectControlValueAccessorDirective, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], { value: [{
            type: Input,
            args: ['value']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9hY2Nlc3NvcnMvc2VsZWN0LW9wdGlvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRyxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7O0FBRWhHLGNBQWM7QUFJZCxNQUFNLE9BQU8scUJBQXFCO0lBS0U7SUFDcEI7SUFDQTtJQUxLLEVBQUUsR0FBa0IsSUFBSSxDQUFDO0lBRTFDLFlBQ2dDLE1BQThDLEVBQ2xFLFFBQW1CLEVBQ25CLFVBQXNCO1FBRkYsV0FBTSxHQUFOLE1BQU0sQ0FBd0M7UUFDbEUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRTlCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvRSxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVc7UUFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUNXLEtBQUssQ0FBQyxLQUFRO1FBQ3JCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNMLENBQUM7K0VBakNRLHFCQUFxQjs2REFBckIscUJBQXFCOztpRkFBckIscUJBQXFCO2NBSGpDLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsUUFBUTthQUNyQjs7c0JBTVEsUUFBUTs7c0JBQUksSUFBSTtzRUF1QlYsS0FBSztrQkFEZixLQUFLO21CQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSB9IGZyb20gJy4vc2VsZWN0LWNvbnRyb2wtdmFsdWUtYWNjZXNzb3IuZGlyZWN0aXZlJztcclxuXHJcbi8qKiBAaWdub3JlICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdvcHRpb24nLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2VsZWN0T3B0aW9uRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgcHJpdmF0ZSBwYXJlbnQ6IFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlPFQ+LFxyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICApIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMucGFyZW50LnJlZ2lzdGVyT3B0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdGhpcy5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuZGVyZWdpc3Rlck9wdGlvbih0aGlzLmlkISk7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LndyaXRlVmFsdWUodGhpcy5wYXJlbnQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoJ3ZhbHVlJylcclxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IFQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQudXBkYXRlT3B0aW9uVmFsdWUodGhpcy5pZCEsIHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQud3JpdGVWYWx1ZSh0aGlzLnBhcmVudC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==