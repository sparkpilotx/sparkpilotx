import React, { useState, useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'

import { ThemeProvider } from './components/theme-provider'
import { TitleBar } from './components/title-bar'
import { Settings } from './components/settings'
import { WorkflowDemo } from './workflow/demo'
import { StatusBar } from './components/status-bar'

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

  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-screen">
          <TitleBar onOpenSettings={() => setIsSettingsOpen(true)} />
          <main className="flex-1">
            <WorkflowDemo />
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