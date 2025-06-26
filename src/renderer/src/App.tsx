import React, { useState, useEffect } from 'react'

import { ThemeProvider } from './components/theme-provider'
import { TitleBar } from './components/title-bar'
import { Settings } from './components/settings'


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
      <div className="flex flex-col h-screen">
        <TitleBar onOpenSettings={() => setIsSettingsOpen(true)} />
        <main className="flex-1 p-4 overflow-hidden">
        </main>
      </div>
      
      {/* Settings Modal - managed at app level */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </ThemeProvider>
  )
}

export default App