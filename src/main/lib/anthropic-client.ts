/**
 * Anthropic client factory.
 * Provides reusable client creation for multiple agents.
 */

import Anthropic from '@anthropic-ai/sdk'

/**
 * Configuration options for creating an Anthropic client.
 */
export interface AnthropicClientConfig {
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
 * Create a configured Anthropic client instance.
 * @param config Optional configuration overrides.
 * @returns Configured Anthropic client.
 */
export function createAnthropicClient(config: AnthropicClientConfig = {}): Anthropic {
  const {
    apiKey = import.meta.env.MAIN_VITE_ANTHROPIC_API_KEY,
    baseURL = import.meta.env.MAIN_VITE_ANTHROPIC_BASE_URL
  } = config

  return new Anthropic({
    apiKey,
    baseURL
  })
} 