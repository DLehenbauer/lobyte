import { toInt16, toInt8, toUint32 } from './types';
export * from './types';

export interface IBufferLike {
    [byteOffset: number]: number;
}

export function writeXint8(bytes: IBufferLike, byteOffset: number, value: number) {
    bytes[byteOffset++] = value;
}

export function writeXint16LE(bytes: IBufferLike, byteOffset: number, value: number) {
    bytes[byteOffset++] = value; value >>>= 8;
    bytes[byteOffset]   = value & 0xFF;
}

export function writeXint32LE(bytes: IBufferLike, byteOffset: number, value: number) {
    bytes[byteOffset++] = value & 0xFF; value >>>= 8;
    bytes[byteOffset++] = value & 0xFF; value >>>= 8;
    bytes[byteOffset++] = value & 0xFF; value >>>= 8;
    bytes[byteOffset]   = value;   // No mask required: Only 8 of 32 bits remaining after shift.
}

export function readInt8(bytes: IBufferLike, byteOffset: number) {
    return toInt8(readUint8(bytes, byteOffset));
}

export function readInt16LE(bytes: IBufferLike, byteOffset: number) {
    return toInt16(readUint16LE(bytes, byteOffset));
}

export function readInt32LE(bytes: IBufferLike, byteOffset: number) {
    return (bytes[byteOffset++] | bytes[byteOffset++] << 8 | bytes[byteOffset++] << 16 | bytes[byteOffset++] << 24);
}

export function readUint8(bytes: IBufferLike, byteOffset: number) {
    return bytes[byteOffset++];
}

export function readUint16LE(bytes: IBufferLike, byteOffset: number) {
    return (bytes[byteOffset++] | bytes[byteOffset++] << 8);
}

export function readUint32LE(bytes: IBufferLike, byteOffset: number) {
    return toUint32(readInt32LE(bytes, byteOffset));
}
