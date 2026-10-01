import type { Project } from '@/types/project'

export type ProjectPartKind =
  | 'mcu'
  | 'breadboard'
  | 'led'
  | 'led-yellow'
  | 'led-green'
  | 'resistor'
  | 'button'
  | 'potentiometer'
  | 'sensor'
  | 'display'
  | 'servo'
  | 'rfid'
  | 'relay'
  | 'buzzer'
  | 'jumper'
  | 'generic'

export interface ProjectScenePart {
  readonly id: string
  readonly kind: ProjectPartKind
  readonly label: string
  readonly revealStep: number
  readonly position: readonly [number, number, number]
  readonly highlight?: boolean
}

export interface ProjectSceneStep {
  readonly stepIndex: number
  readonly title: string
  readonly instructions: string
  readonly visiblePartIds: readonly string[]
  readonly focusPartId: string | null
  readonly cameraHint: readonly [number, number, number]
}

export interface ProjectScene {
  readonly projectId: string
  readonly slug: string
  readonly title: string
  readonly parts: readonly ProjectScenePart[]
  readonly steps: readonly ProjectSceneStep[]
}

function kindFromComponentId(componentId: string): ProjectPartKind {
  const id = componentId.toLowerCase()
  if (id.includes('atmega') || id.includes('uno') || id.includes('esp32')) return 'mcu'
  if (id.includes('breadboard')) return 'breadboard'
  if (id.includes('led-yellow')) return 'led-yellow'
  if (id.includes('led-green')) return 'led-green'
  if (id.includes('led') || id.includes('rgb')) return 'led'
  if (id.includes('resistor')) return 'resistor'
  if (id.includes('button') || id.includes('keypad')) return 'button'
  if (id.includes('pot') || id.includes('joystick')) return 'potentiometer'
  if (id.includes('servo') || id.includes('stepper')) return 'servo'
  if (id.includes('lcd') || id.includes('matrix') || id.includes('seven')) return 'display'
  if (id.includes('rc522') || id.includes('rfid')) return 'rfid'
  if (id.includes('relay')) return 'relay'
  if (id.includes('buzzer')) return 'buzzer'
  if (id.includes('jumper')) return 'jumper'
  if (
    id.includes('dht') ||
    id.includes('lm35') ||
    id.includes('ldr') ||
    id.includes('ultrasonic') ||
    id.includes('ir-') ||
    id.includes('sensor')
  ) {
    return 'sensor'
  }
  return 'generic'
}

const SLOT_OFFSETS: readonly (readonly [number, number, number])[] = [
  [-1.15, 0.12, 0.05],
  [0.95, 0.1, 0.15],
  [0.55, 0.28, -0.25],
  [1.35, 0.32, -0.35],
  [1.55, 0.28, 0.05],
  [1.15, 0.3, 0.35],
  [0.35, 0.28, 0.4],
  [1.75, 0.34, 0.15],
  [0.75, 0.36, -0.55],
  [1.95, 0.28, -0.15],
]

export function buildProjectScene(project: Project): ProjectScene {
  const parts: ProjectScenePart[] = project.bom.map((item, index) => {
    const kind = kindFromComponentId(item.componentId)
    const slot = SLOT_OFFSETS[index % SLOT_OFFSETS.length]!
    const revealStep =
      kind === 'mcu' || kind === 'breadboard'
        ? 0
        : Math.min(project.constructionSteps.length - 1, Math.max(1, Math.floor(index / 2)))

    return {
      id: `${item.componentId}-${index}`,
      kind,
      label: item.componentId.replace(/^hw-/, '').replace(/-/g, ' '),
      revealStep,
      position: slot,
      highlight: kind === 'led' || kind === 'sensor' || kind === 'display',
    }
  })

  const steps: ProjectSceneStep[] = project.constructionSteps.map((step, stepIndex) => {
    const visible = parts.filter((part) => part.revealStep <= stepIndex)
    const focus =
      visible.find((part) => part.revealStep === stepIndex) ?? visible.at(-1) ?? null
    return {
      stepIndex,
      title: step.title,
      instructions: step.instructions,
      visiblePartIds: visible.map((part) => part.id),
      focusPartId: focus?.id ?? null,
      cameraHint: focus
        ? [focus.position[0] + 2.4, focus.position[1] + 2.1, focus.position[2] + 2.8]
        : [3.2, 2.6, 3.8],
    }
  })

  return {
    projectId: project.id,
    slug: project.slug,
    title: project.title,
    parts,
    steps,
  }
}
