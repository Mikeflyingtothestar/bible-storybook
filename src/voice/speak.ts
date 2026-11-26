import * as Speech from 'expo-speech'

export function speakText(text: string, rate = 0.92): void {
  Speech.stop()
  Speech.speak(text, { rate })
}

export function stopSpeaking(): void {
  Speech.stop()
}