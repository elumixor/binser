import { test, expect } from "bun:test";
import { serializeFloat, serializeFloat64, deserializeFloat, deserializeFloat64 } from "./float";

test("f32 serialization works", () => {
    const value = 1.5;
    const buffer = serializeFloat(value);
    const { value: deserialized, bytesUsed: size } = deserializeFloat(buffer, 0);
    expect(deserialized).toBe(value);
    expect(size).toBe(4);
});

test("f32 serialization fails with bad floats", () => {
    const value = 1.01;
    const buffer = serializeFloat(value);
    const { value: deserialized, bytesUsed: size } = deserializeFloat(buffer, 0);
    expect(deserialized).not.toBe(value);
    expect(deserialized).toBeCloseTo(value);
    expect(size).toBe(4);
});

test("f64 serialization works", () => {
    const value = 1.01;
    const buffer = serializeFloat64(value);
    const { value: deserialized, bytesUsed: size } = deserializeFloat64(buffer, 0);
    expect(deserialized).toBe(value);
    expect(size).toBe(8);
});
