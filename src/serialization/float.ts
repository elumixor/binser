export function serializeFloat(value: number) {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, value, true);
    return buffer;
}

export function deserializeFloat(buffer: ArrayBuffer, offset: number) {
    return { value: new DataView(buffer).getFloat32(offset, true), bytesUsed: 4 };
}

export function serializeFloat64(value: number) {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, value, true);
    return buffer;
}

export function deserializeFloat64(buffer: ArrayBuffer, offset: number) {
    return { value: new DataView(buffer).getFloat64(offset, true), bytesUsed: 8 };
}
