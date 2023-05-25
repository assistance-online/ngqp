import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Comparator } from './types';
/** @internal */
export declare const LOOSE_IDENTITY_COMPARATOR: <T>(a: T, b: T) => boolean;
/** @internal */
export declare const NOP: Function;
/** @internal */
export declare function isMissing(obj: any): obj is null | undefined;
/** @internal */
export declare function undefinedToNull<T>(obj: T | undefined): T | null;
/** @internal */
export declare function isPresent<T>(obj: T): obj is Exclude<T, null | undefined>;
/** @internal */
export declare function isFunction(obj: any): obj is Function;
/** @internal */
export declare function wrapTryCatch<T extends Function>(fn: T, msg: string): T;
/** @internal */
export declare function areEqualUsing<T>(first: T | null, second: T | null, comparator: Comparator<T | null>): boolean;
/** @internal */
export declare function filterParamMap(paramMap: ParamMap, keys: string[]): ParamMap;
/** @internal */
export declare function compareParamMaps(first: ParamMap, second: ParamMap): boolean;
/** @internal */
export declare function compareStringArraysUnordered(first: string[], second: string[]): boolean;
/** @internal */
export declare function wrapIntoObservable<T>(input: T | Observable<T>): Observable<T>;
