export function range(start: number, end: number, step: number) {
  // from https://github.com/lodash/lodash/blob/master/.internal/baseRange.js

  if (end === undefined) {
    end = start
    start = 0
  }
  step = step === undefined ? (start < end ? 1 : -1) : step

  let index = -1
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
  const result: number[] = new Array(length)

  while (length--) {
    result[++index] = start
    start += step
  }

  return result
}
