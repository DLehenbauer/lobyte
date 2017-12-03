({ Int8 } = require('lobyte'));

console.log(Int8.min);          // -> -128
console.log(Int8.max);          // -> 127
console.log(Int8.bitSize);      // -> 8
console.log(Int8.byteSize);     // -> 1
console.log(Int8.mask);         // -> 0xFF

({ Int8, Int16 } = require('lobyte'));

console.log(Int8.hex(11));          // -> '0b'
console.log(Int16.hex(11));          // -> '000b'

({ ByteArray, Endianness, Uint32 } = require('lobyte'));

const bytes = new ByteArray(Endianness.Big);

bytes.pushInt8(1);                  // Append a zero byte.
bytes.pushUint8([2, 3, 4]);         // Append 3 more bytes.

console.log(Uint32.hex(bytes.getUint32(0)));    // prints '01020304' (since ByteArray is big endian)

bytes.endianness = Endianness.Little;
console.log(Uint32.hex(bytes.getUint32(0)));    // prints '04030201' (since ByteArray is now little endian)
