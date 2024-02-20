import * as i0 from '@angular/core';
import { Injectable, InjectionToken, isDevMode, Inject, Optional, forwardRef, PLATFORM_ID, Directive, HostListener, Self, Input, EventEmitter, Output, Host, NgModule } from '@angular/core';
import * as i1 from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { isObservable, of, Subject, forkJoin, zip, from, EMPTY } from 'rxjs';
import { first, debounceTime, tap, filter, map, takeUntil, startWith, switchMap, distinctUntilChanged, concatMap, catchError } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

/** @internal */
// tslint:disable-next-line:triple-equals
const LOOSE_IDENTITY_COMPARATOR = (a, b) => a == b;
/** @internal */
const NOP = () => { };
/** @internal */
function isMissing(obj) {
    return obj === undefined || obj === null;
}
/** @internal */
function undefinedToNull(obj) {
    if (obj === undefined) {
        return null;
    }
    return obj;
}
/** @internal */
function isPresent(obj) {
    return !isMissing(obj);
}
/** @internal */
function isFunction(obj) {
    return isPresent(obj) && typeof obj === 'function';
}
/** @internal */
function wrapTryCatch(fn, msg) {
    return function () {
        try {
            return fn.apply(this, arguments);
        }
        catch (err) {
            console.error(msg, err);
            return null;
        }
    };
}
/** @internal */
function areEqualUsing(first, second, comparator) {
    const comparison = comparator(first, second);
    if (typeof comparison === 'boolean') {
        return comparison;
    }
    return comparison === 0;
}
/** @internal */
function filterParamMap(paramMap, keys) {
    const params = {};
    keys
        .filter(key => paramMap.keys.includes(key))
        .forEach(key => params[key] = paramMap.getAll(key));
    return convertToParamMap(params);
}
/** @internal */
function compareParamMaps(first, second) {
    if ((first && !second) || (second && !first)) {
        return false;
    }
    if (!compareStringArraysUnordered(first.keys, second.keys)) {
        return false;
    }
    return first.keys.every(key => compareStringArraysUnordered(first.getAll(key), second.getAll(key)));
}
/** @internal */
function compareStringArraysUnordered(first, second) {
    if (!first && !second) {
        return true;
    }
    if ((first && !second) || (second && !first)) {
        return false;
    }
    if (first.length !== second.length) {
        return false;
    }
    const sortedFirst = first.sort();
    const sortedSecond = second.sort();
    return sortedFirst.every((firstKey, index) => firstKey === sortedSecond[index]);
}
/** @internal */
function wrapIntoObservable(input) {
    if (isObservable(input)) {
        return input;
    }
    return of(input);
}

/**
 * Creates a serializer for parameters of type `string`.
 *
 * @param defaultValue Optional default value to return if the value to serialize is `undefined` or `null`.
 */
function createStringSerializer(defaultValue = null) {
    return model => isMissing(model) ? defaultValue : model;
}
/**
 * Creates a deserializer for parameters of type `string`.
 *
 * @param defaultValue Optional default value to return if the value to deserialize is `undefined` or `null`.
 */
function createStringDeserializer(defaultValue = null) {
    return value => isMissing(value) ? defaultValue : value;
}
/**
 * Creates a serializer for parameters of type `number`.
 *
 * @param defaultValue Optional default value to return if the value to serialize is `undefined` or `null`.
 */
function createNumberSerializer(defaultValue = null) {
    return model => isMissing(model) ? defaultValue : `${model}`;
}
/**
 * Creates a deserializer for parameters of type `number`.
 *
 * @param defaultValue Optional default value to return if the value to deserialize is `undefined` or `null`.
 */
function createNumberDeserializer(defaultValue = null) {
    return value => isMissing(value) ? defaultValue : parseFloat(value);
}
/**
 * Creates a serializer for parameters of type `boolean`.
 *
 * @param defaultValue Optional default value to return if the value to serialize is `undefined` or `null`.
 */
function createBooleanSerializer(defaultValue = null) {
    return model => isMissing(model) ? defaultValue : `${model}`;
}
/**
 * Creates a deserializer for parameters of type `boolean`.
 *
 * @param defaultValue Optional default value to return if the value to deserialize is `undefined` or `null`.
 */
function createBooleanDeserializer(defaultValue = null) {
    return value => isMissing(value) ? defaultValue : (value === 'true' || value === '1');
}
/** @internal */
const DEFAULT_STRING_SERIALIZER = createStringSerializer();
/** @internal */
const DEFAULT_STRING_DESERIALIZER = createStringDeserializer();
/** @internal */
const DEFAULT_NUMBER_SERIALIZER = createNumberSerializer();
/** @internal */
const DEFAULT_NUMBER_DESERIALIZER = createNumberDeserializer();
/** @internal */
const DEFAULT_BOOLEAN_SERIALIZER = createBooleanSerializer();
/** @internal */
const DEFAULT_BOOLEAN_DESERIALIZER = createBooleanDeserializer();

/** @internal */
class AbstractQueryParamBase {
    parent = null;
    _valueChanges = new Subject();
    changeFunctions = [];
    /**
     * Emits the current value of this parameter whenever it changes.
     *
     * NOTE: This observable does not complete on its own, so ensure to unsubscribe from it.
     */
    valueChanges = this._valueChanges.asObservable();
    _registerOnChange(fn) {
        this.changeFunctions.push(fn);
    }
    _clearChangeFunctions() {
        this.changeFunctions = [];
    }
    _setParent(parent) {
        if (this.parent && parent) {
            throw new Error(`Parameter already belongs to a QueryParamGroup.`);
        }
        this.parent = parent;
    }
}
/**
 * Abstract base for {@link QueryParam} and {@link MultiQueryParam}.
 *
 * This base class holds most of the parameter's options, but is unaware of
 * how to actually (de-)serialize any values.
 */
class AbstractQueryParam extends AbstractQueryParamBase {
    /**
     * The current value of this parameter.
     */
    value = null;
    /**
     * The name of the parameter to be used in the URL.
     *
     * This represents the name of the query parameter which will be
     * used in the URL (e.g., `?q=`), which differs from the name of
     * the {@link QueryParam} model used inside {@link QueryParamGroup}.
     */
    urlParam;
    /** See {@link QueryParamOpts}. */
    serialize;
    /** See {@link QueryParamOpts}. */
    deserialize;
    /** See {@link QueryParamOpts}. */
    debounceTime;
    /** See {@link QueryParamOpts}. */
    emptyOn;
    /** See {@link QueryParamOpts}. */
    compareWith;
    /** See {@link QueryParamOpts}. */
    combineWith;
    constructor(urlParam, opts = {}) {
        super();
        const { serialize, deserialize, debounceTime, compareWith, emptyOn, combineWith } = opts;
        if (isMissing(urlParam)) {
            throw new Error(`Please provide a URL parameter name for each query parameter.`);
        }
        if (!isFunction(serialize)) {
            throw new Error(`serialize must be a function, but received ${serialize}`);
        }
        if (!isFunction(deserialize)) {
            throw new Error(`deserialize must be a function, but received ${deserialize}`);
        }
        if (emptyOn !== undefined && !isFunction(compareWith)) {
            throw new Error(`compareWith must be a function, but received ${compareWith}`);
        }
        if (isPresent(combineWith) && !isFunction(combineWith)) {
            throw new Error(`combineWith must be a function, but received ${combineWith}`);
        }
        this.urlParam = urlParam;
        this.serialize = wrapTryCatch(serialize, `Error while serializing value for ${this.urlParam}`);
        this.deserialize = wrapTryCatch(deserialize, `Error while deserializing value for ${this.urlParam}`);
        this.debounceTime = undefinedToNull(debounceTime);
        this.emptyOn = emptyOn;
        this.compareWith = compareWith;
        this.combineWith = combineWith;
    }
    /**
     * Updates the value of this parameter.
     *
     * If wired up with a {@link QueryParamGroup}, this will also synchronize
     * the value to the URL.
     */
    setValue(value, opts = {}) {
        this.value = value;
        if (opts.emitModelToViewChange !== false) {
            this.changeFunctions.forEach(changeFn => changeFn(value));
        }
        if (opts.emitEvent !== false) {
            this._valueChanges.next(this.value);
        }
        if (isPresent(this.parent) && !opts.onlySelf) {
            this.parent._updateValue({
                emitEvent: opts.emitEvent,
                emitModelToViewChange: false,
            });
        }
    }
}
/**
 * Describes a single parameter.
 *
 * This is the description of a single parameter and essentially serves
 * as the glue between its representation in the URL and its connection
 * to a form control.
 */
