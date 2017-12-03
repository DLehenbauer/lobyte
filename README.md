# LoByte
A small JavaScript utility library for low-level byte manipulation.

# Installation
Using npm:
```
npm i -g npm
npm i --save lobyte
```
# Usage
Useful constants for Int/Uint 8/16/32:
```javascript
({ Int8 } = require('lobyte'));

console.log(Int8.min);          // -> -128
console.log(Int8.max);          // -> 127
console.log(Int8.bitSize);      // -> 8
console.log(Int8.byteSize);     // -> 1
console.log(Int8.mask);         // -> 0xFF
```
String formatting for hexidecimal numbers, zero-padded as appropriate for the byte size of the given type:
```javascript
({ Int8, Int16 } = require('lobyte'));

console.log(Int8.hex(11));          // -> '0b'
console.log(Int16.hex(11));          // -> '000b'
```
A dynamically growing byte array with DataView-like accessors for get, set, and push:
```javascript
({ ByteArray, Endianness, Uint32 } = require('lobyte'));

const bytes = new ByteArray(Endianness.Big);

bytes.pushInt8(1);                              // Append a zero byte.
bytes.pushUint8([2, 3, 4]);                     // Append 3 more bytes.
console.log(Uint32.hex(bytes.getUint32(0)));    // -> '01020304'

bytes.endianness = Endianness.Little;
console.log(Uint32.hex(bytes.getUint32(0)));    // -> '04030201'
```
