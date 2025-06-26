// Exponential Moving Average for smoothing keypoints
interface KeypointHistory {
  [key: string]: Array<{ x: number; y: number; z?: number }>
}

const keypointHistory: KeypointHistory = {}
const SMOOTHING_FACTOR = 0.7
const HISTORY_LENGTH = 5

// EMA (Exponential Moving Average) buffer for smoothing keypoints
const emaBuffer: { [key: number]: { x: number; y: number; z: number } } = {}

/**
 * Smooths keypoints using a simple Exponential Moving Average.
 * This helps to reduce jitter from the raw pose detection output.
 * @param kpts The raw keypoints array from MediaPipe.
 * @returns The smoothed keypoints array.
 */
export function smoothKeypoints(kpts: any[]): any[] {
  if (!kpts) return []
  const alpha = 0.6 // Smoothing factor. Higher value = less smoothing, more responsive.

  const smoothedKpts = kpts.map((pt, i) => {
    const prev = emaBuffer[i] ?? pt
    const sm = {
      ...pt,
      x: alpha * pt.x + (1 - alpha) * prev.x,
      y: alpha * pt.y + (1 - alpha) * prev.y,
      z: alpha * pt.z + (1 - alpha) * prev.z,
    }
    emaBuffer[i] = { x: sm.x, y: sm.y, z: sm.z }
    return sm
  })

  // Add a reference to the previous hip position for displacement calculation
  const rightHip = smoothedKpts[24]
  if (rightHip) {
    ;(smoothedKpts as any).__prevHipY = (emaBuffer as any).__currentHipY ?? rightHip.y * 100
    ;(emaBuffer as any).__currentHipY = rightHip.y * 100
  }

  return smoothedKpts
}

export function angleBetween(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  // Calculate angle ABC in degrees
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs((radians * 180.0) / Math.PI)
  angle = angle > 180.0 ? 360 - angle : angle
  return angle
}

/**
 * Calculates the angle between three points (a, b, c), with 'b' as the vertex.
 * @param a The first point.
 * @param b The vertex point.
 * @param c The third point.
 * @returns The angle in degrees.
 */
export function angleABC(a: any, b: any, c: any): number {
  if (!a || !b || !c) return 0

  const ab = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
  const cb = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z }

  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z
  const magA = Math.hypot(ab.x, ab.y, ab.z)
  const magB = Math.hypot(cb.x, cb.y, cb.z)

  const cosTheta = dot / (magA * magB)

  // Ensure the value is within the valid range for acos to avoid NaN
  if (cosTheta < -1) return 180
  if (cosTheta > 1) return 0

  return Math.acos(cosTheta) * (180 / Math.PI)
}

export function calculateHipMovement(current: { x: number; y: number }, previous: { x: number; y: number } | null) {
  if (!previous) return 0

  // Convert normalized coordinates to approximate cm (assuming 170cm person height)
  const pixelToCm = 170 // approximate conversion factor
  const deltaY = (current.y - previous.y) * pixelToCm

  return deltaY // positive = down, negative = up
}

export function resetSmoothingState() {
  Object.keys(keypointHistory).forEach((key) => {
    keypointHistory[key] = []
  })
  Object.keys(emaBuffer).forEach((key) => {
    delete emaBuffer[Number(key)]
  })
}
