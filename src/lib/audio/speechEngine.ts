import {
  getFemaleVoiceProfile,
  pickFemaleVoice,
  type FemaleVoiceId,
} from '@/lib/audio/femaleVoices'
import { chunkForLanguage, speechLangTag } from '@/lib/audio/speechLocales'
import { translateLabText } from '@/lib/audio/translateLabText'
import type { LabLanguageCode } from '@/lib/studio/preferences'

export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'unsupported'

export interface SpeakOptions {
  readonly text: string
  readonly voiceId: FemaleVoiceId
  readonly language?: LabLanguageCode
  readonly onStatus?: (status: SpeechStatus) => void
  readonly onBoundary?: (charIndex: number) => void
}

let activeAudio: HTMLAudioElement | null = null
let speakGeneration = 0

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  return window.speechSynthesis ?? null
}

export function speechSupported(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(
    (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') ||
      typeof Audio !== 'undefined',
  )
}

export function loadVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth()
  if (!synth) return []
  return synth.getVoices()
}

export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  const immediate = loadVoices()
  if (immediate.length > 0) return Promise.resolve(immediate)

  return new Promise((resolve) => {
    const synth = getSynth()
    if (!synth) {
      resolve([])
      return
    }
    const finish = () => {
      synth.removeEventListener('voiceschanged', finish)
      resolve(loadVoices())
    }
    synth.addEventListener('voiceschanged', finish)
    window.setTimeout(finish, 750)
  })
}

function stopAudio(): void {
  if (!activeAudio) return
  activeAudio.onended = null
  activeAudio.onerror = null
  activeAudio.pause()
  activeAudio.src = ''
  activeAudio = null
}

export function stopSpeech(): void {
  speakGeneration += 1
  getSynth()?.cancel()
  stopAudio()
}

export function pauseSpeech(): void {
  const synth = getSynth()
  if (synth?.speaking) synth.pause()
  activeAudio?.pause()
}

export function resumeSpeech(): void {
  const synth = getSynth()
  if (synth?.paused) synth.resume()
  void activeAudio?.play().catch(() => undefined)
}

function googleTtsUrl(text: string, language: LabLanguageCode): string {
  const url = new URL('https://translate.google.com/translate_tts')
  url.searchParams.set('ie', 'UTF-8')
  url.searchParams.set('client', 'tw-ob')
  url.searchParams.set('tl', language)
  url.searchParams.set('q', text)
  return url.toString()
}

async function speakWithGoogleAudio(
  chunks: readonly string[],
  language: LabLanguageCode,
  generation: number,
  onStatus?: (status: SpeechStatus) => void,
): Promise<void> {
  onStatus?.('speaking')
  for (const chunk of chunks) {
    if (generation !== speakGeneration) return
    await new Promise<void>((resolve) => {
      const audio = new Audio(googleTtsUrl(chunk, language))
      activeAudio = audio
      audio.onended = () => {
        if (activeAudio === audio) activeAudio = null
        resolve()
      }
      audio.onerror = () => {
        if (activeAudio === audio) activeAudio = null
        resolve()
      }
      void audio.play().catch(() => {
        if (activeAudio === audio) activeAudio = null
        resolve()
      })
    })
  }
}

async function prepareSpokenText(text: string, language: LabLanguageCode): Promise<string> {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  if (language === 'en') return cleaned
  try {
    return await translateLabText(cleaned, language)
  } catch {
    return cleaned
  }
}

/** Split long narration into breath-sized chunks the engine can finish reliably. */
export function chunkNarration(text: string, maxChars = 420): string[] {
  return chunkForLanguage(text, 'en', maxChars)
}

export async function speakText(options: SpeakOptions): Promise<void> {
  return speakNarration(options)
}

export async function speakNarration(options: SpeakOptions): Promise<void> {
  const language = options.language ?? 'en'
  const generation = ++speakGeneration
  stopAudio()
  getSynth()?.cancel()

  const spoken = await prepareSpokenText(options.text, language)
  if (generation !== speakGeneration) return
  if (!spoken) {
    options.onStatus?.('idle')
    return
  }

  const synth = getSynth()
  const voices = await waitForVoices()
  if (generation !== speakGeneration) return

  const profile = getFemaleVoiceProfile(options.voiceId)
  const voice = pickFemaleVoice(voices, profile, language)
  const preferCloudAudio = language === 'my' || !voice || !synth

  if (preferCloudAudio) {
    const chunks = chunkForLanguage(spoken, language, 160)
    if (chunks.length === 0) {
      options.onStatus?.('idle')
      return
    }
    try {
      await speakWithGoogleAudio(chunks, language, generation, options.onStatus)
    } catch {
      options.onStatus?.('idle')
      return
    }
    if (generation === speakGeneration) options.onStatus?.('idle')
    return
  }

  const chunks = chunkForLanguage(spoken, language, language === 'en' ? 420 : 220)
  if (chunks.length === 0) {
    options.onStatus?.('idle')
    return
  }

  await new Promise<void>((resolve) => {
    let index = 0
    const finish = () => {
      if (generation === speakGeneration) options.onStatus?.('idle')
      resolve()
    }

    const speakNext = () => {
      if (generation !== speakGeneration) {
        resolve()
        return
      }
      if (index >= chunks.length) {
        finish()
        return
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index]!)
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = 1
      utterance.lang = speechLangTag(language)
      if (voice) utterance.voice = voice
      utterance.onstart = () => options.onStatus?.('speaking')
      utterance.onpause = () => options.onStatus?.('paused')
      utterance.onresume = () => options.onStatus?.('speaking')
      utterance.onerror = () => finish()
      utterance.onend = () => {
        index += 1
        speakNext()
      }
      utterance.onboundary = (event) => {
        if (typeof event.charIndex === 'number') options.onBoundary?.(event.charIndex)
      }
      synth!.speak(utterance)
    }

    options.onStatus?.('speaking')
    speakNext()
  })
}
