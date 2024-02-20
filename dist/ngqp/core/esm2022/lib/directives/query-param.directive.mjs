import { Directive, Inject, Input, Optional, Self } from '@angular/core';
import { QueryParamGroupService } from './query-param-group.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { selectValueAccessor } from '../accessors/util';
import { QueryParamGroup } from '../model/query-param-group';
import * as i0 from "@angular/core";
import * as i1 from "./query-param-group.service";
/**
 * Binds a {@link QueryParam} to a component directly.
 *
 * This directive accepts a {@link QueryParam} without requiring an outer {@link QueryParamGroup}.
 * It binds this parameter to the host component, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
export class QueryParamDirective {
    groupService;
    /**
     * The {@link QueryParam} to bind to the host component.
     */
    queryParam = null;
    /** @internal */
    name = 'param';
    /** @internal */
    valueAccessor;
    /** @internal */
    group = new QueryParamGroup({});
    /** @internal */
    constructor(groupService, valueAccessors) {
        this.groupService = groupService;
        this.valueAccessor = selectValueAccessor(valueAccessors);
        this.groupService.setQueryParamGroup(this.group);
    }
    /** @ignore */
    ngOnChanges(changes) {
        const paramChange = changes['queryParam'];
        if (paramChange) {
            if (this.group.get(this.name)) {
                this.groupService.deregisterQueryParamDirective(this.name);
                this.group.remove(this.name);
            }
            if (paramChange.currentValue) {
                this.group.add(this.name, paramChange.currentValue);
                this.groupService.registerQueryParamDirective(this);
            }
        }
    }
    /** @ignore */
    ngOnDestroy() {
        if (this.groupService) {
            this.groupService.deregisterQueryParamDirective(this.name);
        }
    }
    static ɵfac = function QueryParamDirective_Factory(t) { return new (t || QueryParamDirective)(i0.ɵɵdirectiveInject(i1.QueryParamGroupService, 8), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamDirective, selectors: [["", "queryParam", ""]], inputs: { queryParam: "queryParam" }, features: [i0.ɵɵProvidersFeature([QueryParamGroupService]), i0.ɵɵNgOnChangesFeature] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParam]',
                providers: [QueryParamGroupService],
            }]
    }], () => [{ type: i1.QueryParamGroupService, decorators: [{
                type: Optional
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }], { queryParam: [{
            type: Input,
            args: ['queryParam']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvZGlyZWN0aXZlcy9xdWVyeS1wYXJhbS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUF3QixRQUFRLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUM5RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVyRSxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7QUFFN0Q7Ozs7OztHQU1HO0FBS0gsTUFBTSxPQUFPLG1CQUFtQjtJQW1CSjtJQWpCeEI7O09BRUc7SUFFSSxVQUFVLEdBQStCLElBQUksQ0FBQztJQUVyRCxnQkFBZ0I7SUFDQSxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBRS9CLGdCQUFnQjtJQUNULGFBQWEsQ0FBdUI7SUFFM0MsZ0JBQWdCO0lBQ1IsS0FBSyxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLGdCQUFnQjtJQUNoQixZQUN3QixZQUFvQyxFQUNULGNBQXNDO1FBRGpFLGlCQUFZLEdBQVosWUFBWSxDQUF3QjtRQUd4RCxJQUFJLENBQUMsYUFBYSxHQUFHLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxjQUFjO0lBQ1AsV0FBVyxDQUFDLE9BQXNCO1FBQ3JDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUxQyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBRUQsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsWUFBWSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELGNBQWM7SUFDUCxXQUFXO1FBQ2QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0QsQ0FBQztJQUNMLENBQUM7NkVBaERRLG1CQUFtQiwyRUFvQkksaUJBQWlCOzZEQXBCeEMsbUJBQW1CLDhHQUZqQixDQUFDLHNCQUFzQixDQUFDOztpRkFFMUIsbUJBQW1CO2NBSi9CLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7YUFDdEM7O3NCQW9CUSxRQUFROztzQkFDUixRQUFROztzQkFBSSxJQUFJOztzQkFBSSxNQUFNO3VCQUFDLGlCQUFpQjtxQkFkMUMsVUFBVTtrQkFEaEIsS0FBSzttQkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIFNlbGYsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwU2VydmljZSB9IGZyb20gJy4vcXVlcnktcGFyYW0tZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7IFF1ZXJ5UGFyYW1BY2Nlc3NvciB9IGZyb20gJy4vcXVlcnktcGFyYW0tYWNjZXNzb3IuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBzZWxlY3RWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi4vYWNjZXNzb3JzL3V0aWwnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtIH0gZnJvbSAnLi4vbW9kZWwvcXVlcnktcGFyYW0nO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtR3JvdXAgfSBmcm9tICcuLi9tb2RlbC9xdWVyeS1wYXJhbS1ncm91cCc7XHJcblxyXG4vKipcclxuICogQmluZHMgYSB7QGxpbmsgUXVlcnlQYXJhbX0gdG8gYSBjb21wb25lbnQgZGlyZWN0bHkuXHJcbiAqXHJcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgYSB7QGxpbmsgUXVlcnlQYXJhbX0gd2l0aG91dCByZXF1aXJpbmcgYW4gb3V0ZXIge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH0uXHJcbiAqIEl0IGJpbmRzIHRoaXMgcGFyYW1ldGVyIHRvIHRoZSBob3N0IGNvbXBvbmVudCwgd2hpY2ggaXMgcmVxdWlyZWQgdG8gaGF2ZSBhIFtDb250cm9sVmFsdWVBY2Nlc3Nvcl1cclxuICoge0BsaW5rIGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3J9LlxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1txdWVyeVBhcmFtXScsXHJcbiAgICBwcm92aWRlcnM6IFtRdWVyeVBhcmFtR3JvdXBTZXJ2aWNlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFF1ZXJ5UGFyYW1EaXJlY3RpdmUgaW1wbGVtZW50cyBRdWVyeVBhcmFtQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25EZXN0cm95ICB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUge0BsaW5rIFF1ZXJ5UGFyYW19IHRvIGJpbmQgdG8gdGhlIGhvc3QgY29tcG9uZW50LlxyXG4gICAgICovXHJcbiAgICBASW5wdXQoJ3F1ZXJ5UGFyYW0nKVxyXG4gICAgcHVibGljIHF1ZXJ5UGFyYW06IFF1ZXJ5UGFyYW08dW5rbm93bj4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9ICdwYXJhbSc7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHZhbHVlQWNjZXNzb3I6IENvbnRyb2xWYWx1ZUFjY2Vzc29yO1xyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHByaXZhdGUgZ3JvdXAgPSBuZXcgUXVlcnlQYXJhbUdyb3VwKHt9KTtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGdyb3VwU2VydmljZTogUXVlcnlQYXJhbUdyb3VwU2VydmljZSxcclxuICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMVUVfQUNDRVNTT1IpIHZhbHVlQWNjZXNzb3JzOiBDb250cm9sVmFsdWVBY2Nlc3NvcltdLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29ycyk7XHJcbiAgICAgICAgdGhpcy5ncm91cFNlcnZpY2Uuc2V0UXVlcnlQYXJhbUdyb3VwKHRoaXMuZ3JvdXApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtQ2hhbmdlID0gY2hhbmdlc1sncXVlcnlQYXJhbSddO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1DaGFuZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdXAuZ2V0KHRoaXMubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBTZXJ2aWNlLmRlcmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwLnJlbW92ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyYW1DaGFuZ2UuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwLmFkZCh0aGlzLm5hbWUsIHBhcmFtQ2hhbmdlLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwU2VydmljZS5yZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5ncm91cFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cFNlcnZpY2UuZGVyZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUodGhpcy5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59Il19