import { test, expect } from "bun:test";
import { serializeBool, deserializeBool } from "./bool";

test("bool serialization works", () => {
    const value = true;
    const buffer = serializeBool(value);
    const { value: deserialized, bytesUsed: size } = deserializeBool(buffer, 0);
    expect(deserialized).toBe(value);
    expect(size).toBe(1);
});
