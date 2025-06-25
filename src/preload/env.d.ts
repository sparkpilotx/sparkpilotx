/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PRELOAD_VITE_API_KEY: string
  readonly VITE_API_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 