class QueryParam extends AbstractQueryParam {
    /** See {@link QueryParamOpts}. */
    multi = false;
    constructor(urlParam, opts) {
        super(urlParam, opts);
    }
    /** @internal */
    serializeValue(value) {
        if (this.emptyOn !== undefined && areEqualUsing(value, this.emptyOn, this.compareWith)) {
            return null;
        }
        return this.serialize(value);
    }
    /** @internal */
    deserializeValue(value) {
        if (this.emptyOn !== undefined && value === null) {
            return of(this.emptyOn);
        }
        return wrapIntoObservable(this.deserialize(value)).pipe(first());
    }
}
/**
 * Like {@link QueryParam}, but for array-typed parameters
 */
class MultiQueryParam extends AbstractQueryParam {
    /** See {@link QueryParamOpts}. */
    multi = true;
    /** See {@link MultiQueryParamOpts}. */
    serializeAll;
    /** See {@link MultiQueryParamOpts}. */
    deserializeAll;
    constructor(urlParam, opts) {
        super(urlParam, opts);
        const { serializeAll, deserializeAll } = opts;
        if (serializeAll !== undefined) {
            if (!isFunction(serializeAll)) {
                throw new Error(`serializeAll must be a function, but received ${serializeAll}`);
            }
            this.serializeAll = wrapTryCatch(serializeAll, `Error while serializing value for ${this.urlParam}`);
        }
        if (deserializeAll !== undefined) {
            if (!isFunction(deserializeAll)) {
                throw new Error(`deserializeAll must be a function, but received ${deserializeAll}`);
            }
            this.deserializeAll = wrapTryCatch(deserializeAll, `Error while deserializing value for ${this.urlParam}`);
        }
    }
    /** @internal */
    serializeValue(value) {
        if (this.emptyOn !== undefined && areEqualUsing(value, this.emptyOn, this.compareWith)) {
            return null;
        }
        if (this.serializeAll !== undefined) {
            return this.serializeAll(value);
        }
        return (value || []).map(this.serialize.bind(this));
    }
    /** @internal */
    deserializeValue(values) {
        if (this.emptyOn !== undefined && (values || []).length === 0) {
            return of(this.emptyOn);
        }
        if (this.deserializeAll !== undefined) {
            return wrapIntoObservable(this.deserializeAll(values));
        }
        if (!values || values.length === 0) {
            return of([]);
        }
        return forkJoin([...values.map(value => wrapIntoObservable(this.deserialize(value)).pipe(first()))]);
    }
}
/**
 * Describes a partitioned query parameter.
 *
 * This encapsulates a list of query parameters such that a single form control
 * can be bound against multiple URL parameters. To achieve this, functions must
 * be defined which can convert the models between the parameters.
 */
class PartitionedQueryParam extends AbstractQueryParamBase {
    /** @internal */
    queryParams;
    /** @internal */
    partition;
    /** @internal */
    reduce;
    constructor(queryParams, opts) {
        super();
        if (queryParams.length === 0) {
            throw new Error(`Partitioned parameters must contain at least one parameter.`);
        }
        if (!isFunction(opts.partition)) {
            throw new Error(`partition must be a function, but received ${opts.partition}`);
        }
        if (!isFunction(opts.reduce)) {
            throw new Error(`reduce must be a function, but received ${opts.reduce}`);
        }
        this.queryParams = queryParams;
        this.partition = opts.partition;
        this.reduce = opts.reduce;
    }
    get value() {
        return this.reduce(this.queryParams.map(queryParam => queryParam.value));
    }
    setValue(value, opts = {}) {
        const partitioned = this.partition(value);
        this.queryParams.forEach((queryParam, index) => queryParam.setValue(partitioned[index], {
            emitEvent: opts.emitEvent,
            onlySelf: true,
            emitModelToViewChange: false,
        }));
        if (opts.emitModelToViewChange !== false) {
            this.changeFunctions.forEach(changeFn => changeFn(this.value));
        }
        if (opts.emitEvent !== false) {
            this._valueChanges.next(this.value);
        }
    }
}

/**
 * Groups multiple {@link QueryParam} instances to a single unit.
 *
 * This "bundles" multiple parameters together such that changes can be emitted as a
 * complete unit. Collecting parameters into a group is required for the synchronization
 * to and from the URL.
 */
