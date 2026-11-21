import * as Speech from 'expo-speech'
import { Platform } from 'react-native'

import { clampRate, segmentDurationMs, type SpeechSegment } from './segments'
import type { SpeakOptions, VoiceProvider } from './types'

function speakWeb(text: string, rate: number): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
}

function stopWeb(): void {
  if (typeof window === 'undefined') return
  window.speechSynthesis?.cancel()
}

/** Verse-by-verse device speech. A timer advances the highlight even when the browser has no voice. */
export class DeviceVoiceProvider implements VoiceProvider {
  private segments: SpeechSegment[] = []
  private index = 0
  private options: SpeakOptions = {}
  private timer: ReturnType<typeof setTimeout> | null = null
  private _speaking = false
  private _paused = false

  get speaking(): boolean {
    return this._speaking
  }

  get paused(): boolean {
    return this._paused
  }

  speak(segments: SpeechSegment[], options: SpeakOptions = {}): void {
    this.clear()
    this.segments = segments
    this.options = options
    this.index = 0
    this._paused = false
    this._speaking = segments.length > 0
    this.playCurrent()
  }

  pause(): void {
    if (!this._speaking) return
    this._paused = true
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    if (Platform.OS === 'web') window.speechSynthesis?.pause()
    else void Speech.pause()
  }

  resume(): void {
    if (!this._speaking || !this._paused) return
    this._paused = false
    if (Platform.OS === 'web') window.speechSynthesis?.resume()
    else void Speech.resume()
    this.playCurrent()
  }

  stop(): void {
    const was = this._speaking
    this.clear()
    if (was) this.options.onEnd?.('stopped')
  }

  private playCurrent(): void {
    if (!this._speaking || this._paused) return
    const segment = this.segments[this.index]
    if (!segment) {
      this._speaking = false
      this.clearAudio()
      this.options.onEnd?.('finished')
      return
    }
    this.options.onSegmentStart?.(this.index, segment)
    const rate = clampRate(this.options.rate ?? 1)
    if (Platform.OS === 'web') speakWeb(segment.text, rate)
    else Speech.speak(segment.text, { rate })
    this.timer = setTimeout(() => {
      this.index += 1
      this.playCurrent()
    }, segmentDurationMs(segment.text, rate))
  }

  private clearAudio(): void {
    if (Platform.OS === 'web') stopWeb()
    else void Speech.stop()
  }

  private clear(): void {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    this._speaking = false
    this._paused = false
    this.clearAudio()
  }
}

/** Placeholder for timed premium audio. The listen bar keeps it behind the flag and tier. */
export class PremiumAudioProvider implements VoiceProvider {
  speaking = false
  paused = false
  speak(): void {}
  pause(): void {}
  resume(): void {}
  stop(): void {}
}
