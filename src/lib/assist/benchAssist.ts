import { listHardware, findHardwareBySlug } from '@/data/hardware'
import { listLessons } from '@/data/lessons'
import { listProjects } from '@/data/projects'
import { listCircuits } from '@/data/circuits'
import { KIT_VISUAL_PROFILES } from '@/data/scan/kitVisualProfiles'

export interface AssistLink {
  readonly label: string
  readonly to: string
}

export interface AssistReply {
  readonly title: string
  readonly body: string
  readonly links: readonly AssistLink[]
}

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

export function answerBenchAssist(raw: string): AssistReply {
  const q = normalize(raw)
  if (!q) {
    return {
      title: 'Bench Assist',
      body: 'Ask about a part, lesson, circuit, 3D build, camera scan, or MAO Mark I. I use local kit data only — no cloud required.',
      links: [
        { label: 'Scan kit with camera', to: '/scan' },
        { label: '3D Lab', to: '/lab/3d' },
        { label: 'Workbench', to: '/lab' },
        { label: 'Components', to: '/components' },
      ],
    }
  }

  if (/(scan|camera|detect|identify|photo|recognize)/.test(q)) {
    return {
      title: 'Camera kit scanner',
      body: 'Open Scan, point at one kit part on a plain background, capture, and confirm the best catalog match. This runs in your browser — nothing is uploaded.',
      links: [
        { label: 'Open camera scanner', to: '/scan' },
        { label: 'Browse components', to: '/components' },
      ],
    }
  }

  if (/(3d|three|orbit|hotspot|matrix face|build in 3d)/.test(q)) {
    return {
      title: '3D building',
      body: 'Use 3D Lab for the Uno bench with assembled / exploded / isolate views. Project builds have their own /projects/:slug/3d scenes. For MAO Mark I face hardware, identify the 8×8 matrix IC before wiring.',
      links: [
        { label: 'Open 3D Lab', to: '/lab/3d' },
        { label: 'Projects', to: '/projects' },
        { label: 'MAO Mark I page', to: '/projects/mao-mark-i' },
      ],
    }
  }

  if (/(mao|robot|mark i|heartbeat|servo face)/.test(q)) {
    return {
      title: 'MAO Mark I',
      body: 'MAO Mark I is your desktop robot prototype on the Uno kit. Firmware speaks MAO/1 over USB. The website shows status contracts — the MCU stays offline-first. Next hardware step after heartbeat: photograph the 8×8 matrix (do not assume MAX7219).',
      links: [
        { label: 'MAO Mark I', to: '/projects/mao-mark-i' },
        { label: '3D Lab', to: '/lab/3d' },
        { label: 'MAO workbench', to: '/projects/mao-mark-i/workbench' },
        { label: 'LED matrix catalog', to: '/components/led-matrix-8x8' },
      ],
    }
  }

  if (/(resistor|220|ohm|led current)/.test(q)) {
    return {
      title: 'LED + resistor path',
      body: 'For a red LED on 5V, start with ~220 Ω series. Use Tools → LED resistor calculator, then wire the LED circuit in Workbench.',
      links: [
        { label: 'Tools', to: '/tools' },
        { label: 'LED circuit', to: '/lab/circuits/led' },
        { label: '220 Ω part', to: '/components/resistor-220' },
      ],
    }
  }

  // Direct slug / name hits
  for (const profile of KIT_VISUAL_PROFILES) {
    if (profile.aliases.some((a) => q.includes(a)) || q.includes(profile.slug.replace(/-/g, ' '))) {
      const hw = findHardwareBySlug(profile.slug)
      if (hw) {
        return {
          title: hw.name,
          body: `${hw.description} ${profile.howToConfirm} Tip: scan it with the camera to confirm.`,
          links: [
            { label: 'Open component', to: `/components/${hw.slug}` },
            { label: 'Scan with camera', to: '/scan' },
            ...(hw.relatedLessons[0]
              ? [{ label: 'Related lesson', to: `/learn/${hw.relatedLessons[0]}` }]
              : []),
          ],
        }
      }
    }
  }

  const lesson = listLessons().find(
    (item) => q.includes(item.slug.replace(/-/g, ' ')) || q.includes(item.title.toLowerCase()),
  )
  if (lesson) {
    return {
      title: lesson.title,
      body: lesson.objective,
      links: [{ label: 'Open lesson', to: `/learn/${lesson.slug}` }],
    }
  }

  const project = listProjects().find(
    (item) => q.includes(item.slug.replace(/-/g, ' ')) || q.includes(item.title.toLowerCase()),
  )
  if (project) {
    return {
      title: project.title,
      body: project.objective,
      links: [
        { label: 'Open project', to: `/projects/${project.slug}` },
        { label: 'Project 3D', to: `/projects/${project.slug}/3d` },
      ],
    }
  }

  const circuit = listCircuits().find(
    (item) => q.includes(item.slug) || q.includes(item.title.toLowerCase()),
  )
  if (circuit) {
    return {
      title: circuit.title,
      body: circuit.description,
      links: [{ label: 'Open circuit', to: `/lab/circuits/${circuit.slug}` }],
    }
  }

  const hwHit = listHardware().find(
    (item) => q.includes(item.slug.replace(/-/g, ' ')) || q.includes(item.name.toLowerCase()),
  )
  if (hwHit) {
    return {
      title: hwHit.name,
      body: hwHit.description,
      links: [{ label: 'Open component', to: `/components/${hwHit.slug}` }],
    }
  }

  // Fallback: suggest search paths
  return {
    title: 'Try a sharper ask',
    body: 'Examples: “scan DHT11”, “3D lab”, “MAO heartbeat”, “220 resistor”, “blink project”, “LED circuit”.',
    links: [
      { label: 'Assist home tips', to: '/assist' },
      { label: 'Camera scan', to: '/scan' },
      { label: 'Components', to: '/components' },
    ],
  }
}
