import * as LoByte from '../lib/index';

export const types = [
    { name: 'Int8',   actual: LoByte.Int8,   signed: LoByte.Signedness.Signed,   bits: 8,  maxHex: '7f', minHex: '80'},
    { name: 'Int16',  actual: LoByte.Int16,  signed: LoByte.Signedness.Signed,   bits: 16, maxHex: '7fff', minHex: '8000'},
    { name: 'Int32',  actual: LoByte.Int32,  signed: LoByte.Signedness.Signed,   bits: 32, maxHex: '7fffffff', minHex: '80000000'},
    { name: 'Uint8',  actual: LoByte.Uint8,  signed: LoByte.Signedness.Unsigned, bits: 8 , maxHex: 'ff', minHex: '00'},
    { name: 'Uint16', actual: LoByte.Uint16, signed: LoByte.Signedness.Unsigned, bits: 16, maxHex: 'ffff', minHex: '0000'},
    { name: 'Uint32', actual: LoByte.Uint32, signed: LoByte.Signedness.Unsigned, bits: 32, maxHex: 'ffffffff', minHex: '00000000'},
    { name: 'Xint8',  actual: LoByte.Xint8,  signed: LoByte.Signedness.Agnostic, bits: 8 , maxHex: 'ff', minHex: '80'},
    { name: 'Xint16', actual: LoByte.Xint16, signed: LoByte.Signedness.Agnostic, bits: 16, maxHex: 'ffff', minHex: '8000'},
    { name: 'Xint32', actual: LoByte.Xint32, signed: LoByte.Signedness.Agnostic, bits: 32, maxHex: 'ffffffff', minHex: '80000000'},
];
