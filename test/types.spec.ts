import { expect } from 'chai';
import { Signedness } from '../src';
import { pretty } from './pretty';
import { INumericType, types } from './types';
import { getTestValues } from './values';

function getMin(type: INumericType) {
    // Int54 is an IEEE 754 double precision floating-point number.
    if (type.bitSize === 54) {
        return Number.MIN_SAFE_INTEGER;
    }

    switch (type.signedness) {
        case Signedness.agnostic:
        case Signedness.signed:
            return -Math.pow(2, type.bitSize - 1);      // Lower bound of a signed integer is -2^(N-1)
        default:
            expect(type.signedness).equals(Signedness.unsigned);
            return 0;                                   // Lower bound of an unsigned integer is always 0
    }
}

function getMax(type: INumericType) {
    switch (type.signedness) {
        case Signedness.agnostic:
        case Signedness.unsigned:
            return Math.pow(2, type.bitSize) - 1;       // Upper bound of an unsigned integer is 2^N - 1.
        default:
            expect(type.signedness).equals(Signedness.signed);
            return Math.pow(2, type.bitSize - 1) - 1;   // Upper bound of a signed integer is 2^(N-1) - 1
    }
}

for (const name of Object.keys(types)) {
    describe(name, () => {
        const type: INumericType = (types as any)[name];
        const min = getMin(type);
        const max = getMax(type);
        const test = (t: INumericType, value: number) => t.min <= value && value <= t.max && Math.trunc(value) === value;

        // Note: Unsigned and twos-complement integers, testing min/max is also implicitly testing
        //       signedness and bitSize (or at least ensuring they are consistent).
        it(`min = ${pretty(min)}`, () =>  { expect(type.min).to.equal(min); });
        it(`max = ${pretty(max)}`, () =>  { expect(type.max).to.equal(max); });
        const values = getTestValues(type);
        describe('test', () => {
            for (const value of values) {
                const expected = test(type, value);
                it(`${pretty(value)} -> ${expected}`, () => {
                    expect(type.test(value)).to.equal(expected);
                });
            }
        });
    });
}
