export type numberOrNumbers = number | (ArrayLike<number> & Iterable<number>);

/** Specifies the byte order for multibyte numerical types. */
export enum Endianness {
    Big,
    Little,
}

/** Specifies if a numerical type is signed, unsigned, or sign agnostic. */
export enum Signedness {
    Signed,
    Unsigned,
    Agnostic,
}

/** Type information and functions pertaining to a specific numeric type. */
export class NumericType {
    private static readonly view = new DataView(new ArrayBuffer(8));
    private static readonly hexPadding = '00000000';

    /** The number of bytes required to store a value of this type. */
    public readonly byteSize: number;

    public readonly agnosticType: NumericType;

    constructor(
        /** The name of this type. */
        public readonly name: string,

        /** Specifies if a numerical type is signed, unsigned, or sign agnostic. */
        public readonly signedness: Signedness,

        /** The number of bits used to represent a value. */
        public readonly bitSize: number,

        /** The smallest value reprentable by this type. */
        public readonly min: number,

        /** The largest value reprentable by this type. */
        public readonly max: number,

        /** Bitmask. */
        public readonly mask: number,

        /** Agnostic type */
        agnosticType: NumericType | undefined,

        /** When applied to a DataView, reads a value of this type. */
        public readonly getter: (byteOffset: number, littleEndian?: boolean) => number,

        /** When applied to a DataView, stores a value of this type. */
        public readonly setter: (byteOffset: number, value: number, littleEndian?: boolean) => void,

        public readonly typedArray: any,

        /** Converts the given number to this type by truncating bits. */
        public readonly truncate = (value: number) => {
            setter.call(NumericType.view, 0, value);
            return getter.call(NumericType.view, 0);
        }
    ) {
        this.byteSize = this.bitSize >>> 3;
        this.agnosticType = agnosticType || this;
        Object.freeze(this);
    }

    /** Returns true if the given value is represntable by this type. */
    public test(value: number) {
        return this.truncate(value) === value;
    }

    /** 
     * Reinterprets the bits of the given value as this type.  (e.g., Int8.from(0xFF) -> -1).
     * 
     * Throws a RangeError if the given value is outside the range that can be represented by this type.
     */
    public from(value: number) {
        this.agnosticType.ensure(value);

        return this.truncate(value);
    }

    /** Throws a RangeError if the given value is not represntable by this type. */
    public ensure(value: number) {
        if (this.test(value)) {
            return;
        }

        throw new RangeError(`Invalid value for ${this.name} (got '${value}')`);
    }

    /** Returns the bytes of the given value as an (untyped) Array. */
    public toArray(value: number, endian: Endianness) {
        this.ensure(value);
        this.setter.call(NumericType.view, 0, value, endian === Endianness.Little);
        return Array.from(new Uint8Array(NumericType.view.buffer, 0, this.byteSize));
    }

    public hex(value: number) {
        this.ensure(value);
        const hex = ((value & this.mask) >>> 0).toString(16);
        return NumericType.hexPadding.substr(8 - (this.byteSize * 2) + hex.length) + hex;
    }
}

/** Type information and functions pertaining to an sign agnostic 8-bit integer. */
// tslint:disable-next-line:variable-name
export const Xint8: NumericType = new NumericType(
    'Xint8',
    /* signedness   = */ Signedness.Agnostic,
    /* bits         = */ 8,
    /* min          = */ -0x80,
    /* max          = */ 0xFF,
    /* mask         = */ 0xFF,
    /* agnosticType = */ undefined,
    DataView.prototype.getUint8,
    DataView.prototype.setUint8,
    Uint8Array,
    (value: number) => value < 0
        ? Int8.truncate(value)
        : Uint8.truncate(value));

/** Type information and functions pertaining to an sign agnostic 16-bit integer. */
// tslint:disable-next-line:variable-name
export const Xint16: NumericType = new NumericType(
    'Xint16',
    /* signedness   = */ Signedness.Agnostic,
    /* bits         = */ 16,
    /* min          = */ -0x8000,
    /* max          = */ 0xFFFF,
    /* mask         = */ 0xFFFF,
    /* agnosticType = */ undefined,
    DataView.prototype.getUint16,
    DataView.prototype.setUint16,
    Uint16Array,
    (value: number) => value < 0
        ? Int16.truncate(value)
        : Uint16.truncate(value));

