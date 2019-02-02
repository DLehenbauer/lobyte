// tslint:disable:no-console
import { Suite } from 'benchmark';
import { readInt16LE, readInt32LE, writeInt16LE, writeInt32LE } from '../src/index';

const buf8  = new Buffer(8);
const u8x8  = new Uint8Array(8);
const u16x4 = new Uint16Array(u8x8.buffer, 0);
const u32x2 = new Uint32Array(u8x8.buffer, 0);
const dv = new DataView(u8x8.buffer);

new Suite('Increment Int32 (LE)')
    .add('Uint32Array', () => { u32x2[0]++; })
    .add('LoByte', () => { writeInt32LE(u8x8, 0, readInt32LE(u8x8, 0) + 1); })
    .add('Buffer', () => { buf8.writeInt32LE(0, buf8.readInt32LE(0, /* noAssert: */ true) + 1, /* noAssert: */ true); })
    .add('DataView', () => { dv.setInt32(0, dv.getInt32(0, /* littleEndian: */ true), /* littleEndian: */ true); })
    .on('cycle', (event: any) => { console.log(String(event.target)); })
    .on('error', (event: any) => { console.error(String(event.target.error)); })
    .on('complete', (event: any) => { console.log(`Fastest is ${event.currentTarget.filter('fastest').map('name')}\n`); })
    .run();

new Suite('Increment Int16 (LE)')
    .add('Uint16Array', () => { u16x4[0]++; })
    .add('LoByte', () => { writeInt16LE(u8x8, 0, readInt16LE(u8x8, 0) + 1); })
    .add('Buffer', () => { buf8.writeInt16LE(0, buf8.readInt16LE(0, /* noAssert: */ true) + 1, /* noAssert: */ true); })
    .add('DataView', () => { dv.setInt16(0, dv.getInt16(0, /* littleEndian: */ true), /* littleEndian: */ true); })
    .on('cycle', (event: any) => { console.log(String(event.target)); })
    .on('error', (event: any) => { console.error(String(event.target.error)); })
    .on('complete', (event: any) => { console.log(`Fastest is ${event.currentTarget.filter('fastest').map('name')}\n`); })
    .run();
