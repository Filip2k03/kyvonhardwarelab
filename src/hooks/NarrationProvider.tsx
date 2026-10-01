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
  type LabLanguageCode,
} from '@/lib/studio/preferences'
import { NarrationContext } from '@/hooks/narrationContext'

function readPrefs() {
  return readLabPreferences(window.localStorage.getItem(LAB_PREFERENCES_KEY))
}

function writeVoiceId(voiceId: FemaleVoiceId): void {
  const current = readPrefs()
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
    typeof window === 'undefined' ? DEFAULT_LAB_PREFERENCES.voiceId : readPrefs().voiceId,
  )
  const [language, setLanguage] = useState<LabLanguageCode>(() =>
    typeof window === 'undefined' ? DEFAULT_LAB_PREFERENCES.language : readPrefs().language,
  )

  useEffect(() => {
    stopSpeech()
  }, [location.pathname])

  useEffect(() => () => stopSpeech(), [])

  useEffect(() => {
    const sync = () => {
      const prefs = readPrefs()
      setVoiceIdState(prefs.voiceId)
      setLanguage(prefs.language)
    }
    window.addEventListener('storage', sync)
    window.addEventListener('kyvon-lab-prefs', sync)
    const timer = window.setInterval(sync, 800)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('kyvon-lab-prefs', sync)
      window.clearInterval(timer)
    }
  }, [])

  const pathMatches = activePath === location.pathname
  const liveStatus: SpeechStatus = pathMatches ? status : 'idle'
  const liveId = pathMatches ? activeId : null
  const liveTitle = pathMatches ? activeTitle : null

  const setVoiceId = useCallback((id: FemaleVoiceId) => {
    setVoiceIdState(id)
    writeVoiceId(id)
    window.dispatchEvent(new Event('kyvon-lab-prefs'))
  }, [])

  const listen = useCallback(
    (id: string, title: string, text: string) => {
      if (!supported) {
        setStatus('unsupported')
        return
      }
      const prefs = readPrefs()
      setLanguage(prefs.language)
      setActivePath(location.pathname)
      setActiveId(id)
      setActiveTitle(title)
      void speakNarration({
        text,
        voiceId: prefs.voiceId,
        language: prefs.language,
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
    [supported, location.pathname],
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
      language,
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
      language,
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
