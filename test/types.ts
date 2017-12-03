import { expect } from 'chai';
import * as LoByte from '../lib/index';
import * as Cases from './cases';

function minValue(type: LoByte.NumericType) {
    switch (type.signedness) {
        case LoByte.Signedness.Agnostic:
        case LoByte.Signedness.Signed:
            return -Math.pow(2, type.bitSize - 1);      // Lower bound of a signed integer is -2^(N-1)
        default:
            expect(type.signedness).equals(LoByte.Signedness.Unsigned);
            return 0;                                   // Lower bound of an unsigned integer is always 0
    }
}

function maxValue(type: LoByte.NumericType) {
    switch (type.signedness) {
        case LoByte.Signedness.Agnostic:
        case LoByte.Signedness.Unsigned:
            return Math.pow(2, type.bitSize) - 1;       // Upper bound of an unsigned integer is 2^N - 1.
        default:
            expect(type.signedness).equals(LoByte.Signedness.Signed);
            return Math.pow(2, type.bitSize - 1) - 1;   // Upper bound of a signed integer is 2^(N-1) - 1
    }
}

function mask(type: LoByte.NumericType) {
    return Math.pow(2, type.bitSize) - 1;               // Mask is same as upper bound of unsigned.
}

Cases.types.forEach((testCase) => {
    const actual = testCase.actual;
    describe(testCase.name, () => {
        it('bitSize', () => {
            expect(actual.bitSize).equals(testCase.bits);
        });
        it('byteSize', () => {
            expect(actual.byteSize).equals(testCase.bits / 8);
        });
        it('min', () => {
            expect(actual.min).equals(minValue(actual));
        });
        it('max', () => {
            expect(actual.max).equals(maxValue(actual));
        });
        it('mask', () => {
            expect(actual.mask).equals(mask(actual));
        });
        it('signed', () => {
            expect(actual.signedness).equals(testCase.signed);
        });
        it('test', () => {
            for (const value of [actual.min, actual.max]) {
                expect(actual.test(value)).equals(true, `must accept ${value}`);
            }
            for (const value of [-Infinity, actual.min - 1, 0.5, actual.max + 1, +Infinity, NaN, undefined, null, '0', '']) {
                expect(actual.test(value as number)).equals(false, `must reject ${value}`);
            }
        });
        it('truncate', () => {
            expect(actual.truncate(actual.min)).equals(-Number.parseInt(testCase.minHex, 16));
            expect(actual.truncate(actual.max)).equals(Number.parseInt(testCase.maxHex, 16));
        });
        it('from', () => {
            expect(actual.from(-Number.parseInt(testCase.minHex, 16))).equals(actual.min);
            expect(actual.from(Number.parseInt(testCase.maxHex, 16))).equals(actual.max);
        });
        it('hex', () => {
            expect(actual.hex(actual.min)).equals(testCase.minHex);
            expect(actual.hex(actual.max)).equals(testCase.maxHex);
        });
    });
});
