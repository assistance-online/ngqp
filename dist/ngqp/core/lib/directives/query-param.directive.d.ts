import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { QueryParamGroupService } from './query-param-group.service';
import { QueryParamAccessor } from './query-param-accessor.interface';
import { ControlValueAccessor } from '@angular/forms';
import { QueryParam } from '../model/query-param';
import * as i0 from "@angular/core";
/**
 * Binds a {@link QueryParam} to a component directly.
 *
 * This directive accepts a {@link QueryParam} without requiring an outer {@link QueryParamGroup}.
 * It binds this parameter to the host component, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
export declare class QueryParamDirective implements QueryParamAccessor, OnChanges, OnDestroy {
    private groupService;
    /**
     * The {@link QueryParam} to bind to the host component.
     */
    queryParam: QueryParam<unknown> | null;
    /** @internal */
    readonly name = "param";
    /** @internal */
    valueAccessor: ControlValueAccessor;
    /** @internal */
    private group;
    /** @internal */
    constructor(groupService: QueryParamGroupService, valueAccessors: ControlValueAccessor[]);
    /** @ignore */
    ngOnChanges(changes: SimpleChanges): void;
    /** @ignore */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<QueryParamDirective, [{ optional: true; }, { optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<QueryParamDirective, "[queryParam]", never, { "queryParam": { "alias": "queryParam"; "required": false; }; }, {}, never, never, false, never>;
}
