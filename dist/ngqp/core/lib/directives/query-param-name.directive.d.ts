import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { QueryParamGroupService } from './query-param-group.service';
import { QueryParamAccessor } from './query-param-accessor.interface';
import * as i0 from "@angular/core";
/**
 * Binds a {@link QueryParam} to a DOM element.
 *
 * This directive accepts the name of a {@link QueryParam} inside its parent {@link QueryParamGroup}.
 * It binds this parameter to the host element, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
export declare class QueryParamNameDirective implements QueryParamAccessor, OnChanges, OnDestroy {
    private groupService;
    /**
     * The name of the {@link QueryParam} inside its parent {@link QueryParamGroup}.
     * Note that this does not refer to the [parameter name]{@link QueryParam#urlParam}.
     */
    set name(name: string);
    get name(): string;
    /** @internal */
    valueAccessor: ControlValueAccessor;
    private _name;
    /** @internal */
    constructor(groupService: QueryParamGroupService, valueAccessors: ControlValueAccessor[]);
    /** @ignore */
    ngOnChanges(changes: SimpleChanges): void;
    /** @ignore */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<QueryParamNameDirective, [{ optional: true; }, { optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<QueryParamNameDirective, "[queryParamName]", never, { "name": { "alias": "queryParamName"; "required": false; }; }, {}, never, never, false, never>;
}
