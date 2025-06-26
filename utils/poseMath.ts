// Pose math utilities for accurate rep detection

interface Keypoint {
  x: number
  y: number
  z: number
  visibility?: number
}

interface SmoothedKeypoints {
  leftHip: Keypoint
  rightHip: Keypoint
  leftKnee: Keypoint
  rightKnee: Keypoint
  leftAnkle: Keypoint
  rightAnkle: Keypoint
  hipCenter: Keypoint
  hipPrev?: Keypoint
}

// Smoothing state
let smoothingState: Record<string, Keypoint> = {}

export function resetSmoothingState() {
  smoothingState = {}
}

export function smoothKeypoints(landmarks: Keypoint[]): SmoothedKeypoints {
  if (!landmarks || landmarks.length < 33) {
    throw new Error("Invalid pose landmarks")
  }

  const smoothingFactor = 0.7

  const smoothPoint = (point: Keypoint, key: string): Keypoint => {
    if (!smoothingState[key]) {
      smoothingState[key] = { ...point }
      return point
    }

    const prev = smoothingState[key]
    const smoothed = {
      x: smoothingFactor * prev.x + (1 - smoothingFactor) * point.x,
      y: smoothingFactor * prev.y + (1 - smoothingFactor) * point.y,
      z: smoothingFactor * prev.z + (1 - smoothingFactor) * point.z,
      visibility: point.visibility,
    }

    smoothingState[key] = smoothed
    return smoothed
  }

  // MediaPipe pose landmark indices
  const leftHip = smoothPoint(landmarks[23], "leftHip")
  const rightHip = smoothPoint(landmarks[24], "rightHip")
  const leftKnee = smoothPoint(landmarks[25], "leftKnee")
  const rightKnee = smoothPoint(landmarks[26], "rightKnee")
  const leftAnkle = smoothPoint(landmarks[27], "leftAnkle")
  const rightAnkle = smoothPoint(landmarks[28], "rightAnkle")

  // Calculate hip center
  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
    z: (leftHip.z + rightHip.z) / 2,
  }

  const hipPrev = smoothingState["hipCenter"]
  smoothingState["hipCenter"] = hipCenter

  return {
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    hipCenter,
    hipPrev,
  }
}

export function angleBetween(a: Keypoint, b: Keypoint, c: Keypoint): number {
  // Calculate angle ABC using vectors BA and BC
  const ba = {
    x: a.x - b.x,
    y: a.y - b.y,
  }

  const bc = {
    x: c.x - b.x,
    y: c.y - b.y,
  }

  // Calculate dot product and magnitudes
  const dotProduct = ba.x * bc.x + ba.y * bc.y
  const magnitudeBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y)
  const magnitudeBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y)

  // Calculate angle in radians then convert to degrees
  const angleRad = Math.acos(dotProduct / (magnitudeBA * magnitudeBC))
  const angleDeg = (angleRad * 180) / Math.PI

  return angleDeg
}

export function calculateHipMovement(current: Keypoint, previous?: Keypoint): number {
  if (!previous) return 0

  // Calculate vertical movement in normalized coordinates
  // Positive = moving up, Negative = moving down
  const deltaY = previous.y - current.y

  // Convert to approximate centimeters (rough estimation)
  // This assumes the person is roughly 170cm tall and fills about 80% of frame height
  const estimatedMovementCm = deltaY * 170 * 0.8

  return estimatedMovementCm
}
