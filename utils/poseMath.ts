// Exponential Moving Average for smoothing keypoints
interface KeypointHistory {
  [key: string]: Array<{ x: number; y: number; z?: number }>
}

const keypointHistory: KeypointHistory = {}
const SMOOTHING_FACTOR = 0.7
const HISTORY_LENGTH = 5

export function smoothKeypoints(landmarks: any[]) {
  if (!landmarks || landmarks.length === 0) {
    return {
      leftHip: { x: 0, y: 0 },
      leftKnee: { x: 0, y: 0 },
      leftAnkle: { x: 0, y: 0 },
      rightHip: { x: 0, y: 0 },
      rightKnee: { x: 0, y: 0 },
      rightAnkle: { x: 0, y: 0 },
      hipCenter: { x: 0, y: 0 },
      hipPrev: null,
    }
  }

  // MediaPipe pose landmark indices
  const leftHip = landmarks[23] || { x: 0, y: 0 }
  const leftKnee = landmarks[25] || { x: 0, y: 0 }
  const leftAnkle = landmarks[27] || { x: 0, y: 0 }
  const rightHip = landmarks[24] || { x: 0, y: 0 }
  const rightKnee = landmarks[26] || { x: 0, y: 0 }
  const rightAnkle = landmarks[28] || { x: 0, y: 0 }

  // Calculate hip center
  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  }

  // Store hip history for movement calculation
  if (!keypointHistory.hipCenter) {
    keypointHistory.hipCenter = []
  }
  keypointHistory.hipCenter.push(hipCenter)
  if (keypointHistory.hipCenter.length > HISTORY_LENGTH) {
    keypointHistory.hipCenter.shift()
  }

  const hipPrev =
    keypointHistory.hipCenter.length > 1 ? keypointHistory.hipCenter[keypointHistory.hipCenter.length - 2] : null

  return {
    leftHip,
    leftKnee,
    leftAnkle,
    rightHip,
    rightKnee,
    rightAnkle,
    hipCenter,
    hipPrev,
  }
}

export function angleBetween(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  // Calculate angle ABC in degrees
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs((radians * 180.0) / Math.PI)
  angle = angle > 180.0 ? 360 - angle : angle
  return angle
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
}
