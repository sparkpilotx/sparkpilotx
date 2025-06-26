import { createContext, useContext, useEffect, useState } from "react"
import { type ThemeInfo } from "@shared/types"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  effectiveTheme: 'light' | 'dark'
}

const initialState: ThemeProviderState = {
  effectiveTheme: 'light'
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
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
        
        // Set effective theme based on system preference
        const newEffectiveTheme = themeInfo.shouldUseDarkColors ? 'dark' : 'light'
        setEffectiveTheme(newEffectiveTheme)

        // Listen for native theme changes
        unsubscribe = window.api.onThemeUpdated((themeInfo: ThemeInfo) => {
          const newEffectiveTheme = themeInfo.shouldUseDarkColors ? 'dark' : 'light'
          setEffectiveTheme(newEffectiveTheme)
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
  }, [])

  const value = {
    effectiveTheme,
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