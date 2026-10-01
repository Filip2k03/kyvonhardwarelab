import { describe, expect, it, vi } from 'vitest'
import { findLessonBySlug } from '@/data/lessons'
import { findProjectBySlug } from '@/data/projects'
import { findHardwareBySlug } from '@/data/hardware'
import { findCircuitBySlug } from '@/data/circuits'
import {
  FEMALE_VOICE_PROFILES,
  looksFemaleVoice,
  pickFemaleVoice,
} from '@/lib/audio/femaleVoices'
import { chunkNarration } from '@/lib/audio/speechEngine'
import { chunkForLanguage, langMatchesVoice, speechLangTag } from '@/lib/audio/speechLocales'
import { narrateLesson, narrateProject, narrateComponent, narrateCircuit } from '@/lib/audio/buildNarration'
import { resolvePageNarration } from '@/lib/audio/resolvePageNarration'
import { translateLabText } from '@/lib/audio/translateLabText'

describe('female voice profiles', () => {
  it('defines exactly ten female-only speaking styles', () => {
    expect(FEMALE_VOICE_PROFILES).toHaveLength(10)
    expect(FEMALE_VOICE_PROFILES.map((profile) => profile.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('prefers female system voices and skips male-labelled ones', () => {
    const voices = [
      { name: 'Microsoft David', lang: 'en-US', voiceURI: 'david', default: false, localService: true } as SpeechSynthesisVoice,
      { name: 'Samantha', lang: 'en-US', voiceURI: 'samantha', default: true, localService: true } as SpeechSynthesisVoice,
      { name: 'Microsoft Zira', lang: 'en-US', voiceURI: 'zira', default: false, localService: true } as SpeechSynthesisVoice,
    ]
    expect(looksFemaleVoice(voices[0]!)).toBe(false)
    expect(looksFemaleVoice(voices[1]!)).toBe(true)
    const picked = pickFemaleVoice(voices, FEMALE_VOICE_PROFILES[0]!)
    expect(picked?.name).toBe('Samantha')
  })

  it('selects Japanese and Russian voices by language without falling back to English', () => {
    const voices = [
      { name: 'Samantha', lang: 'en-US', voiceURI: 'samantha', default: true, localService: true } as SpeechSynthesisVoice,
      { name: 'Kyoko', lang: 'ja-JP', voiceURI: 'kyoko', default: false, localService: true } as SpeechSynthesisVoice,
      { name: 'Milena', lang: 'ru-RU', voiceURI: 'milena', default: false, localService: true } as SpeechSynthesisVoice,
    ]
    expect(pickFemaleVoice(voices, FEMALE_VOICE_PROFILES[1]!, 'ja')?.name).toBe('Kyoko')
    expect(pickFemaleVoice(voices, FEMALE_VOICE_PROFILES[1]!, 'ru')?.name).toBe('Milena')
    expect(pickFemaleVoice(voices, FEMALE_VOICE_PROFILES[1]!, 'my')).toBeNull()
  })
})

describe('speech locales', () => {
  it('maps lab languages to speech tags and voice matching', () => {
    expect(speechLangTag('my')).toBe('my-MM')
    expect(langMatchesVoice('my-MM', 'my')).toBe(true)
    expect(langMatchesVoice('ja_JP', 'ja')).toBe(true)
    expect(chunkForLanguage('မင်္ဂလာပါ။ ကျေးဇူးတင်ပါတယ်။', 'my', 40).length).toBeGreaterThan(0)
  })
})

describe('translateLabText', () => {
  it('returns English unchanged and translates via gtx for other languages', async () => {
    expect(await translateLabText('Hello lab', 'en')).toBe('Hello lab')

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [[['မင်္ဂလာပါ', 'Hello lab']]],
    })
    vi.stubGlobal('fetch', fetchMock)
    expect(await translateLabText('Hello lab', 'my')).toContain('မင်္ဂလာပါ')
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('tl=my')
    vi.unstubAllGlobals()
  })
})

describe('narration scripts', () => {
  it('builds human-paced scripts for lessons, projects, components, and circuits', () => {
    const lesson = findLessonBySlug('leds-and-resistors')!
    const project = findProjectBySlug('blink')!
    const component = findHardwareBySlug('led-red')!
    const circuit = findCircuitBySlug('led')!

    expect(narrateLesson(lesson)).toMatch(/Let's sit with lesson/i)
    expect(narrateLesson(lesson)).toMatch(/Safety/i)
    expect(narrateProject(project)).toMatch(/Let's build project/i)
    expect(narrateComponent(component)).toMatch(/This is the/i)
    expect(narrateCircuit(circuit)).toMatch(/diagram/i)
  })

  it('chunks long speech for reliable playback', () => {
    const chunks = chunkNarration(`${'Sentence one. '.repeat(40)}${'Sentence two. '.repeat(40)}`)
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.every((chunk) => chunk.length <= 500)).toBe(true)
  })

  it('resolves page narration for module routes', () => {
    expect(resolvePageNarration('/learn/leds-and-resistors').id).toContain('lesson:')
    expect(resolvePageNarration('/projects/blink').title).toBe('Blink')
    expect(resolvePageNarration('/lab/3d').id).toBe('lab3d')
    expect(resolvePageNarration('/').text.length).toBeGreaterThan(40)
  })
})
