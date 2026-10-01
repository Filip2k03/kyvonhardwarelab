import type { Project } from '@/types/project'
import { resolveBomName } from '@/data/projects'
import type { ProjectSceneStep } from '@/lib/projects/buildProjectScene'

export function narrateProjectStep(
  project: Project,
  step: ProjectSceneStep,
  totalSteps: number,
): string {
  const stepNumber = step.stepIndex + 1
  const opening =
    stepNumber === 1
      ? `Welcome to the 3D build for ${project.title}. We are on step one of ${totalSteps}.`
      : `Step ${stepNumber} of ${totalSteps} for ${project.title}.`

  const focusHint = step.focusPartId
    ? 'Look at the highlighted part on the bench while I explain.'
    : 'Orbit the scene so you can see the whole layout.'

  const safety =
    stepNumber === 1
      ? `Quick safety first. ${project.safety.slice(0, 2).join(' ')}`
      : ''

  const closing =
    stepNumber === totalSteps
      ? `That finishes the construction path. When you test, watch for this: ${project.testing[0] ?? 'steady expected behavior'}. Take a breath before you apply power.`
      : 'When this step looks right on your board, move to the next step with me.'

  return [opening, focusHint, `This step is called ${step.title}.`, step.instructions, safety, closing]
    .filter(Boolean)
    .join(' ')
}

export function narrateProjectIntro(project: Project): string {
  const parts = project.bom
    .slice(0, 6)
    .map((item) => resolveBomName(item.componentId))
    .join(', ')

  return [
    `This is a guided 3D walkthrough of ${project.title}.`,
    `We will build it one step at a time, with the model updating as we go.`,
    `The goal: ${project.objective}`,
    `Parts you will see include ${parts}.`,
    'Press play on a step to hear the explanation while the model focuses that stage. You can open fullscreen for a clearer view at the bench.',
  ].join(' ')
}
