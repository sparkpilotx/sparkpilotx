/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_APP_NAME: string
  readonly VITE_API_VERSION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 