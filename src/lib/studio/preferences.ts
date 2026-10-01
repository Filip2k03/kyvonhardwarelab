import { isFemaleVoiceId, type FemaleVoiceId } from '@/lib/audio/femaleVoices'

export const LAB_LANGUAGES = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'my', native: 'မြန်မာ', english: 'Myanmar (Burmese)' },
  { code: 'ja', native: '日本語', english: 'Japanese' },
  { code: 'ru', native: 'Русский', english: 'Russian' },
] as const

export type LabLanguageCode = (typeof LAB_LANGUAGES)[number]['code']

export type TextScale = '100' | '112' | '125'

export interface LabPreferences {
  readonly language: LabLanguageCode
  readonly dimmer: number
  readonly textScale: TextScale
  readonly voiceId: FemaleVoiceId
}

export const LAB_PREFERENCES_KEY = 'kyvon-lab-preferences'

export const DEFAULT_LAB_PREFERENCES: LabPreferences = {
  language: 'en',
  dimmer: 0,
  textScale: '100',
  voiceId: 2,
}

const TEXT_SCALES: readonly TextScale[] = ['100', '112', '125']

export function isLabLanguage(value: string): value is LabLanguageCode {
  return LAB_LANGUAGES.some((language) => language.code === value)
}

export function clampDimmer(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(0.72, Math.max(0, Math.round(value * 100) / 100))
}

export function googleTranslateCookieValue(code: LabLanguageCode): string {
  if (code === 'en') return ''
  return `/en/${code}`
}

export function readLabPreferences(raw: string | null): LabPreferences {
  if (!raw) return DEFAULT_LAB_PREFERENCES
  try {
    const parsed = JSON.parse(raw) as Partial<LabPreferences>
    const language =
      typeof parsed.language === 'string' && isLabLanguage(parsed.language)
        ? parsed.language
        : DEFAULT_LAB_PREFERENCES.language
    const textScale =
      typeof parsed.textScale === 'string' && TEXT_SCALES.includes(parsed.textScale as TextScale)
        ? (parsed.textScale as TextScale)
        : DEFAULT_LAB_PREFERENCES.textScale
    const voiceId =
      typeof parsed.voiceId === 'number' && isFemaleVoiceId(parsed.voiceId)
        ? parsed.voiceId
        : DEFAULT_LAB_PREFERENCES.voiceId
    return {
      language,
      dimmer: clampDimmer(typeof parsed.dimmer === 'number' ? parsed.dimmer : 0),
      textScale,
      voiceId,
    }
  } catch {
    return DEFAULT_LAB_PREFERENCES
  }
}

function googleTranslateCookieDomains(): readonly string[] {
  const host = window.location.hostname
  const domains = new Set<string>([host, `.${host}`])
  const parts = host.split('.')
  if (parts.length >= 2) {
    const parent = parts.slice(-2).join('.')
    domains.add(parent)
    domains.add(`.${parent}`)
  }
  return [...domains]
}

/** Google Translate keeps googtrans on host and parent domains; clear all copies. */
export function clearGoogleTranslateCookies(): void {
  const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = `googtrans=; expires=${expire}; path=/`
  for (const domain of googleTranslateCookieDomains()) {
    document.cookie = `googtrans=; expires=${expire}; path=/; domain=${domain}`
  }
}

function writeGoogleCookie(code: LabLanguageCode): void {
  const value = googleTranslateCookieValue(code)
  if (!value) {
    clearGoogleTranslateCookies()
    return
  }
  const host = window.location.hostname
  document.cookie = `googtrans=${value}; path=/`
  document.cookie = `googtrans=${value}; path=/; domain=${host}`
}

function reloadPage(): void {
  try {
    window.location.reload()
  } catch {
    // jsdom does not implement navigation.
  }
}

/**
 * Apply screen language via the hidden Google Translate widget.
 * English must clear cookies and reload — the combo cannot reliably undo DOM translation.
 */
export function applyLabLanguage(code: LabLanguageCode): void {
  writeGoogleCookie(code)
  document.documentElement.lang = code

  if (code === 'en') {
    reloadPage()
    return
  }

  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (combo) {
    combo.value = code
    combo.dispatchEvent(new Event('change'))
    return
  }
  reloadPage()
}
