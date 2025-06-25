/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_VERSION: string
  readonly MAIN_VITE_LANGSMITH_TRACING: string
  readonly MAIN_VITE_LANGSMITH_ENDPOINT: string
  readonly MAIN_VITE_LANGSMITH_API_KEY: string
  readonly MAIN_VITE_LANGSMITH_PROJECT: string
  readonly MAIN_VITE_OPENAI_API_KEY: string
  readonly MAIN_VITE_ANTHROPIC_API_KEY: string
  readonly MAIN_VITE_GEMINI_API_KEY: string
  readonly MAIN_VITE_UPSTREAM_PROXY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 