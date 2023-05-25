import { Directive, Input } from '@angular/core';
import { QueryParamGroupService } from './query-param-group.service';
import * as i0 from "@angular/core";
import * as i1 from "./query-param-group.service";
/**
 * Binds a {@link QueryParamGroup} to a DOM element.
 *
 * This directive accepts an instance of {@link QueryParamGroup}. Any child using
 * {@link QueryParamNameDirective} will then be matched against this group, and the
 * synchronization process can take place.
 */
class QueryParamGroupDirective {
    groupService;
    /**
     * The {@link QueryParamGroup} to bind.
     */
    queryParamGroup = null;
    /** @internal */
    constructor(groupService) {
        this.groupService = groupService;
    }
    /** @ignore */
    ngOnChanges(changes) {
        const groupChange = changes['queryParamGroup'];
        if (groupChange) {
            if (!groupChange.firstChange) {
                throw new Error(`Binding a different QueryParamGroup during runtime is currently not supported.`);
            }
            const queryParamGroup = groupChange.currentValue;
            if (!queryParamGroup) {
                throw new Error(`You added the queryParamGroup directive, but haven't supplied a group to use.`);
            }
            this.groupService.setQueryParamGroup(queryParamGroup);
        }
    }
    static ɵfac = function QueryParamGroupDirective_Factory(t) { return new (t || QueryParamGroupDirective)(i0.ɵɵdirectiveInject(i1.QueryParamGroupService)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamGroupDirective, selectors: [["", "queryParamGroup", ""]], inputs: { queryParamGroup: "queryParamGroup" }, features: [i0.ɵɵProvidersFeature([QueryParamGroupService]), i0.ɵɵNgOnChangesFeature] });
}
export { QueryParamGroupDirective };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamGroupDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParamGroup]',
                providers: [QueryParamGroupService],
            }]
    }], function () { return [{ type: i1.QueryParamGroupService }]; }, { queryParamGroup: [{
            type: Input,
            args: ['queryParamGroup']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tZ3JvdXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvZGlyZWN0aXZlcy9xdWVyeS1wYXJhbS1ncm91cC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBRzNFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7QUFFckU7Ozs7OztHQU1HO0FBQ0gsTUFJYSx3QkFBd0I7SUFTYjtJQVBwQjs7T0FFRztJQUVJLGVBQWUsR0FBMkIsSUFBSSxDQUFDO0lBRXRELGdCQUFnQjtJQUNoQixZQUFvQixZQUFvQztRQUFwQyxpQkFBWSxHQUFaLFlBQVksQ0FBd0I7SUFDeEQsQ0FBQztJQUVELGNBQWM7SUFDUCxXQUFXLENBQUMsT0FBc0I7UUFDckMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0MsSUFBSSxXQUFXLEVBQUU7WUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO2FBQ3JHO1lBRUQsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQztZQUNqRCxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7YUFDcEc7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQztrRkEzQlEsd0JBQXdCOzZEQUF4Qix3QkFBd0IsNkhBRnRCLENBQUMsc0JBQXNCLENBQUM7O1NBRTFCLHdCQUF3Qjt1RkFBeEIsd0JBQXdCO2NBSnBDLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUN0Qzt5RUFPVSxlQUFlO2tCQURyQixLQUFLO21CQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtTmFtZURpcmVjdGl2ZSB9IGZyb20gJy4vcXVlcnktcGFyYW0tbmFtZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtR3JvdXAgfSBmcm9tICcuLi9tb2RlbC9xdWVyeS1wYXJhbS1ncm91cCc7XHJcbmltcG9ydCB7IFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2UgfSBmcm9tICcuL3F1ZXJ5LXBhcmFtLWdyb3VwLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEJpbmRzIGEge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH0gdG8gYSBET00gZWxlbWVudC5cclxuICpcclxuICogVGhpcyBkaXJlY3RpdmUgYWNjZXB0cyBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfS4gQW55IGNoaWxkIHVzaW5nXHJcbiAqIHtAbGluayBRdWVyeVBhcmFtTmFtZURpcmVjdGl2ZX0gd2lsbCB0aGVuIGJlIG1hdGNoZWQgYWdhaW5zdCB0aGlzIGdyb3VwLCBhbmQgdGhlXHJcbiAqIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGNhbiB0YWtlIHBsYWNlLlxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1txdWVyeVBhcmFtR3JvdXBdJyxcclxuICAgIHByb3ZpZGVyczogW1F1ZXJ5UGFyYW1Hcm91cFNlcnZpY2VdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUXVlcnlQYXJhbUdyb3VwRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB7QGxpbmsgUXVlcnlQYXJhbUdyb3VwfSB0byBiaW5kLlxyXG4gICAgICovXHJcbiAgICBASW5wdXQoJ3F1ZXJ5UGFyYW1Hcm91cCcpXHJcbiAgICBwdWJsaWMgcXVlcnlQYXJhbUdyb3VwOiBRdWVyeVBhcmFtR3JvdXAgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyb3VwU2VydmljZTogUXVlcnlQYXJhbUdyb3VwU2VydmljZSkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaWdub3JlICovXHJcbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwQ2hhbmdlID0gY2hhbmdlc1sncXVlcnlQYXJhbUdyb3VwJ107XHJcbiAgICAgICAgaWYgKGdyb3VwQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGlmICghZ3JvdXBDaGFuZ2UuZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQmluZGluZyBhIGRpZmZlcmVudCBRdWVyeVBhcmFtR3JvdXAgZHVyaW5nIHJ1bnRpbWUgaXMgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQuYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW1Hcm91cCA9IGdyb3VwQ2hhbmdlLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFxdWVyeVBhcmFtR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgWW91IGFkZGVkIHRoZSBxdWVyeVBhcmFtR3JvdXAgZGlyZWN0aXZlLCBidXQgaGF2ZW4ndCBzdXBwbGllZCBhIGdyb3VwIHRvIHVzZS5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ncm91cFNlcnZpY2Uuc2V0UXVlcnlQYXJhbUdyb3VwKHF1ZXJ5UGFyYW1Hcm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==