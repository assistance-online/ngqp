import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MultiSelectOptionDirective } from './multi-select-option.directive';
import * as i0 from "@angular/core";
/** @ignore */
export declare class MultiSelectControlValueAccessorDirective<T> implements ControlValueAccessor {
    private renderer;
    private elementRef;
    private selectedIds;
    private options;
    private optionMap;
    private idCounter;
    private fnChange;
    private fnTouched;
    onChange(): void;
    onTouched(): void;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLSelectElement>);
    writeValue(values: T[]): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    registerOption(option: MultiSelectOptionDirective<T>): string;
    deregisterOption(id: string): void;
    updateOptionValue(id: string, value: T): void;
    private getOptionId;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelectControlValueAccessorDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MultiSelectControlValueAccessorDirective<any>, "select[multiple][queryParamName],select[multiple][queryParam]", never, {}, {}, never, never, false, never>;
}
