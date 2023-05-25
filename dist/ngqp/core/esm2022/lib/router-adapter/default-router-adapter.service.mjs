import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
/** @internal */
class DefaultRouterAdapter {
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
export { DefaultRouterAdapter };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DefaultRouterAdapter, [{
        type: Injectable
    }], function () { return [{ type: i1.Router }, { type: i1.ActivatedRoute }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1yb3V0ZXItYWRhcHRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvcm91dGVyLWFkYXB0ZXIvZGVmYXVsdC1yb3V0ZXItYWRhcHRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGNBQWMsRUFBVSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBR2pFLGdCQUFnQjtBQUNoQixNQUNhLG9CQUFvQjtJQUVUO0lBQXdCO0lBQTVDLFlBQW9CLE1BQWMsRUFBVSxLQUFxQjtRQUE3QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7SUFDakUsQ0FBQztJQUVELElBQVcsR0FBRztRQUNWLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQVcsYUFBYTtRQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO0lBQ3BDLENBQUM7SUFFTSxRQUFRLENBQUMsV0FBbUIsRUFBRSxTQUEwQyxFQUFFO1FBQzdFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQzVCLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSztZQUN0QixtQkFBbUIsRUFBRSxPQUFPO1lBQzVCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLEdBQUcsTUFBTTtTQUNaLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxvQkFBb0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUMsQ0FBQzs4RUF4QlEsb0JBQW9CO2dFQUFwQixvQkFBb0IsV0FBcEIsb0JBQW9COztTQUFwQixvQkFBb0I7dUZBQXBCLG9CQUFvQjtjQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUGFyYW1zLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBSb3V0ZXJBZGFwdGVyLCBSb3V0ZXJPcHRpb25zIH0gZnJvbSAnLi9yb3V0ZXItYWRhcHRlci5pbnRlcmZhY2UnO1xyXG5cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0Um91dGVyQWRhcHRlciBpbXBsZW1lbnRzIFJvdXRlckFkYXB0ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1cmwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm91dGVyLnVybDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHF1ZXJ5UGFyYW1NYXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm91dGUucXVlcnlQYXJhbU1hcDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmF2aWdhdGUocXVlcnlQYXJhbXM6IFBhcmFtcywgZXh0cmFzOiBSb3V0ZXJPcHRpb25zICYgeyBzdGF0ZT86IGFueSB9ID0ge30pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW10sIHtcclxuICAgICAgICAgICAgcmVsYXRpdmVUbzogdGhpcy5yb3V0ZSxcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogJ21lcmdlJyxcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHF1ZXJ5UGFyYW1zLFxyXG4gICAgICAgICAgICAuLi5leHRyYXMsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEN1cnJlbnROYXZpZ2F0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlci5nZXRDdXJyZW50TmF2aWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==