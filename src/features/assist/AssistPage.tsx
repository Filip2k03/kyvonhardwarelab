import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Send } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageListenButton } from '@/components/audio/ListenButton'
import { LabPanel } from '@/components/ui/LabPanel'
import { answerBenchAssist, type AssistReply } from '@/lib/assist/benchAssist'
import { useInspector } from '@/hooks/useInspector'

const STARTERS = [
  'How do I scan a DHT11?',
  'Show me the 3D lab',
  'MAO heartbeat commands',
  'What is a 220 ohm resistor for?',
  'Blink LED project',
  'LED with resistor circuit',
] as const

export function AssistPage() {
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState<AssistReply | null>(null)
  const [history, setHistory] = useState<Array<{ q: string; a: AssistReply }>>([])
  const { setContent } = useInspector()

  useEffect(() => {
    setContent({
      title: 'Bench Assist',
      body: (
        <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
          <p>Local Q&A over kit catalog, lessons, circuits, and MAO Mark I. No cloud calls.</p>
          <p className="font-mono-tech text-xs">Ask about parts, scans, 3D build, or serial commands.</p>
        </div>
      ),
    })
    return () => setContent(null)
  }, [setContent])

  function submit(question: string) {
    const trimmed = question.trim()
    if (!trimmed) return
    const next = answerBenchAssist(trimmed)
    setAnswer(next)
    setHistory((prev) => [{ q: trimmed, a: next }, ...prev].slice(0, 8))
    setInput('')
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submit(input)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Local assistant"
        title="Bench Assist"
        description="Ask about kit parts, camera scan, 3D lab build modes, circuits, lessons, and MAO Mark I serial — answers stay on this device."
        actions={<PageListenButton />}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)]">
        <LabPanel className="space-y-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="assist-q">
              Ask Bench Assist
            </label>
            <input
              id="assist-q"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. How do I wire an LED with a resistor?"
              className="min-h-11 flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
            />
            <button type="submit" className="lab-btn-primary shrink-0">
              <Send className="mr-2 inline h-4 w-4" aria-hidden="true" />
              Ask
            </button>
          </form>

          <div className="flex flex-wrap gap-1">
            {STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => submit(starter)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-left text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]"
              >
                {starter}
              </button>
            ))}
          </div>

          {answer ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-accent)]/40 bg-[var(--color-surface-raised)] p-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                <h2 className="text-sm font-semibold">{answer.title}</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{answer.body}</p>
              {answer.links.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {answer.links.map((link) => (
                    <li key={`${link.to}-${link.label}`}>
                      <Link
                        to={link.to}
                        className="inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-accent)] hover:bg-[var(--color-bg)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">
              Pick a starter or type a question. Assist routes you to Scan, 3D Lab, components, and MAO docs.
            </p>
          )}
        </LabPanel>

        <LabPanel>
          <h2 className="text-sm font-semibold">Recent</h2>
          {history.length === 0 ? (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">Your last asks show here.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.map((item) => (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswer(item.a)
                      setInput(item.q)
                    }}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2 text-left hover:bg-[var(--color-surface-raised)]"
                  >
                    <p className="text-xs font-medium">{item.q}</p>
                    <p className="mt-1 font-mono-tech text-[10px] text-[var(--color-text-muted)]">
                      {item.a.title}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </LabPanel>
      </div>
    </div>
  )
}
