import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img
        alt="logo"
        className="mb-5 h-32 w-32 transition-transform duration-300 hover:drop-shadow-[0_0_1.2em_#6988e6aa]"
        src={electronLogo}
      />
      <div className="mb-2.5 font-semibold text-gray-400">Powered by electron-vite</div>
      <div className="py-4 text-center text-3xl font-bold">
        Build an Electron app with{' '}
        <span className="bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text font-bold text-transparent">
          React
        </span>
        &nbsp;and{' '}
        <span className="bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text font-bold text-transparent">
          TypeScript
        </span>
      </div>
      <p className="text-md font-semibold text-gray-400">
        Please try pressing <code className="rounded bg-gray-800 p-1 font-mono">F12</code> to open
        the devTool
      </p>
      <div className="m-[-6px] flex flex-wrap justify-start p-8">
        <div className="flex-shrink-0 p-1.5">
          <a
            className="inline-block cursor-pointer whitespace-nowrap rounded-full border border-gray-600 bg-gray-700 px-5 py-2 text-sm font-semibold text-white no-underline hover:border-gray-500 hover:bg-gray-600"
            href="https://electron-vite.org/"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>
        </div>
        <div className="flex-shrink-0 p-1.5">
          <a
            className="inline-block cursor-pointer whitespace-nowrap rounded-full border border-gray-600 bg-gray-700 px-5 py-2 text-sm font-semibold text-white no-underline hover:border-gray-500 hover:bg-gray-600"
            target="_blank"
            rel="noreferrer"
            onClick={ipcHandle}
          >
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </div>
  )
}

export default App
