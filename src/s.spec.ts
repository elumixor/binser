import { describe, expect, test } from "bun:test";
import { s } from "./s";

describe("S object serialization", () => {
    test("works with plain objects", () => {
        class Obj {
            @s.i32
            a = 1234;
            @s.f32
            b = 1.5;
            @s.f64
            c = 1.01;
            @s.str
            d = "hello";
            @s.date
            e = new Date();
        }

        const obj = new Obj();

        const buffer = s.serialize(obj);
        const deserialized = s.deserialize(buffer, Obj);

        expect(deserialized).toStrictEqual(obj);
        expect(deserialized).toBeInstanceOf(Obj);

        expect(deserialized.a).toBe(obj.a);
        expect(deserialized.b).toBe(obj.b);
        expect(deserialized.c).toBe(obj.c);
        expect(deserialized.d).toBe(obj.d);
    });

    test("works with nested objects", () => {
        class Nested {
            @s.i32
            a = 1234;
            @s.f64
            b = 1.01;
        }

        class Obj {
            @s.object(Nested)
            nested = new Nested();
        }

        const obj = new Obj();

        const buffer = s.serialize(obj);
        const deserialized = s.deserialize(buffer, Obj);

        expect(deserialized).toStrictEqual(obj);
        expect(deserialized).toBeInstanceOf(Obj);

        expect(deserialized.nested).toStrictEqual(obj.nested);
        expect(deserialized.nested).toBeInstanceOf(Nested);

        expect(deserialized.nested.a).toBe(obj.nested.a);
        expect(deserialized.nested.b).toBe(obj.nested.b);
    });

    test("works with arrays", () => {
        class Obj {
            @s.array.i32
            a = [1, 2, 3, 4];
        }

        const obj = new Obj();

        const buffer = s.serialize(obj);
        const deserialized = s.deserialize(buffer, Obj);

        expect(deserialized).toStrictEqual(obj);
        expect(deserialized).toBeInstanceOf(Obj);

        expect(deserialized.a).toStrictEqual(obj.a);
    });

    test("works with nested arrays", () => {
        class Nested {
            @s.array.i32
            a = [1, 2];
        }

        class Obj {
            @s.array.object(Nested)
            nested = [new Nested(), new Nested()];
        }

        const obj = new Obj();

        const buffer = s.serialize(obj);
        const deserialized = s.deserialize(buffer, Obj);

        expect(deserialized).toStrictEqual(obj);
        expect(deserialized).toBeInstanceOf(Obj);

        expect(deserialized.nested).toStrictEqual(obj.nested);
        expect(deserialized.nested).toBeInstanceOf(Array);

        expect(deserialized.nested[0]).toStrictEqual(obj.nested[0]);
        expect(deserialized.nested[0]).toBeInstanceOf(Nested);

        expect(deserialized.nested[0].a).toStrictEqual(obj.nested[0].a);
    });
});
