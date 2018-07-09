import { Memory } from '../dist'
import { assert } from 'chai'

describe('memory', () => {
    describe('construction', () => {
        for (const length of [0, 1, 3, 4, 7, 8, 9, 12]) {
            it(`${length} bytes`, () => {
                const memory = new Memory(new Uint8Array(length))
                assert.equal(memory.x8.byteLength, length)
                assert.equal(memory.x16.byteLength, (length >>> 1) << 1)
                assert.equal(memory.x32.byteLength, (length >>> 2) << 2)
            })
        }
    })
})