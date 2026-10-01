import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { findAdjacentLessons, findLessonBySlug, lessonsBySlugMap } from '@/data/lessons'
import { findHardwareBySlug } from '@/data/hardware'
import { useProgress } from '@/hooks/useProgress'
import { useInspector } from '@/hooks/useInspector'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateLesson } from '@/lib/audio/buildNarration'
import { PROGRESS_STATUS_LABELS } from '@/lib/learn/labels'
import { scoreQuiz, type QuizAnswerMap } from '@/lib/learn/scoreQuiz'
import { prerequisitesMet } from '@/lib/learn/curriculum'
import {
  LESSON_FLOW_STAGES,
  isLessonFlowStage,
  nextLessonFlowStage,
  previousLessonFlowStage,
  type LessonFlowStageId,
} from '@/lib/learn/lessonFlow'
import type { Lesson } from '@/types/lesson'
import { cn } from '@/lib/cn'

function Section({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
        {title}
      </h2>
      <div className="max-w-3xl text-sm leading-relaxed text-[var(--color-text)]">{children}</div>
    </section>
  )
}

function LessonQuiz({ lesson }: { readonly lesson: Lesson }) {
  const { completeLesson, saveQuiz } = useProgress()
  const [answers, setAnswers] = useState<QuizAnswerMap>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const quizResult = quizSubmitted ? scoreQuiz(lesson.quiz, answers) : null

  return (
    <section className="space-y-4" aria-labelledby="quiz-heading">
      <h2
        id="quiz-heading"
        className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
      >
        Quiz
      </h2>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const result = scoreQuiz(lesson.quiz, answers)
          setQuizSubmitted(true)
          saveQuiz(`${lesson.id}:quiz`, result.score, result.maxScore)
          completeLesson(lesson.id, result.score)
        }}
      >
        {lesson.quiz.map((question, index) => (
          <fieldset
            key={question.id}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <legend className="px-1 text-sm font-medium">
              {index + 1}. {question.prompt}
            </legend>
            <div className="mt-3 space-y-2">
              {question.options.map((option) => (
                <label key={option.id} className="flex min-h-11 items-start gap-2 text-sm">
                  <input
                    type="radio"
                    className="mt-1"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    disabled={quizSubmitted}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: option.id,
                      }))
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {quizResult ? (
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                {quizResult.results.find((item) => item.questionId === question.id)?.isCorrect
                  ? 'Correct. '
                  : 'Not correct. '}
                {question.explanation}
              </p>
            ) : null}
          </fieldset>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="lab-btn-primary disabled:opacity-60"
            disabled={quizSubmitted}
          >
            Submit quiz & complete lesson
          </button>
          {quizResult ? (
            <p className="font-mono-tech text-sm text-[var(--color-accent)]" aria-live="polite">
              Score {quizResult.score}/{quizResult.maxScore}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  )
}

function LessonFlowNav({
  stage,
  onSelect,
}: {
  readonly stage: LessonFlowStageId
  readonly onSelect: (id: LessonFlowStageId) => void
}) {
  return (
    <nav
      aria-label="Lesson flow"
      className="sticky top-14 z-20 -mx-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-2 backdrop-blur-sm sm:-mx-1 sm:px-1"
    >
      <ol className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LESSON_FLOW_STAGES.map((item, index) => {
          const active = item.id === stage
          return (
            <li key={item.id} className="flex shrink-0 items-center gap-1">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden px-1 font-mono-tech text-[10px] text-[var(--color-text-muted)] sm:inline"
                >
                  →
                </span>
              ) : null}
              <button
                type="button"
                title={item.hint}
                aria-current={active ? 'step' : undefined}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'min-h-11 rounded-[var(--radius-sm)] border px-3 text-sm whitespace-nowrap',
                  active
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-accent-strong)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]',
                )}
              >
                <span className="font-mono-tech text-[10px] tracking-wide uppercase">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="ml-2">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function LessonPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()
  const lesson = lessonSlug ? findLessonBySlug(lessonSlug) : undefined
  const adjacent = lessonSlug ? findAdjacentLessons(lessonSlug) : { previous: undefined, next: undefined }
  const [searchParams, setSearchParams] = useSearchParams()
  const stage: LessonFlowStageId = isLessonFlowStage(searchParams.get('stage'))
    ? (searchParams.get('stage') as LessonFlowStageId)
    : 'learn'
  const { setContent } = useInspector()
  const {
    getStatus,
    startLesson,
    completeExperiment,
    toggleBookmark,
    isBookmarked,
    document,
  } = useProgress()

  useEffect(() => {
    if (!lesson) return
    startLesson(lesson.id)
  }, [lesson?.id, lesson, startLesson])

  useEffect(() => {
    if (!lesson) {
      setContent(null)
      return
    }
    const stageMeta = LESSON_FLOW_STAGES.find((item) => item.id === stage)
    setContent({
      title: 'Lesson flow',
      body: (
        <div className="space-y-3 text-sm">
          <p className="font-medium">{lesson.title}</p>
          <p className="font-mono-tech text-xs text-[var(--color-accent)]">
            {stageMeta?.label ?? stage} · lesson {String(lesson.number).padStart(2, '0')}
          </p>
          <p className="text-[var(--color-text-muted)]">{stageMeta?.hint}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{lesson.objective}</p>
        </div>
      ),
    })
    return () => setContent(null)
  }, [lesson, stage, setContent])

  const completedIds = useMemo(
    () =>
      new Set(
        Object.entries(document.lessons)
          .filter(([, record]) => record.status === 'COMPLETED')
          .map(([id]) => id),
      ),
    [document.lessons],
  )

  if (!lesson) {
    return (
      <EmptyState
        title="Lesson not found"
        description={`No lesson matches “${lessonSlug ?? 'unknown'}”.`}
      />
    )
  }

  const status = getStatus(lesson.id)
  const experimentId = `${lesson.id}:experiment`
  const experimentDone = document.experiments[experimentId]?.status === 'COMPLETED'
  const unlocked = prerequisitesMet(lesson, completedIds, lessonsBySlugMap())
  const prevStage = previousLessonFlowStage(stage)
  const nextStage = nextLessonFlowStage(stage)

  function setStage(next: LessonFlowStageId) {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        params.set('stage', next)
        return params
      },
      { replace: true },
    )
  }

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/learn" className="text-[var(--color-accent)] hover:underline">
            Learn
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{String(lesson.number).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{stage}</span>
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
          <div className="flex flex-wrap gap-2">
            <ListenButton
              id={`lesson:${lesson.id}`}
              title={lesson.title}
              text={narrateLesson(lesson)}
            />
            <Link
              to={`/handouts/lessons/${lesson.slug}`}
              className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm"
            >
              Handout
            </Link>
            <button
              type="button"
              onClick={() => toggleBookmark(lesson.id)}
              className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm"
            >
              {isBookmarked(lesson.id) ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">{lesson.objective}</p>
        <p className="font-mono-tech text-xs text-[var(--color-accent)]">
          {PROGRESS_STATUS_LABELS[status]}
        </p>
        {!unlocked ? (
          <p className="text-sm text-[var(--color-warning)]">
            Recommended prerequisites are not marked complete yet. You can still study ahead, but
            expect gaps.
          </p>
        ) : null}
      </header>

      <LessonFlowNav stage={stage} onSelect={setStage} />

      {stage === 'learn' ? (
        <div className="space-y-8">
          <Section title="Prerequisites">
            {lesson.prerequisites.length === 0 ? (
              <p>None — this is an entry lesson.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {lesson.prerequisites.map((slug) => (
                  <li key={slug}>
                    <Link
                      to={`/learn/${slug}`}
                      className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 font-mono-tech text-xs text-[var(--color-accent)]"
                    >
                      {slug}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Theory">
            <p>{lesson.theory}</p>
          </Section>
          <Section title="Visual explanation">
            <p>{lesson.visualExplanation}</p>
          </Section>
        </div>
      ) : null}

      {stage === 'build' ? (
        <div className="space-y-8">
          <Section title="Required hardware">
            <ul className="flex flex-wrap gap-2">
              {lesson.requiredHardware.map((slug) => {
                const hw = findHardwareBySlug(slug)
                return (
                  <li key={slug}>
                    <Link
                      to={`/components/${slug}`}
                      className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-xs text-[var(--color-accent)]"
                    >
                      {hw?.name ?? slug}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Section>

          <section className="space-y-2 rounded-[var(--radius-md)] border border-[var(--color-warning)]/40 bg-[var(--color-surface)] p-4">
            <h2 className="text-sm font-semibold text-[var(--color-warning)]">Safety</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {lesson.safety.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <Section title="Wiring">
            <p>{lesson.wiring}</p>
          </Section>

          <Section title="Prediction">
            <p className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-3">
              {lesson.prediction}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Write your prediction in a notebook before powering the circuit.
            </p>
          </Section>

          <Section title="Firmware">
            <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono-tech text-xs leading-relaxed">
              <code>{lesson.firmware}</code>
            </pre>
          </Section>

          <Section title="Code walkthrough">
            <p>{lesson.codeWalkthrough}</p>
          </Section>
        </div>
      ) : null}

      {stage === 'experiment' ? (
        <div className="space-y-8">
          <Section title="Physical experiment">
            <p>{lesson.physicalExperiment}</p>
            <button
              type="button"
              className="lab-btn-primary mt-3 disabled:opacity-60"
              disabled={experimentDone}
              onClick={() => completeExperiment(experimentId)}
            >
              {experimentDone ? 'Experiment marked complete' : 'Mark experiment complete'}
            </button>
          </Section>

          <Section title="Expected result">
            <p>{lesson.expectedResult}</p>
          </Section>

          <Section title="Measurements">
            <ul className="list-disc space-y-1 pl-5">
              {lesson.measurements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Common mistakes">
            <ul className="list-disc space-y-1 pl-5">
              {lesson.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Debugging">
            <ul className="list-disc space-y-1 pl-5">
              {lesson.debugging.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        </div>
      ) : null}

      {stage === 'challenge' ? (
        <div className="space-y-8">
          <Section title="Challenge">
            <p>{lesson.challenge}</p>
          </Section>

          <Section title="Mini project">
            <p>{lesson.miniProject}</p>
          </Section>

          <LessonQuiz key={lesson.id} lesson={lesson} />
        </div>
      ) : null}

      <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--color-border)] pt-4">
        {prevStage ? (
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm"
            onClick={() => setStage(prevStage)}
          >
            ← {LESSON_FLOW_STAGES.find((item) => item.id === prevStage)?.label}
          </button>
        ) : (
          <span />
        )}
        {nextStage ? (
          <button
            type="button"
            className="lab-btn-primary"
            onClick={() => setStage(nextStage)}
          >
            Continue to {LESSON_FLOW_STAGES.find((item) => item.id === nextStage)?.label} →
          </button>
        ) : null}
      </div>

      <nav className="flex flex-wrap justify-between gap-3 border-t border-[var(--color-border)] pt-4" aria-label="Lesson">
        {adjacent.previous ? (
          <Link
            to={`/learn/${adjacent.previous.slug}`}
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm leading-[2.75rem]"
          >
            ← {adjacent.previous.title}
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link
            to={`/learn/${adjacent.next.slug}`}
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm leading-[2.75rem]"
          >
            {adjacent.next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
