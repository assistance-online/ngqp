import { OnChanges, SimpleChanges } from '@angular/core';
import { QueryParamGroup } from '../model/query-param-group';
import { QueryParamGroupService } from './query-param-group.service';
import * as i0 from "@angular/core";
/**
 * Binds a {@link QueryParamGroup} to a DOM element.
 *
 * This directive accepts an instance of {@link QueryParamGroup}. Any child using
 * {@link QueryParamNameDirective} will then be matched against this group, and the
 * synchronization process can take place.
 */
export declare class QueryParamGroupDirective implements OnChanges {
    private groupService;
    /**
     * The {@link QueryParamGroup} to bind.
     */
    queryParamGroup: QueryParamGroup | null;
    /** @internal */
    constructor(groupService: QueryParamGroupService);
    /** @ignore */
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<QueryParamGroupDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<QueryParamGroupDirective, "[queryParamGroup]", never, { "queryParamGroup": { "alias": "queryParamGroup"; "required": false; }; }, {}, never, never, false, never>;
}
