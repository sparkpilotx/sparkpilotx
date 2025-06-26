/**
 * Google GenAI client factory
 * Provides reusable client creation for multiple agents
 */

import { GoogleGenAI, type HttpOptions } from '@google/genai'

/**
 * Configuration options for creating a Google GenAI client
 */
export interface GoogleGenAIClientConfig {
  /** Optional HTTP configuration options (proxy, timeout, etc.) */
  httpOptions?: HttpOptions
  /** Override the default Vertex AI setting */
  useVertexAI?: boolean
  /** Override the default API key */
  apiKey?: string
  /** Override the default project ID */
  project?: string
  /** Override the default location */
  location?: string
}

/**
 * Create a configured Google GenAI client instance
 * @param config Optional configuration overrides
 * @returns Configured GoogleGenAI client
 */
export function createGoogleGenAIClient(config: GoogleGenAIClientConfig = {}): GoogleGenAI {
  const {
    httpOptions,
    useVertexAI = import.meta.env.MAIN_VITE_GOOGLE_GENAI_USE_VERTEXAI === 'true',
    apiKey = import.meta.env.MAIN_VITE_GEMINI_API_KEY,
    project = import.meta.env.MAIN_VITE_GOOGLE_CLOUD_PROJECT,
    location = import.meta.env.MAIN_VITE_GOOGLE_CLOUD_LOCATION
  } = config

  if (useVertexAI) {
    return new GoogleGenAI({
      vertexai: true,
      project,
      location,
      httpOptions
    })
  }

  return new GoogleGenAI({
    vertexai: false,
    apiKey,
    httpOptions
  })
}

/**
 * Create a client specifically configured for Vertex AI
 * @param project Google Cloud project ID
 * @param location Google Cloud location
 * @param httpOptions Optional HTTP configuration
 * @returns Vertex AI configured client
 */
export function createVertexAIClient(
  project: string, 
  location: string, 
  httpOptions?: HttpOptions
): GoogleGenAI {
  return new GoogleGenAI({
    vertexai: true,
    project,
    location,
    httpOptions
  })
}

/**
 * Create a client specifically configured for Gemini API
 * @param apiKey Gemini API key
 * @param httpOptions Optional HTTP configuration
 * @returns Gemini API configured client
 */
export function createGeminiAPIClient(
  apiKey: string, 
  httpOptions?: HttpOptions
): GoogleGenAI {
  return new GoogleGenAI({
    vertexai: false,
    apiKey,
    httpOptions
  })
} 