import "reflect-metadata";
import type { Constructor } from "./types";
import type { ObjectType, PrimitiveType, SerializableType } from "./types";

const metadataKey = Symbol("serialization");

interface IPrimitiveMetadata {
    readonly key: string;
    readonly type: SerializableType<PrimitiveType>;
}

interface IObjectMetadata {
    readonly key: string;
    readonly type: SerializableType<ObjectType>;
    readonly Class: Constructor;
}

export class Metadata {
    readonly pairs = new Array<IPrimitiveMetadata | IObjectMetadata>();
}

export function addMetadata(target: object, key: string, type: SerializableType<ObjectType>, Class: Constructor): void;
export function addMetadata(target: object, key: string, type: SerializableType<PrimitiveType>): void;
export function addMetadata(target: object, key: string, type: SerializableType, Class?: Constructor) {
    target = getTarget(target);

    let map;
    if (!Reflect.hasMetadata(metadataKey, target)) {
        map = new Metadata();
        Reflect.defineMetadata(metadataKey, map, target);
    }
    map = Reflect.getMetadata(metadataKey, target) as Metadata;

    const baseType = getBaseType(type);

    if (baseType === "obj") {
        if (!Class) throw new Error("Class must be provided for object type");
        map.pairs.push({ key, type: type as SerializableType<ObjectType>, Class });
    } else map.pairs.push({ key, type: type as SerializableType<PrimitiveType> });
}

export function getMetadata(target: object): Metadata {
    target = getTarget(target);

    const metadata = Reflect.getMetadata(metadataKey, target) as Metadata | undefined;
    if (!metadata) throw new Error(`Metadata not found for target:\n${String(target)}`);
    return metadata;
}

function getBaseType(type: SerializableType) {
    if (typeof type === "string") return type;
    return getBaseType(type.array);
}

// Make it work when used both on a class and an instance
function getTarget(target: object) {
    return target.constructor !== Function ? target.constructor : target;
}
