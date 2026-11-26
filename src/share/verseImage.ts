import { Platform } from 'react-native'

/** Draws a simple share card in the browser. Native builds have no canvas, so they skip the file. */
export async function shareVerseImage(label: string, text: string): Promise<'shared' | 'downloaded' | 'unavailable'> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return 'unavailable'
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const context = canvas.getContext('2d')
  if (!context) return 'unavailable'
  context.fillStyle = '#F4F7FF'
  context.fillRect(0, 0, 1080, 1080)
  context.fillStyle = '#D7E4FF'
  context.beginPath()
  context.arc(860, 180, 220, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#4338CA'
  context.font = '600 28px Inter, sans-serif'
  context.fillText(label.toUpperCase(), 80, 220)
  context.fillStyle = '#12121A'
  context.font = '500 54px Georgia, serif'
  const words = text.split(' ')
  let line = ''
  let y = 340
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (context.measureText(next).width > 900) {
      context.fillText(line, 80, y)
      y += 72
      line = word
    } else {
      line = next
    }
  }
  if (line) context.fillText(line, 80, y)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return 'unavailable'
  const file = new File([blob], 'verse-of-the-day.png', { type: 'image/png' })
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean }
  if (nav.share && nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title: label, text })
    return 'shared'
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'verse-of-the-day.png'
  link.click()
  URL.revokeObjectURL(url)
  return 'downloaded'
}
