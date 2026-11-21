import type { SpeechSegment } from './segments'

export type SpeakOptions = {
  voiceId?: string
  rate?: number
  onSegmentStart?: (index: number, segment: SpeechSegment) => void
  onEnd?: (reason: 'finished' | 'stopped') => void
}

export interface VoiceProvider {
  speak(segments: SpeechSegment[], options?: SpeakOptions): void
  pause(): void
  resume(): void
  stop(): void
  readonly speaking: boolean
  readonly paused: boolean
}
