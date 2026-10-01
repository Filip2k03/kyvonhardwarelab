import { describe, expect, it } from 'vitest'
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
import { narrateLesson, narrateProject, narrateComponent, narrateCircuit } from '@/lib/audio/buildNarration'
import { resolvePageNarration } from '@/lib/audio/resolvePageNarration'

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
