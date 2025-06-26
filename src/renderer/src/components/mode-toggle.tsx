import { Moon, Sun, Monitor } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle(): React.JSX.Element {
  const { theme, effectiveTheme, setTheme } = useTheme()

  const handleToggle = (): void => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
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
      <span className="sr-only">
        Toggle theme (current: {theme === 'system' ? `system (${effectiveTheme})` : theme})
      </span>
    </Button>
  )
} 