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
let voicesWarmed = false

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

/** Warm the voice list early so Listen clicks are not stuck waiting. */
export function warmSpeechEngine(): void {
  if (voicesWarmed || typeof window === 'undefined') return
  voicesWarmed = true
  const synth = getSynth()
  if (!synth) return
  void synth.getVoices()
  synth.addEventListener('voiceschanged', () => {
    void synth.getVoices()
  })
}

/**
 * Must run synchronously inside a click/tap handler so Chrome keeps speech + audio
 * unlocked for the async speak path that follows.
 */
export function primeSpeechEngine(): void {
  const synth = getSynth()
  if (synth) {
    try {
      synth.resume()
    } catch {
      /* ignore */
    }
  }

  if (typeof Audio === 'undefined') return
  try {
    const silent = new Audio(
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==',
    )
    silent.volume = 0.01
    void silent
      .play()
      .then(() => {
        silent.pause()
        silent.removeAttribute('src')
        silent.load()
      })
      .catch(() => undefined)
  } catch {
    /* ignore */
  }
}

export function waitForVoices(timeoutMs = 250): Promise<SpeechSynthesisVoice[]> {
  const immediate = loadVoices()
  if (immediate.length > 0) return Promise.resolve(immediate)

  return new Promise((resolve) => {
    const synth = getSynth()
    if (!synth) {
      resolve([])
      return
    }
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      synth.removeEventListener('voiceschanged', finish)
      resolve(loadVoices())
    }
    synth.addEventListener('voiceschanged', finish)
    window.setTimeout(finish, timeoutMs)
  })
}

function stopAudio(): void {
  if (!activeAudio) return
  activeAudio.onended = null
  activeAudio.onerror = null
  activeAudio.pause()
  activeAudio.removeAttribute('src')
  activeAudio.load()
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
  if (synth?.paused) {
    try {
      synth.resume()
    } catch {
      /* ignore */
    }
  }
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
): Promise<boolean> {
  onStatus?.('speaking')
  let playedAny = false
  for (const chunk of chunks) {
    if (generation !== speakGeneration) return playedAny
    const ok = await new Promise<boolean>((resolve) => {
      const audio = new Audio(googleTtsUrl(chunk, language))
      activeAudio = audio
      audio.onended = () => {
        if (activeAudio === audio) activeAudio = null
        resolve(true)
      }
      audio.onerror = () => {
        if (activeAudio === audio) activeAudio = null
        resolve(false)
      }
      void audio.play().then(
        () => undefined,
        () => {
          if (activeAudio === audio) activeAudio = null
          resolve(false)
        },
      )
    })
    if (!ok) return playedAny
    playedAny = true
  }
  return playedAny
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

async function speakWithWebSpeech(
  chunks: readonly string[],
  options: SpeakOptions,
  language: LabLanguageCode,
  voice: SpeechSynthesisVoice | null,
  generation: number,
): Promise<boolean> {
  const synth = getSynth()
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false

  const profile = getFemaleVoiceProfile(options.voiceId)

  return new Promise<boolean>((resolve) => {
    let index = 0
    let started = false
    let watchdog: number | undefined

    const clearWatch = () => {
      if (watchdog !== undefined) window.clearTimeout(watchdog)
      watchdog = undefined
    }

    const finish = (ok: boolean) => {
      clearWatch()
      if (generation === speakGeneration) options.onStatus?.('idle')
      resolve(ok)
    }

    const speakNext = () => {
      if (generation !== speakGeneration) {
        clearWatch()
        resolve(started)
        return
      }
      if (index >= chunks.length) {
        finish(started)
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]!)
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = 1
      utterance.lang = speechLangTag(language)
      if (voice) utterance.voice = voice

      utterance.onstart = () => {
        started = true
        clearWatch()
        options.onStatus?.('speaking')
      }
      utterance.onpause = () => options.onStatus?.('paused')
      utterance.onresume = () => options.onStatus?.('speaking')
      utterance.onerror = (event) => {
        const reason = event.error
        if (reason === 'interrupted' || reason === 'canceled') {
          finish(started)
          return
        }
        finish(started)
      }
      utterance.onend = () => {
        index += 1
        speakNext()
      }
      utterance.onboundary = (event) => {
        if (typeof event.charIndex === 'number') options.onBoundary?.(event.charIndex)
      }

      try {
        synth.resume()
      } catch {
        /* ignore */
      }
      try {
        synth.speak(utterance)
      } catch {
        finish(started)
        return
      }

      // If Chrome swallows speak() (no start within 1.5s), report failure so cloud fallback can run.
      if (index === 0) {
        watchdog = window.setTimeout(() => {
          if (!started && generation === speakGeneration) {
            try {
              synth.cancel()
            } catch {
              /* ignore */
            }
            resolve(false)
          }
        }, 1500)
      }
    }

    options.onStatus?.('speaking')
    speakNext()
  })
}

export async function speakText(options: SpeakOptions): Promise<void> {
  return speakNarration(options)
}

export async function speakNarration(options: SpeakOptions): Promise<void> {
  const language = options.language ?? 'en'
  const generation = ++speakGeneration
  stopAudio()
  getSynth()?.cancel()

  options.onStatus?.('speaking')

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
  const chunksCloud = chunkForLanguage(spoken, language, 160)
  const chunksSpeech = chunkForLanguage(spoken, language, language === 'en' ? 420 : 220)

  // Prefer local Web Speech for languages that usually have system voices.
  // Myanmar often has none — try cloud first, then fall back to Web Speech.
  const preferCloudFirst = language === 'my'

  if (preferCloudFirst && chunksCloud.length > 0) {
    try {
      const played = await speakWithGoogleAudio(chunksCloud, language, generation, options.onStatus)
      if (generation !== speakGeneration) return
      if (played) {
        options.onStatus?.('idle')
        return
      }
    } catch {
      /* fall through to Web Speech */
    }
  }

  if (synth && chunksSpeech.length > 0) {
    const ok = await speakWithWebSpeech(chunksSpeech, options, language, voice, generation)
    if (generation !== speakGeneration) return
    if (ok) return
  }

  // Last resort: cloud TTS for any language if Web Speech failed.
  if (!preferCloudFirst && chunksCloud.length > 0) {
    try {
      const played = await speakWithGoogleAudio(chunksCloud, language, generation, options.onStatus)
      if (generation !== speakGeneration) return
      if (played) {
        options.onStatus?.('idle')
        return
      }
    } catch {
      /* ignore */
    }
  }

  if (generation === speakGeneration) options.onStatus?.('idle')
}
