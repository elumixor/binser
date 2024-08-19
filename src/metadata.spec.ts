import { describe, test, expect } from "bun:test";
import { addMetadata, getMetadata, Metadata } from "./metadata";

describe("metadata", () => {
    test("works for both instance and class", () => {
        class Example {
            i32 = 5678;
        }

        addMetadata(Example, "i32", "i32");

        const metadata = getMetadata(Example);
        const instanceMetadata = getMetadata(new Example());

        expect(metadata).toStrictEqual(instanceMetadata);
        expect(metadata).toBeInstanceOf(Metadata);
    });

    test("works for primitives", () => {
        class Example {
            i32 = 5678;
            f32 = 1.5;
            f64 = 1.01;
            name = "serialize";
            date = new Date();
        }

        addMetadata(Example, "i32", "i32");
        addMetadata(Example, "f32", "f32");
        addMetadata(Example, "f64", "f64");
        addMetadata(Example, "name", "str");
        addMetadata(Example, "date", "date");

        const metadata = getMetadata(Example);

        const pairs = metadata.pairs;

        expect(pairs).toContainEqual({ key: "i32", type: "i32" });
        expect(pairs).toContainEqual({ key: "f32", type: "f32" });
        expect(pairs).toContainEqual({ key: "f64", type: "f64" });
        expect(pairs).toContainEqual({ key: "name", type: "str" });
        expect(pairs).toContainEqual({ key: "date", type: "date" });
    });

    test("works for arrays", () => {
        class Example {
            embedding = [0.1, 0.2, 0.3];
        }

        addMetadata(Example, "embedding", { array: "f64" });

        const { pairs } = getMetadata(Example);
        expect(pairs).toContainEqual({ key: "embedding", type: { array: "f64" } });
    });

    test("works for objects", () => {
        class Nested {
            a = 1234;
            b = 1.01;
        }

        class Example {
            nested = new Nested();
        }

        addMetadata(Example, "nested", "obj", Nested);

        const { pairs } = getMetadata(Example);
        expect(pairs).toContainEqual({ key: "nested", type: "obj", Class: Nested });
    });

    test("works for nested arrays", () => {
        class Example {
            nested = [
                [1, 2],
                [3, 4],
            ];
        }

        addMetadata(Example, "nested", { array: { array: "i32" } });

        const { pairs } = getMetadata(Example);
        expect(pairs).toContainEqual({ key: "nested", type: { array: { array: "i32" } } });
    });
});
