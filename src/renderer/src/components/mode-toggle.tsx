import { Moon, Sun, Monitor, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle(): React.JSX.Element {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            }`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            }`}
          />
          <Monitor
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === 'system' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(): void => setTheme('light')}>
          <div className="flex w-full items-center justify-between">
            <span>Light</span>
            {theme === 'light' && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(): void => setTheme('dark')}>
          <div className="flex w-full items-center justify-between">
            <span>Dark</span>
            {theme === 'dark' && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(): void => setTheme('system')}>
          <div className="flex w-full items-center justify-between">
            <span>System</span>
            {theme === 'system' && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 