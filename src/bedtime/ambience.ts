export const AMBIENT_BEDS = [
  { id: 'rain', title: 'Rain' },
  { id: 'water', title: 'Water' },
  { id: 'night', title: 'Night air' },
  { id: 'tone', title: 'Soft tone' },
] as const

export type AmbientId = (typeof AMBIENT_BEDS)[number]['id']

export type AmbientBed = { stop: () => void }

/**
 * Original beds synthesised in the browser. They are not recordings and not a
 * sample library. A user gesture should call this so the audio context can start.
 */
export function startAmbience(id: AmbientId): AmbientBed | null {
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null
  const ctx = new window.AudioContext()
  void ctx.resume()
  const master = ctx.createGain()
  master.gain.value = id === 'tone' ? 0.06 : 0.16
  master.connect(ctx.destination)

  if (id === 'tone') {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 174
    osc.connect(master)
    osc.start()
    return {
      stop() {
        osc.stop()
        void ctx.close()
      },
    }
  }

  const length = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1
    last = last * 0.98 + white * 0.02
    data[index] = id === 'night' ? last : white
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  noise.loop = true
  const filter = ctx.createBiquadFilter()
  if (id === 'rain') {
    filter.type = 'highpass'
    filter.frequency.value = 900
  } else if (id === 'water') {
    filter.type = 'bandpass'
    filter.frequency.value = 480
    filter.Q.value = 0.7
  } else {
    filter.type = 'lowpass'
    filter.frequency.value = 240
  }
  noise.connect(filter).connect(master)
  noise.start()
  return {
    stop() {
      noise.stop()
      void ctx.close()
    },
  }
}