class QueryParamGroup {
    /** @internal */
    _valueChanges = new Subject();
    /**
     * Emits the values of all parameters in this group whenever at least one changes.
     *
     * This observable emits an object keyed by the {@QueryParam} names where each key
     * carries the current value of the represented parameter. It emits whenever at least
     * one parameter's value is changed.
     *
     * NOTE: This observable does not complete on its own, so ensure to unsubscribe from it.
     */
    valueChanges = this._valueChanges.asObservable();
    /** @internal */
    _queryParamAdded$ = new Subject();
    /** @internal */
    queryParamAdded$ = this._queryParamAdded$.asObservable();
    /** @internal */
    queryParams;
    /** @internal */
    routerOptions;
    /** @internal */
    options;
    changeFunctions = [];
    constructor(queryParams, extras = {}) {
        this.queryParams = queryParams;
        this.routerOptions = extras;
        this.options = extras;
        Object.values(this.queryParams).forEach(queryParam => queryParam._setParent(this));
    }
    /** @internal */
    _registerOnChange(fn) {
        this.changeFunctions.push(fn);
    }
    /** @internal */
    _clearChangeFunctions() {
        this.changeFunctions = [];
    }
    /**
     * Retrieves a specific parameter from this group by name.
     *
     * This returns an instance of either {@link QueryParam}, {@link MultiQueryParam}
     * or {@link PartitionedQueryParam} depending on the configuration, or `null`
     * if no parameter with that name is found in this group.
     *
     * @param queryParamName The name of the parameter instance to retrieve.
     */
    get(queryParamName) {
        const param = this.queryParams[queryParamName];
        if (!param) {
            return null;
        }
        return param;
    }
    /**
     * Adds a new {@link QueryParam} to this group.
     *
     * This adds the parameter under the given name to this group. The current
     * URL will be evaluated to synchronize its value initially. Afterwards
     * it is treated just like any other parameter in this group.
     *
     * @param queryParamName Name of the parameter to reference it with.
     * @param queryParam The new parameter to add.
     */
    add(queryParamName, queryParam) {
        if (this.get(queryParamName)) {
            throw new Error(`A parameter with name ${queryParamName} already exists.`);
        }
        this.queryParams[queryParamName] = queryParam;
        queryParam._setParent(this);
        this._queryParamAdded$.next(queryParamName);
    }
    /**
     * Removes a {@link QueryParam} from this group.
     *
     * This removes the parameter defined by the provided name from this group.
     * No further synchronization with this parameter will occur and it will not
     * be reported in the value of this group anymore.
     *
     * @param queryParamName The name of the parameter to remove.
     */
    remove(queryParamName) {
        const queryParam = this.get(queryParamName);
        if (!queryParam) {
            throw new Error(`No parameter with name ${queryParamName} found.`);
        }
        delete this.queryParams[queryParamName];
        queryParam._setParent(null);
        queryParam._clearChangeFunctions();
    }
    /**
     * The current value of this group.
     *
     * See {@link QueryParamGroup#valueChanges} for a description of the format of
     * the value.
     */
    get value() {
        const value = {};
        Object.keys(this.queryParams).forEach(queryParamName => value[queryParamName] = this.queryParams[queryParamName].value);
        return value;
    }
    /**
     * Updates the value of this group by merging it in.
     *
     * This sets the value of each provided parameter to the respective provided
     * value. If a parameter is not listed, its value remains unchanged.
     *
     * @param value See {@link QueryParamGroup#valueChanges} for a description of the format.
     * @param opts Additional options
     */
    patchValue(value, opts = {}) {
        Object.keys(value).forEach(queryParamName => {
            const queryParam = this.queryParams[queryParamName];
            if (isMissing(queryParam)) {
                return;
            }
            queryParam.setValue(value[queryParamName], {
                emitEvent: opts.emitEvent,
                onlySelf: true,
                emitModelToViewChange: false,
            });
        });
        this._updateValue(opts);
    }
    /**
     * Updates the value of this group by overwriting it.
     *
     * This sets the value of each provided parameter to the respective provided
     * value. If a parameter is not listed, its value is set to `undefined`.
     *
     * @param value See {@link QueryParamGroup#valueChanges} for a description of the format.
     * @param opts Additional options
     */
    setValue(value, opts = {}) {
        Object.keys(this.queryParams).forEach(queryParamName => {
            this.queryParams[queryParamName].setValue(undefinedToNull(value?.[queryParamName]), {
                emitEvent: opts.emitEvent,
                onlySelf: true,
                emitModelToViewChange: false,
            });
        });
        this._updateValue(opts);
    }
    /** @internal */
    _updateValue(opts = {}) {
        if (opts.emitModelToViewChange !== false) {
            this.changeFunctions.forEach(changeFn => changeFn(this.value));
        }
        if (opts.emitEvent !== false) {
            this._valueChanges.next(this.value);
        }
    }
}

function isMultiOpts(opts) {
    return opts.multi === true;
}
/**
 * Service to create parameters and groups.
 *
 * This service provides a simple API to create {@link QueryParamGroup} and {@link QueryParam}
 * instances and is the recommended way to set them up.
 */
