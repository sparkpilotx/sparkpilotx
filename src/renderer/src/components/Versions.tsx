import { useState } from 'react'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="fixed bottom-5 inline-flex items-center overflow-hidden rounded-full bg-zinc-800 p-4 font-mono text-sm text-opacity-80 backdrop-blur-2xl">
      <li className="border-r border-gray-500 px-5">Electron v{versions.electron}</li>
      <li className="border-r border-gray-500 px-5">Chromium v{versions.chrome}</li>
      <li className="px-5">Node v{versions.node}</li>
    </ul>
  )
}

export default Versions
