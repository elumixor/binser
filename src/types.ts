export type PrimitiveType = "i32" | `f${32 | 64}` | "str" | "bool" | "date";
export type ObjectType = "obj";
export type FlatType = PrimitiveType | ObjectType;

export interface ArrayType<T extends FlatType = FlatType> {
    array: T | ArrayType<T>;
}
export type SerializableType<T extends FlatType = FlatType> = T | ArrayType<T>;

interface IFlatTypeMap {
    i32: number;
    f32: number;
    f64: number;
    str: string;
    bool: boolean;
    date: Date;
    obj: object & Record<string, unknown>;
}

export type JSType<T extends SerializableType = SerializableType> = T extends FlatType
    ? IFlatTypeMap[T]
    : T extends ArrayType<infer U>
      ? JSType<U>[]
      : never;

export type MaybeNested<T extends SerializableType, Instance> =
    T extends ArrayType<infer U> ? MaybeNested<U, Instance>[] : Instance;

export interface IDeserializationResult<T> {
    value: T;
    bytesUsed: number;
}
export type Constructor = abstract new (...args: unknown[]) => object;
