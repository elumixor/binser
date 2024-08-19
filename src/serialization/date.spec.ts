import { test, expect } from "bun:test";
import { serializeDate, deserializeDate } from "./date";

test("date serialization works", () => {
    const value = new Date();
    const buffer = serializeDate(value);
    const { value: deserialized, bytesUsed: size } = deserializeDate(buffer, 0);
    expect(deserialized).toBeInstanceOf(Date);
    expect(deserialized.getTime()).toBe(value.getTime());
    expect(size).toBe(8);
});
