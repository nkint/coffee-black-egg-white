/*

original code in Svelte from here: https://github.com/gka/palettes

*/

import chroma from 'chroma-js'
import { range as _range } from './range'
import { ColorBlindType } from './types'
const blinder = require('color-blind')

function colorBlindSim(color: string, type: ColorBlindType) {
  return blinder[type](chroma(color).hex()) as string
}

export function createPalette(
  colors: string[],
  _colors2: string[] = [],
  numColors: number = 9,
  diverging: boolean = false,
  bezier: boolean = false,
  correctLightness: boolean = false,
  colorBlind = 'none' as ColorBlindType,
) {
  const colors2 = _colors2 || []

  const totalColorLength = colors.length + colors2.length
  if (numColors < totalColorLength) {
    throw new Error('numColors must be greater than or equal of the total input color')
  }

  const even = numColors % 2 === 0
  const numColorsLeft = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : numColors
  const numColorsRight = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : 0
  const genColors = colors.length !== 1 ? colors : autoColors(colors[0], numColorsLeft)
  const genColors2 = colors2.length !== 1 ? colors2 : autoColors(colors2[0], numColorsRight, true)

  const scaleLeft = bezier && colors.length > 1 ? chroma.bezier(genColors as any) : genColors
  const stepsLeft = colors.length
    ? chroma
        .scale(scaleLeft as any)
        .correctLightness(correctLightness)
        .colors(numColorsLeft)
    : []

  const scaleRight = bezier && colors2.length > 1 ? chroma.bezier(genColors2 as any) : genColors2
  const stepsRight =
    diverging && colors2.length
      ? chroma
          .scale(scaleRight as any)
          .correctLightness(correctLightness)
          .colors(numColorsRight)
      : []
  const steps = (even && diverging ? stepsLeft.slice(0, stepsLeft.length - 1) : stepsLeft).concat(
    stepsRight.slice(1),
  )

  function autoGradient(color: string, numColors: number) {
    const lab = chroma(color).lab()
    const lRange = 100 * (0.95 - 1 / numColors)
    const lStep = lRange / (numColors - 1)
    let lStart = (100 - lRange) * 0.5
    const range = _range(lStart, lStart + numColors * lStep, lStep)
    let offset = 0
    if (!diverging) {
      offset = 9999
      for (let i = 0; i < numColors; i++) {
        const diff = lab[0] - range[i]
        if (Math.abs(diff) < Math.abs(offset)) {
          offset = diff
        }
      }
    }
    return range.map(l => chroma.lab(l + offset, lab[1], lab[2]))
  }

  function autoColors(color: string, numColors: number, reverse = false) {
    if (diverging) {
      const colors = autoGradient(color, 3).concat(chroma('#f5f5f5'))
      if (reverse) colors.reverse()
      return colors
    } else {
      return autoGradient(color, numColors)
    }
  }
  return colorBlind === 'none' ? steps : steps.map(step => colorBlindSim(step, colorBlind))
}
