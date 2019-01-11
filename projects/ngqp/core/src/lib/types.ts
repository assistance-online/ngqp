import { Params } from '@angular/router';

/**
 * A serializer defines how the represented form control's
 * value is converted into a string to be used in the URL.
 */
export type ParamSerializer<T> = (model: T) => string;

/**
 * A deserializer defines how a URL parameter is converted
 * into the represented form control's value.
 */
export type ParamDeserializer<T> = (value: string) => T;

/**
 * Defines a function which describes side effects on other
 * URL parameters.
 *
 * See {@link QueryParamOpts#combineWith}.
 */
export type ParamCombinator<T> = (previousValue: T, newValue: T) => Params;

/** @internal */
export type OnChangeFunction<T> = (value: T) => void;

/**
 * A function which compares two values of the same type to determine
 * if they are equal.
 *
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns `true` if and only if `a` and `b` should be considered equal.
 */
export type Comparator<T> = (a: T, b: T) => boolean;