class QueryParamBuilder {
    /**
     * Creates a new {@link QueryParamGroup}.
     *
     * This is the primary method to create a new group of parameters. Pass a list of
     * {@link QueryParam} instances by using the `xxxParam` methods.
     *
     * @param queryParams List of {@link QueryParam}s keyed by a unique name.
     * @param extras Additional parameters for this group, overriding global configuration.
     * @returns The new {@link QueryParamGroup}.
     */
    group(queryParams, extras = {}) {
        // TODO Maybe we should first validate that no two queryParams defined the same "param".
        return new QueryParamGroup(queryParams, extras);
    }
    /**
     * Partition a query parameter into multiple others.
     *
     * Partitioning is useful if you need to bind a single form control to multiple query parameters.
     * For example, consider a {@code <select>} which represents both a field to sort by and the
     * direction to sort in. If you want to encode these two information on separate URL parameters,
     * you can define a single query parameter that is partitioned into two others.
     *
     * @param queryParams The query parameters making up this partition.
     * @param opts See {@link PartitionedQueryParamOpts}.
     */
    partition(queryParams, opts) {
        return new PartitionedQueryParam(queryParams, opts);
    }
    /**
     * Create a new parameter of type `string`.
     *
     * See {@link QueryParamOpts}.
     */
    stringParam(urlParam, opts = {}) {
        opts = {
            serialize: DEFAULT_STRING_SERIALIZER,
            deserialize: DEFAULT_STRING_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    /**
     * Create a new parameter of type `number`.
     *
     * See {@link QueryParamOpts}.
     */
    numberParam(urlParam, opts = {}) {
        opts = {
            serialize: DEFAULT_NUMBER_SERIALIZER,
            deserialize: DEFAULT_NUMBER_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    /**
     * Create a new parameter of type `boolean`.
     *
     * See {@link QueryParamOpts}.
     */
    booleanParam(urlParam, opts = {}) {
        opts = {
            serialize: DEFAULT_BOOLEAN_SERIALIZER,
            deserialize: DEFAULT_BOOLEAN_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    /**
     * Create a new parameter for a complex type.
     *
     * See {@link QueryParamOpts}.
     */
    param(urlParam, opts = {}) {
        opts = {
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };
        if (isMultiOpts(opts)) {
            return new MultiQueryParam(urlParam, opts);
        }
        else {
            return new QueryParam(urlParam, opts);
        }
    }
    static ɵfac = function QueryParamBuilder_Factory(t) { return new (t || QueryParamBuilder)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QueryParamBuilder, factory: QueryParamBuilder.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamBuilder, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();

/**
 * See {@link RouterOptions}.
 */
const DefaultRouterOptions = {
    replaceUrl: true,
    preserveFragment: true,
};
/** @internal */
const NGQP_ROUTER_ADAPTER = new InjectionToken('NGQP_ROUTER_ADAPTER');
/** Injection token to provide {@link RouterOptions}. */
const NGQP_ROUTER_OPTIONS = new InjectionToken('NGQP_ROUTER_OPTIONS');

/** @internal */
function isMultiQueryParam(queryParam) {
    return queryParam.multi;
}
/** @internal */
class NavigationData {
    params;
    synthetic;
    constructor(params, synthetic = false) {
        this.params = params;
        this.synthetic = synthetic;
    }
}
/**
 * Service implementing the synchronization logic
 *
 * This service is the key to the synchronization process by binding a {@link QueryParamGroup}
 * to the router.
 *
 * @internal
 */
class QueryParamGroupService {
    routerAdapter;
    globalRouterOptions;
    /** The {@link QueryParamGroup} to bind. */
    queryParamGroup = null;
    /** List of {@link QueryParamAccessor} registered to this service. */
    directives = new Map();
    /**
     * Queue of navigation parameters
     *
     * A queue is used for navigations as we need to make sure all parameter changes
     * are executed in sequence as otherwise navigations might overwrite each other.
     */
    queue$ = new Subject();
    /** @ignore */
    synchronizeRouter$ = new Subject();
    /** @ignore */
    destroy$ = new Subject();
    constructor(routerAdapter, globalRouterOptions) {
        this.routerAdapter = routerAdapter;
        this.globalRouterOptions = globalRouterOptions;
        this.setupNavigationQueue();
    }
    /** @ignore */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.synchronizeRouter$.complete();
        this.queryParamGroup?._clearChangeFunctions();
        if (this.queryParamGroup?.options?.clearOnDestroy) {
            const nullParams = Object.values(this.queryParamGroup.queryParams)
                .map(queryParam => this.wrapIntoPartition(queryParam))
                .map(partitionedQueryParam => partitionedQueryParam.queryParams.map(queryParam => queryParam.urlParam))
                .reduce((a, b) => [...a, ...b], [])
                .map(urlParam => ({ [urlParam]: null }))
                .reduce((a, b) => ({ ...a, ...b }), {});
            this.routerAdapter.navigate(nullParams, {
                replaceUrl: true,
            }).then();
        }
    }
    /**
     * Uses the given {@link QueryParamGroup} for synchronization.
     */
    setQueryParamGroup(queryParamGroup) {
        // FIXME: If this is called when we already have a group, we probably need to do
        //        some cleanup first.
        if (this.queryParamGroup) {
            throw new Error(`A QueryParamGroup has already been setup. Changing the group is currently not supported.`);
        }
        this.queryParamGroup = queryParamGroup;
        this.startSynchronization();
    }
    /**
     * Registers a {@link QueryParamAccessor}.
     */
    registerQueryParamDirective(directive) {
        if (!directive.valueAccessor) {
            throw new Error(`No value accessor found for the form control. Please make sure to implement ControlValueAccessor on this component.`);
        }
        // Capture the name here, particularly for the queue below to avoid re-evaluating
        // it as it might change over time.
        const queryParamName = directive.name;
        const partitionedQueryParam = this.getQueryParamAsPartition(queryParamName);
        // Chances are that we read the initial route before a directive has been registered here.
        // The value in the model will be correct, but we need to sync it to the view once initially.
        directive.valueAccessor.writeValue(partitionedQueryParam.value);
        // Proxy updates from the view to debounce them (if needed).
        const queues = partitionedQueryParam.queryParams.map(() => new Subject());
        zip(...queues.map((queue$, index) => {
            const queryParam = partitionedQueryParam.queryParams[index];
            return queue$.pipe(isPresent(queryParam.debounceTime) ? debounceTime(queryParam.debounceTime) : tap());
        })).pipe(
        // Do not synchronize while the param is detached from the group
        filter(() => !!this.getQueryParamGroup().get(queryParamName)), map((newValue) => this.getParamsForValue(partitionedQueryParam, partitionedQueryParam.reduce(newValue))), takeUntil(this.destroy$)).subscribe(params => this.enqueueNavigation(new NavigationData(params)));
        directive.valueAccessor.registerOnChange((newValue) => {
            const partitioned = partitionedQueryParam.partition(newValue);
            queues.forEach((queue$, index) => queue$.next(partitioned[index]));
        });
        this.directives.set(queryParamName, [...(this.directives.get(queryParamName) || []), directive]);
    }
    /**
     * Deregisters a {@link QueryParamAccessor} by referencing its name.
     */
    deregisterQueryParamDirective(queryParamName) {
        if (!queryParamName) {
            return;
        }
        const directives = this.directives.get(queryParamName);
        if (!directives) {
            return;
        }
        directives.forEach(directive => {
            directive.valueAccessor.registerOnChange(NOP);
            directive.valueAccessor.registerOnTouched(NOP);
        });
        this.directives.delete(queryParamName);
        const queryParam = this.getQueryParamGroup().get(queryParamName);
        if (queryParam) {
            queryParam._clearChangeFunctions();
        }
    }
    startSynchronization() {
        this.setupGroupChangeListener();
        this.setupParamChangeListeners();
        this.setupRouterListener();
        this.watchNewParams();
    }
    /** Listens for programmatic changes on group level and synchronizes to the router. */
    setupGroupChangeListener() {
        this.getQueryParamGroup()._registerOnChange((newValue) => {
            if (newValue === null) {
                throw new Error(`Received null value from QueryParamGroup.`);
            }
            let params = {};
            Object.keys(newValue).forEach(queryParamName => {
                const queryParam = this.getQueryParamGroup().get(queryParamName);
                if (isMissing(queryParam)) {
                    return;
                }
                params = { ...params, ...this.getParamsForValue(queryParam, newValue[queryParamName]) };
            });
            this.enqueueNavigation(new NavigationData(params, true));
        });
    }
    /** Listens for programmatic changes on parameter level and synchronizes to the router. */
    setupParamChangeListeners() {
        Object.keys(this.getQueryParamGroup().queryParams)
            .forEach(queryParamName => this.setupParamChangeListener(queryParamName));
    }
    setupParamChangeListener(queryParamName) {
        const queryParam = this.getQueryParamGroup().get(queryParamName);
        if (!queryParam) {
            throw new Error(`No param in group found for name ${queryParamName}`);
        }
        queryParam._registerOnChange((newValue) => this.enqueueNavigation(new NavigationData(this.getParamsForValue(queryParam, newValue), true)));
    }
    /** Listens for changes in the router and synchronizes to the model. */
    setupRouterListener() {
        this.synchronizeRouter$.pipe(startWith(undefined), switchMap(() => this.routerAdapter.queryParamMap.pipe(
        // We want to ignore changes to query parameters which aren't related to this
        // particular group; however, we do need to react if one of our parameters has
        // vanished when it was set before.
        distinctUntilChanged((previousMap, currentMap) => {
            const keys = Object.values(this.getQueryParamGroup().queryParams)
                .map(queryParam => this.wrapIntoPartition(queryParam))
                .map(partitionedQueryParam => partitionedQueryParam.queryParams.map(queryParam => queryParam.urlParam))
                .reduce((a, b) => [...a, ...b], []);
            // It is important that we filter the maps only here so that both are filtered
            // with the same set of keys; otherwise, e.g. removing a parameter from the group
            // would interfere.
            return compareParamMaps(filterParamMap(previousMap, keys), filterParamMap(currentMap, keys));
        }))), switchMap(queryParamMap => {
            // We need to capture this right here since this is only set during the on-going navigation.
            const synthetic = this.isSyntheticNavigation();
            const queryParamNames = Object.keys(this.getQueryParamGroup().queryParams);
            return forkJoin([...queryParamNames]
                .map(queryParamName => {
                const partitionedQueryParam = this.getQueryParamAsPartition(queryParamName);
                return forkJoin([...partitionedQueryParam.queryParams]
                    .map(queryParam => isMultiQueryParam(queryParam)
                    ? queryParam.deserializeValue(queryParamMap.getAll(queryParam.urlParam))
                    : queryParam.deserializeValue(queryParamMap.get(queryParam.urlParam)))).pipe(map(newValues => partitionedQueryParam.reduce(newValues)), tap(newValue => {
                    const directives = this.directives.get(queryParamName);
                    if (directives) {
                        directives.forEach(directive => directive.valueAccessor.writeValue(newValue));
                    }
                }), map(newValue => {
                    return { [queryParamName]: newValue };
                }), takeUntil(this.destroy$));
            })).pipe(map((values) => values.reduce((groupValue, value) => {
                return {
                    ...groupValue,
                    ...value,
                };
            }, {})), tap(groupValue => this.getQueryParamGroup().setValue(groupValue, {
                emitEvent: !synthetic,
                emitModelToViewChange: false,
            })));
        }), takeUntil(this.destroy$)).subscribe();
    }
    /** Listens for newly added parameters and starts synchronization for them. */
    watchNewParams() {
        this.getQueryParamGroup().queryParamAdded$.pipe(takeUntil(this.destroy$)).subscribe(queryParamName => {
            this.setupParamChangeListener(queryParamName);
            this.synchronizeRouter$.next();
        });
    }
    /** Returns true if the current navigation is synthetic. */
    isSyntheticNavigation() {
        const navigation = this.routerAdapter.getCurrentNavigation();
        if (!navigation || navigation.trigger !== 'imperative') {
            // When using the back / forward buttons, the state is passed along with it, even though
            // for us it's now a navigation initiated by the user. Therefore, a navigation can only
            // be synthetic if it has been triggered imperatively.
            // See https://github.com/angular/angular/issues/28108.
            return false;
        }
        return navigation.extras && navigation.extras.state && navigation.extras.state['synthetic'];
    }
    /** Subscribes to the parameter queue and executes navigations in sequence. */
    setupNavigationQueue() {
        this.queue$.pipe(takeUntil(this.destroy$), concatMap(data => this.navigateSafely(data))).subscribe();
    }
    navigateSafely(data) {
        return from(this.routerAdapter.navigate(data.params, {
            ...this.routerOptions,
            state: { synthetic: data.synthetic },
        })).pipe(catchError((err) => {
            if (isDevMode()) {
                console.error(`There was an error while navigating`, err);
            }
            return EMPTY;
        }));
    }
    /** Sends a change of parameters to the queue. */
    enqueueNavigation(data) {
        this.queue$.next(data);
    }
    /**
     * Returns the full set of parameters given a value for a parameter model.
     *
     * This consists mainly of properly serializing the model value and ensuring to take
     * side effect changes into account that may have been configured.
     */
    getParamsForValue(queryParam, value) {
        const partitionedQueryParam = this.wrapIntoPartition(queryParam);
        const partitioned = partitionedQueryParam.partition(value);
        const combinedParams = partitionedQueryParam.queryParams
            .map((current, index) => isMissing(current.combineWith) ? null : current.combineWith(partitioned[index]))
            .reduce((a, b) => {
            return { ...(a || {}), ...(b || {}) };
        }, {});
        const newValues = partitionedQueryParam.queryParams
            .map((current, index) => {
            return {
                [current.urlParam]: current.serializeValue(partitioned[index]),
            };
        })
            .reduce((a, b) => {
            return { ...a, ...b };
        }, {});
        // Note that we list the side-effect parameters first so that our actual parameter can't be
        // overridden by it.
        return {
            ...combinedParams,
            ...newValues,
        };
    }
    /**
     * Returns the current set of options to pass to the router.
     *
     * This merges the global configuration with the group specific configuration.
     */
    get routerOptions() {
        const groupOptions = this.getQueryParamGroup().routerOptions;
        return {
            ...(this.globalRouterOptions || {}),
            ...(groupOptions || {}),
        };
    }
    /**
     * Returns the query parameter with the given name as a partition.
     *
     * If the query parameter is partitioned, it is returned unchanged. Otherwise
     * it is wrapped into a noop partition. This makes it easy to operate on
     * query parameters independent of whether they are partitioned.
     */
    getQueryParamAsPartition(queryParamName) {
        const queryParam = this.getQueryParamGroup().get(queryParamName);
        if (!queryParam) {
            throw new Error(`Could not find query param with name ${queryParamName}. Did you forget to add it to your QueryParamGroup?`);
        }
        return this.wrapIntoPartition(queryParam);
    }
    /**
     * Wraps a query parameter into a partition if it isn't already.
     */
    wrapIntoPartition(queryParam) {
        if (queryParam instanceof PartitionedQueryParam) {
            return queryParam;
        }
        return new PartitionedQueryParam([queryParam], {
            partition: value => [value],
            reduce: values => values[0],
        });
    }
    getQueryParamGroup() {
        if (!this.queryParamGroup) {
            throw new Error(`No QueryParamGroup has been registered yet.`);
        }
        return this.queryParamGroup;
    }
    static ɵfac = function QueryParamGroupService_Factory(t) { return new (t || QueryParamGroupService)(i0.ɵɵinject(NGQP_ROUTER_ADAPTER), i0.ɵɵinject(NGQP_ROUTER_OPTIONS, 8)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QueryParamGroupService, factory: QueryParamGroupService.ɵfac });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamGroupService, [{
        type: Injectable
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: [NGQP_ROUTER_ADAPTER]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NGQP_ROUTER_OPTIONS]
            }] }], null); })();

/** @ignore */
const NGQP_DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DefaultControlValueAccessorDirective),
    multi: true
};
/** @ignore */
function isAndroid(navigator) {
    return /android (\d+)/.test(navigator.userAgent.toLowerCase());
}
/** @ignore */
class DefaultControlValueAccessorDirective {
    platformId;
    renderer;
    elementRef;
    supportsComposition;
    composing = false;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        if (this.supportsComposition && this.composing) {
            return;
        }
        this.fnChange(event.target.value);
    }
    onBlur() {
        this.fnTouched();
    }
    onCompositionStart() {
        this.composing = true;
    }
    onCompositionEnd(event) {
        this.composing = false;
        if (this.supportsComposition) {
            this.fnChange(event.target.value);
        }
    }
    constructor(platformId, renderer, elementRef) {
        this.platformId = platformId;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.supportsComposition = isPlatformBrowser(this.platformId || '') && !isAndroid(window.navigator);
    }
    writeValue(value) {
        const normalizedValue = value === null ? '' : value;
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    static ɵfac = function DefaultControlValueAccessorDirective_Factory(t) { return new (t || DefaultControlValueAccessorDirective)(i0.ɵɵdirectiveInject(PLATFORM_ID, 8), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: DefaultControlValueAccessorDirective, selectors: [["input", "queryParamName", "", 3, "type", "checkbox", 3, "type", "radio"], ["textarea", "queryParamName", ""], ["input", "queryParam", "", 3, "type", "checkbox", 3, "type", "radio"], ["textarea", "queryParam", ""]], hostBindings: function DefaultControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function DefaultControlValueAccessorDirective_input_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function DefaultControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); })("compositionstart", function DefaultControlValueAccessorDirective_compositionstart_HostBindingHandler() { return ctx.onCompositionStart(); })("compositionend", function DefaultControlValueAccessorDirective_compositionend_HostBindingHandler($event) { return ctx.onCompositionEnd($event); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_DEFAULT_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DefaultControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input:not([type=checkbox]):not([type=radio])[queryParamName],textarea[queryParamName],' +
                    'input:not([type=checkbox]):not([type=radio])[queryParam],textarea[queryParam]',
                providers: [NGQP_DEFAULT_VALUE_ACCESSOR],
            }]
    }], () => [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], { onInput: [{
            type: HostListener,
            args: ['input', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }], onCompositionStart: [{
            type: HostListener,
            args: ['compositionstart']
        }], onCompositionEnd: [{
            type: HostListener,
            args: ['compositionend', ['$event']]
        }] }); })();

