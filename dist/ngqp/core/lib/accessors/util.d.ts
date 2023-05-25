import { ControlValueAccessor } from '@angular/forms';
/**
 * This resembles the selectControlValueAccessor function from
 *   https://github.com/angular/angular/blob/7.1.2/packages/forms/src/directives/shared.ts#L186
 * We can't use it directly since it isn't exported in the public API, but let's hope choosing
 * any accessor is good enough for our purposes.
 *
 * @internal
 */
export declare function selectValueAccessor(valueAccessors: ControlValueAccessor[]): ControlValueAccessor;
