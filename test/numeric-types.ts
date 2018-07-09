import { NumericType, Signedness } from '../dist'
import { assert } from 'chai'

const specialValues = [undefined, null, NaN, -Infinity, -0, +0, +Infinity]

const minValue = (type: NumericType) => {
    return type.signedness === Signedness.Signed
        ? -Math.pow(2, type.bitSize - 1)        // Lower bound of a signed integer is -2^(N-1)
        : 0                                     // Lower bound of an unsigned integer is 0
}

const maxValue = (type: NumericType) => {
    return type.signedness === Signedness.Signed
        ? Math.pow(2,  type.bitSize - 1) - 1    // Upper bound of a signed integer is 2^(N-1) - 1
        : Math.pow(2,  type.bitSize) - 1        // Upper bound of an unsigned integer is 2^N - 1.
}

export const testValues = (type: NumericType) => {
    const min = minValue(type)
    const max = maxValue(type)

    return specialValues.concat([min - 1, min, max, max + 1])
}

export const testForEachValue = (testName: string, values: any[], actual: (value: number) => any, expected: (value: number) => any) => {
    describe(testName, () => {
        values.forEach(value => {
            it(`${value} -> ${JSON.stringify(expected(value))}`, () => {
                assert.deepEqual(actual(value), expected(value))
            })
        })
    })
}