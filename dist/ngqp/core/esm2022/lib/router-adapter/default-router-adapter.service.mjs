import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
/** @internal */
export class DefaultRouterAdapter {
    router;
    route;
    constructor(router, route) {
        this.router = router;
        this.route = route;
    }
    get url() {
        return this.router.url;
    }
    get queryParamMap() {
        return this.route.queryParamMap;
    }
    navigate(queryParams, extras = {}) {
        return this.router.navigate([], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
            queryParams: queryParams,
            ...extras,
        });
    }
    getCurrentNavigation() {
        return this.router.getCurrentNavigation();
    }
    static ɵfac = function DefaultRouterAdapter_Factory(t) { return new (t || DefaultRouterAdapter)(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i1.ActivatedRoute)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DefaultRouterAdapter, factory: DefaultRouterAdapter.ɵfac });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DefaultRouterAdapter, [{
        type: Injectable
    }], () => [{ type: i1.Router }, { type: i1.ActivatedRoute }], null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1yb3V0ZXItYWRhcHRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvcm91dGVyLWFkYXB0ZXIvZGVmYXVsdC1yb3V0ZXItYWRhcHRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGNBQWMsRUFBVSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBR2pFLGdCQUFnQjtBQUVoQixNQUFNLE9BQU8sb0JBQW9CO0lBRVQ7SUFBd0I7SUFBNUMsWUFBb0IsTUFBYyxFQUFVLEtBQXFCO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtJQUNqRSxDQUFDO0lBRUQsSUFBVyxHQUFHO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBVyxhQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7SUFDcEMsQ0FBQztJQUVNLFFBQVEsQ0FBQyxXQUFtQixFQUFFLFNBQTBDLEVBQUU7UUFDN0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3RCLG1CQUFtQixFQUFFLE9BQU87WUFDNUIsV0FBVyxFQUFFLFdBQVc7WUFDeEIsR0FBRyxNQUFNO1NBQ1osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLG9CQUFvQjtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QyxDQUFDOzhFQXhCUSxvQkFBb0I7Z0VBQXBCLG9CQUFvQixXQUFwQixvQkFBb0I7O2lGQUFwQixvQkFBb0I7Y0FEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFBhcmFtcywgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgUm91dGVyQWRhcHRlciwgUm91dGVyT3B0aW9ucyB9IGZyb20gJy4vcm91dGVyLWFkYXB0ZXIuaW50ZXJmYWNlJztcclxuXHJcbi8qKiBAaW50ZXJuYWwgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdFJvdXRlckFkYXB0ZXIgaW1wbGVtZW50cyBSb3V0ZXJBZGFwdGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdXJsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlci51cmw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBxdWVyeVBhcmFtTWFwKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlLnF1ZXJ5UGFyYW1NYXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5hdmlnYXRlKHF1ZXJ5UGFyYW1zOiBQYXJhbXMsIGV4dHJhczogUm91dGVyT3B0aW9ucyAmIHsgc3RhdGU/OiBhbnkgfSA9IHt9KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm91dGVyLm5hdmlnYXRlKFtdLCB7XHJcbiAgICAgICAgICAgIHJlbGF0aXZlVG86IHRoaXMucm91dGUsXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zSGFuZGxpbmc6ICdtZXJnZScsXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiBxdWVyeVBhcmFtcyxcclxuICAgICAgICAgICAgLi4uZXh0cmFzLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdXJyZW50TmF2aWdhdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIuZ2V0Q3VycmVudE5hdmlnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbn0iXX0=