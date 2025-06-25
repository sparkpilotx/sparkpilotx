import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import rendererConfig from './vite.config'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    envPrefix: ['MAIN_VITE_', 'VITE_']
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    envPrefix: ['PRELOAD_VITE_', 'VITE_']
  },
  renderer: rendererConfig
})
