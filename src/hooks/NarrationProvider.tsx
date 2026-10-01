import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { FemaleVoiceId } from '@/lib/audio/femaleVoices'
import { resolvePageNarration } from '@/lib/audio/resolvePageNarration'
import {
  pauseSpeech,
  resumeSpeech,
  speakNarration,
  speechSupported,
  stopSpeech,
  type SpeechStatus,
} from '@/lib/audio/speechEngine'
import {
  DEFAULT_LAB_PREFERENCES,
  LAB_PREFERENCES_KEY,
  readLabPreferences,
} from '@/lib/studio/preferences'
import { NarrationContext } from '@/hooks/narrationContext'

function readVoiceId(): FemaleVoiceId {
  return readLabPreferences(window.localStorage.getItem(LAB_PREFERENCES_KEY)).voiceId
}

function writeVoiceId(voiceId: FemaleVoiceId): void {
  const current = readLabPreferences(window.localStorage.getItem(LAB_PREFERENCES_KEY))
  window.localStorage.setItem(LAB_PREFERENCES_KEY, JSON.stringify({ ...current, voiceId }))
}

export function NarrationProvider({ children }: { readonly children: ReactNode }) {
  const location = useLocation()
  const [supported] = useState(() => speechSupported())
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState<string | null>(null)
  const [activePath, setActivePath] = useState<string | null>(null)
  const [voiceId, setVoiceIdState] = useState<FemaleVoiceId>(() =>
    typeof window === 'undefined' ? DEFAULT_LAB_PREFERENCES.voiceId : readVoiceId(),
  )

  useEffect(() => {
    stopSpeech()
  }, [location.pathname])

  useEffect(() => () => stopSpeech(), [])

  const pathMatches = activePath === location.pathname
  const liveStatus: SpeechStatus = pathMatches ? status : 'idle'
  const liveId = pathMatches ? activeId : null
  const liveTitle = pathMatches ? activeTitle : null

  const setVoiceId = useCallback((id: FemaleVoiceId) => {
    setVoiceIdState(id)
    writeVoiceId(id)
  }, [])

  const listen = useCallback(
    (id: string, title: string, text: string) => {
      if (!supported) {
        setStatus('unsupported')
        return
      }
      setActivePath(location.pathname)
      setActiveId(id)
      setActiveTitle(title)
      void speakNarration({
        text,
        voiceId,
        onStatus: (next) => {
          setStatus(next)
          if (next === 'idle') {
            setActiveId(null)
            setActiveTitle(null)
            setActivePath(null)
          }
        },
      })
    },
    [supported, voiceId, location.pathname],
  )

  const listenToPage = useCallback(() => {
    const page = resolvePageNarration(location.pathname)
    listen(page.id, page.title, page.text)
  }, [listen, location.pathname])

  const pause = useCallback(() => {
    pauseSpeech()
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    resumeSpeech()
    setStatus('speaking')
  }, [])

  const stop = useCallback(() => {
    stopSpeech()
    setStatus('idle')
    setActiveId(null)
    setActiveTitle(null)
    setActivePath(null)
  }, [])

  const value = useMemo(
    () => ({
      supported,
      status: liveStatus,
      activeId: liveId,
      activeTitle: liveTitle,
      voiceId,
      setVoiceId,
      listen,
      listenToPage,
      pause,
      resume,
      stop,
    }),
    [
      supported,
      liveStatus,
      liveId,
      liveTitle,
      voiceId,
      setVoiceId,
      listen,
      listenToPage,
      pause,
      resume,
      stop,
    ],
  )

  return <NarrationContext.Provider value={value}>{children}</NarrationContext.Provider>
}