/** @ignore */
const NGQP_RANGE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangeControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class RangeControlValueAccessorDirective {
    renderer;
    elementRef;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        const value = event.target.value;
        this.fnChange(value === '' ? null : parseFloat(value));
    }
    onBlur() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', parseFloat(value));
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    static ɵfac = function RangeControlValueAccessorDirective_Factory(t) { return new (t || RangeControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: RangeControlValueAccessorDirective, selectors: [["input", "type", "range", "queryParamName", ""], ["input", "type", "range", "queryParam", ""]], hostBindings: function RangeControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function RangeControlValueAccessorDirective_input_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function RangeControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_RANGE_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RangeControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=range][queryParamName],input[type=range][queryParam]',
                providers: [NGQP_RANGE_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onInput: [{
            type: HostListener,
            args: ['input', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();

/** @ignore */
const NGQP_NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class NumberControlValueAccessorDirective {
    renderer;
    elementRef;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        const value = event.target.value;
        this.fnChange(value === '' ? null : parseFloat(value));
    }
    onBlur() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        const normalizedValue = value === null ? '' : value;
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    static ɵfac = function NumberControlValueAccessorDirective_Factory(t) { return new (t || NumberControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: NumberControlValueAccessorDirective, selectors: [["input", "type", "number", "queryParamName", ""], ["input", "type", "number", "queryParam", ""]], hostBindings: function NumberControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function NumberControlValueAccessorDirective_input_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function NumberControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_NUMBER_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NumberControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=number][queryParamName],input[type=number][queryParam]',
                providers: [NGQP_NUMBER_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onInput: [{
            type: HostListener,
            args: ['input', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();

/** @ignore */
const NGQP_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class CheckboxControlValueAccessorDirective {
    renderer;
    elementRef;
    fnChange = (_) => { };
    fnTouched = () => { };
    onInput(event) {
        this.fnChange(event.target.checked);
    }
    onBlur() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', value);
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    static ɵfac = function CheckboxControlValueAccessorDirective_Factory(t) { return new (t || CheckboxControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: CheckboxControlValueAccessorDirective, selectors: [["input", "type", "checkbox", "queryParamName", ""], ["input", "type", "checkbox", "queryParam", ""]], hostBindings: function CheckboxControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function CheckboxControlValueAccessorDirective_change_HostBindingHandler($event) { return ctx.onInput($event); })("blur", function CheckboxControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onBlur(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_CHECKBOX_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CheckboxControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][queryParamName],input[type=checkbox][queryParam]',
                providers: [NGQP_CHECKBOX_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onInput: [{
            type: HostListener,
            args: ['change', ['$event']]
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }] }); })();

/** @ignore */
const NGQP_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class SelectControlValueAccessorDirective {
    renderer;
    elementRef;
    value = null;
    selectedId = null;
    optionMap = new Map();
    idCounter = 0;
    fnChange = (_) => { };
    fnTouched = () => { };
    onChange(event) {
        this.selectedId = event.target.value;
        this.value = undefinedToNull(this.optionMap.get(this.selectedId));
        this.fnChange(this.value);
    }
    onTouched() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.value = value;
        this.selectedId = value === null ? null : this.getOptionId(value);
        if (this.selectedId === null) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'selectedIndex', -1);
        }
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.selectedId);
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    registerOption() {
        return (this.idCounter++).toString();
    }
    deregisterOption(id) {
        this.optionMap.delete(id);
    }
    updateOptionValue(id, value) {
        this.optionMap.set(id, value);
        if (this.selectedId === id) {
            this.fnChange(value);
        }
    }
    getOptionId(value) {
        for (const id of Array.from(this.optionMap.keys())) {
            if (this.optionMap.get(id) === value) {
                return id;
            }
        }
        return null;
    }
    static ɵfac = function SelectControlValueAccessorDirective_Factory(t) { return new (t || SelectControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: SelectControlValueAccessorDirective, selectors: [["select", "queryParamName", "", 3, "multiple", ""], ["select", "queryParam", "", 3, "multiple", ""]], hostBindings: function SelectControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function SelectControlValueAccessorDirective_change_HostBindingHandler($event) { return ctx.onChange($event); })("blur", function SelectControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onTouched(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_SELECT_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'select:not([multiple])[queryParamName],select:not([multiple])[queryParam]',
                providers: [NGQP_SELECT_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onChange: [{
            type: HostListener,
            args: ['change', ['$event']]
        }], onTouched: [{
            type: HostListener,
            args: ['blur']
        }] }); })();

/** @ignore */
const NGQP_MULTI_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectControlValueAccessorDirective),
    multi: true
};
/** @ignore */
class MultiSelectControlValueAccessorDirective {
    renderer;
    elementRef;
    selectedIds = [];
    options = new Map();
    optionMap = new Map();
    idCounter = 0;
    fnChange = (_) => { };
    fnTouched = () => { };
    onChange() {
        this.selectedIds = Array.from(this.options.entries())
            .filter(([id, option]) => option.selected)
            .map(([id]) => id);
        const values = this.selectedIds.map(id => this.optionMap.get(id));
        this.fnChange(values);
    }
    onTouched() {
        this.fnTouched();
    }
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(values) {
        values = values === null ? [] : values;
        if (!Array.isArray(values)) {
            throw new Error(`Provided a non-array value to select[multiple]: ${values}`);
        }
        this.selectedIds = values
            .map(value => this.getOptionId(value))
            .filter((id) => id !== null);
        this.options.forEach((option, id) => option.selected = this.selectedIds.includes(id));
    }
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    registerOption(option) {
        const newId = (this.idCounter++).toString();
        this.options.set(newId, option);
        return newId;
    }
    deregisterOption(id) {
        this.optionMap.delete(id);
    }
    updateOptionValue(id, value) {
        this.optionMap.set(id, value);
        if (this.selectedIds.includes(id)) {
            this.onChange();
        }
    }
    getOptionId(value) {
        for (const id of Array.from(this.optionMap.keys())) {
            if (this.optionMap.get(id) === value) {
                return id;
            }
        }
        return null;
    }
    static ɵfac = function MultiSelectControlValueAccessorDirective_Factory(t) { return new (t || MultiSelectControlValueAccessorDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: MultiSelectControlValueAccessorDirective, selectors: [["select", "multiple", "", "queryParamName", ""], ["select", "multiple", "", "queryParam", ""]], hostBindings: function MultiSelectControlValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function MultiSelectControlValueAccessorDirective_change_HostBindingHandler() { return ctx.onChange(); })("blur", function MultiSelectControlValueAccessorDirective_blur_HostBindingHandler() { return ctx.onTouched(); });
        } }, features: [i0.ɵɵProvidersFeature([NGQP_MULTI_SELECT_VALUE_ACCESSOR])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MultiSelectControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: 'select[multiple][queryParamName],select[multiple][queryParam]',
                providers: [NGQP_MULTI_SELECT_VALUE_ACCESSOR],
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { onChange: [{
            type: HostListener,
            args: ['change']
        }], onTouched: [{
            type: HostListener,
            args: ['blur']
        }] }); })();

/** @ignore */
const NGQP_BUILT_IN_ACCESSORS = [
    DefaultControlValueAccessorDirective,
    NumberControlValueAccessorDirective,
    RangeControlValueAccessorDirective,
    CheckboxControlValueAccessorDirective,
    SelectControlValueAccessorDirective,
    MultiSelectControlValueAccessorDirective,
];

/**
 * This resembles the selectControlValueAccessor function from
 *   https://github.com/angular/angular/blob/7.1.2/packages/forms/src/directives/shared.ts#L186
 * We can't use it directly since it isn't exported in the public API, but let's hope choosing
 * any accessor is good enough for our purposes.
 *
 * @internal
 */
function selectValueAccessor(valueAccessors) {
    if (!valueAccessors || !Array.isArray(valueAccessors)) {
        throw new Error(`No matching ControlValueAccessor has been found for this form control`);
    }
    let defaultAccessor = null;
    let builtInAccessor = null;
    let customAccessor = null;
    valueAccessors.forEach(valueAccessor => {
        if (valueAccessor.constructor === DefaultControlValueAccessorDirective) {
            defaultAccessor = valueAccessor;
        }
        else if (NGQP_BUILT_IN_ACCESSORS.some(current => valueAccessor.constructor === current)) {
            if (builtInAccessor !== null) {
                throw new Error(`More than one built-in ControlValueAccessor matches`);
            }
            builtInAccessor = valueAccessor;
        }
        else {
            if (customAccessor !== null) {
                throw new Error(`More than one custom ControlValueAccessor has been found on the form control`);
            }
            customAccessor = valueAccessor;
        }
    });
    if (customAccessor !== null) {
        return customAccessor;
    }
    if (builtInAccessor !== null) {
        return builtInAccessor;
    }
    if (defaultAccessor !== null) {
        return defaultAccessor;
    }
    throw new Error(`No matching ControlValueAccessor has been found for this form control`);
}

/**
 * Binds a {@link QueryParam} to a component directly.
 *
 * This directive accepts a {@link QueryParam} without requiring an outer {@link QueryParamGroup}.
 * It binds this parameter to the host component, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
class QueryParamDirective {
    groupService;
    /**
     * The {@link QueryParam} to bind to the host component.
     */
    queryParam = null;
    /** @internal */
    name = 'param';
    /** @internal */
    valueAccessor;
    /** @internal */
    group = new QueryParamGroup({});
    /** @internal */
    constructor(groupService, valueAccessors) {
        this.groupService = groupService;
        this.valueAccessor = selectValueAccessor(valueAccessors);
        this.groupService.setQueryParamGroup(this.group);
    }
    /** @ignore */
    ngOnChanges(changes) {
        const paramChange = changes['queryParam'];
        if (paramChange) {
            if (this.group.get(this.name)) {
                this.groupService.deregisterQueryParamDirective(this.name);
                this.group.remove(this.name);
            }
            if (paramChange.currentValue) {
                this.group.add(this.name, paramChange.currentValue);
                this.groupService.registerQueryParamDirective(this);
            }
        }
    }
    /** @ignore */
    ngOnDestroy() {
        if (this.groupService) {
            this.groupService.deregisterQueryParamDirective(this.name);
        }
    }
    static ɵfac = function QueryParamDirective_Factory(t) { return new (t || QueryParamDirective)(i0.ɵɵdirectiveInject(QueryParamGroupService, 8), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamDirective, selectors: [["", "queryParam", ""]], inputs: { queryParam: "queryParam" }, features: [i0.ɵɵProvidersFeature([QueryParamGroupService]), i0.ɵɵNgOnChangesFeature] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParam]',
                providers: [QueryParamGroupService],
            }]
    }], () => [{ type: QueryParamGroupService, decorators: [{
                type: Optional
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }], { queryParam: [{
            type: Input,
            args: ['queryParam']
        }] }); })();

