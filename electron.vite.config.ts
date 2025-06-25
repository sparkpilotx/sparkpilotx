import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import rendererConfig from './vite.config'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared')
      }
    },
    envPrefix: ['MAIN_VITE_', 'VITE_']
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared')
      }
    },
    envPrefix: ['PRELOAD_VITE_', 'VITE_']
  },
  renderer: rendererConfig
})