/** Type information and functions pertaining to an sign agnostic 32-bit integer. */
// tslint:disable-next-line:variable-name
export const Xint32: NumericType = new NumericType(
    'Xint32',
    /* signedness   = */ Signedness.Agnostic,
    /* bits         = */ 32,
    /* min          = */ -0x80000000,
    /* max          = */ 0xFFFFFFFF,
    /* mask         = */ 0xFFFFFFFF,
    /* agnosticType = */ undefined,
    DataView.prototype.getUint32,
    DataView.prototype.setUint32,
    Uint32Array,
    (value: number) => value < 0
        ? Int32.truncate(value)
        : Uint32.truncate(value));

/** Type information and functions pertaining to a signed 8-bit integer. */
// tslint:disable-next-line:variable-name
export const Int8 = new NumericType(
    'Int8',
    /* signedness   = */ Signedness.Signed,
    /* bits         = */ 8,
    /* min          = */ -0x80,
    /* max          = */ 0x7F,
    /* mask         = */ 0xFF,
    /* agnosticType = */ Xint8,
    DataView.prototype.getInt8,
    DataView.prototype.setInt8,
    Int8Array);

/** Type information and functions pertaining to a signed 16-bit integer. */
// tslint:disable-next-line:variable-name
export const Int16 = new NumericType(
    'Int16',
    /* signedness   = */ Signedness.Signed,
    /* bits         = */ 16,
    /* min          = */ -0x8000,
    /* max          = */ 0x7FFF,
    /* mask         = */ 0xFFFF,
    /* agnosticType = */ Xint16,
    DataView.prototype.getInt16,
    DataView.prototype.setInt16,
    Int16Array);

/** Type information and functions pertaining to a signed 32-bit integer. */
// tslint:disable-next-line:variable-name
export const Int32 = new NumericType(
    'Int32',
    /* signedness   = */ Signedness.Signed,
    /* bits         = */ 32,
    /* min          = */ -0x80000000,
    /* max          = */ 0x7FFFFFFF,
    /* mask         = */ 0xFFFFFFFF,
    /* agnosticType = */ Xint32,
    DataView.prototype.getInt32,
    DataView.prototype.setInt32,
    Int16Array);

/** Type information and functions pertaining to an unsigned 8-bit integer. */
// tslint:disable-next-line:variable-name
export const Uint8 = new NumericType(
    'Uint8',
    /* signedness   = */ Signedness.Unsigned,
    /* bits         = */ 8,
    /* min          = */ 0,
    /* max          = */ 0xFF,
    /* mask         = */ 0xFF,
    /* agnosticType = */ Xint8,
    DataView.prototype.getUint8,
    DataView.prototype.setUint8,
    Uint8Array);

/** Type information and functions pertaining to an unsigned 16-bit integer. */
// tslint:disable-next-line:variable-name
export const Uint16 = new NumericType(
    'Uint16',
    /* signedness   = */ Signedness.Unsigned,
    /* bits         = */ 16,
    /* min          = */ 0,
    /* max          = */ 0xFFFF,
    /* mask         = */ 0xFFFF,
    /* agnosticType = */ Xint16,
    DataView.prototype.getUint16,
    DataView.prototype.setUint16,
    Uint16Array);

/** Type information and functions pertaining to an unsigned 32-bit integer. */
// tslint:disable-next-line:variable-name
export const Uint32 = new NumericType(
    'Uint32',
    /* signedness   = */ Signedness.Unsigned,
    /* bits         = */ 32,
    /* min          = */ 0,
    /* max          = */ 0xFFFFFFFF,
    /* mask         = */ 0xFFFFFFFF,
    /* agnosticType = */ Xint32,
    DataView.prototype.getUint32,
    DataView.prototype.setUint32,
    Uint32Array);

/** A dynamically sized array of bytes, supporting operatings similar to DataViews and TypedArrays. */
export class ByteArray {
    private static readonly defaultCapacity = 8;

    private _byteLength = 0;
    private _buffer: Uint8Array;
    private _view: DataView;

    constructor(public endianness: Endianness) {
        this.resizeBuffer(ByteArray.defaultCapacity);
    }