/**
 * Binds a {@link QueryParam} to a DOM element.
 *
 * This directive accepts the name of a {@link QueryParam} inside its parent {@link QueryParamGroup}.
 * It binds this parameter to the host element, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
class QueryParamNameDirective {
    groupService;
    /**
     * The name of the {@link QueryParam} inside its parent {@link QueryParamGroup}.
     * Note that this does not refer to the [parameter name]{@link QueryParam#urlParam}.
     */
    set name(name) {
        this._name = name;
    }
    get name() {
        if (!this._name) {
            throw new Error(`No queryParamName has been specified.`);
        }
        return this._name;
    }
    /** @internal */
    valueAccessor;
    _name = null;
    /** @internal */
    constructor(groupService, valueAccessors) {
        this.groupService = groupService;
        if (!this.groupService) {
            throw new Error(`No parent configuration found. Did you forget to add [queryParamGroup]?`);
        }
        this.valueAccessor = selectValueAccessor(valueAccessors);
    }
    /** @ignore */
    ngOnChanges(changes) {
        const nameChange = changes['name'];
        if (nameChange) {
            if (!nameChange.firstChange) {
                this.groupService.deregisterQueryParamDirective(nameChange.previousValue);
            }
            if (nameChange.currentValue) {
                this.groupService.registerQueryParamDirective(this);
            }
        }
    }
    /** @ignore */
    ngOnDestroy() {
        if (this.groupService) {
            this.groupService.deregisterQueryParamDirective(this.name);
        }
    }
    static ɵfac = function QueryParamNameDirective_Factory(t) { return new (t || QueryParamNameDirective)(i0.ɵɵdirectiveInject(QueryParamGroupService, 8), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamNameDirective, selectors: [["", "queryParamName", ""]], inputs: { name: [i0.ɵɵInputFlags.None, "queryParamName", "name"] }, features: [i0.ɵɵNgOnChangesFeature] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamNameDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParamName]',
            }]
    }], () => [{ type: QueryParamGroupService, decorators: [{
                type: Optional
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }], { name: [{
            type: Input,
            args: ['queryParamName']
        }] }); })();

