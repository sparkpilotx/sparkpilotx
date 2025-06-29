/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string

  readonly MAIN_VITE_UPSTREAM_PROXY: string
  
  readonly MAIN_VITE_LANGSMITH_TRACING: string
  readonly MAIN_VITE_LANGSMITH_ENDPOINT: string
  readonly MAIN_VITE_LANGSMITH_API_KEY: string
  readonly MAIN_VITE_LANGSMITH_PROJECT: string

  readonly MAIN_VITE_OPENAI_API_KEY: string
  readonly MAIN_VITE_OPENAI_PROJECT_ID: string
  readonly MAIN_VITE_OPENAI_ORG_ID: string

  readonly MAIN_VITE_ANTHROPIC_API_KEY: string

  readonly MAIN_VITE_GEMINI_API_KEY: string
  readonly MAIN_VITE_GOOGLE_CLOUD_PROJECT: string
  readonly MAIN_VITE_GOOGLE_CLOUD_LOCATION: string
  readonly MAIN_VITE_GOOGLE_GENAI_USE_VERTEXAI: string
  readonly MAIN_VITE_DEFAULT_GEMINI_MODEL: string
  readonly MAIN_VITE_DEFAULT_GEMINI_FLASH_MODEL: string
  readonly MAIN_VITE_DEFAULT_GEMINI_EMBEDDING_MODEL: string

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 