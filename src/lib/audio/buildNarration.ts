import { resolveBomName } from '@/data/projects'
import { findHardwareBySlug } from '@/data/hardware'
import type { CircuitDefinition } from '@/types/circuit'
import type { HardwareComponent } from '@/types/hardware'
import type { Lesson } from '@/types/lesson'
import type { Project } from '@/types/project'
import type { Lab3dHotspot } from '@/data/lab3d/unoBoard'

function joinList(items: readonly string[]): string {
  if (items.length === 0) return 'none listed'
  if (items.length === 1) return items[0]!
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`
}

function softPause(label: string): string {
  return `${label}.`
}

export function narrateLesson(lesson: Lesson): string {
  const parts = [
    `Hi. Let's sit with lesson ${lesson.number}: ${lesson.title}.`,
    `Here is the goal in plain words. ${lesson.objective}`,
    softPause('Theory first'),
    lesson.theory,
    lesson.visualExplanation,
    softPause('What you need on the bench'),
    `Bring ${joinList(
      lesson.requiredHardware.map((slug) => findHardwareBySlug(slug)?.name ?? slug),
    )}.`,
    softPause('Safety'),
    joinList(lesson.safety),
    softPause('Wiring'),
    lesson.wiring,
    softPause('Before you power anything, make a prediction'),
    lesson.prediction,
    softPause('What the firmware is doing'),
    lesson.codeWalkthrough,
    softPause('Physical experiment'),
    lesson.physicalExperiment,
    `You should expect this: ${lesson.expectedResult}`,
    softPause('Measurements to take'),
    joinList(lesson.measurements),
    softPause('If something looks wrong'),
    joinList(lesson.debugging),
    softPause('Challenge'),
    lesson.challenge,
    `When you are ready for a small project idea, try this. ${lesson.miniProject}`,
    'Take your time. Pause me whenever you need both hands free.',
  ]
  return parts.filter(Boolean).join(' ')
}

export function narrateProject(project: Project): string {
  const bom = project.bom.map((item) => {
    const name = resolveBomName(item.componentId)
    return `${item.quantity} of ${name}`
  })
  const steps = project.constructionSteps
    .map((step, index) => `Step ${index + 1}. ${step.title}. ${step.instructions}`)
    .join(' ')

  return [
    `Let's build project ${project.number}: ${project.title}.`,
    `The objective is simple. ${project.objective}`,
    softPause('Why this works'),
    project.explanation,
    softPause('Parts to gather'),
    joinList(bom),
    softPause('Safety before power'),
    joinList(project.safety),
    softPause('Construction'),
    steps,
    softPause('How to know it worked'),
    joinList(project.testing),
    softPause('Debugging ideas'),
    joinList(project.debugging),
    softPause('If you want to go further'),
    joinList(project.extensions),
    'I will stay with you through the build. Stop playback when you need quiet.',
  ].join(' ')
}

export function narrateComponent(component: HardwareComponent): string {
  const pins = component.pins.map((pin) => `${pin.name}, ${pin.description}`).join('. ')
  return [
    `This is the ${component.name}.`,
    component.description,
    `It sits in the ${component.category} family, at ${component.difficulty} difficulty.`,
    `Operating voltage: ${component.operatingVoltage}. Logic level: ${component.logicVoltage}.`,
    softPause('Pins and contacts'),
    pins || 'No pin table for this part.',
    softPause('How it works'),
    component.operatingPrinciple,
    softPause('Safety'),
    joinList(component.safety),
    'When you wire it, share ground with the controller and double-check the voltage before you connect power.',
  ].join(' ')
}

export function narrateCircuit(circuit: CircuitDefinition): string {
  const warnings = circuit.warnings.map((warning) => warning.message)
  return [
    `Let's look at the ${circuit.title} diagram.`,
    circuit.description,
    circuit.accessibleDescription,
    softPause('Safety notes on this drawing'),
    warnings.length > 0 ? joinList(warnings) : 'No special warnings beyond normal lab care.',
    'Use the diagram to check your breadboard before you apply power.',
  ].join(' ')
}

export function narrateHotspot(hotspot: Lab3dHotspot): string {
  return [
    `On the 3D bench, this hotspot is ${hotspot.label}.`,
    hotspot.summary,
    hotspot.details,
    `Labels to remember: ${joinList(hotspot.pinNames)}.`,
  ].join(' ')
}

export function narrateOverview(title: string, body: string): string {
  return `You are in ${title}. ${body} Use Listen on any lesson, project, component, or diagram for a full walkthrough.`
}
