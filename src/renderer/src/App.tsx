import React, { useState, useEffect, Suspense } from 'react'
import { ReactFlowProvider } from '@xyflow/react'

import { ThemeProvider } from './components/theme-provider'
import { TitleBar } from './components/title-bar'
import { Settings } from './components/settings'
import { StatusBar } from './components/status-bar'

// Sample configuration - reads from VITE_CURRENT_SAMPLE environment variable
const CURRENT_SAMPLE = import.meta.env.VITE_CURRENT_SAMPLE || 'placeholder'

// Auto-import all samples from samples directory
const sampleModules = import.meta.glob('./samples/*/index.tsx')

// Manual samples (outside of samples directory)
const WorkflowSample = React.lazy(() => import('./workflow/demo'))

// Loading component
const SampleLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-600">Loading sample...</p>
    </div>
  </div>
)

// Create sample registry
const samples: Record<string, React.ReactElement> = {
  // Manual samples
  workflow: <WorkflowSample />
}

// Auto-register samples from samples directory
Object.entries(sampleModules).forEach(([path, moduleLoader]) => {
  // Extract sample name from path: './samples/placeholder/index.tsx' -> 'placeholder'
  const sampleName = path.split('/')[2]
  if (sampleName) {
    const SampleComponent = React.lazy(moduleLoader as () => Promise<{ default: React.ComponentType }>)
    samples[sampleName] = <SampleComponent />
  }
})

function App(): React.JSX.Element {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    // Listen for settings shortcut from main process
    const unsubscribe = window.api.onOpenSettings(() => {
      setIsSettingsOpen(true)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Get current sample component
  const CurrentSample = samples[CURRENT_SAMPLE] || samples.placeholder || Object.values(samples)[0]

  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-screen">
          <TitleBar onOpenSettings={() => setIsSettingsOpen(true)} />
          <main className="flex-1">
            <Suspense fallback={<SampleLoader />}>
              {CurrentSample}
            </Suspense>
          </main>
          <StatusBar />
        </div>
        
        {/* Settings Modal - managed at app level */}
        <Settings 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </ReactFlowProvider>
    </ThemeProvider>
  )
}

export default App