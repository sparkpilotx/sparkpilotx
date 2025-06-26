/**
 * Global proxy configuration for the application
 * This module configures the global proxy settings for all network requests
 */

import { setGlobalDispatcher, ProxyAgent, Agent } from 'undici'

/**
 * Initialize global proxy configuration
 * This should be called early in the application lifecycle
 */
export function initializeGlobalProxy(): void {
  // Configure global proxy dispatcher if proxy is set
  if (import.meta.env.MAIN_VITE_UPSTREAM_PROXY) {
    console.log('Configuring global proxy:', import.meta.env.MAIN_VITE_UPSTREAM_PROXY)
    const proxyAgent = new ProxyAgent(import.meta.env.MAIN_VITE_UPSTREAM_PROXY)
    setGlobalDispatcher(proxyAgent)
  } else {
    console.log('No proxy configured, using default agent')
    // Use default agent if no proxy is configured
    setGlobalDispatcher(new Agent())
  }
}

/**
 * Get the current proxy configuration
 * @returns The proxy URL if configured, otherwise undefined
 */
export function getProxyConfig(): string | undefined {
  return import.meta.env.MAIN_VITE_UPSTREAM_PROXY
}

/**
 * Check if proxy is configured
 * @returns True if proxy is configured, false otherwise
 */
export function isProxyConfigured(): boolean {
  return !!import.meta.env.MAIN_VITE_UPSTREAM_PROXY
} 