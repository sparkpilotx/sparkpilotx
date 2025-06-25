import { WebFrameMain } from 'electron'

const RENDERER_URL = process.env['ELECTRON_RENDERER_URL']

export const validateSender = (frame: WebFrameMain): boolean => {
  if (!RENDERER_URL) {
    // In production, only 'file://' protocol is allowed
    return frame.url.startsWith('file://')
  }

  // In development, the origin of the sender's URL must match the dev server's URL
  try {
    const frameUrl = new URL(frame.url)
    const rendererUrl = new URL(RENDERER_URL)
    return frameUrl.origin === rendererUrl.origin
  } catch (e) {
    console.error('Failed to parse sender URL:', e)
    return false
  }
} 