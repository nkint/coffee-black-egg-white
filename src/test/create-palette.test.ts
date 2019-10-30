import { createPalette } from '..'
import { colorBlindCheck } from '../color-blind-check'
import chroma from 'chroma-js'

/**
 * @jest-environment node
 */

function stripSpaces(s: string) {
  return s.replace(/\s+/g, '')
}

export const foo = false
const cases = [
  {
    result: [
      'rgb(0, 66, 157)',
      'rgb(38, 113, 176)',
      'rgb(75, 161, 196)',
      'rgb(113, 208, 215)',
      'rgb(150, 255, 234)',
      'rgb(176, 255, 232)',
      'rgb(203, 255, 229)',
      'rgb(229, 255, 227)',
      'rgb(255, 255, 224)',
    ],
    colors: ['#00429d', '#96ffea', 'rgb(255, 255, 224)'],
    colors2: null as string[],
    numColors: 9,
    diverging: false,
    bezier: false,
    correctLightness: false,
    colorBlind: 'none' as const,
  },
  {
    result: [
      'rgb(0, 66, 157)',
      'rgb(20, 92, 168)',
      'rgb(41, 117, 178)',
      'rgb(61, 142, 188)',
      'rgb(81, 168, 198)',
      'rgb(101, 194, 209)',
      'rgb(122, 220, 220)',
      'rgb(143, 246, 230)',
      'rgb(255, 255, 224)',
    ],
    colors: ['#00429d', '#96ffea', 'rgb(255, 255, 224)'],
    colors2: null as string[],
    numColors: 9,
    diverging: false,
    bezier: false,
    correctLightness: true,
    colorBlind: 'none' as const,
  },
  {
    result: [
      'rgb(0, 66, 157)',
      'rgb(46, 89, 168)',
      'rgb(71, 113, 178)',
      'rgb(93, 138, 189)',
      'rgb(115, 162, 198)',
      'rgb(138, 188, 207)',
      'rgb(165, 213, 216)',
      'rgb(197, 237, 223)',
      'rgb(255, 255, 224)',
    ],
    colors: ['#00429d', '#96ffea', 'rgb(255, 255, 224)'],
    colors2: null as string[],
    numColors: 9,
    diverging: false,
    bezier: true,
    correctLightness: true,
    colorBlind: 'none' as const,
  },
  {
    result: [
      'rgb(0, 66, 157)',
      'rgb(75, 161, 196)',
      'rgb(150, 255, 234)',
      'rgb(203, 255, 229)',
      'rgb(255, 255, 224)',
      'rgb(255, 128, 159)',
      'rgb(255, 0, 94)',
      'rgb(201, 0, 76)',
      'rgb(147, 0, 58)',
    ],
    colors: ['#00429d', '#96ffea', 'rgb(255, 255, 224)'],
    colors2: ['rgb(255, 255, 224)', '#ff005e', '#93003a'],
    numColors: 9,
    diverging: true,
    bezier: false,
    correctLightness: false,
    colorBlind: 'none' as const,
  },
  {
    result: [
      'rgb(0, 66, 157)',
      'rgb(41, 117, 178)',
      'rgb(81, 168, 198)',
      'rgb(122, 220, 220)',
      'rgb(255, 255, 224)',
      'rgb(255, 187, 189)',
      'rgb(255, 107, 149)',
      'rgb(225, 0, 84)',
      'rgb(147, 0, 58)',
    ],
    colors: ['#00429d', '#96ffea', 'rgb(255, 255, 224)'],
    colors2: ['rgb(255, 255, 224)', '#ff005e', '#93003a'],
    numColors: 9,
    diverging: true,
    bezier: false,
    correctLightness: true,
    colorBlind: 'none' as const,
  },
  {
    result: [
      'rgb(0, 66, 157)',
      'rgb(71, 113, 178)',
      'rgb(115, 162, 198)',
      'rgb(165, 213, 216)',
      'rgb(255, 255, 224)',
      'rgb(255, 188, 175)',
      'rgb(244, 119, 127)',
      'rgb(207, 55, 89)',
      'rgb(147, 0, 58)',
    ],
    colors: ['#00429d', '#96ffea', 'rgb(255, 255, 224)'],
    colors2: ['rgb(255, 255, 224)', '#ff005e', '#93003a'],
    numColors: 9,
    diverging: true,
    bezier: true,
    correctLightness: true,
    colorBlind: 'none' as const,
  },
]

test('color palette generation', () => {
  cases.forEach(c => {
    const result = createPalette(
      c.colors,
      c.colors2,
      c.numColors,
      c.diverging,
      c.bezier,
      c.correctLightness,
      c.colorBlind,
    ).map(col => chroma(col).css())

    result.forEach((col, i) => {
      expect(stripSpaces(col)).toBe(stripSpaces(c.result[i]))
    })
  })
})

test('test palette creation', () => {
  cases.forEach(c => {
    const result = createPalette(
      c.colors,
      c.colors2,
      c.numColors,
      c.diverging,
      c.bezier,
      c.correctLightness,
      c.colorBlind,
    ).map(col => chroma(col).css())

    result.forEach((col, i) => {
      expect(stripSpaces(col)).toBe(stripSpaces(c.result[i]))
    })
  })
})

test('test color blind-ness', () => {
  const colors = ['#00429d', '#96ffea', '#ffffe0']
  const palette = createPalette(colors, [], 9, false, false, false)

  const invalid = colorBlindCheck(palette)
  expect(invalid).toHaveLength(1)
  expect(invalid[0]).toBe('protanopia')
})

test('test palette length', () => {
  const colors = ['#00429d', '#96ffea', '#ffffe0']
  expect(() => {
    createPalette(colors, [], 0)
  }).toThrowError(new Error('numColors must be greater than or equal of the total input color'))
})
