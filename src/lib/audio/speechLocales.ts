import type { LabLanguageCode } from '@/lib/studio/preferences'

/** BCP-47 tags used by Web Speech and Google Translate TTS. */
export const SPEECH_LANG_TAGS: Record<LabLanguageCode, string> = {
  en: 'en-US',
  my: 'my-MM',
  ja: 'ja-JP',
  ru: 'ru-RU',
}

export function speechLangTag(code: LabLanguageCode): string {
  return SPEECH_LANG_TAGS[code]
}

export function langMatchesVoice(voiceLang: string, code: LabLanguageCode): boolean {
  const normalized = voiceLang.toLowerCase().replace('_', '-')
  if (code === 'en') return normalized.startsWith('en')
  if (code === 'my') return normalized.startsWith('my') || normalized.includes('burm') || normalized.includes('myanmar')
  if (code === 'ja') return normalized.startsWith('ja')
  if (code === 'ru') return normalized.startsWith('ru')
  return false
}

/** Split long text for TTS engines that choke on big payloads. */
export function chunkForLanguage(text: string, code: LabLanguageCode, maxChars = 180): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []

  const splitter =
    code === 'my'
      ? /(?<=[။!?])\s+|\s+/
      : code === 'ja'
        ? /(?<=[。！？.!?])\s*/
        : /(?<=[.!?。！？])\s+/

  const pieces = cleaned.split(splitter).map((part) => part.trim()).filter(Boolean)
  const chunks: string[] = []
  let current = ''
  for (const piece of pieces) {
    if (!current) {
      current = piece
      continue
    }
    if (`${current} ${piece}`.length <= maxChars) {
      current = `${current} ${piece}`
    } else {
      chunks.push(current)
      current = piece.length > maxChars ? piece.slice(0, maxChars) : piece
      if (piece.length > maxChars) {
        for (let i = maxChars; i < piece.length; i += maxChars) {
          chunks.push(piece.slice(i, i + maxChars))
        }
        current = ''
      }
    }
  }
  if (current) chunks.push(current)
  return chunks
}
