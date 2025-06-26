"use client"

import { useRef, useState, useCallback } from "react"
import type { Pose, Results } from "@mediapipe/pose"
import { smoothKeypoints, angleABC } from "@/utils/poseMath"

export interface DetectorConfig {
  pose: string // "squat", "push_up", etc.
  rules: Record<string, any> // down_knee_angle, up_leg_straight…
  minValidReps: number | null
  scoringKey: "max_reps_in_time" | "first_n_valid_reps"
  debug?: boolean
}

/* ---------- Tunables ---------- */
const MIN_REP_MS = 700
const BOTTOM_DWELL_MS = 200
const FRAMES_FOR_STATE = 3
const HIP_MOVE_MIN_CM = 10 // Adjusted for more sensitivity

type RepState = "ready" | "descending" | "bottom" | "ascending" | "complete" | "invalid"

export interface DebugData {
  kneeAngle: string
  hipDy: string
  state: RepState
}

export const useRepDetector = () => {
  /* ---------- React state ---------- */
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")
  const [debugData, setDebugData] = useState<DebugData | null>(null)

  /* ---------- Refs ---------- */
  const poseRef = useRef<Pose | null>(null)
  const cfgRef = useRef<DetectorConfig | null>(null)
  const lastRepAt = useRef(0)
  const bottomAt = useRef(0)
  const upCount = useRef(0)
  const downCount = useRef(0)
  const stateRef = useRef<RepState>("ready")
  const earlyCbRef = useRef<(() => void) | null>(null)

  /* ---------- Core callback ---------- */
  const onResults = useCallback((res: Results) => {
    const cfg = cfgRef.current
    if (!cfg || !res.poseLandmarks) return

    const now = performance.now()
    const pts = smoothKeypoints(res.poseLandmarks) as any // Cast to any to access custom props
    const knee = angleABC(pts[24], pts[26], pts[28]) // Right hip, knee, ankle
    const hipY = pts[24].y * 100 // cm-ish
    const hipDy = hipY - (pts.__prevHipY ?? hipY)

    /* hysteresis helpers */
    const aboveUp = knee > cfg.rules.up_leg_straight.min
    const belowDown = knee < cfg.rules.down_knee_angle.max

    upCount.current = aboveUp ? upCount.current + 1 : 0
    downCount.current = belowDown ? downCount.current + 1 : 0

    /* ---------- FSM ---------- */
    switch (stateRef.current) {
      case "ready":
        if (downCount.current >= FRAMES_FOR_STATE && hipDy > HIP_MOVE_MIN_CM) {
          stateRef.current = "descending"
          setRepState("descending")
        }
        break

      case "descending":
        if (downCount.current >= FRAMES_FOR_STATE) {
          stateRef.current = "bottom"
          setRepState("bottom")
          bottomAt.current = now
        }
        break

      case "bottom":
        if (
          now - bottomAt.current >= BOTTOM_DWELL_MS &&
          upCount.current >= FRAMES_FOR_STATE &&
          hipDy < -HIP_MOVE_MIN_CM
        ) {
          stateRef.current = "ascending"
          setRepState("ascending")
        }
        break

      case "ascending":
        if (aboveUp && now - lastRepAt.current > MIN_REP_MS) {
          setValidReps((v) => {
            const n = v + 1
            // early-exit tutorial
            if (cfg.scoringKey === "first_n_valid_reps" && cfg.minValidReps && n >= cfg.minValidReps) {
              setTimeout(() => earlyCbRef.current?.(), 150)
            }
            return n
          })
          stateRef.current = "complete"
          setRepState("complete")
          lastRepAt.current = now
          setTimeout(() => {
            stateRef.current = "ready"
            setRepState("ready")
          }, 400)
        }
        break

      case "complete":
      case "invalid":
        // Handled by timeouts
        break
    }

    /* ---------- debug ---------- */
    if (cfg.debug) {
      setDebugData({
        kneeAngle: knee.toFixed(1),
        hipDy: hipDy.toFixed(1),
        state: stateRef.current,
      })
    }
  }, [])

  /* ---------- API exposed to component ---------- */
  const initDetector = useCallback(
    async (video: HTMLVideoElement, cfg: DetectorConfig) => {
      cfgRef.current = cfg

      // Dynamically import Pose to avoid SSR/bundling issues
      const { Pose } = await import("@mediapipe/pose")

      const pose = new Pose({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
      })
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      pose.onResults(onResults)
      poseRef.current = pose

      // This is a placeholder for the camera feed logic which will be in the component
      return pose
    },
    [onResults],
  )

  const destroyDetector = useCallback(() => {
    poseRef.current?.close()
    poseRef.current = null
    cfgRef.current = null
  }, [])

  /* optional early-complete hook */
  const onEarlyComplete = useCallback((cb: () => void) => {
    earlyCbRef.current = cb
    return () => {
      earlyCbRef.current = null
    }
  }, [])

  return { initDetector, destroyDetector, validReps, invalidReps, repState, onEarlyComplete, debugData }
}
export default useRepDetector
