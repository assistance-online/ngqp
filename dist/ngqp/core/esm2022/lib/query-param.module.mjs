import { NgModule } from '@angular/core';
import { ControlValueAccessorDirective, QueryParamDirective, QueryParamNameDirective, QueryParamGroupDirective } from './directives/directives';
import { CheckboxControlValueAccessorDirective, DefaultControlValueAccessorDirective, MultiSelectControlValueAccessorDirective, MultiSelectOptionDirective, NumberControlValueAccessorDirective, RangeControlValueAccessorDirective, SelectControlValueAccessorDirective, SelectOptionDirective } from './accessors/accessors';
import { DefaultRouterAdapter, DefaultRouterOptions, NGQP_ROUTER_ADAPTER, NGQP_ROUTER_OPTIONS } from './router-adapter/router-adapter';
import * as i0 from "@angular/core";
/** @ignore */
const DIRECTIVES = [
    QueryParamDirective,
    QueryParamNameDirective,
    QueryParamGroupDirective,
    ControlValueAccessorDirective,
    // Accessors
    DefaultControlValueAccessorDirective,
    NumberControlValueAccessorDirective,
    RangeControlValueAccessorDirective,
    CheckboxControlValueAccessorDirective,
    SelectControlValueAccessorDirective,
    SelectOptionDirective,
    MultiSelectControlValueAccessorDirective,
    MultiSelectOptionDirective,
];
export class QueryParamModule {
    static withConfig(config = {}) {
        return {
            ngModule: QueryParamModule,
            providers: [
                {
                    provide: NGQP_ROUTER_OPTIONS,
                    useValue: {
                        ...DefaultRouterOptions,
                        ...config.routerOptions
                    },
                },
            ],
        };
    }
    static ɵfac = function QueryParamModule_Factory(t) { return new (t || QueryParamModule)(); };
    static ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: QueryParamModule });
    static ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [
            {
                provide: NGQP_ROUTER_ADAPTER,
                useClass: DefaultRouterAdapter
            },
            {
                provide: NGQP_ROUTER_OPTIONS,
                useValue: DefaultRouterOptions,
            },
        ] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamModule, [{
        type: NgModule,
        args: [{
                imports: [],
                declarations: [DIRECTIVES],
                exports: [DIRECTIVES],
                providers: [
                    {
                        provide: NGQP_ROUTER_ADAPTER,
                        useClass: DefaultRouterAdapter
                    },
                    {
                        provide: NGQP_ROUTER_OPTIONS,
                        useValue: DefaultRouterOptions,
                    },
                ],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(QueryParamModule, { declarations: [QueryParamDirective,
        QueryParamNameDirective,
        QueryParamGroupDirective,
        ControlValueAccessorDirective,
        // Accessors
        DefaultControlValueAccessorDirective,
        NumberControlValueAccessorDirective,
        RangeControlValueAccessorDirective,
        CheckboxControlValueAccessorDirective,
        SelectControlValueAccessorDirective,
        SelectOptionDirective,
        MultiSelectControlValueAccessorDirective,
        MultiSelectOptionDirective], exports: [QueryParamDirective,
        QueryParamNameDirective,
        QueryParamGroupDirective,
        ControlValueAccessorDirective,
        // Accessors
        DefaultControlValueAccessorDirective,
        NumberControlValueAccessorDirective,
        RangeControlValueAccessorDirective,
        CheckboxControlValueAccessorDirective,
        SelectControlValueAccessorDirective,
        SelectOptionDirective,
        MultiSelectControlValueAccessorDirective,
        MultiSelectOptionDirective] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvcXVlcnktcGFyYW0ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFDSCw2QkFBNkIsRUFDN0IsbUJBQW1CLEVBQ25CLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDM0IsTUFBTSx5QkFBeUIsQ0FBQztBQUNqQyxPQUFPLEVBQ0gscUNBQXFDLEVBQ3JDLG9DQUFvQyxFQUNwQyx3Q0FBd0MsRUFDeEMsMEJBQTBCLEVBQzFCLG1DQUFtQyxFQUNuQyxrQ0FBa0MsRUFDbEMsbUNBQW1DLEVBQ25DLHFCQUFxQixFQUN4QixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDSCxvQkFBb0IsRUFDcEIsb0JBQW9CLEVBQ3BCLG1CQUFtQixFQUNuQixtQkFBbUIsRUFFdEIsTUFBTSxpQ0FBaUMsQ0FBQzs7QUFFekMsY0FBYztBQUNkLE1BQU0sVUFBVSxHQUFnQjtJQUM1QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtJQUN4Qiw2QkFBNkI7SUFFN0IsWUFBWTtJQUNaLG9DQUFvQztJQUNwQyxtQ0FBbUM7SUFDbkMsa0NBQWtDO0lBQ2xDLHFDQUFxQztJQUNyQyxtQ0FBbUM7SUFDbkMscUJBQXFCO0lBQ3JCLHdDQUF3QztJQUN4QywwQkFBMEI7Q0FDN0IsQ0FBQztBQWlCRixNQUFNLE9BQU8sZ0JBQWdCO0lBRWxCLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBNEMsRUFBRTtRQUNuRSxPQUFPO1lBQ0gsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksT0FBTyxFQUFFLG1CQUFtQjtvQkFDNUIsUUFBUSxFQUFFO3dCQUNOLEdBQUcsb0JBQW9CO3dCQUN2QixHQUFHLE1BQU0sQ0FBQyxhQUFhO3FCQUMxQjtpQkFDSjthQUNKO1NBQ0osQ0FBQztJQUNOLENBQUM7MEVBZlEsZ0JBQWdCOzREQUFoQixnQkFBZ0I7aUVBWGQ7WUFDUDtnQkFDSSxPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixRQUFRLEVBQUUsb0JBQW9CO2FBQ2pDO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsUUFBUSxFQUFFLG9CQUFvQjthQUNqQztTQUNKOztpRkFFUSxnQkFBZ0I7Y0FmNUIsUUFBUTtlQUFDO2dCQUNOLE9BQU8sRUFBRSxFQUFFO2dCQUNYLFlBQVksRUFBRSxDQUFFLFVBQVUsQ0FBRTtnQkFDNUIsT0FBTyxFQUFFLENBQUUsVUFBVSxDQUFFO2dCQUN2QixTQUFTLEVBQUU7b0JBQ1A7d0JBQ0ksT0FBTyxFQUFFLG1CQUFtQjt3QkFDNUIsUUFBUSxFQUFFLG9CQUFvQjtxQkFDakM7b0JBQ0Q7d0JBQ0ksT0FBTyxFQUFFLG1CQUFtQjt3QkFDNUIsUUFBUSxFQUFFLG9CQUFvQjtxQkFDakM7aUJBQ0o7YUFDSjs7d0ZBQ1ksZ0JBQWdCLG1CQS9CekIsbUJBQW1CO1FBQ25CLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIsNkJBQTZCO1FBRTdCLFlBQVk7UUFDWixvQ0FBb0M7UUFDcEMsbUNBQW1DO1FBQ25DLGtDQUFrQztRQUNsQyxxQ0FBcUM7UUFDckMsbUNBQW1DO1FBQ25DLHFCQUFxQjtRQUNyQix3Q0FBd0M7UUFDeEMsMEJBQTBCLGFBYjFCLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIsd0JBQXdCO1FBQ3hCLDZCQUE2QjtRQUU3QixZQUFZO1FBQ1osb0NBQW9DO1FBQ3BDLG1DQUFtQztRQUNuQyxrQ0FBa0M7UUFDbEMscUNBQXFDO1FBQ3JDLG1DQUFtQztRQUNuQyxxQkFBcUI7UUFDckIsd0NBQXdDO1FBQ3hDLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIFF1ZXJ5UGFyYW1EaXJlY3RpdmUsXHJcbiAgICBRdWVyeVBhcmFtTmFtZURpcmVjdGl2ZSxcclxuICAgIFF1ZXJ5UGFyYW1Hcm91cERpcmVjdGl2ZVxyXG59IGZyb20gJy4vZGlyZWN0aXZlcy9kaXJlY3RpdmVzJztcclxuaW1wb3J0IHtcclxuICAgIENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBEZWZhdWx0Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBNdWx0aVNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgTXVsdGlTZWxlY3RPcHRpb25EaXJlY3RpdmUsXHJcbiAgICBOdW1iZXJDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIFJhbmdlQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIFNlbGVjdE9wdGlvbkRpcmVjdGl2ZVxyXG59IGZyb20gJy4vYWNjZXNzb3JzL2FjY2Vzc29ycyc7XHJcbmltcG9ydCB7XHJcbiAgICBEZWZhdWx0Um91dGVyQWRhcHRlcixcclxuICAgIERlZmF1bHRSb3V0ZXJPcHRpb25zLFxyXG4gICAgTkdRUF9ST1VURVJfQURBUFRFUixcclxuICAgIE5HUVBfUk9VVEVSX09QVElPTlMsXHJcbiAgICBSb3V0ZXJPcHRpb25zXHJcbn0gZnJvbSAnLi9yb3V0ZXItYWRhcHRlci9yb3V0ZXItYWRhcHRlcic7XHJcblxyXG4vKiogQGlnbm9yZSAqL1xyXG5jb25zdCBESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtcclxuICAgIFF1ZXJ5UGFyYW1EaXJlY3RpdmUsXHJcbiAgICBRdWVyeVBhcmFtTmFtZURpcmVjdGl2ZSxcclxuICAgIFF1ZXJ5UGFyYW1Hcm91cERpcmVjdGl2ZSxcclxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG5cclxuICAgIC8vIEFjY2Vzc29yc1xyXG4gICAgRGVmYXVsdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgTnVtYmVyQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBSYW5nZUNvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgU2VsZWN0T3B0aW9uRGlyZWN0aXZlLFxyXG4gICAgTXVsdGlTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIE11bHRpU2VsZWN0T3B0aW9uRGlyZWN0aXZlLFxyXG5dO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbIERJUkVDVElWRVMgXSxcclxuICAgIGV4cG9ydHM6IFsgRElSRUNUSVZFUyBdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBOR1FQX1JPVVRFUl9BREFQVEVSLFxyXG4gICAgICAgICAgICB1c2VDbGFzczogRGVmYXVsdFJvdXRlckFkYXB0ZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogTkdRUF9ST1VURVJfT1BUSU9OUyxcclxuICAgICAgICAgICAgdXNlVmFsdWU6IERlZmF1bHRSb3V0ZXJPcHRpb25zLFxyXG4gICAgICAgIH0sXHJcbiAgICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUXVlcnlQYXJhbU1vZHVsZSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB3aXRoQ29uZmlnKGNvbmZpZzogeyByb3V0ZXJPcHRpb25zPzogUm91dGVyT3B0aW9ucyB9ID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFF1ZXJ5UGFyYW1Nb2R1bGU+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZ01vZHVsZTogUXVlcnlQYXJhbU1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogTkdRUF9ST1VURVJfT1BUSU9OUyxcclxuICAgICAgICAgICAgICAgICAgICB1c2VWYWx1ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5EZWZhdWx0Um91dGVyT3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLnJvdXRlck9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=