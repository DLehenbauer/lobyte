import { expect } from 'chai';
import { pretty } from './pretty';
import { encodables, IEncodableType, xint32 } from './types';

const zero = new Uint8Array(xint32.byteSize * 4);
const bytes = new Uint8Array(zero.length);
const dv = new DataView(bytes.buffer);

function roundTripLE(type: IEncodableType, byteOffset: number, value: number) {
    bytes.set(zero);
    type.dvWrite(dv, byteOffset, value, /* littleEndian: */ true);
    const expected = type.dvRead(dv, byteOffset, /* littleEndian: */ true);

    it (`${pretty(value)} -> ${pretty(expected)}`, () => {
        // Zero the buffer before we begin the test.
        bytes.set(zero);
        expect(type.dvRead(dv, byteOffset, /* littleEndian */ true)).equal(0);

        // Vet that writing/reading return the same value.
        type.writeLE(bytes, byteOffset, value);
        expect(type.dvRead(dv, byteOffset, /* littleEndian */ true)).equal(expected);

        // Sanity check that reading with DataView returns the same value.
        const actual = type.readLE(bytes, byteOffset);
        expect(actual).to.equal(expected);

        // Sanity check that writing did not overrun the expected area.
        expect(type.dvRead(dv, byteOffset - type.byteSize, /* littleEndian */ true)).equal(0);
        expect(type.dvRead(dv, byteOffset + type.byteSize, /* littleEndian */ true)).equal(0);
    });
}

for (const name of Object.keys(encodables)) {
    describe(name, () => {
        const type: IEncodableType = (encodables as any)[name];
        const values: any[] = [ type.min - 1, type.min, 0, '1', NaN, undefined, 0.5, type.max, type.max + 1];

        describe('read/write aligned', () => {
            for (const value of values) {
                roundTripLE(type, 4, value);
            }
        });

        describe('read/write unaligned', () => {
            for (const value of values) {
                roundTripLE(type, 5, value);
            }
        });
    });
}
