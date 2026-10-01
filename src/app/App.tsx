import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { AppRouter } from '@/app/router'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProgressProvider>
          <NarrationProvider>
            <AppRouter />
          </NarrationProvider>
        </ProgressProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
