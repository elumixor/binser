export function serializeStr(value: string) {
    const length = value.length;
    const lengthBuffer = new ArrayBuffer(4);
    new DataView(lengthBuffer).setUint32(0, length, true);

    const encoder = new TextEncoder();
    const stringBuffer = encoder.encode(value);

    const finalBuffer = new ArrayBuffer(4 + stringBuffer.byteLength);
    const finalView = new Uint8Array(finalBuffer);
    finalView.set(new Uint8Array(lengthBuffer), 0);
    finalView.set(stringBuffer, 4);

    return finalBuffer;
}

export function deserializeStr(buffer: ArrayBuffer, offset: number) {
    const length = new DataView(buffer).getUint32(offset, true);
    const stringBuffer = buffer.slice(offset + 4, offset + 4 + length);
    const str = new TextDecoder().decode(stringBuffer);
    return { value: str, bytesUsed: 4 + length };
}
