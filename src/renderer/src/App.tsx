import { ThemeProvider } from '@/components/theme-provider'
import { TitleBar } from './components/title-bar'

function App(): React.JSX.Element {
  const platform = window.api.process.platform

  return (
    <ThemeProvider defaultTheme="dark" storageKey="sparkpilotx-ui-theme">
      <TitleBar />
      <div className="pt-8">
        <p>Platform: {platform}</p>
      </div>
    </ThemeProvider>
  )
}

export default App