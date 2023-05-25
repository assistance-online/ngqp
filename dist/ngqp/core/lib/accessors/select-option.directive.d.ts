import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SelectControlValueAccessorDirective } from './select-control-value-accessor.directive';
import * as i0 from "@angular/core";
/** @ignore */
export declare class SelectOptionDirective<T> implements OnInit, OnDestroy {
    private parent;
    private renderer;
    private elementRef;
    private readonly id;
    constructor(parent: SelectControlValueAccessorDirective<T>, renderer: Renderer2, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    set value(value: T);
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectOptionDirective<any>, [{ optional: true; host: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SelectOptionDirective<any>, "option", never, { "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
