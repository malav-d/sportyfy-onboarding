// Pose math utilities for accurate rep detection using TensorFlow.js keypoints

// A Keypoint contains x, y, z coordinates and a confidence score.
interface Keypoint {
  x: number
  y: number
  z?: number
  score?: number
  name?: string
}

// Calculates the angle between three keypoints in degrees.
export function angleBetween(a: Keypoint, b: Keypoint, c: Keypoint): number {
  if (!a || !b || !c) return 0

  const angleRad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angleDeg = Math.abs((angleRad * 180) / Math.PI)

  if (angleDeg > 180) {
    angleDeg = 360 - angleDeg
  }
  return angleDeg
}

// Calculates the vertical movement of the hip center.
// A positive value means moving down, negative means moving up.
export function calculateHipMovement(currentHip: Keypoint, previousHip?: Keypoint): number {
  if (!currentHip || !previousHip) return 0

  // We use the 'y' coordinate. In screen space, a larger 'y' is lower.
  const deltaY = currentHip.y - previousHip.y
  return deltaY
}

// Helper to get a specific keypoint from the pose data by name.
export function getKeypoint(keypoints: Keypoint[], name: string): Keypoint | undefined {
  return keypoints.find((kp) => kp.name === name)
}
