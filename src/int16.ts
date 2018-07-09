import { NumericType, Signedness } from './numeric-type'

export class Int16Type extends NumericType {
    constructor() {
        super(Signedness.Signed, /* bitSize: */ 16, -0x8000, 0x7FFF)
    }

    truncate(value: number) {
        // Left-shift coerces to a 16b integer: sxxxxxxx xxxxxxxx 00000000 00000000
        // Right-shift sign extends           : ssssssss ssssssss sxxxxxxx xxxxxxxx
        return (value << 16) >> 16
    }

    getLE(bytes: Uint8Array, byteOffset: number) {
        return this.truncate(               // 'truncate()' sign extends as needed
              bytes[byteOffset++]
            | bytes[byteOffset] << 8)
    }

    setLE(bytes: Uint8Array, byteOffset: number, value: number) {
        bytes[byteOffset++] = value
        bytes[byteOffset]   = value >> 8
    }

    getBE(bytes: Uint8Array, byteOffset: number) {
        return this.truncate(               // 'truncate()' sign extends as needed
              bytes[byteOffset++] << 8
            | bytes[byteOffset])
    }

    setBE(bytes: Uint8Array, byteOffset: number, value: number) {
        bytes[byteOffset++] = value >> 8
        bytes[byteOffset]   = value
    }
}

export const Int16 = Object.freeze(new Int16Type());