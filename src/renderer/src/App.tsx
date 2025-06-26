import React from 'react'

import { ThemeProvider } from './components/theme-provider'
import { TitleBar } from './components/title-bar'

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <TitleBar />
        <main className="flex-1 p-4 overflow-hidden">
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App