/**
 * Binds a {@link QueryParamGroup} to a DOM element.
 *
 * This directive accepts an instance of {@link QueryParamGroup}. Any child using
 * {@link QueryParamNameDirective} will then be matched against this group, and the
 * synchronization process can take place.
 */
class QueryParamGroupDirective {
    groupService;
    /**
     * The {@link QueryParamGroup} to bind.
     */
    queryParamGroup = null;
    /** @internal */
    constructor(groupService) {
        this.groupService = groupService;
    }
    /** @ignore */
    ngOnChanges(changes) {
        const groupChange = changes['queryParamGroup'];
        if (groupChange) {
            if (!groupChange.firstChange) {
                throw new Error(`Binding a different QueryParamGroup during runtime is currently not supported.`);
            }
            const queryParamGroup = groupChange.currentValue;
            if (!queryParamGroup) {
                throw new Error(`You added the queryParamGroup directive, but haven't supplied a group to use.`);
            }
            this.groupService.setQueryParamGroup(queryParamGroup);
        }
    }
    static ɵfac = function QueryParamGroupDirective_Factory(t) { return new (t || QueryParamGroupDirective)(i0.ɵɵdirectiveInject(QueryParamGroupService)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QueryParamGroupDirective, selectors: [["", "queryParamGroup", ""]], inputs: { queryParamGroup: "queryParamGroup" }, features: [i0.ɵɵProvidersFeature([QueryParamGroupService]), i0.ɵɵNgOnChangesFeature] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueryParamGroupDirective, [{
        type: Directive,
        args: [{
                selector: '[queryParamGroup]',
                providers: [QueryParamGroupService],
            }]
    }], () => [{ type: QueryParamGroupService }], { queryParamGroup: [{
            type: Input,
            args: ['queryParamGroup']
        }] }); })();

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
class ControlValueAccessorDirective {
    /**
     * Fired when a value should be written (model -> view).
     *
     * From the ControlValueAccessor perspective, this is the equivalent of
     * writeValue. You should bind to this event and update your component's
     * state with the given value.
     */
    controlValueChange = new EventEmitter();
    /**
     * Fired when the control's disabled change should change.
     *
     * From the ControlValueAccessor perspective, this is the equivalent of
     * setDisabledState.
     *
     * This is currently not used by ngqp.
     */
    disabledChange = new EventEmitter();
    fnChange = (_) => { };
    fnTouched = () => { };
    /**
     * Write a new value to the model (view -> model)
     *
     * When your component's value changes, call this method to inform
     * the model about the change.
     */
    notifyChange(value) {
        this.fnChange(value);
    }
    /**
     * Inform that the component has been touched by the user.
     *
     * This is currently not used by ngqp.
     */
    notifyTouched() {
        this.fnTouched();
    }
    /** @internal */
    writeValue(value) {
        this.controlValueChange.emit(value);
    }
    /** @internal */
    registerOnChange(fn) {
        this.fnChange = fn;
    }
    /** @internal */
    registerOnTouched(fn) {
        this.fnTouched = fn;
    }
    /** @internal */
    setDisabledState(isDisabled) {
        this.disabledChange.emit(isDisabled);
    }
    static ɵfac = function ControlValueAccessorDirective_Factory(t) { return new (t || ControlValueAccessorDirective)(); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: ControlValueAccessorDirective, selectors: [["", "controlValueAccessor", ""]], outputs: { controlValueChange: "controlValueChange", disabledChange: "disabledChange" }, exportAs: ["controlValueAccessor"], features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(() => ControlValueAccessorDirective),
                    multi: true
                }
            ])] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ControlValueAccessorDirective, [{
        type: Directive,
        args: [{
                selector: '[controlValueAccessor]',
                exportAs: 'controlValueAccessor',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => ControlValueAccessorDirective),
                        multi: true
                    }
                ],
            }]
    }], null, { controlValueChange: [{
            type: Output,
            args: ['controlValueChange']
        }], disabledChange: [{
            type: Output,
            args: ['disabledChange']
        }] }); })();

