import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterAdapter, RouterOptions } from './router-adapter.interface';
import * as i0 from "@angular/core";
/** @internal */
export declare class DefaultRouterAdapter implements RouterAdapter {
    private router;
    private route;
    constructor(router: Router, route: ActivatedRoute);
    get url(): string;
    get queryParamMap(): import("rxjs").Observable<import("@angular/router").ParamMap>;
    navigate(queryParams: Params, extras?: RouterOptions & {
        state?: any;
    }): Promise<boolean>;
    getCurrentNavigation(): import("@angular/router").Navigation | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultRouterAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DefaultRouterAdapter>;
}
