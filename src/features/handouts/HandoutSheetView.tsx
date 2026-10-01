import type { ReactNode } from 'react'
import type { HandoutSheet } from '@/types/handout'

interface HandoutSheetViewProps {
  readonly sheet: HandoutSheet
  readonly circuit?: ReactNode
}

function RuledLines({ count }: { readonly count: number }) {
  return (
    <div className="handout-lines" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="handout-line" />
      ))}
    </div>
  )
}

export function HandoutSheetView({ sheet, circuit }: HandoutSheetViewProps) {
  return (
    <article className="handout-sheet" aria-label={`${sheet.numberLabel}: ${sheet.title}`}>
      <header className="handout-header">
        <p className="handout-brand">KYVON HARDWARE LAB</p>
        <p className="handout-kind">{sheet.kind === 'lesson' ? 'Lesson' : 'Project'}</p>
        <h1>{sheet.title}</h1>
        <p className="handout-subtitle">{sheet.subtitle}</p>
        <dl className="handout-identity">
          <div>
            <dt>Name</dt>
            <dd />
          </div>
          <div>
            <dt>Date</dt>
            <dd />
          </div>
        </dl>
      </header>

      {sheet.sections.map((block) => (
        <section
          key={block.id}
          className={block.avoidPageBreak ? 'break-inside-avoid' : undefined}
          aria-labelledby={`handout-${sheet.slug}-${block.id}`}
        >
          <h2 id={`handout-${sheet.slug}-${block.id}`}>{block.title}</h2>
          {block.body ? <p className="handout-body whitespace-pre-wrap">{block.body}</p> : null}
          {block.id === 'circuit' ? circuit : null}
          {block.items && block.items.length > 0 ? (
            <ul>
              {block.items.map((item, index) => (
                <li key={`${block.id}-${index}`}>
                  {item.text ? <span>{item.text}</span> : null}
                  {item.lines ? <RuledLines count={item.lines} /> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  )
}
