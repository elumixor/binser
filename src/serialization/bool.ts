export function serializeBool(value: boolean) {
    const buffer = new ArrayBuffer(1);
    new DataView(buffer).setUint8(0, value ? 1 : 0);
    return buffer;
}

export function deserializeBool(buffer: ArrayBuffer, offset: number) {
    return { value: new DataView(buffer).getUint8(offset) === 1, bytesUsed: 1 };
}