/** @ignore */
class SelectOptionDirective {
    parent;
    renderer;
    elementRef;
    id = null;
    constructor(parent, renderer, elementRef) {
        this.parent = parent;
        this.renderer = renderer;
        this.elementRef = elementRef;
        if (this.parent) {
            this.id = this.parent.registerOption();
        }
    }
    ngOnInit() {
        if (this.parent) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.id);
        }
    }
    ngOnDestroy() {
        if (this.parent) {
            this.parent.deregisterOption(this.id);
            this.parent.writeValue(this.parent.value);
        }
    }
    set value(value) {
        if (this.parent) {
            this.parent.updateOptionValue(this.id, value);
            this.parent.writeValue(this.parent.value);
        }
    }
    static ɵfac = function SelectOptionDirective_Factory(t) { return new (t || SelectOptionDirective)(i0.ɵɵdirectiveInject(SelectControlValueAccessorDirective, 9), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: SelectOptionDirective, selectors: [["option"]], inputs: { value: "value" } });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectOptionDirective, [{
        type: Directive,
        args: [{
                selector: 'option',
            }]
    }], () => [{ type: SelectControlValueAccessorDirective, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], { value: [{
            type: Input,
            args: ['value']
        }] }); })();

/** @ignore */
class MultiSelectOptionDirective {
    parent;
    renderer;
    elementRef;
    id = null;
    constructor(parent, renderer, elementRef) {
        this.parent = parent;
        this.renderer = renderer;
        this.elementRef = elementRef;
        if (this.parent) {
            this.id = this.parent.registerOption(this);
        }
    }
    ngOnInit() {
        if (this.parent) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.id);
        }
    }
    ngOnDestroy() {
        if (this.parent) {
            this.parent.deregisterOption(this.id);
        }
    }
    set value(value) {
        if (this.parent) {
            this.parent.updateOptionValue(this.id, value);
        }
    }
    get selected() {
        return this.elementRef.nativeElement.selected;
    }
    set selected(selected) {
        if (this.parent) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'selected', selected);
        }
    }
    static ɵfac = function MultiSelectOptionDirective_Factory(t) { return new (t || MultiSelectOptionDirective)(i0.ɵɵdirectiveInject(MultiSelectControlValueAccessorDirective, 9), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: MultiSelectOptionDirective, selectors: [["option"]], inputs: { value: "value" } });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MultiSelectOptionDirective, [{
        type: Directive,
        args: [{
                selector: 'option',
            }]
    }], () => [{ type: MultiSelectControlValueAccessorDirective, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], { value: [{
            type: Input,
            args: ['value']
        }] }); })();

/** @internal */
class DefaultRouterAdapter {
    router;
    route;
    constructor(router, route) {
        this.router = router;
        this.route = route;
    }
    get url() {
        return this.router.url;
    }
    get queryParamMap() {
        return this.route.queryParamMap;
    }
    navigate(queryParams, extras = {}) {
        return this.router.navigate([], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
            queryParams: queryParams,
            ...extras,
        });
    }
    getCurrentNavigation() {
        return this.router.getCurrentNavigation();
    }
    static ɵfac = function DefaultRouterAdapter_Factory(t) { return new (t || DefaultRouterAdapter)(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i1.ActivatedRoute)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DefaultRouterAdapter, factory: DefaultRouterAdapter.ɵfac });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DefaultRouterAdapter, [{
        type: Injectable
    }], () => [{ type: i1.Router }, { type: i1.ActivatedRoute }], null); })();

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

/**
 * Generated bundle index. Do not edit.
 */

export { AbstractQueryParam, CheckboxControlValueAccessorDirective, ControlValueAccessorDirective, DefaultControlValueAccessorDirective, DefaultRouterAdapter, DefaultRouterOptions, MultiQueryParam, MultiSelectControlValueAccessorDirective, MultiSelectOptionDirective, NGQP_BUILT_IN_ACCESSORS, NGQP_ROUTER_ADAPTER, NGQP_ROUTER_OPTIONS, NumberControlValueAccessorDirective, PartitionedQueryParam, QueryParam, QueryParamBuilder, QueryParamDirective, QueryParamGroup, QueryParamGroupDirective, QueryParamModule, QueryParamNameDirective, RangeControlValueAccessorDirective, SelectControlValueAccessorDirective, SelectOptionDirective, createBooleanDeserializer, createBooleanSerializer, createNumberDeserializer, createNumberSerializer, createStringDeserializer, createStringSerializer };
//# sourceMappingURL=ngqp-core.mjs.map
