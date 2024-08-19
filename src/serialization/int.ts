export function serializeInt(value: number) {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setInt32(0, value, true);
    return buffer;
}

export function deserializeInt(buffer: ArrayBuffer, offset: number) {
    return { value: new DataView(buffer).getInt32(offset, true), bytesUsed: 4 };
}