    /** The length of the ByteArray in bytes. */
    public get byteLength() { return this._byteLength; }

    /** Removes bytes from the ByteArray and, if provided, inserts new bytes in their place. */
    public splice(startByteOffset: number, bytesDeleted: number, bytesInserted: ArrayLike<number>) {
        this.boundsCheck(startByteOffset, bytesDeleted);

        const originalSuffixStart = startByteOffset + bytesDeleted;
        const suffixLength = this._byteLength - originalSuffixStart;
        const byteLengthDelta = bytesInserted.length - bytesDeleted;
        const increase = this.getCapacityIncrease(byteLengthDelta);

        if (increase > 0) {
            const oldBytes = this._buffer.slice(0, this._byteLength);

            // Create a new Buffer to contain the spliced results.
            this.resizeBuffer(this.byteCapacity + increase);

            // If there are bytes prior to the insertion point, copy those to the destination.
            if (startByteOffset > 0) {
                const prefix = oldBytes.slice(0, startByteOffset);
                this._buffer.set(prefix);
            }

            // Copy the inserted bytes at the designated byte offset.
            this._buffer.set(bytesInserted, startByteOffset);

            // If there are bytes after the inserted bytes, copy those to the destination.
            if (suffixLength > 0) {
                const suffix = oldBytes.slice(originalSuffixStart);
                this._buffer.set(suffix, startByteOffset + bytesInserted.length);
            }
        } else {
            // If there are bytes we need to preserve after the inserted bytes, copy those now.
            if (suffixLength > 0) {
                this._buffer.copyWithin(startByteOffset + bytesInserted.length, originalSuffixStart, this._byteLength);
            }

            // Set the inserted bytes at the designated offset.
            this._buffer.set(bytesInserted, startByteOffset);
        }

        this._byteLength += byteLengthDelta;
    }

    /** Returns the value at the specified byte offset. */
    public get(type: NumericType, byteOffset: number) {
        this.boundsCheck(byteOffset, type.byteSize);
        return type.getter.call(this._view, byteOffset, this.isLittleEndian);
    }

    /** Sets the value(s) at the specified byte offset. */
    public set(type: NumericType, byteOffset: number, valueOrValues: number | (ArrayLike<number> & Iterable<number>)) {
        const byteSize = type.byteSize;
        if (typeof valueOrValues === 'number') {
            this.boundsCheck(byteOffset, byteSize);
            type.ensure(valueOrValues);
            type.setter.call(this._view, byteOffset, valueOrValues, this.isLittleEndian);
            byteOffset += byteSize;
        } else {
            const valuesLength = valueOrValues.length;

            // Attempting to set with a zero-length array is more likely to be an error than intentional.
            // Unlike push(), we throw to alert the programmer of a likely bug.
            if (valuesLength < 1) {
                throw new Error('Values can not be empty.');
            }

            this.boundsCheck(byteOffset, byteSize * valuesLength);
            for (const value of valueOrValues) {
                type.ensure(value);
                type.setter.call(this._view, byteOffset, value, this.isLittleEndian);
                byteOffset += byteSize;
            }
        }
    }

    /** Appends the given value(s) to the end of this ByteArray. */
    public push(type: NumericType, valueOrValues: numberOrNumbers) {
        const byteSize = type.byteSize;
        if (typeof valueOrValues === 'number') {
            this.ensureCapacity(byteSize);
            type.ensure(valueOrValues);
            type.setter.call(this._view, this._byteLength, valueOrValues, this.isLittleEndian);
            this._byteLength += byteSize;
        } else {
            const totalByteSize = byteSize * valueOrValues.length;
            this.ensureCapacity(totalByteSize);
            let byteOffset = this._byteLength;
            for (const value of valueOrValues) {
                type.ensure(value);
                type.setter.call(this._view, byteOffset, value, this.isLittleEndian);
                byteOffset += byteSize;
            }
            this._byteLength += totalByteSize;
        }
    }

    public getInt8(byteOffset: number)                                      { return this.get(Int8, byteOffset); }
    public setInt8(byteOffset: number, valueOrValues: numberOrNumbers)      { this.set(Int8, byteOffset, valueOrValues); }
    public pushInt8(valueOrValues: numberOrNumbers)                         { this.push(Int8, valueOrValues); }

