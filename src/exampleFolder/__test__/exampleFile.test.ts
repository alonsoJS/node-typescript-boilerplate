import { add } from '../exampleFile'

describe('EXAMPLE TEST', () => {
  it('should return the sum of the two values', () => {
    const values = {
      value1: 5,
      value2: 14,
    }

    const fnResult = add(values)

    expect(fnResult).toBe(values.value1 + values.value2)
  })
})
