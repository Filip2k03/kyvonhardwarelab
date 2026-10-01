import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { LearnPage } from '@/features/learn/LearnPage'
import { LessonPage } from '@/features/learn/LessonPage'
import { ComponentsPage } from '@/features/hardware/ComponentsPage'
import { ComponentDetailPage } from '@/features/hardware/ComponentDetailPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { LabPage } from '@/features/lab/LabPage'
import { CircuitPage } from '@/features/lab/CircuitPage'
import { ToolsPage } from '@/features/tools/ToolsPage'
import { HandoutsPage } from '@/features/handouts/HandoutsPage'
import { LessonHandoutPage, ProjectHandoutPage } from '@/features/handouts/HandoutPrintPage'
import { ProgressPage } from '@/features/progress/ProgressPage'
import { ScanPage } from '@/features/scan/ScanPage'
import { AssistPage } from '@/features/assist/AssistPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'
import { MaoLabShell } from '@/features/maoLab/components/MaoLabShell'
import { MaoLandingPage } from '@/features/maoLab/pages/MaoLandingPage'
import { MaoComponentsPage } from '@/features/maoLab/pages/MaoComponentsPage'
import { MaoWiringPage } from '@/features/maoLab/pages/MaoWiringPage'
import { MaoBuildPage } from '@/features/maoLab/pages/MaoBuildPage'
import { MaoFacePage } from '@/features/maoLab/pages/MaoFacePage'
import { MaoFirmwarePage } from '@/features/maoLab/pages/MaoFirmwarePage'
import { MaoTelemetryPage } from '@/features/maoLab/pages/MaoTelemetryPage'
import { MaoArchitecturePage } from '@/features/maoLab/pages/MaoArchitecturePage'

const Lab3dPage = lazy(async () => {
  const module = await import('@/features/lab/Lab3dPage')
  return { default: module.Lab3dPage }
})

const Project3dPage = lazy(async () => {
  const module = await import('@/features/projects/Project3dPage')
  return { default: module.Project3dPage }
})

const MaoWorkbenchPage = lazy(async () => {
  const module = await import('@/features/maoLab/pages/MaoWorkbenchPage')
  return { default: module.MaoWorkbenchPage }
})

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/:lessonSlug" element={<LessonPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="components/:slug" element={<ComponentDetailPage />} />

        <Route path="projects/mao-mark-i" element={<MaoLabShell />}>
          <Route index element={<MaoLandingPage />} />
          <Route
            path="workbench"
            element={
              <Suspense fallback={<PageLoader label="Loading MAO workbench" />}>
                <MaoWorkbenchPage />
              </Suspense>
            }
          />
          <Route path="components" element={<MaoComponentsPage />} />
          <Route path="wiring" element={<MaoWiringPage />} />
          <Route path="build" element={<MaoBuildPage />} />
          <Route path="face" element={<MaoFacePage />} />
          <Route path="firmware" element={<MaoFirmwarePage />} />
          <Route path="telemetry" element={<MaoTelemetryPage />} />
          <Route path="architecture" element={<MaoArchitecturePage />} />
        </Route>

        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route
          path="projects/:slug/3d"
          element={
            <Suspense fallback={<PageLoader label="Loading project 3D" />}>
              <Project3dPage />
            </Suspense>
          }
        />
        <Route path="lab" element={<LabPage />} />
        <Route path="workbench" element={<Navigate to="/lab" replace />} />
        <Route path="lab/circuits/:slug" element={<CircuitPage />} />
        <Route
          path="lab/3d"
          element={
            <Suspense fallback={<PageLoader label="Loading 3D explorer" />}>
              <Lab3dPage />
            </Suspense>
          }
        />
        <Route path="scan" element={<ScanPage />} />
        <Route path="assist" element={<AssistPage />} />
        <Route path="mao" element={<Navigate to="/projects/mao-mark-i" replace />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="handouts" element={<HandoutsPage />} />
        <Route path="handouts/lessons/:lessonSlug" element={<LessonHandoutPage />} />
        <Route path="handouts/projects/:slug" element={<ProjectHandoutPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
