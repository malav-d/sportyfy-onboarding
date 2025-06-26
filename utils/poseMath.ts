import type { Keypoint } from "@tensorflow-models/pose-detection"

/**
 * Calculates the angle between three keypoints.
 * @param p1 The first keypoint (e.g., shoulder).
 * @param p2 The second keypoint (e.g., elbow, the vertex of the angle).
 * @param p3 The third keypoint (e.g., wrist).
 * @returns The angle in degrees.
 */
export function calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  if (
    p1.score === undefined ||
    p1.score < 0.5 ||
    p2.score === undefined ||
    p2.score < 0.5 ||
    p3.score === undefined ||
    p3.score < 0.5
  ) {
    return 0
  }

  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x)
  let angle = Math.abs((radians * 180.0) / Math.PI)

  if (angle > 180.0) {
    angle = 360 - angle
  }
  return angle
}
