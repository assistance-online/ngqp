import { ModuleWithProviders } from '@angular/core';
import { RouterOptions } from './router-adapter/router-adapter';
import * as i0 from "@angular/core";
import * as i1 from "./directives/query-param.directive";
import * as i2 from "./directives/query-param-name.directive";
import * as i3 from "./directives/query-param-group.directive";
import * as i4 from "./directives/control-value-accessor.directive";
import * as i5 from "./accessors/default-control-value-accessor.directive";
import * as i6 from "./accessors/number-control-value-accessor.directive";
import * as i7 from "./accessors/range-control-value-accessor.directive";
import * as i8 from "./accessors/checkbox-control-value-accessor.directive";
import * as i9 from "./accessors/select-control-value-accessor.directive";
import * as i10 from "./accessors/select-option.directive";
import * as i11 from "./accessors/multi-select-control-value-accessor.directive";
import * as i12 from "./accessors/multi-select-option.directive";
export declare class QueryParamModule {
    static withConfig(config?: {
        routerOptions?: RouterOptions;
    }): ModuleWithProviders<QueryParamModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<QueryParamModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<QueryParamModule, [typeof i1.QueryParamDirective, typeof i2.QueryParamNameDirective, typeof i3.QueryParamGroupDirective, typeof i4.ControlValueAccessorDirective, typeof i5.DefaultControlValueAccessorDirective, typeof i6.NumberControlValueAccessorDirective, typeof i7.RangeControlValueAccessorDirective, typeof i8.CheckboxControlValueAccessorDirective, typeof i9.SelectControlValueAccessorDirective, typeof i10.SelectOptionDirective, typeof i11.MultiSelectControlValueAccessorDirective, typeof i12.MultiSelectOptionDirective], never, [typeof i1.QueryParamDirective, typeof i2.QueryParamNameDirective, typeof i3.QueryParamGroupDirective, typeof i4.ControlValueAccessorDirective, typeof i5.DefaultControlValueAccessorDirective, typeof i6.NumberControlValueAccessorDirective, typeof i7.RangeControlValueAccessorDirective, typeof i8.CheckboxControlValueAccessorDirective, typeof i9.SelectControlValueAccessorDirective, typeof i10.SelectOptionDirective, typeof i11.MultiSelectControlValueAccessorDirective, typeof i12.MultiSelectOptionDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<QueryParamModule>;
}
