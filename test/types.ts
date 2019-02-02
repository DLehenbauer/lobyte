import {
    BitSize,
    ByteSize,
    IBufferLike,
    isInt16,
    isInt32,
    isInt54,
    isInt8,
    isUint16,
    isUint32,
    isUint8,
    isXint16,
    isXint32,
    isXint8,
    Max,
    Min,
    readInt16LE,
    readInt32LE,
    readInt8,
    readUint16LE,
    readUint32LE,
    readUint8,
    Signedness,
    writeXint16LE,
    writeXint32LE,
    writeXint8,
} from '../src';

export interface INumericType {
    bitSize: BitSize;
    byteSize: ByteSize;
    max: number;
    min: number;
    name: string;
    signedness: Signedness;
    test: (value: number) => boolean;
}

export interface IEncodableType extends INumericType {
    dvRead: (dataView: DataView, index: number, littleEndian: boolean) => void;
    dvWrite: (dataView: DataView, index: number, value: number, littleEndian: boolean) => void;
    readLE: (bytes: IBufferLike, index: number) => void;
    writeLE: (bytes: IBufferLike, index: number, value: number) => void;
}

export const int8: IEncodableType = {
    bitSize: BitSize.int8,
    byteSize: ByteSize.int8,
    dvRead: (dataView, index) => dataView.getInt8(index),
    dvWrite: (dataView, index, value) => dataView.setInt8(index, value),
    max: Max.int8,
    min: Min.int8,
    name: 'Int8',
    readLE: readInt8,
    signedness: Signedness.signed,
    test: isInt8,
    writeLE: writeXint8,
};

export const int16: IEncodableType = {
    bitSize: BitSize.int16,
    byteSize: ByteSize.int16,
    dvRead: (dataView, index, littleEndian) => dataView.getInt16(index, littleEndian),
    dvWrite: (dataView, index, value, littleEndian) => dataView.setInt16(index, value, littleEndian),
    max: Max.int16,
    min: Min.int16,
    name: 'Int16',
    readLE: readInt16LE,
    signedness: Signedness.signed,
    test: isInt16,
    writeLE: writeXint16LE,
};

export const int32: IEncodableType = {
    bitSize: BitSize.int32,
    byteSize: ByteSize.int32,
    dvRead: (dataView, index, littleEndian) => dataView.getInt32(index, littleEndian),
    dvWrite: (dataView, index, value, littleEndian) => dataView.setInt32(index, value, littleEndian),
    max: Max.int32,
    min: Min.int32,
    name: 'Int32',
    readLE: readInt32LE,
    signedness: Signedness.signed,
    test: isInt32,
    writeLE: writeXint32LE,
};

export const int54: INumericType = {
    bitSize: BitSize.int54,
    byteSize: ByteSize.int54,
    max: Max.int54,
    min: Min.int54,
    name: 'Int54',
    signedness: Signedness.signed,
    test: isInt54,
};

export const uint8: IEncodableType = {
    bitSize: BitSize.uint8,
    byteSize: ByteSize.uint8,
    dvRead: (dataView, index) => dataView.getUint8(index),
    dvWrite: (dataView, index, value) => dataView.setUint8(index, value),
    max: Max.uint8,
    min: Min.uint8,
    name: 'Uint8',
    readLE: readUint8,
    signedness: Signedness.unsigned,
    test: isUint8,
    writeLE: writeXint8,
};

export const uint16: IEncodableType = {
    bitSize: BitSize.uint16,
    byteSize: ByteSize.uint16,
    dvRead: (dataView, index, littleEndian) => dataView.getUint16(index, littleEndian),
    dvWrite: (dataView, index, value, littleEndian) => dataView.setUint16(index, value, littleEndian),
    max: Max.uint16,
    min: Min.uint16,
    name: 'Uint16',
    readLE: readUint16LE,
    signedness: Signedness.unsigned,
    test: isUint16,
    writeLE: writeXint16LE,
};

export const uint32: IEncodableType = {
    bitSize: BitSize.uint32,
    byteSize: ByteSize.uint32,
    dvRead: (dataView, index, littleEndian) => dataView.getUint32(index, littleEndian),
    dvWrite: (dataView, index, value, littleEndian) => dataView.setUint32(index, value, littleEndian),
    max: Max.uint32,
    min: Min.uint32,
    name: 'Uint32',
    readLE: readUint32LE,
    signedness: Signedness.unsigned,
    test: isUint32,
    writeLE: writeXint32LE,
};

export const xint8: INumericType = {
    bitSize: BitSize.xint8,
    byteSize: ByteSize.xint8,
    max: Max.xint8,
    min: Min.xint8,
    name: 'Xint8',
    signedness: Signedness.agnostic,
    test: isXint8,
};

export const xint16: INumericType = {
    bitSize: BitSize.xint16,
    byteSize: ByteSize.xint16,
    max: Max.xint16,
    min: Min.xint16,
    name: 'Xint16',
    signedness: Signedness.agnostic,
    test: isXint16,
};

export const xint32: INumericType = {
    bitSize: BitSize.xint32,
    byteSize: ByteSize.xint32,
    max: Max.xint32,
    min: Min.xint32,
    name: 'Xint32',
    signedness: Signedness.agnostic,
    test: isXint32,
};

export const types = { int8, int16, int32, int54, uint8, uint16, uint32, xint8, xint16, xint32 };
export const encodables = { int8, int16, int32, uint8, uint16, uint32 };
