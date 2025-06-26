import { registerThemeHandler } from './theme'

// Store cleanup functions for all handlers
const handlerCleanups: (() => void)[] = []

export function registerIpcHandlers(): void {
  // Clear any existing handlers first
  unregisterIpcHandlers()
  
  // Register all handlers and store their cleanup functions
  handlerCleanups.push(
    registerThemeHandler()
    // Add more handlers here as they're created
    // handlerCleanups.push(registerOtherHandler())
  )
}

export function unregisterIpcHandlers(): void {
  // Clean up all registered handlers
  handlerCleanups.forEach(cleanup => {
    try {
      cleanup()
    } catch (error) {
      console.error('Error during IPC handler cleanup:', error)
    }
  })
  
  // Clear the cleanup array
  handlerCleanups.length = 0
} 