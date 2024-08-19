import type { Constructor } from "./types";
import { addMetadata } from "./metadata";
import type { ArrayType, FlatType, ObjectType, SerializableType } from "./types";

export class Decorator {
    constructor(private readonly arrayNesting = 0) {}

    readonly i32 = (target: object, key: string): void => {
        addMetadata(target, key, this.resolveType("i32"));
    };
    readonly f32 = (target: object, key: string): void => {
        addMetadata(target, key, this.resolveType("f32"));
    };
    readonly f64 = (target: object, key: string): void => {
        addMetadata(target, key, this.resolveType("f64"));
    };
    readonly str = (target: object, key: string): void => {
        addMetadata(target, key, this.resolveType("str"));
    };
    readonly bool = (target: object, key: string): void => {
        addMetadata(target, key, this.resolveType("bool"));
    };
    readonly date = (target: object, key: string): void => {
        addMetadata(target, key, this.resolveType("date"));
    };
    readonly object = (Class: Constructor) => {
        return (target: object, key: string): void => {
            addMetadata(target, key, this.resolveType("obj"), Class);
        };
    };

    get array() {
        return new Decorator(this.arrayNesting + 1);
    }

    private resolveType<T extends FlatType | ObjectType>(ft: T): SerializableType<T> {
        if (this.arrayNesting === 0) return ft as SerializableType<T>;

        const base = { array: ft } as ArrayType;

        let current = base;
        for (let i = 1; i < this.arrayNesting; i++) {
            current.array = { array: ft };
            current = current.array;
        }

        return base as SerializableType<T>;
    }
}
