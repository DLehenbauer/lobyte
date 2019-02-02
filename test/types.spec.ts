import { expect } from 'chai';
import { Signedness } from '../src';
import { pretty } from './pretty';
import { INumericType, types } from './types';

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
        const includes = [min, max];
        const excludes = [-Infinity, min - 1, undefined, null, NaN, '0', 0.5, max + 1, +Infinity];

        // Note: Unsigned and twos-complement integers, testing min/max is also implicitly testing
        //       signedness and bitSize (or at least ensuring they are consistent).
        it(`min = ${pretty(min)}`, () =>  { expect(type.min).to.equal(min); });
        it(`max = ${pretty(max)}`, () =>  { expect(type.max).to.equal(max); });
        describe('test', () => {
            for (const value of includes) {
                it(`${pretty(value)} -> true`, () => {
                    expect(type.test(value)).to.equal(true);
                });
            }
            for (const value of excludes) {
                it(`${pretty(value)} -> false`, () => {
                    expect(type.test(value as any)).to.equal(false);
                });
            }
        });
    });
}
