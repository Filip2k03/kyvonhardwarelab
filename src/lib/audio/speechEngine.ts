import {
  getFemaleVoiceProfile,
  pickFemaleVoice,
  type FemaleVoiceId,
} from '@/lib/audio/femaleVoices'

export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'unsupported'

export interface SpeakOptions {
  readonly text: string
  readonly voiceId: FemaleVoiceId
  readonly onStatus?: (status: SpeechStatus) => void
  readonly onBoundary?: (charIndex: number) => void
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  return window.speechSynthesis ?? null
}

export function speechSupported(): boolean {
  return Boolean(getSynth() && typeof SpeechSynthesisUtterance !== 'undefined')
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

export function stopSpeech(): void {
  getSynth()?.cancel()
}

export function pauseSpeech(): void {
  const synth = getSynth()
  if (synth?.speaking) synth.pause()
}

export function resumeSpeech(): void {
  const synth = getSynth()
  if (synth?.paused) synth.resume()
}

export async function speakText(options: SpeakOptions): Promise<void> {
  const synth = getSynth()
  if (!synth || !speechSupported()) {
    options.onStatus?.('unsupported')
    return
  }

  const cleaned = options.text.replace(/\s+/g, ' ').trim()
  if (!cleaned) {
    options.onStatus?.('idle')
    return
  }

  synth.cancel()
  const voices = await waitForVoices()
  const profile = getFemaleVoiceProfile(options.voiceId)
  const voice = pickFemaleVoice(voices, profile)

  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.rate = profile.rate
  utterance.pitch = profile.pitch
  utterance.volume = 1
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang || 'en-US'
  } else {
    utterance.lang = 'en-US'
  }

  utterance.onstart = () => options.onStatus?.('speaking')
  utterance.onpause = () => options.onStatus?.('paused')
  utterance.onresume = () => options.onStatus?.('speaking')
  utterance.onend = () => options.onStatus?.('idle')
  utterance.onerror = () => options.onStatus?.('idle')
  utterance.onboundary = (event) => {
    if (typeof event.charIndex === 'number') options.onBoundary?.(event.charIndex)
  }

  options.onStatus?.('speaking')
  synth.speak(utterance)
}

/** Split long narration into breath-sized chunks the engine can finish reliably. */
export function chunkNarration(text: string, maxChars = 420): string[] {
  const sentences = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)

  const chunks: string[] = []
  let current = ''
  for (const sentence of sentences) {
    if (!current) {
      current = sentence
      continue
    }
    if (`${current} ${sentence}`.length <= maxChars) {
      current = `${current} ${sentence}`
    } else {
      chunks.push(current)
      current = sentence
    }
  }
  if (current) chunks.push(current)
  return chunks
}

export async function speakNarration(options: SpeakOptions): Promise<void> {
  const chunks = chunkNarration(options.text)
  if (chunks.length === 0) {
    options.onStatus?.('idle')
    return
  }

  const synth = getSynth()
  if (!synth || !speechSupported()) {
    options.onStatus?.('unsupported')
    return
  }

  synth.cancel()
  const voices = await waitForVoices()
  const profile = getFemaleVoiceProfile(options.voiceId)
  const voice = pickFemaleVoice(voices, profile)

  let index = 0

  await new Promise<void>((resolve) => {
    const finish = () => {
      options.onStatus?.('idle')
      resolve()
    }

    const speakNext = () => {
      if (index >= chunks.length) {
        finish()
        return
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index]!)
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = 1
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang || 'en-US'
      } else {
        utterance.lang = 'en-US'
      }
      utterance.onstart = () => options.onStatus?.('speaking')
      utterance.onpause = () => options.onStatus?.('paused')
      utterance.onresume = () => options.onStatus?.('speaking')
      utterance.onerror = () => finish()
      utterance.onend = () => {
        index += 1
        speakNext()
      }
      synth.speak(utterance)
    }

    options.onStatus?.('speaking')
    speakNext()
  })
}
