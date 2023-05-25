import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * Provides an ad-hoc ControlValueAccessor to a component.
 *
 * This directive provides a ControlValueAccessor for the host on which it is applied
 * by proxying the required interface through events and an API.
 *
 *
 *     <app-item-selector #ctrl
 *              controlValueAccessor #accessor="controlValueAccessor"
 *              (itemChange)="accessor.notifyChange($event)"
 *              (controlValueChange)="ctrl.item = $event">
 *     </app-item-selector>
 */
export declare class ControlValueAccessorDirective<T> implements ControlValueAccessor {
    /**
     * Fired when a value should be written (model -> view).
     *
     * From the ControlValueAccessor perspective, this is the equivalent of
     * writeValue. You should bind to this event and update your component's
     * state with the given value.
     */
    controlValueChange: EventEmitter<T>;
    /**
     * Fired when the control's disabled change should change.
     *
     * From the ControlValueAccessor perspective, this is the equivalent of
     * setDisabledState.
     *
     * This is currently not used by ngqp.
     */
    disabledChange: EventEmitter<boolean>;
    private fnChange;
    private fnTouched;
    /**
     * Write a new value to the model (view -> model)
     *
     * When your component's value changes, call this method to inform
     * the model about the change.
     */
    notifyChange(value: T): void;
    /**
     * Inform that the component has been touched by the user.
     *
     * This is currently not used by ngqp.
     */
    notifyTouched(): void;
    /** @internal */
    writeValue(value: T): void;
    /** @internal */
    registerOnChange(fn: (value: T) => any): void;
    /** @internal */
    registerOnTouched(fn: () => any): void;
    /** @internal */
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlValueAccessorDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ControlValueAccessorDirective<any>, "[controlValueAccessor]", ["controlValueAccessor"], {}, { "controlValueChange": "controlValueChange"; "disabledChange": "disabledChange"; }, never, never, false, never>;
}
