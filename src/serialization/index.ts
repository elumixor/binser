import { serializeArray, deserializeArray } from "./array";
import { serializeBool, deserializeBool } from "./bool";
import { serializeDate, deserializeDate } from "./date";
import { serializeFloat, serializeFloat64, deserializeFloat, deserializeFloat64 } from "./float";
import { serializeInt, deserializeInt } from "./int";
import { serializeString, deserializeString } from "./str";

export function serializeValue(value: unknown, type: string) {
    switch (type) {
        case "i32":
            return serializeInt(value as number);
        case "f32":
            return serializeFloat(value as number);
        case "f64":
            return serializeFloat64(value as number);
        case "str":
            return serializeString(value as string);
        case "bool":
            return serializeBool(value as boolean);
        case "date":
            return serializeDate(value as Date);
        case "array:i32":
            return serializeArray(value as number[], serializeInt);
        case "array:f32":
            return serializeArray(value as number[], serializeFloat);
        case "array:f64":
            return serializeArray(value as number[], serializeFloat64);
        case "array:str":
            return serializeArray(value as string[], serializeString);
        case "array:bool":
            return serializeArray(value as boolean[], serializeBool);
        case "array:date":
            return serializeArray(value as Date[], serializeDate);
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}

export function deserializeValue(buffer: ArrayBuffer, offset: number, type: string) {
    switch (type) {
        case "i32":
            return deserializeInt(buffer, offset);
        case "f32":
            return deserializeFloat(buffer, offset);
        case "f64":
            return deserializeFloat64(buffer, offset);
        case "str":
            return deserializeString(buffer, offset);
        case "bool":
            return deserializeBool(buffer, offset);
        case "date":
            return deserializeDate(buffer, offset);
        case "array:i32":
            return deserializeArray(buffer, offset, deserializeInt);
        case "array:f32":
            return deserializeArray(buffer, offset, deserializeFloat);
        case "array:f64":
            return deserializeArray(buffer, offset, deserializeFloat64);
        case "array:str":
            return deserializeArray(buffer, offset, deserializeString);
        case "array:bool":
            return deserializeArray(buffer, offset, deserializeBool);
        case "array:date":
            return deserializeArray(buffer, offset, deserializeDate);
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}
