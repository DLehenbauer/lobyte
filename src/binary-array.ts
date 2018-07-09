import { Endianness } from './numeric-type'
import { Int16 } from './int16'
import { Memory } from './memory'

/*
              ByteArray----------->Memory
              /       \
      ByteArrayLE  ByteArrayBE
           |            |
     ByteArrayMLE  ByteArrayMBE
*/

export abstract class BinaryArray {
    private readonly _memory = new Memory(new Uint8Array(4))
    private _byteLength = 0

    constructor (public endianness: Endianness) { }

    private get byteCapacity() { return this._memory.x8.byteLength }

    protected ensureCapacity(bytesNeeded: number) {
        const oldCapacity = this.byteCapacity
        const bytesAvailable = oldCapacity - this._byteLength
        const delta = bytesNeeded - bytesAvailable

        if (delta <= 0) {
            return
        }

        const increase = Math.max(oldCapacity, delta)
        const newCapacity = oldCapacity + increase;
        this._memory.resize(newCapacity)
    }
}