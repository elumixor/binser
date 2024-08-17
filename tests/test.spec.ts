import { test, expect, describe } from "bun:test";
import { s } from "../src";

class Example {
    @s.i32
    i32 = 5678;
    @s.f32
    f32 = 1.5;
    @s.f64
    f64 = 1.01;
    @s.str
    name = "serialize";
    @s.array.f64
    embedding = [0.1, 0.2, 0.3];
    @s.date
    date = new Date();
}

describe("serialization", () => {
    const example = new Example();
    const buffer = s.serialize(example);
    const deserialized = s.deserialize(buffer, Example);

    test("instanceof works", () => {
        expect(deserialized).toBeInstanceOf(Example);
    });

    test("i32 works", () => {
        expect(deserialized.i32).toBe(example.i32);
    });

    test("f32 works", () => {
        expect(deserialized.f32).toBe(example.f32);
    });

    test("f64 works", () => {
        expect(deserialized.f64).toBe(example.f64);
    });

    test("str works", () => {
        expect(deserialized.name).toBe(example.name);
    });

    test("array:f64 works", () => {
        expect(deserialized.embedding).toStrictEqual(example.embedding);
    });

    test("date works", () => {
        expect(deserialized.date).toEqual(example.date);
    });
});
