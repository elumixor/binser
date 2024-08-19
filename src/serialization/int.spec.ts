import { test, expect } from "bun:test";
import { serializeInt, deserializeInt } from "./int";

test("i32 serialization works", () => {
    const value = 1234;
    const buffer = serializeInt(value);
    const { value: deserialized, bytesUsed: size } = deserializeInt(buffer, 0);
    expect(deserialized).toBe(value);
    expect(size).toBe(4);
});
