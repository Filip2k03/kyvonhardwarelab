import type { HueBucket } from '@/data/scan/kitVisualProfiles'

export interface FrameAnalysis {
  readonly dominantHues: readonly HueBucket[]
  readonly brightness: 'dark' | 'mid' | 'bright'
  readonly meanLuma: number
  readonly saturation: number
}

function hueToBucket(h: number): HueBucket {
  if (h < 15 || h >= 345) return 'red'
  if (h < 40) return 'orange'
  if (h < 70) return 'yellow'
  if (h < 160) return 'green'
  if (h < 200) return 'cyan'
  if (h < 260) return 'blue'
  if (h < 290) return 'purple'
  if (h < 330) return 'pink'
  return 'red'
}

/** Sample ImageData and estimate dominant hues + brightness (no cloud). */
export function analyzeImageData(image: ImageData): FrameAnalysis {
  const { data, width, height } = image
  const step = Math.max(4, Math.floor(Math.min(width, height) / 40)) * 4
  const hueCounts: Record<HueBucket, number> = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    cyan: 0,
    blue: 0,
    purple: 0,
    pink: 0,
    brown: 0,
    black: 0,
    white: 0,
    gray: 0,
  }

  let lumaSum = 0
  let satSum = 0
  let samples = 0

  for (let i = 0; i < data.length; i += step) {
    const r = data[i]! / 255
    const g = data[i + 1]! / 255
    const b = data[i + 2]! / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const sat = max === 0 ? 0 : delta / max
    lumaSum += luma
    satSum += sat
    samples += 1

    if (luma < 0.12) {
      hueCounts.black += 2
      continue
    }
    if (luma > 0.85 && sat < 0.15) {
      hueCounts.white += 2
      continue
    }
    if (sat < 0.12) {
      hueCounts.gray += 1
      continue
    }

    let h = 0
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6
      else if (max === g) h = (b - r) / delta + 2
      else h = (r - g) / delta + 4
      h *= 60
      if (h < 0) h += 360
    }
    // brown heuristic
    if (h >= 15 && h < 50 && luma < 0.45) {
      hueCounts.brown += 1
    } else {
      hueCounts[hueToBucket(h)] += 1
    }
  }

  const meanLuma = samples === 0 ? 0.5 : lumaSum / samples
  const saturation = samples === 0 ? 0 : satSum / samples
  const brightness: FrameAnalysis['brightness'] =
    meanLuma < 0.28 ? 'dark' : meanLuma > 0.62 ? 'bright' : 'mid'

  const ranked = (Object.entries(hueCounts) as [HueBucket, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([hue]) => hue)

  return {
    dominantHues: ranked,
    brightness,
    meanLuma,
    saturation,
  }
}
