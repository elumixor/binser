export function serializeDate(value: Date): ArrayBuffer {
    const timestamp = value.getTime(); // Get the Unix timestamp in milliseconds
    const buffer = new ArrayBuffer(8); // Allocate 8 bytes for a 64-bit integer
    new DataView(buffer).setFloat64(0, timestamp, true); // Store the timestamp as a 64-bit float
    return buffer;
}

export function deserializeDate(buffer: ArrayBuffer, offset: number) {
    const timestamp = new DataView(buffer).getFloat64(offset, true);
    return { value: new Date(timestamp), bytesUsed: 8 };
}
