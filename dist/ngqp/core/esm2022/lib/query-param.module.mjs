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
class QueryParamModule {
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
export { QueryParamModule };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamModule, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktcGFyYW0ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmdxcC9jb3JlL3NyYy9saWIvcXVlcnktcGFyYW0ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFDSCw2QkFBNkIsRUFDN0IsbUJBQW1CLEVBQ25CLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDM0IsTUFBTSx5QkFBeUIsQ0FBQztBQUNqQyxPQUFPLEVBQ0gscUNBQXFDLEVBQ3JDLG9DQUFvQyxFQUNwQyx3Q0FBd0MsRUFDeEMsMEJBQTBCLEVBQzFCLG1DQUFtQyxFQUNuQyxrQ0FBa0MsRUFDbEMsbUNBQW1DLEVBQ25DLHFCQUFxQixFQUN4QixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDSCxvQkFBb0IsRUFDcEIsb0JBQW9CLEVBQ3BCLG1CQUFtQixFQUNuQixtQkFBbUIsRUFFdEIsTUFBTSxpQ0FBaUMsQ0FBQzs7QUFFekMsY0FBYztBQUNkLE1BQU0sVUFBVSxHQUFnQjtJQUM1QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtJQUN4Qiw2QkFBNkI7SUFFN0IsWUFBWTtJQUNaLG9DQUFvQztJQUNwQyxtQ0FBbUM7SUFDbkMsa0NBQWtDO0lBQ2xDLHFDQUFxQztJQUNyQyxtQ0FBbUM7SUFDbkMscUJBQXFCO0lBQ3JCLHdDQUF3QztJQUN4QywwQkFBMEI7Q0FDN0IsQ0FBQztBQUVGLE1BZWEsZ0JBQWdCO0lBRWxCLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBNEMsRUFBRTtRQUNuRSxPQUFPO1lBQ0gsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksT0FBTyxFQUFFLG1CQUFtQjtvQkFDNUIsUUFBUSxFQUFFO3dCQUNOLEdBQUcsb0JBQW9CO3dCQUN2QixHQUFHLE1BQU0sQ0FBQyxhQUFhO3FCQUMxQjtpQkFDSjthQUNKO1NBQ0osQ0FBQztJQUNOLENBQUM7MEVBZlEsZ0JBQWdCOzREQUFoQixnQkFBZ0I7aUVBWGQ7WUFDUDtnQkFDSSxPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixRQUFRLEVBQUUsb0JBQW9CO2FBQ2pDO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsUUFBUSxFQUFFLG9CQUFvQjthQUNqQztTQUNKOztTQUVRLGdCQUFnQjt1RkFBaEIsZ0JBQWdCO2NBZjVCLFFBQVE7ZUFBQztnQkFDTixPQUFPLEVBQUUsRUFBRTtnQkFDWCxZQUFZLEVBQUUsQ0FBRSxVQUFVLENBQUU7Z0JBQzVCLE9BQU8sRUFBRSxDQUFFLFVBQVUsQ0FBRTtnQkFDdkIsU0FBUyxFQUFFO29CQUNQO3dCQUNJLE9BQU8sRUFBRSxtQkFBbUI7d0JBQzVCLFFBQVEsRUFBRSxvQkFBb0I7cUJBQ2pDO29CQUNEO3dCQUNJLE9BQU8sRUFBRSxtQkFBbUI7d0JBQzVCLFFBQVEsRUFBRSxvQkFBb0I7cUJBQ2pDO2lCQUNKO2FBQ0o7O3dGQUNZLGdCQUFnQixtQkEvQnpCLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIsd0JBQXdCO1FBQ3hCLDZCQUE2QjtRQUU3QixZQUFZO1FBQ1osb0NBQW9DO1FBQ3BDLG1DQUFtQztRQUNuQyxrQ0FBa0M7UUFDbEMscUNBQXFDO1FBQ3JDLG1DQUFtQztRQUNuQyxxQkFBcUI7UUFDckIsd0NBQXdDO1FBQ3hDLDBCQUEwQixhQWIxQixtQkFBbUI7UUFDbkIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4Qiw2QkFBNkI7UUFFN0IsWUFBWTtRQUNaLG9DQUFvQztRQUNwQyxtQ0FBbUM7UUFDbkMsa0NBQWtDO1FBQ2xDLHFDQUFxQztRQUNyQyxtQ0FBbUM7UUFDbkMscUJBQXFCO1FBQ3JCLHdDQUF3QztRQUN4QywwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBRdWVyeVBhcmFtRGlyZWN0aXZlLFxyXG4gICAgUXVlcnlQYXJhbU5hbWVEaXJlY3RpdmUsXHJcbiAgICBRdWVyeVBhcmFtR3JvdXBEaXJlY3RpdmVcclxufSBmcm9tICcuL2RpcmVjdGl2ZXMvZGlyZWN0aXZlcyc7XHJcbmltcG9ydCB7XHJcbiAgICBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgRGVmYXVsdENvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgTXVsdGlTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIE11bHRpU2VsZWN0T3B0aW9uRGlyZWN0aXZlLFxyXG4gICAgTnVtYmVyQ29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBSYW5nZUNvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBTZWxlY3RPcHRpb25EaXJlY3RpdmVcclxufSBmcm9tICcuL2FjY2Vzc29ycy9hY2Nlc3NvcnMnO1xyXG5pbXBvcnQge1xyXG4gICAgRGVmYXVsdFJvdXRlckFkYXB0ZXIsXHJcbiAgICBEZWZhdWx0Um91dGVyT3B0aW9ucyxcclxuICAgIE5HUVBfUk9VVEVSX0FEQVBURVIsXHJcbiAgICBOR1FQX1JPVVRFUl9PUFRJT05TLFxyXG4gICAgUm91dGVyT3B0aW9uc1xyXG59IGZyb20gJy4vcm91dGVyLWFkYXB0ZXIvcm91dGVyLWFkYXB0ZXInO1xyXG5cclxuLyoqIEBpZ25vcmUgKi9cclxuY29uc3QgRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbXHJcbiAgICBRdWVyeVBhcmFtRGlyZWN0aXZlLFxyXG4gICAgUXVlcnlQYXJhbU5hbWVEaXJlY3RpdmUsXHJcbiAgICBRdWVyeVBhcmFtR3JvdXBEaXJlY3RpdmUsXHJcbiAgICBDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuXHJcbiAgICAvLyBBY2Nlc3NvcnNcclxuICAgIERlZmF1bHRDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIE51bWJlckNvbnRyb2xWYWx1ZUFjY2Vzc29yRGlyZWN0aXZlLFxyXG4gICAgUmFuZ2VDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvckRpcmVjdGl2ZSxcclxuICAgIFNlbGVjdE9wdGlvbkRpcmVjdGl2ZSxcclxuICAgIE11bHRpU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JEaXJlY3RpdmUsXHJcbiAgICBNdWx0aVNlbGVjdE9wdGlvbkRpcmVjdGl2ZSxcclxuXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXSxcclxuICAgIGRlY2xhcmF0aW9uczogWyBESVJFQ1RJVkVTIF0sXHJcbiAgICBleHBvcnRzOiBbIERJUkVDVElWRVMgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogTkdRUF9ST1VURVJfQURBUFRFUixcclxuICAgICAgICAgICAgdXNlQ2xhc3M6IERlZmF1bHRSb3V0ZXJBZGFwdGVyXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HUVBfUk9VVEVSX09QVElPTlMsXHJcbiAgICAgICAgICAgIHVzZVZhbHVlOiBEZWZhdWx0Um91dGVyT3B0aW9ucyxcclxuICAgICAgICB9LFxyXG4gICAgXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFF1ZXJ5UGFyYW1Nb2R1bGUge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgd2l0aENvbmZpZyhjb25maWc6IHsgcm91dGVyT3B0aW9ucz86IFJvdXRlck9wdGlvbnMgfSA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxRdWVyeVBhcmFtTW9kdWxlPiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IFF1ZXJ5UGFyYW1Nb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IE5HUVBfUk9VVEVSX09QVElPTlMsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uRGVmYXVsdFJvdXRlck9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZy5yb3V0ZXJPcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19