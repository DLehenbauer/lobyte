/** Specifies the byte order for multibyte numerical types. */
export enum Endianness {
    little  = 0,
    big     = 1,
}

/** Specifies if a numerical type is signed, unsigned, or sign agnostic. */
export enum Signedness {
    agnostic = 0,
    unsigned = 1,
    signed   = 2,
}

export const enum Max {
    int8    = 0x7F,
    int16   = 0x7FFF,
    int32   = 0x7FFFFFFF,
    int54   = 0x1FFFFFFFFFFFFF,     // TS2474: Number.MAX_SAFE_INTEGER is not constant
    uint8   = 0xFF,
    uint16  = 0xFFFF,
    uint32  = 0xFFFFFFFF,
    xint8   = 0xFF,
    xint16  = 0xFFFF,
    xint32  = 0xFFFFFFFF,
}

export const enum Min {
    int8    = -0x80,
    int16   = -0x8000,
    int32   = -0x80000000,
    int54   = -0x1FFFFFFFFFFFFF,    // TS2474: Number.MIN_SAFE_INTEGER is not constant
    uint8   = 0,
    uint16  = 0,
    uint32  = 0,
    xint8    = -0x80,
    xint16   = -0x8000,
    xint32   = -0x80000000,
}

export const enum ByteSize {
    int8    = 1,
    int16   = 2,
    int32   = 4,
    int54   = 8,
    uint8   = 1,
    uint16  = 2,
    uint32  = 4,
    xint8   = 1,
    xint16  = 2,
    xint32  = 4,
}

export const enum BitSize {
    int8    = 8,
    int16   = 16,
    int32   = 32,
    int54   = 54,
    uint8   = 8,
    uint16  = 16,
    uint32  = 32,
    xint8   = 8,
    xint16  = 16,
    xint32  = 32,
}

export function toInt8(value: number)   { return value << 24 >> 24; }
export function toInt16(value: number)  { return value << 16 >> 16; }
export function toInt32(value: number)  { return value | 0; }
export function toUint8(value: number)  { return value & Max.uint8; }
export function toUint16(value: number) { return value & Max.uint16; }
export function toUint32(value: number) { return value >>> 0; }

export function isInt8(value: number)   { return Min.int8 <= value && value <= Max.int8 && isInt32(value); }
export function isInt16(value: number)  { return Min.int16 <= value && value <= Max.int16 && isInt32(value); }
export function isInt32(value: number)  { return (value | 0) === value; }
export function isInt54(value: number)  { return Number.isSafeInteger(value); }
export function isUint8(value: number)  { return toUint8(value) === value; }
export function isUint16(value: number) { return toUint16(value) === value; }
export function isUint32(value: number) { return toUint32(value) === value; }
export function isXint8(value: number)  { return Min.int8 <= value && value <= Max.uint8 && isInt32(value); }
export function isXint16(value: number) { return Min.int16 <= value && value <= Max.uint16 && isInt32(value); }
export function isXint32(value: number) { return isInt32(value) || isUint32(value); }
