import type { Constructor } from "../types";
import { getMetadata } from "../metadata";
import { deserialize, serialize } from "./serialize";
import type { IDeserializationResult } from "../types";

export function serializeObject(obj: object): ArrayBuffer {
    const { pairs } = getMetadata(obj);

    const propertyValues = pairs.map(({ key }) => Reflect.get(obj, key) as unknown);

    // Serialize each property recursively
    const buffers = propertyValues.map((property, i) => serialize(property, pairs[i].type));

    const totalByteLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    const finalBuffer = new ArrayBuffer(totalByteLength);
    const finalView = new Uint8Array(finalBuffer);

    let offset = 0;
    for (const buffer of buffers) {
        finalView.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }

    return finalBuffer;
}

export function deserializeObject<T extends Constructor>(
    buffer: ArrayBuffer,
    offset: number,
    Class: T,
): IDeserializationResult<InstanceType<T>> {
    const baseOffset = offset;

    const obj = {} as InstanceType<T>;

    const { pairs } = getMetadata(Class);
    for (const pair of pairs) {
        let value, bytesUsed;

        if ("Class" in pair) ({ value, bytesUsed } = deserialize(buffer, offset, pair.type, pair.Class));
        else ({ value, bytesUsed } = deserialize(buffer, offset, pair.type));

        Reflect.set(obj, pair.key, value);

        offset += bytesUsed;
    }

    Reflect.setPrototypeOf(obj, Class.prototype as object);

    return { value: obj, bytesUsed: offset - baseOffset };
}
