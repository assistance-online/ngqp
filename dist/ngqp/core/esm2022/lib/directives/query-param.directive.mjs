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
class QueryParamDirective {
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
export { QueryParamDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParam]',
                providers: [QueryParamGroupService],
            }]
    }], function () { return [{ type: i1.QueryParamGroupService, decorators: [{
                type: Optional
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }]; }, { queryParam: [{
            type: Input,
            args: ['queryParam']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvZGlyZWN0aXZlcy9xdWVyeS1wYXJhbS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUF3QixRQUFRLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUM5RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVyRSxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7QUFFN0Q7Ozs7OztHQU1HO0FBQ0gsTUFJYSxtQkFBbUI7SUFtQko7SUFqQnhCOztPQUVHO0lBRUksVUFBVSxHQUErQixJQUFJLENBQUM7SUFFckQsZ0JBQWdCO0lBQ0EsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUUvQixnQkFBZ0I7SUFDVCxhQUFhLENBQXVCO0lBRTNDLGdCQUFnQjtJQUNSLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV4QyxnQkFBZ0I7SUFDaEIsWUFDd0IsWUFBb0MsRUFDVCxjQUFzQztRQURqRSxpQkFBWSxHQUFaLFlBQVksQ0FBd0I7UUFHeEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsY0FBYztJQUNQLFdBQVcsQ0FBQyxPQUFzQjtRQUNyQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFMUMsSUFBSSxXQUFXLEVBQUU7WUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQztZQUVELElBQUksV0FBVyxDQUFDLFlBQVksRUFBRTtnQkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxZQUFZLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdkQ7U0FDSjtJQUNMLENBQUM7SUFFRCxjQUFjO0lBQ1AsV0FBVztRQUNkLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5RDtJQUNMLENBQUM7NkVBaERRLG1CQUFtQiwyRUFvQkksaUJBQWlCOzZEQXBCeEMsbUJBQW1CLDhHQUZqQixDQUFDLHNCQUFzQixDQUFDOztTQUUxQixtQkFBbUI7dUZBQW5CLG1CQUFtQjtjQUovQixTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQ3RDOztzQkFvQlEsUUFBUTs7c0JBQ1IsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksTUFBTTt1QkFBQyxpQkFBaUI7d0JBZDFDLFVBQVU7a0JBRGhCLEtBQUs7bUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBTZWxmLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2UgfSBmcm9tICcuL3F1ZXJ5LXBhcmFtLWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtQWNjZXNzb3IgfSBmcm9tICcuL3F1ZXJ5LXBhcmFtLWFjY2Vzc29yLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgc2VsZWN0VmFsdWVBY2Nlc3NvciB9IGZyb20gJy4uL2FjY2Vzc29ycy91dGlsJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbSB9IGZyb20gJy4uL21vZGVsL3F1ZXJ5LXBhcmFtJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwIH0gZnJvbSAnLi4vbW9kZWwvcXVlcnktcGFyYW0tZ3JvdXAnO1xyXG5cclxuLyoqXHJcbiAqIEJpbmRzIGEge0BsaW5rIFF1ZXJ5UGFyYW19IHRvIGEgY29tcG9uZW50IGRpcmVjdGx5LlxyXG4gKlxyXG4gKiBUaGlzIGRpcmVjdGl2ZSBhY2NlcHRzIGEge0BsaW5rIFF1ZXJ5UGFyYW19IHdpdGhvdXQgcmVxdWlyaW5nIGFuIG91dGVyIHtAbGluayBRdWVyeVBhcmFtR3JvdXB9LlxyXG4gKiBJdCBiaW5kcyB0aGlzIHBhcmFtZXRlciB0byB0aGUgaG9zdCBjb21wb25lbnQsIHdoaWNoIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBbQ29udHJvbFZhbHVlQWNjZXNzb3JdXHJcbiAqIHtAbGluayBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yfS5cclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbcXVlcnlQYXJhbV0nLFxyXG4gICAgcHJvdmlkZXJzOiBbUXVlcnlQYXJhbUdyb3VwU2VydmljZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBRdWVyeVBhcmFtRGlyZWN0aXZlIGltcGxlbWVudHMgUXVlcnlQYXJhbUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uRGVzdHJveSAge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHtAbGluayBRdWVyeVBhcmFtfSB0byBiaW5kIHRvIHRoZSBob3N0IGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgQElucHV0KCdxdWVyeVBhcmFtJylcclxuICAgIHB1YmxpYyBxdWVyeVBhcmFtOiBRdWVyeVBhcmFtPHVua25vd24+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSAncGFyYW0nO1xyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyB2YWx1ZUFjY2Vzc29yOiBDb250cm9sVmFsdWVBY2Nlc3NvcjtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwcml2YXRlIGdyb3VwID0gbmV3IFF1ZXJ5UGFyYW1Hcm91cCh7fSk7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBncm91cFNlcnZpY2U6IFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2UsXHJcbiAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKSB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMudmFsdWVBY2Nlc3NvciA9IHNlbGVjdFZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3NvcnMpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBTZXJ2aWNlLnNldFF1ZXJ5UGFyYW1Hcm91cCh0aGlzLmdyb3VwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBwYXJhbUNoYW5nZSA9IGNoYW5nZXNbJ3F1ZXJ5UGFyYW0nXTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3VwLmdldCh0aGlzLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwU2VydmljZS5kZXJlZ2lzdGVyUXVlcnlQYXJhbURpcmVjdGl2ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cC5yZW1vdmUodGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmFtQ2hhbmdlLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cC5hZGQodGhpcy5uYW1lLCBwYXJhbUNoYW5nZS5jdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cFNlcnZpY2UucmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ3JvdXBTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBTZXJ2aWNlLmRlcmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKHRoaXMubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==