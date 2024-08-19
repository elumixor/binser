import { test, expect } from "bun:test";
import { serializeStr, deserializeStr } from "./str";

test("string serialization works", () => {
    const value = "hello";
    const buffer = serializeStr(value);
    const { value: deserialized, bytesUsed: size } = deserializeStr(buffer, 0);
    expect(deserialized).toBe(value);
    expect(size).toBe(4 + value.length);
});
