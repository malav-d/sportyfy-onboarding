import type { Keypoint } from "@tensorflow-models/pose-detection"

/**
 * Calculates the angle in degrees between three points (p1, p2, p3),
 * where p2 is the vertex.
 */
export function angleBetween(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  if (!p1 || !p2 || !p3) return 0
  const y = p3.y - p2.y
  const x = p3.x - p2.x
  const theta = Math.atan2(y, x)

  const y1 = p1.y - p2.y
  const x1 = p1.x - p2.x
  const theta1 = Math.atan2(y1, x1)

  let angle = (theta1 - theta) * (180 / Math.PI)
  if (angle < 0) {
    angle += 360
  }
  if (angle > 180) {
    angle = 360 - angle
  }
  return angle
}

/**
 * Finds a keypoint by name from the keypoints array.
 */
export function getKeypoint(keypoints: Keypoint[], name: string): Keypoint | undefined {
  return keypoints.find((kp) => kp.name === name)
}

/**
 * Calculates the normalized vertical hip movement between frames.
 * A positive value means moving down, negative means moving up.
 */
export function calculateHipMovement(currentHip: Keypoint, previousHip: Keypoint | null): number {
  if (!previousHip || !currentHip) return 0
  // We only care about vertical (y-axis) movement for squats
  return currentHip.y - previousHip.y
}
