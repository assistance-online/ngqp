import { Directive, Inject, Input, Optional, Self } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { QueryParamGroupService } from './query-param-group.service';
import { selectValueAccessor } from '../accessors/util';
import * as i0 from "@angular/core";
import * as i1 from "./query-param-group.service";
/**
 * Binds a {@link QueryParam} to a DOM element.
 *
 * This directive accepts the name of a {@link QueryParam} inside its parent {@link QueryParamGroup}.
 * It binds this parameter to the host element, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
export class QueryParamNameDirective {
    groupService;
    /**
     * The name of the {@link QueryParam} inside its parent {@link QueryParamGroup}.
     * Note that this does not refer to the [parameter name]{@link QueryParam#urlParam}.
     */
    set name(name) {
        this._name = name;
    }
    get name() {
        if (!this._name) {
            throw new Error(`No queryParamName has been specified.`);
        }
        return this._name;
    }
    /** @internal */
    valueAccessor;
    _name = null;
    /** @internal */
    constructor(groupService, valueAccessors) {
        this.groupService = groupService;
        if (!this.groupService) {
            throw new Error(`No parent configuration found. Did you forget to add [queryParamGroup]?`);
        }
        this.valueAccessor = selectValueAccessor(valueAccessors);
    }
    /** @ignore */
    ngOnChanges(changes) {
        const nameChange = changes['name'];
        if (nameChange) {
            if (!nameChange.firstChange) {
                this.groupService.deregisterQueryParamDirective(nameChange.previousValue);
            }
            if (nameChange.currentValue) {
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
    static ɵfac = function QueryParamNameDirective_Factory(t) { return new (t || QueryParamNameDirective)(i0.ɵɵdirectiveInject(i1.QueryParamGroupService, 8), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamNameDirective, selectors: [["", "queryParamName", ""]], inputs: { name: [i0.ɵɵInputFlags.None, "queryParamName", "name"] }, features: [i0.ɵɵNgOnChangesFeature] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamNameDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParamName]',
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
            }] }], { name: [{
            type: Input,
            args: ['queryParamName']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tbmFtZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9kaXJlY3RpdmVzL3F1ZXJ5LXBhcmFtLW5hbWUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDOUcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7QUFFeEQ7Ozs7OztHQU1HO0FBSUgsTUFBTSxPQUFPLHVCQUF1QjtJQTBCUjtJQXhCeEI7OztPQUdHO0lBQ0gsSUFDVyxJQUFJLENBQUMsSUFBWTtRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBVyxJQUFJO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxhQUFhLENBQXVCO0lBRW5DLEtBQUssR0FBa0IsSUFBSSxDQUFDO0lBRXBDLGdCQUFnQjtJQUNoQixZQUN3QixZQUFvQyxFQUNULGNBQXNDO1FBRGpFLGlCQUFZLEdBQVosWUFBWSxDQUF3QjtRQUd4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMseUVBQXlFLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsY0FBYztJQUNQLFdBQVcsQ0FBQyxPQUFzQjtRQUNyQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsNkJBQTZCLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlFLENBQUM7WUFFRCxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxjQUFjO0lBQ1AsV0FBVztRQUNkLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELENBQUM7SUFDTCxDQUFDO2lGQXZEUSx1QkFBdUIsMkVBMkJBLGlCQUFpQjs2REEzQnhDLHVCQUF1Qjs7aUZBQXZCLHVCQUF1QjtjQUhuQyxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjthQUMvQjs7c0JBMkJRLFFBQVE7O3NCQUNSLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsaUJBQWlCO3FCQXBCdEMsSUFBSTtrQkFEZCxLQUFLO21CQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBTZWxmLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwU2VydmljZSB9IGZyb20gJy4vcXVlcnktcGFyYW0tZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7IFF1ZXJ5UGFyYW1BY2Nlc3NvciB9IGZyb20gJy4vcXVlcnktcGFyYW0tYWNjZXNzb3IuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgc2VsZWN0VmFsdWVBY2Nlc3NvciB9IGZyb20gJy4uL2FjY2Vzc29ycy91dGlsJztcclxuXHJcbi8qKlxyXG4gKiBCaW5kcyBhIHtAbGluayBRdWVyeVBhcmFtfSB0byBhIERPTSBlbGVtZW50LlxyXG4gKlxyXG4gKiBUaGlzIGRpcmVjdGl2ZSBhY2NlcHRzIHRoZSBuYW1lIG9mIGEge0BsaW5rIFF1ZXJ5UGFyYW19IGluc2lkZSBpdHMgcGFyZW50IHtAbGluayBRdWVyeVBhcmFtR3JvdXB9LlxyXG4gKiBJdCBiaW5kcyB0aGlzIHBhcmFtZXRlciB0byB0aGUgaG9zdCBlbGVtZW50LCB3aGljaCBpcyByZXF1aXJlZCB0byBoYXZlIGEgW0NvbnRyb2xWYWx1ZUFjY2Vzc29yXVxyXG4gKiB7QGxpbmsgaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Db250cm9sVmFsdWVBY2Nlc3Nvcn0uXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3F1ZXJ5UGFyYW1OYW1lXScsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBRdWVyeVBhcmFtTmFtZURpcmVjdGl2ZSBpbXBsZW1lbnRzIFF1ZXJ5UGFyYW1BY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHtAbGluayBRdWVyeVBhcmFtfSBpbnNpZGUgaXRzIHBhcmVudCB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfS5cclxuICAgICAqIE5vdGUgdGhhdCB0aGlzIGRvZXMgbm90IHJlZmVyIHRvIHRoZSBbcGFyYW1ldGVyIG5hbWVde0BsaW5rIFF1ZXJ5UGFyYW0jdXJsUGFyYW19LlxyXG4gICAgICovXHJcbiAgICBASW5wdXQoJ3F1ZXJ5UGFyYW1OYW1lJylcclxuICAgIHB1YmxpYyBzZXQgbmFtZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBxdWVyeVBhcmFtTmFtZSBoYXMgYmVlbiBzcGVjaWZpZWQuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgdmFsdWVBY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3I7XHJcblxyXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBncm91cFNlcnZpY2U6IFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2UsXHJcbiAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKSB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSxcclxuICAgICkge1xyXG4gICAgICAgIGlmICghdGhpcy5ncm91cFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBwYXJlbnQgY29uZmlndXJhdGlvbiBmb3VuZC4gRGlkIHlvdSBmb3JnZXQgdG8gYWRkIFtxdWVyeVBhcmFtR3JvdXBdP2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29ycyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZUNoYW5nZSA9IGNoYW5nZXNbJ25hbWUnXTtcclxuICAgICAgICBpZiAobmFtZUNoYW5nZSkge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVDaGFuZ2UuZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBTZXJ2aWNlLmRlcmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKG5hbWVDaGFuZ2UucHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChuYW1lQ2hhbmdlLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cFNlcnZpY2UucmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ3JvdXBTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBTZXJ2aWNlLmRlcmVnaXN0ZXJRdWVyeVBhcmFtRGlyZWN0aXZlKHRoaXMubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=