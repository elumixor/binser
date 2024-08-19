import type { Constructor } from "../types";
import { deserialize, serialize } from "./serialize";
import type { PrimitiveType, JSType, ObjectType, SerializableType } from "../types";

export function serializeArray(array: unknown[], type: SerializableType) {
    const length = array.length;
    const lengthBuffer = new ArrayBuffer(4);
    new DataView(lengthBuffer).setUint32(0, length, true);

    // Serialize recursively
    const buffers = array.map((value) => serialize(value, type));

    const totalByteLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    const finalBuffer = new ArrayBuffer(4 + totalByteLength);
    const finalView = new Uint8Array(finalBuffer);
    finalView.set(new Uint8Array(lengthBuffer), 0);

    let offset = 4;
    for (const buffer of buffers) {
        finalView.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }

    return finalBuffer;
}

export function deserializeArray<T extends SerializableType, U extends Constructor>(
    buffer: ArrayBuffer,
    offset: number,
    type: T,
    Class?: U,
) {
    const baseOffset = offset;

    const length = new DataView(buffer).getUint32(offset, true);
    offset += 4;

    const array = [];
    for (let i = 0; i < length; i++) {
        let value, bytesUsed;

        // Deserialize each element recursively
        if (type === "obj") {
            if (!Class) throw new Error("Class is required");
            ({ value, bytesUsed } = deserialize<SerializableType<ObjectType>, U>(buffer, offset, type, Class));
        } else {
            ({ value, bytesUsed } = deserialize(buffer, offset, type as PrimitiveType));
        }

        array.push(value);
        offset += bytesUsed;
    }

    return { value: array as JSType<T>[], bytesUsed: offset - baseOffset };
}
