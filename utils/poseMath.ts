// Pose detection math utilities
export interface Point3D {
  x: number
  y: number
  z: number
  visibility?: number
}

export interface SmoothedKeypoints {
  leftHip: Point3D
  rightHip: Point3D
  leftKnee: Point3D
  rightKnee: Point3D
  leftAnkle: Point3D
  rightAnkle: Point3D
  hipCenter: Point3D
  hipPrev?: Point3D
}

// Exponential Moving Average for smoothing keypoints
const smoothingFactor = 0.7
let previousKeypoints: SmoothedKeypoints | null = null

export function smoothKeypoints(landmarks: Point3D[]): SmoothedKeypoints {
  if (!landmarks || landmarks.length < 33) {
    throw new Error("Invalid pose landmarks")
  }

  // MediaPipe pose landmark indices
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
    z: (leftHip.z + rightHip.z) / 2,
  }

  const currentKeypoints: SmoothedKeypoints = {
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    hipCenter,
    hipPrev: previousKeypoints?.hipCenter,
  }

  // Apply smoothing if we have previous data
  if (previousKeypoints) {
    const smooth = (current: Point3D, previous: Point3D): Point3D => ({
      x: smoothingFactor * previous.x + (1 - smoothingFactor) * current.x,
      y: smoothingFactor * previous.y + (1 - smoothingFactor) * current.y,
      z: smoothingFactor * previous.z + (1 - smoothingFactor) * current.z,
    })

    currentKeypoints.leftHip = smooth(leftHip, previousKeypoints.leftHip)
    currentKeypoints.rightHip = smooth(rightHip, previousKeypoints.rightHip)
    currentKeypoints.leftKnee = smooth(leftKnee, previousKeypoints.leftKnee)
    currentKeypoints.rightKnee = smooth(rightKnee, previousKeypoints.rightKnee)
    currentKeypoints.leftAnkle = smooth(leftAnkle, previousKeypoints.leftAnkle)
    currentKeypoints.rightAnkle = smooth(rightAnkle, previousKeypoints.rightAnkle)
    currentKeypoints.hipCenter = smooth(hipCenter, previousKeypoints.hipCenter)
  }

  previousKeypoints = currentKeypoints
  return currentKeypoints
}

export function angleBetween(a: Point3D, b: Point3D, c: Point3D): number {
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

export function calculateHipMovement(current: Point3D, previous?: Point3D): number {
  if (!previous) return 0

  // Convert normalized coordinates to approximate centimeters
  // Assuming average person height of 170cm and video frame represents full body
  const pixelToCm = 170 // rough conversion factor
  const deltaY = (previous.y - current.y) * pixelToCm

  return deltaY // positive = moving up, negative = moving down
}

export function resetSmoothingState(): void {
  previousKeypoints = null
}
