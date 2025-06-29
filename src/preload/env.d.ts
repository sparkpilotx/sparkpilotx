/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  
  readonly PRELOAD_VITE_API_KEY: string
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 