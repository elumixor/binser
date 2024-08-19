import { test, expect } from "bun:test";
import { serializeArray, deserializeArray } from "./array";

test("array serialization works", () => {
    const value = [1, 2, 3, 4];
    const buffer = serializeArray(value, "i32");
    const { value: deserialized, bytesUsed: size } = deserializeArray(buffer, 0, "i32");
    expect(deserialized).toStrictEqual(value);
    expect(size).toBe(4 + 4 * value.length);
});

test("array serialization works with nested arrays", () => {
    const value = [
        [1, 2],
        [3, 4],
    ];
    const buffer = serializeArray(value, { array: "i32" });
    const { value: deserialized, bytesUsed: size } = deserializeArray(buffer, 0, { array: "i32" });
    expect(deserialized).toStrictEqual(value);
    expect(size).toBe(4 + (4 + 4 * 2) * 2);
});
