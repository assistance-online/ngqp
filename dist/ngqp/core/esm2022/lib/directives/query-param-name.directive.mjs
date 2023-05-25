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
class QueryParamNameDirective {
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
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamNameDirective, selectors: [["", "queryParamName", ""]], inputs: { name: ["queryParamName", "name"] }, features: [i0.ɵɵNgOnChangesFeature] });
}
export { QueryParamNameDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamNameDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParamName]',
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
            }] }]; }, { name: [{
            type: Input,
            args: ['queryParamName']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tbmFtZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3FwL2NvcmUvc3JjL2xpYi9kaXJlY3RpdmVzL3F1ZXJ5LXBhcmFtLW5hbWUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDOUcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7QUFFeEQ7Ozs7OztHQU1HO0FBQ0gsTUFHYSx1QkFBdUI7SUEwQlI7SUF4QnhCOzs7T0FHRztJQUNILElBQ1csSUFBSSxDQUFDLElBQVk7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQVcsSUFBSTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1NBQzVEO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxnQkFBZ0I7SUFDVCxhQUFhLENBQXVCO0lBRW5DLEtBQUssR0FBa0IsSUFBSSxDQUFDO0lBRXBDLGdCQUFnQjtJQUNoQixZQUN3QixZQUFvQyxFQUNULGNBQXNDO1FBRGpFLGlCQUFZLEdBQVosWUFBWSxDQUF3QjtRQUd4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7U0FDOUY7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxjQUFjO0lBQ1AsV0FBVyxDQUFDLE9BQXNCO1FBQ3JDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxJQUFJLFVBQVUsRUFBRTtZQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFO2dCQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUM3RTtZQUVELElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtnQkFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2RDtTQUNKO0lBQ0wsQ0FBQztJQUVELGNBQWM7SUFDUCxXQUFXO1FBQ2QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlEO0lBQ0wsQ0FBQztpRkF2RFEsdUJBQXVCLDJFQTJCQSxpQkFBaUI7NkRBM0J4Qyx1QkFBdUI7O1NBQXZCLHVCQUF1Qjt1RkFBdkIsdUJBQXVCO2NBSG5DLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsa0JBQWtCO2FBQy9COztzQkEyQlEsUUFBUTs7c0JBQ1IsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksTUFBTTt1QkFBQyxpQkFBaUI7d0JBcEJ0QyxJQUFJO2tCQURkLEtBQUs7bUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIFNlbGYsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtR3JvdXBTZXJ2aWNlIH0gZnJvbSAnLi9xdWVyeS1wYXJhbS1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUFjY2Vzc29yIH0gZnJvbSAnLi9xdWVyeS1wYXJhbS1hY2Nlc3Nvci5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBzZWxlY3RWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi4vYWNjZXNzb3JzL3V0aWwnO1xyXG5cclxuLyoqXHJcbiAqIEJpbmRzIGEge0BsaW5rIFF1ZXJ5UGFyYW19IHRvIGEgRE9NIGVsZW1lbnQuXHJcbiAqXHJcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgdGhlIG5hbWUgb2YgYSB7QGxpbmsgUXVlcnlQYXJhbX0gaW5zaWRlIGl0cyBwYXJlbnQge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH0uXHJcbiAqIEl0IGJpbmRzIHRoaXMgcGFyYW1ldGVyIHRvIHRoZSBob3N0IGVsZW1lbnQsIHdoaWNoIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBbQ29udHJvbFZhbHVlQWNjZXNzb3JdXHJcbiAqIHtAbGluayBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yfS5cclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbcXVlcnlQYXJhbU5hbWVdJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIFF1ZXJ5UGFyYW1OYW1lRGlyZWN0aXZlIGltcGxlbWVudHMgUXVlcnlQYXJhbUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUge0BsaW5rIFF1ZXJ5UGFyYW19IGluc2lkZSBpdHMgcGFyZW50IHtAbGluayBRdWVyeVBhcmFtR3JvdXB9LlxyXG4gICAgICogTm90ZSB0aGF0IHRoaXMgZG9lcyBub3QgcmVmZXIgdG8gdGhlIFtwYXJhbWV0ZXIgbmFtZV17QGxpbmsgUXVlcnlQYXJhbSN1cmxQYXJhbX0uXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgncXVlcnlQYXJhbU5hbWUnKVxyXG4gICAgcHVibGljIHNldCBuYW1lKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHF1ZXJ5UGFyYW1OYW1lIGhhcyBiZWVuIHNwZWNpZmllZC5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyB2YWx1ZUFjY2Vzc29yOiBDb250cm9sVmFsdWVBY2Nlc3NvcjtcclxuXHJcbiAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGdyb3VwU2VydmljZTogUXVlcnlQYXJhbUdyb3VwU2VydmljZSxcclxuICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMVUVfQUNDRVNTT1IpIHZhbHVlQWNjZXNzb3JzOiBDb250cm9sVmFsdWVBY2Nlc3NvcltdLFxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdyb3VwU2VydmljZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHBhcmVudCBjb25maWd1cmF0aW9uIGZvdW5kLiBEaWQgeW91IGZvcmdldCB0byBhZGQgW3F1ZXJ5UGFyYW1Hcm91cF0/YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHZhbHVlQWNjZXNzb3JzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBjb25zdCBuYW1lQ2hhbmdlID0gY2hhbmdlc1snbmFtZSddO1xyXG4gICAgICAgIGlmIChuYW1lQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZUNoYW5nZS5maXJzdENoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cFNlcnZpY2UuZGVyZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUobmFtZUNoYW5nZS5wcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5hbWVDaGFuZ2UuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwU2VydmljZS5yZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpZ25vcmUgKi9cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5ncm91cFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cFNlcnZpY2UuZGVyZWdpc3RlclF1ZXJ5UGFyYW1EaXJlY3RpdmUodGhpcy5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==