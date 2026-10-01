import type { LabLanguageCode } from '@/lib/studio/preferences'
import { langMatchesVoice } from '@/lib/audio/speechLocales'

export type FemaleVoiceId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10

export interface FemaleVoiceProfile {
  readonly id: FemaleVoiceId
  readonly name: string
  readonly blurb: string
  readonly rate: number
  readonly pitch: number
  readonly preferredNames: readonly string[]
}

/** Ten female-only speaking styles. The browser supplies the actual TTS voice. */
export const FEMALE_VOICE_PROFILES: readonly FemaleVoiceProfile[] = [
  {
    id: 1,
    name: 'Soft Mentor',
    blurb: 'Gentle pace for first reads at the bench.',
    rate: 0.9,
    pitch: 1.08,
    preferredNames: ['Samantha', 'Karen', 'Google US English', 'Microsoft Aria'],
  },
  {
    id: 2,
    name: 'Clear Lab Guide',
    blurb: 'Even and readable for wiring steps.',
    rate: 0.98,
    pitch: 1.02,
    preferredNames: ['Victoria', 'Moira', 'Google UK English Female', 'Microsoft Jenny'],
  },
  {
    id: 3,
    name: 'Warm Coach',
    blurb: 'Friendly tone when you are stuck on a concept.',
    rate: 0.94,
    pitch: 1.12,
    preferredNames: ['Fiona', 'Tessa', 'Google UK English Female', 'Microsoft Sonia'],
  },
  {
    id: 4,
    name: 'Steady Instructor',
    blurb: 'Slower, deliberate explanations.',
    rate: 0.86,
    pitch: 0.98,
    preferredNames: ['Serena', 'Kate', 'Microsoft Zira', 'Google US English'],
  },
  {
    id: 5,
    name: 'Bright Tutor',
    blurb: 'A little quicker for review sessions.',
    rate: 1.05,
    pitch: 1.14,
    preferredNames: ['Samantha', 'Veena', 'Microsoft Aria', 'Google UK English Female'],
  },
  {
    id: 6,
    name: 'Calm Bench Partner',
    blurb: 'Quiet presence while you hold the iron or jumper.',
    rate: 0.88,
    pitch: 1.04,
    preferredNames: ['Karen', 'Moira', 'Microsoft Jenny', 'Google US English'],
  },
  {
    id: 7,
    name: 'Precise Technician',
    blurb: 'Tight diction for pin names and voltages.',
    rate: 0.96,
    pitch: 0.96,
    preferredNames: ['Victoria', 'Serena', 'Microsoft Zira', 'Google UK English Female'],
  },
  {
    id: 8,
    name: 'Friendly Explainer',
    blurb: 'Conversational walkthroughs of theory.',
    rate: 1.0,
    pitch: 1.1,
    preferredNames: ['Fiona', 'Tessa', 'Microsoft Sonia', 'Google US English'],
  },
  {
    id: 9,
    name: 'Quiet Focus',
    blurb: 'Slowest pace for dense safety and measurement notes.',
    rate: 0.82,
    pitch: 1.0,
    preferredNames: ['Kate', 'Moira', 'Microsoft Aria', 'Google UK English Female'],
  },
  {
    id: 10,
    name: 'Confident Lead',
    blurb: 'Clear leadership for project construction.',
    rate: 1.02,
    pitch: 1.06,
    preferredNames: ['Samantha', 'Victoria', 'Microsoft Jenny', 'Google US English'],
  },
] as const

const FEMALE_HINT =
  /\b(female|woman|girl|zira|samantha|karen|victoria|moira|fiona|tessa|serena|kate|veena|aria|jenny|sonia|natasha|helen|susan|linda|hazel|kyoko|haruka|milena|irina|tatyana|myanmar|burmese)\b/i

const MALE_HINT =
  /\b(male|man|boy|david|mark|daniel|thomas|alex|fred|bruce|james|george|ravi|lee|ichiro)\b/i

export function isFemaleVoiceId(value: number): value is FemaleVoiceId {
  return Number.isInteger(value) && value >= 1 && value <= 10
}

export function getFemaleVoiceProfile(id: FemaleVoiceId): FemaleVoiceProfile {
  return FEMALE_VOICE_PROFILES[id - 1]!
}

export function looksFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const blob = `${voice.name} ${voice.voiceURI}`
  if (MALE_HINT.test(blob) && !FEMALE_HINT.test(blob)) return false
  if (FEMALE_HINT.test(blob)) return true
  // Prefer voices that do not announce themselves as male.
  return !MALE_HINT.test(blob)
}

export function listFemaleVoices(
  voices: readonly SpeechSynthesisVoice[],
  language: LabLanguageCode = 'en',
): SpeechSynthesisVoice[] {
  const inLang = voices.filter((voice) => langMatchesVoice(voice.lang, language))
  const femaleInLang = inLang.filter(looksFemaleVoice)
  if (femaleInLang.length > 0) return femaleInLang
  if (inLang.length > 0) return [...inLang]

  const femaleAny = voices.filter(looksFemaleVoice)
  if (language === 'en') {
    return femaleAny.length > 0
      ? femaleAny
      : voices.filter((voice) => /^en(-|_)/i.test(voice.lang))
  }
  // Non-English: do not silently fall back to English voices — caller may use cloud TTS.
  return []
}

export function pickFemaleVoice(
  voices: readonly SpeechSynthesisVoice[],
  profile: FemaleVoiceProfile,
  language: LabLanguageCode = 'en',
): SpeechSynthesisVoice | null {
  const female = listFemaleVoices(voices, language)
  if (female.length === 0) return null

  for (const preferred of profile.preferredNames) {
    const match = female.find((voice) => voice.name.toLowerCase().includes(preferred.toLowerCase()))
    if (match) return match
  }

  // Stable rotation across the ten profiles when names are unavailable.
  const index = (profile.id - 1) % female.length
  return female[index] ?? null
}
