import { useState, useEffect } from 'react'

export function useDocumentTitle(): string {
  const [title, setTitle] = useState(document.title)

  useEffect(() => {
    const titleElement = document.querySelector('title')
    if (titleElement) {
      const observer = new MutationObserver(() => {
        setTitle(document.title)
      })
      observer.observe(titleElement, { childList: true })
      return () => observer.disconnect()
    }
    return () => {}
  }, [])

  return title
} 