import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <div className="fixed bottom-5">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Versions</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dependencies</h4>
              <p className="text-sm text-muted-foreground">
                The versions of core dependencies.
              </p>
            </div>
            <Separator />
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Electron</span>
                <span className="text-right font-mono">{versions.electron}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Chromium</span>
                <span className="text-right font-mono">{versions.chrome}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Node.js</span>
                <span className="text-right font-mono">{versions.node}</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Versions
