import { useState } from 'react'
import { fetchTTSAudio } from '../lib/ttsAudio'

interface Props {
  text: string
  language: 'ar' | 'en'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

let unlockedAudio: HTMLAudioElement | null = null

export function playAudioSrc(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!unlockedAudio) {
      unlockedAudio = new Audio()
    }
    unlockedAudio.src = src
    unlockedAudio.load()
    unlockedAudio.onended = () => resolve()
    unlockedAudio.onerror = () => reject(new Error('Audio failed'))
    unlockedAudio.play().catch(reject)
  })
}

export async function playTTS(text: string, language: 'ar' | 'en'): Promise<void> {
  const src = await fetchTTSAudio(text, language)
  return playAudioSrc(src)
}

export default function AudioButton({ text, language, label, size = 'md' }: Props) {
  const [playing, setPlaying] = useState(false)

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }

  const handlePlay = async () => {
    if (playing) return
    setPlaying(true)
    try {
      await playTTS(text, language)
    } catch {
      // TTS may fail if function is unavailable
    } finally {
      setPlaying(false)
    }
  }

  return (
    <button
      onClick={handlePlay}
      aria-label={label ?? 'Play audio'}
      className={`${sizeClasses[size]} rounded-full bg-surface border border-border flex items-center justify-center pressable`}
    >
      {playing ? (
        <span className="text-primary">▐▐</span>
      ) : (
        <span>🔊</span>
      )}
    </button>
  )
}
