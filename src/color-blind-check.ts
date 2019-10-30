import { ColorBlindType } from './types'
import chroma from 'chroma-js'
const blinder = require('color-blind')

export function colorBlindCheck(colors: string[]) {
  const types: ColorBlindType[] = [
    'protanomaly',
    'protanopia',
    'deuteranomaly',
    'deuteranopia',
    'tritanomaly',
    'tritanopia',
  ]
  const invalid = []
  for (let i = 0; i < types.length; i++) {
    if (!checkType(colors, types[i])) invalid.push(types[i])
  }
  return invalid
}

function checkType(colors: string[], type: ColorBlindType) {
  // let ok = 0;
  let notok = 0
  const ratioThreshold = 5
  const smallestPerceivableDistance = 9
  const k = colors.length
  if (!k) {
    // console.log('no colors', type);
    return true
  }
  // compute distances between colors
  for (let a = 0; a < k; a++) {
    for (let b = a + 1; b < k; b++) {
      const colorA = chroma(colors[a])
      const colorB = chroma(colors[b])
      const distanceNorm = difference(colorA, colorB)
      if (distanceNorm < smallestPerceivableDistance) continue
      const aSim = blinder[type](colorA.hex())
      const bSim = blinder[type](colorB.hex())
      const distanceSim = difference(aSim, bSim)
      const isNotOk =
        distanceNorm / distanceSim > ratioThreshold && distanceSim < smallestPerceivableDistance
      if (isNotOk) {
        // console.log(type, colors[a],colors[b],aSim+'',bSim+'', distanceNorm, distanceSim, distanceNorm/distanceSim);
      }
      // count combinations that are problematic
      if (isNotOk) notok++
      // else ok++;
    }
  }
  // console.log(type, notok/(ok+notok));
  // compute share of problematic colorss
  return notok === 0
}

function difference(colorA: string | chroma.Color, colorB: string | chroma.Color) {
  return 0.5 * (chroma.deltaE(colorA, colorB) + chroma.deltaE(colorB, colorA))
}
