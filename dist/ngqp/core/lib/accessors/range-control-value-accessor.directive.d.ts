import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
export declare class RangeControlValueAccessorDirective implements ControlValueAccessor {
    private renderer;
    private elementRef;
    private fnChange;
    private fnTouched;
    onInput(event: UIEvent): void;
    onBlur(): void;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RangeControlValueAccessorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RangeControlValueAccessorDirective, "input[type=range][queryParamName],input[type=range][queryParam]", never, {}, {}, never, never, false, never>;
}
