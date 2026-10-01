import { createContext } from 'react'
import type { FemaleVoiceId } from '@/lib/audio/femaleVoices'
import type { SpeechStatus } from '@/lib/audio/speechEngine'
import type { LabLanguageCode } from '@/lib/studio/preferences'

export interface NarrationContextValue {
  readonly supported: boolean
  readonly status: SpeechStatus
  readonly activeId: string | null
  readonly activeTitle: string | null
  readonly voiceId: FemaleVoiceId
  readonly language: LabLanguageCode
  readonly setVoiceId: (id: FemaleVoiceId) => void
  readonly listen: (id: string, title: string, text: string) => void
  readonly listenToPage: () => void
  readonly pause: () => void
  readonly resume: () => void
  readonly stop: () => void
}

export const NarrationContext = createContext<NarrationContextValue | null>(null)
