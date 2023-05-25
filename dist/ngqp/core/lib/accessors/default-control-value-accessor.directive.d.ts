import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
export declare class DefaultControlValueAccessorDirective implements ControlValueAccessor {
    private platformId;
    private renderer;
    private elementRef;
    private readonly supportsComposition;
    private composing;
    private fnChange;
    private fnTouched;
    onInput(event: UIEvent): void;
    onBlur(): void;
    onCompositionStart(): void;
    onCompositionEnd(event: UIEvent): void;
    constructor(platformId: string | null, renderer: Renderer2, elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>);
    writeValue(value: string): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultControlValueAccessorDirective, [{ optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DefaultControlValueAccessorDirective, "input:not([type=checkbox]):not([type=radio])[queryParamName],textarea[queryParamName],input:not([type=checkbox]):not([type=radio])[queryParam],textarea[queryParam]", never, {}, {}, never, never, false, never>;
}
