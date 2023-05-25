import { ParamDeserializer, ParamSerializer } from './types';
/**
 * Creates a serializer for parameters of type `string`.
 *
 * @param defaultValue Optional default value to return if the value to serialize is `undefined` or `null`.
 */
export declare function createStringSerializer(defaultValue?: string | null): ParamSerializer<string | null>;
/**
 * Creates a deserializer for parameters of type `string`.
 *
 * @param defaultValue Optional default value to return if the value to deserialize is `undefined` or `null`.
 */
export declare function createStringDeserializer(defaultValue?: string | null): ParamDeserializer<string | null>;
/**
 * Creates a serializer for parameters of type `number`.
 *
 * @param defaultValue Optional default value to return if the value to serialize is `undefined` or `null`.
 */
export declare function createNumberSerializer(defaultValue?: string | null): ParamSerializer<number | null>;
/**
 * Creates a deserializer for parameters of type `number`.
 *
 * @param defaultValue Optional default value to return if the value to deserialize is `undefined` or `null`.
 */
export declare function createNumberDeserializer(defaultValue?: number | null): ParamDeserializer<number | null>;
/**
 * Creates a serializer for parameters of type `boolean`.
 *
 * @param defaultValue Optional default value to return if the value to serialize is `undefined` or `null`.
 */
export declare function createBooleanSerializer(defaultValue?: string | null): ParamSerializer<boolean | null>;
/**
 * Creates a deserializer for parameters of type `boolean`.
 *
 * @param defaultValue Optional default value to return if the value to deserialize is `undefined` or `null`.
 */
export declare function createBooleanDeserializer(defaultValue?: boolean | null): ParamDeserializer<boolean | null>;
/** @internal */
export declare const DEFAULT_STRING_SERIALIZER: ParamSerializer<string | null>;
/** @internal */
export declare const DEFAULT_STRING_DESERIALIZER: ParamDeserializer<string | null>;
/** @internal */
export declare const DEFAULT_NUMBER_SERIALIZER: ParamSerializer<number | null>;
/** @internal */
export declare const DEFAULT_NUMBER_DESERIALIZER: ParamDeserializer<number | null>;
/** @internal */
export declare const DEFAULT_BOOLEAN_SERIALIZER: ParamSerializer<boolean | null>;
/** @internal */
export declare const DEFAULT_BOOLEAN_DESERIALIZER: ParamDeserializer<boolean | null>;
