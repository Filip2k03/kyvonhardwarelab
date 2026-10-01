import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  LAB_LANGUAGES,
  applyLabLanguage,
  clampDimmer,
  clearGoogleTranslateCookies,
  googleTranslateCookieValue,
  readLabPreferences,
} from '@/lib/studio/preferences'

describe('lab preferences', () => {
  afterEach(() => {
    clearGoogleTranslateCookies()
    document.documentElement.lang = 'en'
    vi.restoreAllMocks()
  })

  it('offers English, Myanmar, Japanese, and Russian', () => {
    expect(LAB_LANGUAGES.map((language) => language.code)).toEqual(['en', 'my', 'ja', 'ru'])
    expect(googleTranslateCookieValue('ja')).toBe('/en/ja')
    expect(googleTranslateCookieValue('en')).toBe('')
  })

  it('clamps the dimmer and ignores bad saved data', () => {
    expect(clampDimmer(4)).toBe(0.72)
    expect(clampDimmer(-1)).toBe(0)
    expect(readLabPreferences('not-json').language).toBe('en')
    expect(
      readLabPreferences(JSON.stringify({ language: 'ru', dimmer: 0.4, textScale: '125', voiceId: 7 })),
    ).toEqual({ language: 'ru', dimmer: 0.4, textScale: '125', voiceId: 7 })
    expect(readLabPreferences(JSON.stringify({ voiceId: 99 })).voiceId).toBe(2)
  })

  it('writes a Google Translate cookie for a chosen language', () => {
    applyLabLanguage('my')
    expect(document.cookie).toContain('googtrans=/en/my')
    expect(document.documentElement.lang).toBe('my')
  })

  it('clears translate cookies and reloads when restoring English', () => {
    document.cookie = 'googtrans=/en/my; path=/'
    const reload = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload, hostname: 'lab.thuyakyaw.com' })

    applyLabLanguage('en')

    expect(document.cookie).not.toContain('googtrans=/en/my')
    expect(document.documentElement.lang).toBe('en')
    expect(reload).toHaveBeenCalledTimes(1)
  })
})
