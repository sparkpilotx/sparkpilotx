/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PRELOAD_VITE_API_KEY: string
  readonly VITE_API_VERSION: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 