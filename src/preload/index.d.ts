import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    api: ElectronAPI & {
      // Theme-related APIs removed as we now use CSS media queries
      // Add other custom API types here as needed
    }
  }
}
