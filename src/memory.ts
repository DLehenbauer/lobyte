export class Memory {
    private  _x8: Uint8Array
    private _x16: Uint16Array | undefined
    private _x32: Uint32Array | undefined

    constructor (bytes: Uint8Array) {
        this._x8 = bytes
    }

    public get x8() { return this._x8 }

    public get x16() {
        if (!this._x16) {
            const buffer = this._x8.buffer
            this._x16 = new Uint16Array(buffer.slice(0, buffer.byteLength & ~1))
        }

        return this._x16
    }

    public get x32() {
        if (!this._x32) {
            const buffer = this._x8.buffer
            this._x32 = new Uint32Array(buffer.slice(0, buffer.byteLength & ~3))
        }

        return this._x32
    }

    public resize(newCapacity: number) {
        const oldCapacity = this._x8.byteLength
        this._x16 = undefined;
        const oldBytes = this._x8;
        this._x8 = new Uint8Array(newCapacity);
        this._x8.set(oldBytes.slice(0, Math.min(newCapacity, oldCapacity)));
    }
}