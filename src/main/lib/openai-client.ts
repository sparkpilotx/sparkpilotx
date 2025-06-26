/**
 * OpenAI client factory.
 * Provides reusable client creation for multiple agents.
 */

import OpenAI from 'openai'

/**
 * Configuration options for creating an OpenAI client.
 */
export interface OpenAIClientConfig {
  /**
   * Override the default API key.
   */
  apiKey?: string
  /**
   * Override the default base URL.
   */
  baseURL?: string
}

/**
 * Create a configured OpenAI client instance.
 * @param config Optional configuration overrides.
 * @returns Configured OpenAI client.
 */
export function createOpenAIClient(config: OpenAIClientConfig = {}): OpenAI {
  const {
    apiKey = import.meta.env.MAIN_VITE_OPENAI_API_KEY,
    baseURL = import.meta.env.MAIN_VITE_OPENAI_BASE_URL
  } = config

  return new OpenAI({
    apiKey,
    baseURL
  })
} 