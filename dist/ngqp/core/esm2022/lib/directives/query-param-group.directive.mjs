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
export class QueryParamGroupDirective {
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamGroupDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParamGroup]',
                providers: [QueryParamGroupService],
            }]
    }], () => [{ type: i1.QueryParamGroupService }], { queryParamGroup: [{
            type: Input,
            args: ['queryParamGroup']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0tZ3JvdXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvZGlyZWN0aXZlcy9xdWVyeS1wYXJhbS1ncm91cC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBRzNFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7QUFFckU7Ozs7OztHQU1HO0FBS0gsTUFBTSxPQUFPLHdCQUF3QjtJQVNiO0lBUHBCOztPQUVHO0lBRUksZUFBZSxHQUEyQixJQUFJLENBQUM7SUFFdEQsZ0JBQWdCO0lBQ2hCLFlBQW9CLFlBQW9DO1FBQXBDLGlCQUFZLEdBQVosWUFBWSxDQUF3QjtJQUN4RCxDQUFDO0lBRUQsY0FBYztJQUNQLFdBQVcsQ0FBQyxPQUFzQjtRQUNyQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvQyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO1lBQ3RHLENBQUM7WUFFRCxNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO1lBQ2pELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO1lBQ3JHLENBQUM7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDTCxDQUFDO2tGQTNCUSx3QkFBd0I7NkRBQXhCLHdCQUF3Qiw2SEFGdEIsQ0FBQyxzQkFBc0IsQ0FBQzs7aUZBRTFCLHdCQUF3QjtjQUpwQyxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7YUFDdEM7dURBT1UsZUFBZTtrQkFEckIsS0FBSzttQkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbU5hbWVEaXJlY3RpdmUgfSBmcm9tICcuL3F1ZXJ5LXBhcmFtLW5hbWUuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgUXVlcnlQYXJhbUdyb3VwIH0gZnJvbSAnLi4vbW9kZWwvcXVlcnktcGFyYW0tZ3JvdXAnO1xyXG5pbXBvcnQgeyBRdWVyeVBhcmFtR3JvdXBTZXJ2aWNlIH0gZnJvbSAnLi9xdWVyeS1wYXJhbS1ncm91cC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBCaW5kcyBhIHtAbGluayBRdWVyeVBhcmFtR3JvdXB9IHRvIGEgRE9NIGVsZW1lbnQuXHJcbiAqXHJcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH0uIEFueSBjaGlsZCB1c2luZ1xyXG4gKiB7QGxpbmsgUXVlcnlQYXJhbU5hbWVEaXJlY3RpdmV9IHdpbGwgdGhlbiBiZSBtYXRjaGVkIGFnYWluc3QgdGhpcyBncm91cCwgYW5kIHRoZVxyXG4gKiBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBjYW4gdGFrZSBwbGFjZS5cclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbcXVlcnlQYXJhbUdyb3VwXScsXHJcbiAgICBwcm92aWRlcnM6IFtRdWVyeVBhcmFtR3JvdXBTZXJ2aWNlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFF1ZXJ5UGFyYW1Hcm91cERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUge0BsaW5rIFF1ZXJ5UGFyYW1Hcm91cH0gdG8gYmluZC5cclxuICAgICAqL1xyXG4gICAgQElucHV0KCdxdWVyeVBhcmFtR3JvdXAnKVxyXG4gICAgcHVibGljIHF1ZXJ5UGFyYW1Hcm91cDogUXVlcnlQYXJhbUdyb3VwIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBncm91cFNlcnZpY2U6IFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2UpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGlnbm9yZSAqL1xyXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBjb25zdCBncm91cENoYW5nZSA9IGNoYW5nZXNbJ3F1ZXJ5UGFyYW1Hcm91cCddO1xyXG4gICAgICAgIGlmIChncm91cENoYW5nZSkge1xyXG4gICAgICAgICAgICBpZiAoIWdyb3VwQ2hhbmdlLmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEJpbmRpbmcgYSBkaWZmZXJlbnQgUXVlcnlQYXJhbUdyb3VwIGR1cmluZyBydW50aW1lIGlzIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkLmApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBxdWVyeVBhcmFtR3JvdXAgPSBncm91cENoYW5nZS5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghcXVlcnlQYXJhbUdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSBhZGRlZCB0aGUgcXVlcnlQYXJhbUdyb3VwIGRpcmVjdGl2ZSwgYnV0IGhhdmVuJ3Qgc3VwcGxpZWQgYSBncm91cCB0byB1c2UuYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBTZXJ2aWNlLnNldFF1ZXJ5UGFyYW1Hcm91cChxdWVyeVBhcmFtR3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXX0=