import { useEffect, useId, useState } from 'react'
import { Headphones, SlidersHorizontal, X } from 'lucide-react'
import { FEMALE_VOICE_PROFILES, type FemaleVoiceId } from '@/lib/audio/femaleVoices'
import { useNarration } from '@/hooks/useNarrationAudio'
import {
  LAB_LANGUAGES,
  LAB_PREFERENCES_KEY,
  applyLabLanguage,
  clampDimmer,
  readLabPreferences,
  type LabPreferences,
  type TextScale,
} from '@/lib/studio/preferences'
import { cn } from '@/lib/cn'

const TEXT_OPTIONS: readonly { readonly scale: TextScale; readonly label: string }[] = [
  { scale: '100', label: 'Comfortable' },
  { scale: '112', label: 'Larger' },
  { scale: '125', label: 'Reading' },
]

function loadScript(): void {
  if (document.getElementById('google-translate-script')) return
  window.googleTranslateElementInit = () => {
    const translate = window.google?.translate
    if (!translate || document.getElementById('google_translate_element')?.childElementCount) return
    new translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,my,ja,ru',
        autoDisplay: false,
      },
      'google_translate_element',
    )
  }
  const script = document.createElement('script')
  script.id = 'google-translate-script'
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.body.appendChild(script)
}

export function LabControls() {
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const { voiceId, setVoiceId, listenToPage, status, supported, activeTitle, stop } = useNarration()
  const [prefs, setPrefs] = useState<LabPreferences>(() =>
    readLabPreferences(window.localStorage.getItem(LAB_PREFERENCES_KEY)),
  )

  useEffect(() => {
    loadScript()
  }, [])

  useEffect(() => {
    document.documentElement.style.fontSize = `${prefs.textScale}%`
    document.documentElement.lang = prefs.language
    window.localStorage.setItem(LAB_PREFERENCES_KEY, JSON.stringify({ ...prefs, voiceId }))
    window.dispatchEvent(new Event('kyvon-lab-prefs'))
  }, [prefs, voiceId])

  function persist(next: LabPreferences) {
    // Flush before applyLabLanguage may reload (English restore).
    window.localStorage.setItem(LAB_PREFERENCES_KEY, JSON.stringify({ ...next, voiceId }))
    window.dispatchEvent(new Event('kyvon-lab-prefs'))
    setPrefs(next)
  }

  function update(next: LabPreferences) {
    persist(next)
  }

  return (
    <>
      <div
        id="google_translate_element"
        className="google-translate-host no-print"
        translate="no"
      />
      <div
        aria-hidden="true"
        className="no-print pointer-events-none fixed inset-0 z-30 bg-black print:hidden"
        style={{ opacity: prefs.dimmer }}
      />
      <div className="no-print fixed right-4 bottom-4 z-50 print:hidden" translate="no">
        {open ? (
          <section
            aria-labelledby={titleId}
            className="mb-3 max-h-[min(78vh,40rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="text-sm font-semibold">
                  Make this lab yours
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  Pick a female speaking voice, dim the screen, and change language. Listen speaks
                  English, Myanmar (Burmese), Japanese, or Russian to match Adjust.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--color-border)]"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Close lab settings</span>
              </button>
            </div>

            <fieldset className="mt-4">
              <legend className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                Female voice · 10 versions
              </legend>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                Female voices only. Matching system voices are used when available; Myanmar and
                other missing voices fall back to free lab speech audio.
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {FEMALE_VOICE_PROFILES.map((profile) => {
                  const selected = voiceId === profile.id
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      aria-pressed={selected}
                      className={cn(
                        'min-h-11 px-3 py-2 text-left text-sm',
                        selected
                          ? 'bg-[var(--color-accent-strong)] text-[var(--color-text-on-accent)]'
                          : 'border border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                      )}
                      onClick={() => setVoiceId(profile.id as FemaleVoiceId)}
                    >
                      <span className="block font-mono-tech text-[10px] opacity-80">
                        Voice {String(profile.id).padStart(2, '0')}
                      </span>
                      <span className="block font-medium">{profile.name}</span>
                      <span className={cn('mt-0.5 block text-[11px] leading-snug', selected ? 'opacity-85' : 'text-[var(--color-text-muted)]')}>
                        {profile.blurb}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {supported ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
                  onClick={listenToPage}
                >
                  <Headphones className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                  Listen to this page
                </button>
                {status === 'speaking' || status === 'paused' ? (
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center border border-[var(--color-border)] px-3 text-sm"
                    onClick={stop}
                  >
                    Stop audio
                  </button>
                ) : null}
                {activeTitle ? (
                  <p className="w-full text-[11px] text-[var(--color-text-muted)]">
                    Now: {activeTitle}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-xs text-[var(--color-warning)]">
                This browser does not expose speech synthesis.
              </p>
            )}

            <fieldset className="mt-4">
              <legend className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                Language · screen + audio
              </legend>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                Screen translation and spoken guides both follow this choice (en / my / ja / ru).
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {LAB_LANGUAGES.map((language) => {
                  const selected = prefs.language === language.code
                  return (
                    <button
                      key={language.code}
                      type="button"
                      aria-pressed={selected}
                      className={cn(
                        'min-h-11 px-3 text-left text-sm',
                        selected
                          ? 'bg-[var(--color-accent-strong)] text-[var(--color-text-on-accent)]'
                          : 'border border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                      )}
                      onClick={() => {
                        const next = { ...prefs, language: language.code }
                        persist(next)
                        if (language.code !== prefs.language) applyLabLanguage(language.code)
                      }}
                    >
                      <span className="block font-medium">{language.native}</span>
                      <span className={cn('block text-[11px]', selected ? 'opacity-80' : 'text-[var(--color-text-muted)]')}>
                        {language.english}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <label className="mt-4 block">
              <span className="flex items-baseline justify-between text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                Screen dimmer
                <span className="font-mono-tech normal-case">{Math.round(prefs.dimmer * 100)}%</span>
              </span>
              <input
                className="mt-2 w-full accent-[var(--color-accent)]"
                type="range"
                min={0}
                max={72}
                step={1}
                value={Math.round(prefs.dimmer * 100)}
                aria-valuemin={0}
                aria-valuemax={72}
                aria-valuenow={Math.round(prefs.dimmer * 100)}
                aria-label="Screen dimmer"
                onChange={(event) =>
                  update({ ...prefs, dimmer: clampDimmer(Number(event.target.value) / 100) })
                }
              />
            </label>

            <fieldset className="mt-4">
              <legend className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                Type size
              </legend>
              <div className="mt-2 flex gap-2">
                {TEXT_OPTIONS.map((option) => {
                  const selected = prefs.textScale === option.scale
                  return (
                    <button
                      key={option.scale}
                      type="button"
                      aria-pressed={selected}
                      className={cn(
                        'min-h-11 flex-1 px-2 text-sm',
                        selected
                          ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)]'
                          : 'border border-[var(--color-border)] text-[var(--color-text-muted)]',
                      )}
                      onClick={() => update({ ...prefs, textScale: option.scale })}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </section>
        ) : null}

        <button
          type="button"
          className="ml-auto flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-[var(--color-text-on-accent)] shadow-[var(--shadow-md)]"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          <span>{open ? 'Close' : 'Adjust'}</span>
        </button>
      </div>
    </>
  )
}
