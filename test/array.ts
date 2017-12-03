import { expect } from 'chai';
import * as LoByte from '../lib/index';
import * as Cases from './cases';

describe('ByteArray', () => {
    const defaultCapacity = 8;    // Must match defaultCapacity
    const boundsError = 'is outside the bounds of the';
    const valueError = 'Invalid value for';

    let array: LoByte.ByteArray;

    beforeEach(() => {
        array = new LoByte.ByteArray(LoByte.Endianness.Big);
    });

    const setArrayLength = (byteLength: number) => {
        array.pushUint8(new Array(byteLength - array.byteLength).fill(0));
        expect(array.byteLength).equals(byteLength);
    };

    const expectArrayEqual = (type: LoByte.NumericType, expected: ArrayLike<number>) => {
        expect(array.byteLength / type.byteSize).equals(expected.length, 'ByteArray should have the expected length');
        for (let i = 0; i < expected.length; i++) {
            expect(array.get(type, i  * type.byteSize)).equals(expected[i], 'ByteArray should contain the expected values');
        }
    };

    it('initial state', () => {
        expect(array.byteLength).equals(0);
        expect(array.byteCapacity).equals(defaultCapacity);
    });

    for (const testCase of Cases.types) {
        const typeName = testCase.name;
        const type = testCase.actual;
        const byteSize = type.byteSize;
        let getFn: (byteOffset: number) => number;
        let setFn: (byteOffset: number, valueOrValues: LoByte.numberOrNumbers) => void;
        let pushFn: (valueOrValues: LoByte.numberOrNumbers) => void;

        beforeEach(() => {
            getFn  = (array as any)[`get${
                (testCase.signed === LoByte.Signedness.Agnostic)
                    ? 'U' + testCase.name.substr(1)
                    : testCase.name}`].bind(array);
            setFn  = (array as any)[`set${testCase.name}`].bind(array);
            pushFn = (array as any)[`push${testCase.name}`].bind(array);
        });

        describe(typeName, () => {
            describe('out-of-range numeric value should throw RangeError', () => {
                for (const value of [type.min - 1, type.max + 1]) {
                    it(`push(${typeName}, ${value})`, () => {
                        expect(() => array.push(type, value)).throws(valueError);
                    });
                    it(`push${typeName}(${value})`, () => {
                        expect(() => pushFn(value)).throws(valueError);
                    });
                    it(`set(${typeName}, ${value})`, () => {
                        array.push(type, 0);
                        expect(() => array.set(type, 0, value)).throws(valueError);
                    });
                    it(`set${typeName}(${value})`, () => {
                        pushFn(0);
                        expect(() => setFn(0, value)).throws(valueError);
                    });
                }
            });

            describe('0 values', () => {
                it('set should throw', () => {
                    array.push(type, 0);
                    expect(() => array.set(type, 0, [])).throws('can not be empty');
                });
                it('push should not throw', () => {
                    array.push(type, []);
                    expect(array.byteLength).equals(0);
                });
            });

            describe('out-of-bounds access should throw RangeError', () => {
                const indices = [-1, 0];
                for (const byteOffset of indices) {
                    it(`get(${byteOffset}) of empty`, () => {
                        expect(() => array.get(type, byteOffset)).throws(boundsError);
                    });
                    it(`get${typeName}(${byteOffset}) of empty`, () => {
                        expect(() => getFn(byteOffset)).throws(boundsError);
                    });
                    it(`get${typeName}(${byteOffset}) of ${byteSize - 1} bytes`, () => {
                        setArrayLength(byteSize - 1);
                        expect(() => getFn(byteOffset)).throws(boundsError);
                    });
                    for (const values of [[0], [0, 0]]) {
                        describe(`${values.length} values`, () => {
                            it(`set(${byteOffset})`, () => {
                                expect(() => array.set(type, byteOffset, 0)).throws(boundsError);
                            });
                            it(`set${typeName}(${byteOffset}) of empty`, () => {
                                expect(() => setFn(byteOffset, values)).throws(boundsError);
                            });
                            it(`set${typeName}(${byteOffset}) of ${byteSize - 1} bytes`, () => {
                                setArrayLength((byteSize - 1) * values.length);
                                expect(() => setFn(byteOffset, values)).throws(boundsError);
                            });
                        });
                    }
                }
            });

            it('push/get', () => {
                array.push(type, type.max);
                expect(array.get(type, 0)).equals(type.max);
            });

            it(`push${typeName}/get${typeName}`, () => {
                pushFn(type.max);
                expect(getFn(0)).equals(type.max);
            });

            it(`push${typeName} (multiple)`, () => {
                const values = [type.max, type.max - 1];
                pushFn(values);
                expectArrayEqual(type, values);
            });

            it('set/get', () => {
                array.push(type, type.min);
                array.set(type, 0, type.max);
                expect(array.get(type, 0)).equals(type.max);
            });

            it(`set${typeName}/get${typeName}`, () => {
                pushFn(type.min);
                setFn(0, type.max);
                expect(getFn(0)).equals(type.max);
            });

            it(`set${typeName} (multiple)`, () => {
                const values = [type.max, type.max - 1];
                pushFn([0, 0]);
                setFn(0, values);
                expectArrayEqual(type, values);
            });

            it('growth', () => {
                const initialCapacity = array.byteCapacity;
                for (let expectedLength = byteSize; expectedLength <= initialCapacity; expectedLength += byteSize) {
                    array.push(type, expectedLength);
                    expect(array.byteLength).equals(expectedLength, 'byteLength should increase by byteSize');
                    expect(array.byteCapacity).equals(initialCapacity, 'byteCapacity should remain unchanged');
                }

                array.push(type, initialCapacity + byteSize);
                expect(array.byteLength).equals(initialCapacity + byteSize, 'byteLength should increase by byteSize');
                expect(array.byteCapacity).equals(initialCapacity * 2, 'byteCapacity should double');

                for (let byteOffset = 0; byteOffset < array.byteLength; byteOffset += byteSize) {
                    expect(array.get(type, byteOffset)).equals(byteOffset + byteSize, 'growth should preserve ByteArray contents');
                }
            });
        });
    }

    describe('splice', () => {
        const testSplice = (name: string, originalBytes: number, byteStartOffset: number, bytesInserted: number, bytesDeleted: number) => {
            it(name, () => {
                const original = new Array(originalBytes)
                    .fill(0)
                    .map((value, index) => LoByte.Uint8.min + value + index + 1);

                for (const value of original) {
                    array.push(LoByte.Uint8, value);
                }

                expectArrayEqual(LoByte.Uint8, original);

                const inserted = new Array(bytesInserted)
                    .fill(0)
                    .map((value, index) => LoByte.Uint8.max - value - index);

                array.splice(byteStartOffset, bytesDeleted, inserted);

                const expected = original.slice(0);
                expected.splice(byteStartOffset, bytesDeleted, ...inserted);
                expectArrayEqual(LoByte.Uint8, expected);

                expect(array.byteCapacity).equals(
                    Math.max(
                        Math.ceil(array.byteLength / defaultCapacity) * defaultCapacity,
                        defaultCapacity),
                    'Intermediate splice operations should not increase capacity');
            });
        };

        const firstGrowth = (defaultCapacity / LoByte.Uint8.byteSize) + 1;

        testSplice('empty / nothing',                         /* original */ 0, /* start */ 0, /* inserted */ 0, /* deleted */ 0);
        testSplice('non-empty / nothing',                     /* original */ 1, /* start */ 0, /* inserted */ 0, /* deleted */ 0);
        testSplice('empty / no growth',                       /* original */ 0, /* start */ 0, /* inserted */ 1, /* deleted */ 0);
        testSplice('empty / growth',                          /* original */ 0, /* start */ 0, /* inserted */ firstGrowth, /* deleted */ 0);
        testSplice('prefix / no growth',                      /* original */ 1, /* start */ 1, /* inserted */ 1, /* deleted */ 0);
        testSplice('prefix / growth',                         /* original */ 1, /* start */ 1, /* inserted */ firstGrowth - 1, /* deleted */ 0);
        testSplice('suffix / no growth',                      /* original */ 1, /* start */ 0, /* inserted */ 1, /* deleted */ 0);
        testSplice('suffix / growth',                         /* original */ 1, /* start */ 0, /* inserted */ firstGrowth - 1, /* deleted */ 0);
        testSplice('prefix / no growth / suffix',             /* original */ 2, /* start */ 1, /* inserted */ 1, /* deleted */ 0);
        testSplice('prefix / growth / suffix',                /* original */ 2, /* start */ 1, /* inserted */ firstGrowth - 2, /* deleted */ 0);
        testSplice('delete all',                              /* original */ 1, /* start */ 0, /* inserted */ 0, /* deleted */ 1);
        testSplice('prefix / delete',                         /* original */ 2, /* start */ 1, /* inserted */ 0, /* deleted */ 1);
        testSplice('delete / suffix',                         /* original */ 2, /* start */ 0, /* inserted */ 0, /* deleted */ 1);
        testSplice('prefix / no growth / delete / suffix',    /* original */ 3, /* start */ 1, /* inserted */ firstGrowth - 3, /* deleted */ 1);
        testSplice('prefix / growth / delete / suffix',       /* original */ 3, /* start */ 1, /* inserted */ firstGrowth - 2, /* deleted */ 1);

        it('splice/insert', () => {
            expect(() => array.splice(1, 0, [])).throws(boundsError);
        });
        it('splice/delete', () => {
            expect(() => array.splice(0, 1, [])).throws(boundsError);
        });
    });
});
