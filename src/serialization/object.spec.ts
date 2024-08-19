import { describe, expect, test } from "bun:test";
import { addMetadata } from "../metadata";
import { deserializeObject, serializeObject } from "./object";

describe("object serialization", () => {
    test("works with plain objects", () => {
        class Obj {
            a = 1234;
            b = 1.01;
        }

        addMetadata(Obj, "a", "i32");
        addMetadata(Obj, "b", "f64");

        const obj = new Obj();

        const buffer = serializeObject(obj);
        const { value: deserialized } = deserializeObject(buffer, 0, Obj);

        expect(deserialized).toStrictEqual(obj);
        expect(deserialized).toBeInstanceOf(Obj);

        expect(deserialized.a).toBe(obj.a);
        expect(deserialized.b).toBe(obj.b);
    });

    test("works with nested objects", () => {
        class Nested {
            a = 1234;
            b = 1.01;
        }

        addMetadata(Nested, "a", "i32");
        addMetadata(Nested, "b", "f64");

        class Obj {
            nested = new Nested();
        }

        addMetadata(Obj, "nested", "obj", Nested);

        const obj = new Obj();

        const buffer = serializeObject(obj);
        const { value: deserialized } = deserializeObject(buffer, 0, Obj);

        expect(deserialized).toStrictEqual(obj);
        expect(deserialized).toBeInstanceOf(Obj);

        expect(deserialized.nested).toStrictEqual(obj.nested);
        expect(deserialized.nested).toBeInstanceOf(Nested);

        expect(deserialized.nested.a).toBe(obj.nested.a);
        expect(deserialized.nested.b).toBe(obj.nested.b);
    });
});
