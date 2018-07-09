import { Int16 } from '../dist'
import { testValues, testForEachValue } from './numeric-types'

const values = testValues(Int16)

const i16 = new Int16Array(1)
const u8 = new Uint8Array(i16.buffer)
const dv = new DataView(i16.buffer)

testForEachValue('truncate', values, Int16.truncate, (value: number) => {
    i16[0] = value
    return i16[0]
})

testForEachValue(
    'setLE',
    values,
    (value: number) => {
        Int16.setLE(u8, /* byteOffset: */ 0, value)
        return [...u8]
    }, (value: number) => {
        dv.setInt16(0, value, /* littleEndian: */ true)
        return [...u8]
    })

testForEachValue(
    'getLE',
    values,
    (value: number) => {
        Int16.setLE(u8, /* byteOffset: */ 0, value)
        return Int16.getLE(u8, /* byteOffset: */ 0)
    }, (value: number) => {
        dv.setInt16(0, value, /* littleEndian: */ true)
        return dv.getInt16(/* byteOffset: */ 0, /* littleEndian: */ true)
    })

testForEachValue(
    'setBE',
    values,
    (value: number) => {
        Int16.setBE(u8, /* byteOffset: */ 0, value)
        return [...u8]
    }, (value: number) => {
        dv.setInt16(0, value, /* littleEndian: */ false)
        return [...u8]
    })

testForEachValue(
    'getBE',
    values,
    (value: number) => {
        Int16.setBE(u8, /* byteOffset: */ 0, value)
        return Int16.getBE(u8, /* byteOffset: */ 0)
    }, (value: number) => {
        dv.setInt16(0, value, /* littleEndian: */ false)
        return dv.getInt16(/* byteOffset: */ 0, /* littleEndian: */ false)
    })
