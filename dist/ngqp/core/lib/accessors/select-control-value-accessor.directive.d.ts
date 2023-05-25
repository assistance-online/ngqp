import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
/** @ignore */
export declare class SelectControlValueAccessorDirective<T> implements ControlValueAccessor {
    private renderer;
    private elementRef;
    value: T | null;
    private selectedId;
    private optionMap;
    private idCounter;
    private fnChange;
    private fnTouched;
    onChange(event: UIEvent): void;
    onTouched(): void;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLSelectElement>);
    writeValue(value: T | null): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    registerOption(): string;
    deregisterOption(id: string): void;
    updateOptionValue(id: string, value: T): void;
    private getOptionId;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectControlValueAccessorDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SelectControlValueAccessorDirective<any>, "select:not([multiple])[queryParamName],select:not([multiple])[queryParam]", never, {}, {}, never, never, false, never>;
}
