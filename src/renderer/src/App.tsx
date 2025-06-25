import Versions from '@/components/versions'
import electronLogo from '@/assets/electron.svg'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Code, ExternalLink } from 'lucide-react'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  console.log(import.meta.env.RENDERER_VITE_WEBSITE_URL)
  console.log(import.meta.env.VITE_API_VERSION)

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-[480px]">
        <CardHeader className="items-center text-center">
          <img alt="logo" className="mb-4 h-24 w-24" src={electronLogo} />
          <CardTitle className="text-2xl">
            Build an Electron app with{' '}
            <span className="bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text font-bold text-transparent">
              React
            </span>
            {' & '}
            <span className="bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text font-bold text-transparent">
              TypeScript
            </span>
          </CardTitle>
          <CardDescription>Powered by electron-vite and shadcn/ui</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button asChild variant="outline">
            <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Documentation
            </a>
          </Button>
          <Button onClick={ipcHandle}>
            <Code className="mr-2 h-4 w-4" />
            Send IPC
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Please try pressing{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono">F12</code> to open the devTool
          </p>
        </CardFooter>
      </Card>
      <Versions />
    </div>
  )
}

export default App
