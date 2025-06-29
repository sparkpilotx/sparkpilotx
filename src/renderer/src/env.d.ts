/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_CURRENT_SAMPLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
