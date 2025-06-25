/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_WEBSITE_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
