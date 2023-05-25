import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MultiSelectControlValueAccessorDirective } from './multi-select-control-value-accessor.directive';
import * as i0 from "@angular/core";
/** @ignore */
export declare class MultiSelectOptionDirective<T> implements OnInit, OnDestroy {
    private parent;
    private renderer;
    private elementRef;
    private readonly id;
    constructor(parent: MultiSelectControlValueAccessorDirective<T>, renderer: Renderer2, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    set value(value: T);
    get selected(): boolean;
    set selected(selected: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelectOptionDirective<any>, [{ optional: true; host: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MultiSelectOptionDirective<any>, "option", never, { "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
