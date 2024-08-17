export function serializeArray<T>(array: T[], serializeFn: (value: T) => ArrayBufferLike) {
    const length = array.length;
    const lengthBuffer = new ArrayBuffer(4);
    new DataView(lengthBuffer).setUint32(0, length, true);

    const buffers = array.map(serializeFn);

    const totalByteLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    const finalBuffer = new ArrayBuffer(4 + totalByteLength);
    const finalView = new Uint8Array(finalBuffer);
    finalView.set(new Uint8Array(lengthBuffer), 0);

    let offset = 4;
    for (const buffer of buffers) {
        finalView.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }

    return finalBuffer;
}

export function deserializeArray<T>(
    buffer: ArrayBuffer,
    offset: number,
    deserializeFn: (buffer: ArrayBuffer, offset: number) => readonly [T, number],
): [T[], number] {
    const baseOffset = offset;

    const length = new DataView(buffer).getUint32(offset, true);
    offset += 4;

    const array = [];
    for (let i = 0; i < length; i++) {
        const [value, bytesUsed] = deserializeFn(buffer, offset);
        array.push(value);
        offset += bytesUsed;
    }

    return [array, offset - baseOffset] as const;
}

