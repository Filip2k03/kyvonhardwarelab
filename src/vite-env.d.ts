/// <reference types="vite/client" />

interface GoogleTranslateElementOptions {
  pageLanguage: string
  includedLanguages?: string
  autoDisplay?: boolean
}

interface Window {
  googleTranslateElementInit?: () => void
  google?: {
    translate: {
      TranslateElement: new (options: GoogleTranslateElementOptions, elementId: string) => unknown
    }
  }
}
