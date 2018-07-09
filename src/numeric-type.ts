/** Specifies if a numerical type is signed, unsigned, or sign agnostic. */
export enum Signedness {
    Signed,
    Unsigned,
    Agnostic,
}

/** Specifies the byte order for multibyte numerical types. */
export enum Endianness {
    Little,
    Big,
    Machine = new Uint8Array(new Uint16Array([ 0xBE1E ]).buffer)[0] === 0xBE
            ? Endianness.Big
            : Endianness.Little
}

export abstract class NumericType {
    public readonly byteSize: number
    private readonly alignmentMask: number

    constructor(
        public readonly signedness: Signedness,
        public readonly bitSize: number,
        public readonly minValue: number,
        public readonly maxValue: number
    ) {
        this.byteSize = (bitSize + 7) >>> 3
        this.alignmentMask = this.byteSize - 1
    }

    isAligned(byteOffset: number) {
        return (byteOffset & this.alignmentMask) === 0
    }

    align(byteOffset: number) {
        const n = this.alignmentMask
        return ((byteOffset + n) >>> n) << n
    }

    abstract truncate(value: number): number
    abstract getLE(bytes: Uint8Array, byteOffset: number): number
    abstract setLE(bytes: Uint8Array, byteOffset: number, value: number): void
    abstract getBE(bytes: Uint8Array, byteOffset: number): number
    abstract setBE(bytes: Uint8Array, byteOffset: number, value: number): void
    
    test(value: number) { return this.truncate(value) === value }
    
    ensure(value: number) {
        if (this.truncate(value) !== value) {
            throw `${this.constructor.toString()} must be in the range [${this.minValue}..${this.maxValue}] inclusive, but got '${value}'.`
        }
    }
}