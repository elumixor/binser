import "reflect-metadata";

const metadataKey = Symbol("serialization");

export function addMetadata(target: object, key: string, type: string) {
    const proto = Reflect.getPrototypeOf(target)!;
    let map;
    if (!Reflect.hasMetadata(metadataKey, proto)) {
        map = [[], []] as [string[], string[]];
        Reflect.defineMetadata(metadataKey, map, proto);
    }
    map = Reflect.getMetadata(metadataKey, proto) as [string[], string[]];
    map[0].push(key);
    map[1].push(type);
}

export function getMetadata(target: object): [string[], string[]] {
    return Reflect.getMetadata(metadataKey, target) as [string[], string[]];
}
