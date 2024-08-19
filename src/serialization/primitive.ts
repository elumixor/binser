import { deserializeBool, serializeBool } from "./bool";
import { deserializeDate, serializeDate } from "./date";
import { deserializeFloat, deserializeFloat64, serializeFloat, serializeFloat64 } from "./float";
import { deserializeInt, serializeInt } from "./int";
import { deserializeStr, serializeStr } from "./str";
import type { IDeserializationResult, JSType, PrimitiveType } from "../types";

export function serializePrimitive<T extends PrimitiveType = PrimitiveType>(value: JSType<T>, type: T): ArrayBuffer {
    if (type === "i32") return serializeInt(value as number);
    if (type === "f32") return serializeFloat(value as number);
    if (type === "f64") return serializeFloat64(value as number);
    if (type === "str") return serializeStr(value as string);
    if (type === "bool") return serializeBool(value as boolean);
    if (type === "date") return serializeDate(value as Date);

    throw new Error(`Unknown primitive type: ${type}`);
}

export function deserializePrimitive<T extends PrimitiveType = PrimitiveType>(
    buffer: ArrayBuffer,
    offset: number,
    type: T,
): IDeserializationResult<JSType<T>> {
    type R = IDeserializationResult<JSType<T>>;

    if (type === "i32") return deserializeInt(buffer, offset) as R;
    if (type === "f32") return deserializeFloat(buffer, offset) as R;
    if (type === "f64") return deserializeFloat64(buffer, offset) as R;
    if (type === "str") return deserializeStr(buffer, offset) as R;
    if (type === "bool") return deserializeBool(buffer, offset) as R;
    if (type === "date") return deserializeDate(buffer, offset) as R;

    throw new Error(`Unknown primitive type: ${type}`);
}
