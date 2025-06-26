import { createContext, useContext, useEffect, useState } from "react"
import { type Theme, type ThemeInfo } from "@shared/types"

export type { Theme }

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  effectiveTheme: 'light' | 'dark'
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  effectiveTheme: 'light'
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sparkpilotx-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  // Update DOM classes based on effective theme
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [effectiveTheme])

  // Initialize theme and listen for native theme updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initializeTheme = async (): Promise<void> => {
      try {
        // Get initial theme info from main process
        const themeInfo = await window.api.getNativeTheme()
        
        // Determine effective theme based on current settings
        const newEffectiveTheme = theme === 'system' 
          ? (themeInfo.shouldUseDarkColors ? 'dark' : 'light')
          : theme
        
        setEffectiveTheme(newEffectiveTheme)

        // Listen for native theme changes
        unsubscribe = window.api.onThemeUpdated((themeInfo: ThemeInfo) => {
          // Only update if we're in system mode or if the theme source changed
          if (theme === 'system') {
            const newEffectiveTheme = themeInfo.shouldUseDarkColors ? 'dark' : 'light'
            setEffectiveTheme(newEffectiveTheme)
          }
        })
      } catch (error) {
        console.error('Failed to initialize theme:', error)
        // Fallback to light theme
        setEffectiveTheme('light')
      }
    }

    initializeTheme()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [theme])

  const value = {
    theme,
    effectiveTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
      
      // Set the native theme
      window.api.setNativeTheme(newTheme)
      
      // For immediate UI update (before native theme event)
      if (newTheme !== 'system') {
        setEffectiveTheme(newTheme)
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
} 