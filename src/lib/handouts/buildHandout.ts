import { findCircuitBySlug } from '@/data/circuits'
import { findHardwareBySlug } from '@/data/hardware'
import { resolveBomName } from '@/data/projects'
import type { Lesson } from '@/types/lesson'
import type { Project } from '@/types/project'
import type { HandoutListItem, HandoutSection, HandoutSheet } from '@/types/handout'

function bullet(text: string, lines?: number): HandoutListItem {
  return lines === undefined ? { text } : { text, lines }
}

function section(
  id: string,
  title: string,
  options: {
    body?: string
    items?: readonly HandoutListItem[]
    avoidPageBreak?: boolean
  },
): HandoutSection {
  return { id, title, ...options }
}

export function lessonToHandout(lesson: Lesson): HandoutSheet {
  const componentNames = lesson.requiredHardware.map(
    (slug) => findHardwareBySlug(slug)?.name ?? slug,
  )

  return {
    kind: 'lesson',
    slug: lesson.slug,
    numberLabel: `Lesson ${String(lesson.number).padStart(2, '0')}`,
    title: lesson.title,
    subtitle: lesson.objective,
    sections: [
      section('objectives', 'Objectives', {
        items: [bullet(lesson.objective), bullet(`Mini project: ${lesson.miniProject}`)],
      }),
      section('theory', 'Theory', {
        body: `${lesson.theory}\n\n${lesson.visualExplanation}`,
      }),
      section('components', 'Components', {
        items: componentNames.map((name) => bullet(name)),
      }),
      section('circuit', 'Circuit', {
        body: lesson.wiring,
        avoidPageBreak: true,
        items: [bullet('Sketch the completed circuit below.', 6)],
      }),
      section('prediction', 'Prediction', {
        body: lesson.prediction,
        items: [bullet('Write your prediction before applying power.', 3)],
      }),
      section('procedure', 'Procedure', {
        body: `${lesson.physicalExperiment}\n\nExpected: ${lesson.expectedResult}\n\n${lesson.firmware}`,
      }),
      section('measurements', 'Measurements', {
        items: lesson.measurements.map((item) => bullet(item, 2)),
      }),
      section('observations', 'Observations', {
        items: [bullet('Record what actually happened.', 4), bullet('Note differences from prediction.', 3)],
      }),
      section('debugging', 'Debugging', {
        items: [...lesson.debugging, ...lesson.commonMistakes].map((item) => bullet(item, 1)),
      }),
      section('challenge', 'Challenge', { body: lesson.challenge }),
      section('notes', 'Notes', {
        items: lesson.safety.map((item) => bullet(item)),
      }),
    ],
  }
}

export function projectToHandout(project: Project): HandoutSheet {
  const circuit = project.circuitId ? findCircuitBySlug(project.circuitId) : undefined
  const circuitBody = circuit
    ? `${circuit.title}. ${circuit.description}`
    : project.explanation

  return {
    kind: 'project',
    slug: project.slug,
    numberLabel: `Project ${String(project.number).padStart(2, '0')}`,
    title: project.title,
    subtitle: project.objective,
    sections: [
      section('objectives', 'Objectives', { body: project.objective }),
      section('theory', 'Theory', { body: project.explanation }),
      section('components', 'Components', {
        items: project.bom.map((item) => {
          const name = resolveBomName(item.componentId)
          const note = item.notes ? ` — ${item.notes}` : ''
          return bullet(`${item.quantity}× ${name}${note}`)
        }),
      }),
      section('circuit', 'Circuit', {
        body: circuitBody,
        avoidPageBreak: true,
        items: [bullet('Attach or sketch the working circuit here. Do not split this diagram.', 6)],
      }),
      section('prediction', 'Prediction', {
        items: [bullet('Predict the output before you upload.', 3)],
      }),
      section('procedure', 'Procedure', {
        items: project.constructionSteps.map((step) =>
          bullet(`${step.title}: ${step.instructions}`),
        ),
        body: project.firmware,
      }),
      section('measurements', 'Measurements', {
        items: project.testing.map((item) => bullet(item, 2)),
      }),
      section('observations', 'Observations', {
        items: [bullet('Record measurements, serial output, and surprises.', 4)],
      }),
      section('debugging', 'Debugging', {
        items: project.debugging.map((item) => bullet(item, 1)),
      }),
      section('challenge', 'Challenge', {
        items: project.extensions.map((item) => bullet(item)),
      }),
      section('notes', 'Notes', {
        items: [...project.safety.map((item) => bullet(item)), bullet('Additional notes.', 4)],
      }),
    ],
  }
}
