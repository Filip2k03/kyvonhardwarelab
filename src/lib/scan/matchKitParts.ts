import { KIT_VISUAL_PROFILES, type KitVisualProfile } from '@/data/scan/kitVisualProfiles'
import type { FrameAnalysis } from '@/lib/scan/analyzeFrame'
import { findHardwareBySlug } from '@/data/hardware'
import type { HardwareComponent } from '@/types/hardware'

export interface KitMatch {
  readonly profile: KitVisualProfile
  readonly component: HardwareComponent
  readonly score: number
  readonly reasons: readonly string[]
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9+\s.-]/g, ' ')
}

export function scoreKitProfile(
  profile: KitVisualProfile,
  analysis: FrameAnalysis | null,
  query: string,
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  const q = normalize(query)

  if (q) {
    for (const alias of profile.aliases) {
      if (q.includes(alias) || alias.includes(q)) {
        score += 40
        reasons.push(`text: ${alias}`)
        break
      }
    }
    for (const tag of profile.tags) {
      if (q.includes(tag)) {
        score += 12
        reasons.push(`tag: ${tag}`)
      }
    }
    if (q.includes(profile.slug.replace(/-/g, ' '))) {
      score += 30
      reasons.push('slug match')
    }
  }

  if (analysis) {
    const hueHits = profile.hueBias.filter((h) => analysis.dominantHues.includes(h))
    if (hueHits.length > 0) {
      score += 10 * hueHits.length
      reasons.push(`color: ${hueHits.join(', ')}`)
    }
    if (profile.brightness === analysis.brightness) {
      score += 8
      reasons.push(`brightness: ${analysis.brightness}`)
    }
  }

  return { score, reasons }
}

export function matchKitParts(
  analysis: FrameAnalysis | null,
  query: string,
  limit = 6,
): readonly KitMatch[] {
  const results: KitMatch[] = []
  for (const profile of KIT_VISUAL_PROFILES) {
    const component = findHardwareBySlug(profile.slug)
    if (!component) continue
    const { score, reasons } = scoreKitProfile(profile, analysis, query)
    if (score <= 0 && !query.trim() && !analysis) continue
    if (score <= 0 && query.trim()) continue
    results.push({ profile, component, score: Math.max(score, analysis ? 1 : 0), reasons })
  }

  // If camera-only with no strong text, still rank by visual score
  if (!query.trim() && analysis) {
    results.sort((a, b) => b.score - a.score)
    return results.filter((item) => item.score > 0).slice(0, limit)
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit)
}

export function listScanTags(): readonly string[] {
  const tags = new Set<string>()
  for (const profile of KIT_VISUAL_PROFILES) {
    for (const tag of profile.tags) tags.add(tag)
    for (const alias of profile.aliases) tags.add(alias)
  }
  return [...tags].sort()
}