    public getInt16(byteOffset: number)                                     { return this.get(Int16, byteOffset); }
    public setInt16(byteOffset: number, valueOrValues: numberOrNumbers)     { this.set(Int16, byteOffset, valueOrValues); }
    public pushInt16(valueOrValues: numberOrNumbers)                        { this.push(Int16, valueOrValues); }

    public getInt32(byteOffset: number)                                     { return this.get(Int32, byteOffset); }
    public setInt32(byteOffset: number, valueOrValues: numberOrNumbers)     { this.set(Int32, byteOffset, valueOrValues); }
    public pushInt32(valueOrValues: numberOrNumbers)                        { this.push(Int32, valueOrValues); }

    public getUint8(byteOffset: number)                                     { return this.get(Uint8, byteOffset); }
    public setUint8(byteOffset: number, valueOrValues: numberOrNumbers)     { this.set(Uint8, byteOffset, valueOrValues); }
    public pushUint8(valueOrValues: numberOrNumbers)                        { this.push(Uint8, valueOrValues); }

    public getUint16(byteOffset: number)                                    { return this.get(Uint16, byteOffset); }
    public setUint16(byteOffset: number, valueOrValues: numberOrNumbers)    { this.set(Uint16, byteOffset, valueOrValues); }
    public pushUint16(valueOrValues: numberOrNumbers)                       { this.push(Uint16, valueOrValues); }

    public getUint32(byteOffset: number)                                    { return this.get(Uint32, byteOffset); }
    public setUint32(byteOffset: number, valueOrValues: numberOrNumbers)    { this.set(Uint32, byteOffset, valueOrValues); }
    public pushUint32(valueOrValues: numberOrNumbers)                       { this.push(Uint32, valueOrValues); }

    public setXint8(byteOffset: number, valueOrValues: numberOrNumbers)     { this.set(Xint8, byteOffset, valueOrValues); }
    public pushXint8(valueOrValues: numberOrNumbers)                        { this.push(Xint8, valueOrValues); }

    public setXint16(byteOffset: number, valueOrValues: numberOrNumbers)    { this.set(Xint16, byteOffset, valueOrValues); }
    public pushXint16(valueOrValues: numberOrNumbers)                       { this.push(Xint16, valueOrValues); }

    public setXint32(byteOffset: number, valueOrValues: numberOrNumbers)    { this.set(Xint32, byteOffset, valueOrValues); }
    public pushXint32(valueOrValues: numberOrNumbers)                       { this.push(Xint32, valueOrValues); }

    /** @internal */
    public get byteCapacity() { return this._buffer.byteLength; }

    public toUint8Array(startByteOffset = 0, byteLength = this._byteLength) {
        return new Uint8Array(this._buffer.slice(startByteOffset, byteLength));
    }

    private resizeBuffer(newCapacity: number) {
        this._buffer = new Uint8Array(newCapacity);
        this._view = new DataView(this._buffer.buffer);
    }

    private boundsCheck(startByteOffset: number, byteSize: number) {
        // Note: We let negative and non-integer numbers pass through to the underlying
        //       DataView/Buffer which will through the appropriate error.
        if (startByteOffset + byteSize > this._byteLength) {
            throw new RangeError('Offset is outside the bounds of the ByteArray');
        }
    }

    private getCapacityIncrease(bytesNeeded: number) {
        const capacity = this.byteCapacity;
        const bytesAvailable = capacity - this._byteLength;
        const increase = bytesNeeded - bytesAvailable;

        return increase <= 0            // If the needed bytes fit in available capacity
            ? 0                         //   ..then no growth is necessary.
            : increase < capacity       // Else, ensure that capacity is at least doubled.
                ? capacity
                : increase;
    }

    private ensureCapacity(bytesNeeded: number) {
        const increase = this.getCapacityIncrease(bytesNeeded);
        if (increase <= 0) {
            return;
        }

        const oldBuffer = this._buffer.slice(0, this._byteLength);
        this.resizeBuffer(this.byteCapacity + increase);
        this._buffer.set(oldBuffer);
    }

    private get isLittleEndian() {
        return this.endianness === Endianness.Little;
    }
}
