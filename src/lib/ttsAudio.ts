const cache = new Map<string, string>()

export async function fetchTTSAudio(text: string, language: 'ar' | 'en'): Promise<string> {
  const key = `${language}:${text}`
  const cached = cache.get(key)
  if (cached) return cached

  const res = await fetch('/.netlify/functions/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  })

  if (!res.ok) throw new Error('TTS request failed')

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  cache.set(key, url)
  return url
}
