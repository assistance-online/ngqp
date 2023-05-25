import { InjectionToken } from '@angular/core';
import { Navigation, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs';
/**
 * Abstraction around the Angular Router used by ngqp in order to read from
 * or manipulate the URL.
 *
 * This abstraction only exists so we can provide a different adapter for the
 * examples on the website.
 *
 * @internal
 */
export interface RouterAdapter {
    /** @internal */
    url: string;
    /** @internal */
    queryParamMap: Observable<ParamMap>;
    /** @internal */
    navigate(queryParams: Params, extras?: RouterOptions & {
        state?: any;
    }): Promise<boolean>;
    /** @internal */
    getCurrentNavigation(): Pick<Navigation, 'trigger' | 'extras'> | null;
}
/**
 * Options to be provided when a navigation is started to update the URL.
 * These options are simply forwarded to Router#navigate.
 */
export interface RouterOptions {
    replaceUrl?: boolean;
    preserveFragment?: boolean;
}
/**
 * See {@link RouterOptions}.
 */
export declare const DefaultRouterOptions: RouterOptions;
/** @internal */
export declare const NGQP_ROUTER_ADAPTER: InjectionToken<RouterAdapter>;
/** Injection token to provide {@link RouterOptions}. */
export declare const NGQP_ROUTER_OPTIONS: InjectionToken<RouterOptions>;
