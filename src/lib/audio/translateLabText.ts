import type { LabLanguageCode } from '@/lib/studio/preferences'
import { chunkForLanguage } from '@/lib/audio/speechLocales'

/**
 * Free client-side translation via Google's public gtx endpoint.
 * Used only to speak lab narration in the Adjust language — not a paid API.
 */
export async function translateLabText(text: string, target: LabLanguageCode): Promise<string> {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned || target === 'en') return cleaned

  const parts = chunkForLanguage(cleaned, 'en', 400)
  const translated: string[] = []

  for (const part of parts) {
    const url = new URL('https://translate.googleapis.com/translate_a/single')
    url.searchParams.set('client', 'gtx')
    url.searchParams.set('sl', 'en')
    url.searchParams.set('tl', target)
    url.searchParams.set('dt', 't')
    url.searchParams.set('q', part)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`translate failed: ${response.status}`)
    }
    const data = (await response.json()) as unknown
    const segments = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : []
    const joined = segments
      .map((row) => (Array.isArray(row) && typeof row[0] === 'string' ? row[0] : ''))
      .join('')
      .trim()
    translated.push(joined || part)
  }

  return translated.join(' ').trim()
}
