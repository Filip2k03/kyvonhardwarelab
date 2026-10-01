import { findCircuitBySlug } from '@/data/circuits'
import { findHardwareBySlug } from '@/data/hardware'
import { findLessonBySlug, listLessons } from '@/data/lessons'
import { findProjectBySlug, listProjects } from '@/data/projects'
import { UNO_BOARD_FALLBACK_SUMMARY, UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'
import {
  narrateCircuit,
  narrateComponent,
  narrateHotspot,
  narrateLesson,
  narrateOverview,
  narrateProject,
} from '@/lib/audio/buildNarration'
import { narrateProjectIntro } from '@/lib/audio/projectStepNarration'

export interface PageNarration {
  readonly id: string
  readonly title: string
  readonly text: string
}

export function resolvePageNarration(pathname: string): PageNarration {
  if (pathname === '/' || pathname === '') {
    return {
      id: 'dashboard',
      title: 'Home',
      text: narrateOverview(
        'KYVON Hardware Lab',
        'Learn the idea, then build it with your hands. Open Learn for lessons, Projects for full builds, Lab for diagrams, Tools for calculators, and Handouts when you want paper at the bench.',
      ),
    }
  }

  const lessonMatch = pathname.match(/^\/learn\/([^/]+)/)
  if (lessonMatch) {
    const lesson = findLessonBySlug(decodeURIComponent(lessonMatch[1]!))
    if (lesson) {
      return { id: `lesson:${lesson.id}`, title: lesson.title, text: narrateLesson(lesson) }
    }
  }

  if (pathname === '/learn') {
    const titles = listLessons()
      .slice(0, 8)
      .map((lesson) => lesson.title)
      .join(', ')
    return {
      id: 'learn-index',
      title: 'Learn',
      text: narrateOverview(
        'the Learn library',
        `Start with fundamentals and keep moving. Early lessons include ${titles}. Open any lesson and press Listen for a human-paced walkthrough.`,
      ),
    }
  }

  const componentMatch = pathname.match(/^\/components\/([^/]+)/)
  if (componentMatch) {
    const component = findHardwareBySlug(decodeURIComponent(componentMatch[1]!))
    if (component) {
      return {
        id: `component:${component.id}`,
        title: component.name,
        text: narrateComponent(component),
      }
    }
  }

  if (pathname === '/components') {
    return {
      id: 'components-index',
      title: 'Components',
      text: narrateOverview(
        'the component catalog',
        'Each part card explains voltage, pins, and how it fits the kit. Open a part and listen for a spoken pin tour.',
      ),
    }
  }

  if (pathname.startsWith('/projects/') && pathname.endsWith('/3d')) {
    const slug = pathname.split('/')[2]
    const project = slug ? findProjectBySlug(decodeURIComponent(slug)) : undefined
    if (project) {
      return {
        id: `project3d:${project.id}`,
        title: `${project.title} 3D`,
        text: narrateProjectIntro(project),
      }
    }
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)/)
  if (projectMatch) {
    const project = findProjectBySlug(decodeURIComponent(projectMatch[1]!))
    if (project) {
      return { id: `project:${project.id}`, title: project.title, text: narrateProject(project) }
    }
  }

  if (pathname === '/projects') {
    const titles = listProjects()
      .slice(0, 6)
      .map((project) => project.title)
      .join(', ')
    return {
      id: 'projects-index',
      title: 'Projects',
      text: narrateOverview(
        'the project library',
        `Builds start gentle and grow. You will find ${titles}, and more. Open one and listen while you gather the bill of materials.`,
      ),
    }
  }

  const circuitMatch = pathname.match(/^\/lab\/circuits\/([^/]+)/)
  if (circuitMatch) {
    const circuit = findCircuitBySlug(decodeURIComponent(circuitMatch[1]!))
    if (circuit) {
      return { id: `circuit:${circuit.id}`, title: circuit.title, text: narrateCircuit(circuit) }
    }
  }

  if (pathname === '/lab/3d') {
    const spots = UNO_BOARD_HOTSPOTS.map((hotspot) => narrateHotspot(hotspot)).join(' ')
    return {
      id: 'lab3d',
      title: '3D Explorer',
      text: `${UNO_BOARD_FALLBACK_SUMMARY} ${spots}`,
    }
  }

  if (pathname === '/lab') {
    return {
      id: 'lab',
      title: 'Lab',
      text: narrateOverview(
        'the Lab',
        'Educational wiring diagrams live here, and the 3D explorer is one click away. Diagrams are teaching drawings, not SPICE simulations.',
      ),
    }
  }

  if (pathname === '/tools') {
    return {
      id: 'tools',
      title: 'Tools',
      text: narrateOverview(
        'Tools',
        'Use the calculators for resistor color codes, LED current, divider math, and unit conversion before you commit a part on the breadboard.',
      ),
    }
  }

  if (pathname.startsWith('/handouts')) {
    return {
      id: 'handouts',
      title: 'Handouts',
      text: narrateOverview(
        'Handouts',
        'Printable A4 worksheets for every lesson and project. Open one, then use print or save as PDF. Listen first if you want a spoken preview of the worksheet sections.',
      ),
    }
  }

  if (pathname === '/progress') {
    return {
      id: 'progress',
      title: 'Progress',
      text: narrateOverview(
        'Progress',
        'Your lesson and project status stay in this browser only. Export a backup if you change machines.',
      ),
    }
  }

  return {
    id: `page:${pathname}`,
    title: 'KYVON Hardware Lab',
    text: narrateOverview(
      'this page',
      'Press Listen for a short orientation, or open a lesson or project for a full spoken walkthrough.',
    ),
  }
}
