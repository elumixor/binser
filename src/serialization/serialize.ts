import type { Constructor } from "../types";
import { deserializeArray, serializeArray } from "./array";
import { deserializeObject, serializeObject } from "./object";
import { deserializePrimitive, serializePrimitive } from "./primitive";
import type {
    IDeserializationResult,
    JSType,
    MaybeNested,
    ObjectType,
    PrimitiveType,
    SerializableType,
} from "../types";

export function serialize<T extends SerializableType>(value: unknown, type: T): ArrayBuffer {
    // Check if it's an array
    if (typeof type !== "string") return serializeArray(value as unknown[], type.array);

    // Check if it's an object
    if (type === "obj") return serializeObject(value as object);

    // Otherwise, it's a primitive
    return serializePrimitive(value as JSType<PrimitiveType>, type);
}
export function deserialize<T extends SerializableType<PrimitiveType>>(
    buffer: ArrayBuffer,
    offset: number,
    type: T,
): IDeserializationResult<JSType<T>>;
export function deserialize<T extends SerializableType<ObjectType>, U extends Constructor>(
    buffer: ArrayBuffer,
    offset: number,
    type: T,
    Class: U,
): IDeserializationResult<MaybeNested<T, InstanceType<U>>>;
export function deserialize<T extends SerializableType, U extends Constructor>(
    buffer: ArrayBuffer,
    offset: number,
    type: T,
    Class?: U,
) {
    // Check if it's an array
    if (typeof type !== "string") return deserializeArray(buffer, offset, type.array, Class);

    // Check if it's an object
    if (type === "obj") {
        if (!Class) throw new Error("Class is required for object deserialization");
        return deserializeObject(buffer, offset, Class);
    }

    // Otherwise, it's a primitive
    return deserializePrimitive(buffer, offset, type);
}
