import { Decorator } from "./decorator";
import { deserialize, serialize } from "./serialization";
import { deserializeArray, serializeArray } from "./serialization/array";
import type { Constructor } from "./types";

class S extends Decorator {
    serialize(obj: object): ArrayBuffer {
        return serialize(obj, "obj");
    }
    deserialize<T extends Constructor>(buffer: ArrayBuffer, Class: T): InstanceType<T> {
        return deserialize(buffer, 0, "obj", Class).value;
    }

    readonly serializeArray = serializeArray;
    readonly deserializeArray = deserializeArray;
}

export const s = new S();
