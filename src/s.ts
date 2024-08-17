import { addMetadata, getMetadata } from "./metadata";
import { serializeValue, deserializeValue } from "./serialization";

type Constructor = abstract new (...args: unknown[]) => object;

export const s = {
    i32: (target: object, key: string): void => {
        addMetadata(target, key, "i32");
    },
    str: (target: object, key: string): void => {
        addMetadata(target, key, "str");
    },
    f32: (target: object, key: string): void => {
        addMetadata(target, key, "f32");
    },
    f64: (target: object, key: string): void => {
        addMetadata(target, key, "f64");
    },
    bool: (target: object, key: string): void => {
        addMetadata(target, key, "bool");
    },
    date: (target: object, key: string): void => {
        addMetadata(target, key, "date");
    },
    array: {
        i32: (target: object, key: string): void => {
            addMetadata(target, key, "array:i32");
        },
        str: (target: object, key: string): void => {
            addMetadata(target, key, "array:str");
        },
        f32: (target: object, key: string): void => {
            addMetadata(target, key, "array:f32");
        },
        f64: (target: object, key: string): void => {
            addMetadata(target, key, "array:f64");
        },
        bool: (target: object, key: string): void => {
            addMetadata(target, key, "array:bool");
        },
        date: (target: object, key: string): void => {
            addMetadata(target, key, "array:date");
        },
    },
    serialize(obj: object): ArrayBuffer {
        const [propertyKeys, serializationTypes] = getMetadata(obj);

        const propertyValues = propertyKeys.map((key) => Reflect.get(obj, key) as unknown);

        const buffers = propertyValues.map((property, i) => serializeValue(property, serializationTypes[i]));

        const totalByteLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
        const finalBuffer = new ArrayBuffer(totalByteLength);
        const finalView = new Uint8Array(finalBuffer);

        let offset = 0;
        for (const buffer of buffers) {
            finalView.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        }

        return finalBuffer;
    },
    deserialize<T extends Constructor>(buffer: ArrayBuffer, Class: T, offset = 0): InstanceType<T> {
        const obj = {} as InstanceType<T>;
        const [propertyKeys, serializationTypes] = getMetadata(Class);

        for (let i = 0; i < propertyKeys.length; i++) {
            const key = propertyKeys[i];
            const type = serializationTypes[i];

            const [property, bytesUsed] = deserializeValue(buffer, offset, type);

            Reflect.set(obj, key, property);
            offset += bytesUsed;
        }

        Reflect.setPrototypeOf(obj, Class.prototype as object);

        return obj;
    },
    serializeArray(arr: unknown[], type: string): ArrayBuffer {
        const length = arr.length;
        const lengthBuffer = new ArrayBuffer(4);
        new DataView(lengthBuffer).setUint32(0, length, true);

        const valueBuffers = arr.map((value) => serializeValue(value, type));

        const totalByteLength = valueBuffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
        const finalBuffer = new ArrayBuffer(4 + totalByteLength);
        const finalView = new Uint8Array(finalBuffer);

        finalView.set(new Uint8Array(lengthBuffer), 0);

        let offset = 4;
        for (const buffer of valueBuffers) {
            finalView.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        }

        return finalBuffer;
    },
    deserializeArray<T extends Constructor>(buffer: ArrayBuffer, Class: T): InstanceType<T>[] {
        const length = new DataView(buffer).getUint32(0, true);
        const obj = new Array(length) as InstanceType<T>[];

        let offset = 4;
        for (let i = 0; i < length; i++) {
            const instance = {} as InstanceType<T>;
            const [propertyKeys, serializationTypes] = getMetadata(Class);

            for (let i = 0; i < propertyKeys.length; i++) {
                const key = propertyKeys[i];
                const type = serializationTypes[i];

                const [property, bytesUsed] = deserializeValue(buffer, offset, type);

                Reflect.set(instance, key, property);
                offset += bytesUsed;
            }

            Reflect.setPrototypeOf(instance, Class.prototype as object);

            obj[i] = instance;
        }

        return obj;
    },
};
