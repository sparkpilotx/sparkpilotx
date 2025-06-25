import Versions from '@/components/versions'
import electronLogo from '@/assets/electron.svg'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>SparkPilotX</CardTitle>
                <ModeToggle />
              </div>
              <CardDescription>
                Your intelligent companion for seamless development and automation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center justify-center">
                  <img src={electronLogo} className="w-32" alt="logo" />
                </div>
                <p>
                  An app built with{' '}
                  <span className="text-teal-500 dark:text-teal-400">React</span>,{' '}
                  <span className="text-blue-500 dark:text-blue-400">TypeScript</span>,{' '}
                  <span className="text-purple-500 dark:text-purple-400">Vite</span> and{' '}
                  <span className="text-gray-500 dark:text-gray-400">Electron</span>.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Edit <code>src/renderer/src/app.tsx</code> and save to test HMR
                </p>
              </div>

              <div className="my-4">
                <Separator />
              </div>

              <div className="flex flex-col space-y-2 text-center text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Ping Preload scripts
                  <button
                    className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white"
                    onClick={ipcHandle}
                  >
                    Ping
                  </button>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Versions />
            </CardFooter>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App