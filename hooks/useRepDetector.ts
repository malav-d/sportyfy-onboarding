"use client"

import { useState, useRef, useCallback } from "react"
import { smoothKeypoints, angleBetween, calculateHipMovement, resetSmoothingState } from "@/utils/poseMath"
import { debugOverlay } from "@/utils/debugOverlay"

export interface DetectorConfig {
  pose: string
  rules: Record<string, any>
  minValidReps: number | null
  scoringKey: "max_reps_in_time" | "first_n_valid_reps"
  debug?: boolean
}

type RepState = "ARMED" | "UP" | "DOWN" | "INVALID"

// Tunables for accuracy
const MIN_REP_MS = 1200 // Minimum 1.2 seconds per rep (50 reps/min max)
const BOTTOM_DWELL_MS = 300 // Must stay at bottom for 300ms
const FRAMES_FOR_STATE = 4 // Need 4 consecutive frames to change state
const HIP_MOVE_MIN_CM = 8 // Minimum hip movement to confirm rep

export const useRepDetector = () => {
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ARMED")

  // Refs for pose detection
  const poseRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const configRef = useRef<DetectorConfig | null>(null)
  const earlyCompleteCallbackRef = useRef<(() => void) | null>(null)

  // State machine refs
  const currentStateRef = useRef<RepState>("ARMED")
  const upFrameCountRef = useRef(0)
  const downFrameCountRef = useRef(0)
  const bottomTimeRef = useRef(0)
  const lastRepTimeRef = useRef(0)
  const stateChangeTimeRef = useRef(0)

  const processFrame = useCallback(
    (results: any) => {
      if (!results.poseLandmarks || !configRef.current) return

      const timestamp = performance.now()
      const config = configRef.current

      try {
        // Smooth keypoints and calculate angles
        const keypoints = smoothKeypoints(results.poseLandmarks)
        const leftKneeAngle = angleBetween(keypoints.leftHip, keypoints.leftKnee, keypoints.leftAnkle)
        const rightKneeAngle = angleBetween(keypoints.rightHip, keypoints.rightKnee, keypoints.rightAnkle)
        const hipMovement = calculateHipMovement(keypoints.hipCenter, keypoints.hipPrev)

        // Use average of both knees for more stability
        const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2

        // Get thresholds from config
        const downThreshold = config.rules.down_knee_angle?.max || 90
        const upThreshold = config.rules.up_leg_straight?.min || 160
        const tolerance = config.rules.down_knee_angle?.tol || 10

        // Determine if we're in up or down position
        const isInUpPosition = avgKneeAngle > upThreshold - tolerance
        const isInDownPosition = avgKneeAngle < downThreshold + tolerance

        // Update frame counters for hysteresis
        if (isInUpPosition) {
          upFrameCountRef.current++
          downFrameCountRef.current = 0
        } else if (isInDownPosition) {
          downFrameCountRef.current++
          upFrameCountRef.current = 0
        } else {
          // In middle range - maintain current counts but don't reset
          upFrameCountRef.current = Math.max(0, upFrameCountRef.current - 1)
          downFrameCountRef.current = Math.max(0, downFrameCountRef.current - 1)
        }

        const currentState = currentStateRef.current

        // State machine logic
        switch (currentState) {
          case "ARMED":
            // Wait for stable up position before starting
            if (upFrameCountRef.current >= FRAMES_FOR_STATE && isInUpPosition) {
              currentStateRef.current = "UP"
              setRepState("UP")
              stateChangeTimeRef.current = timestamp
            }
            break

          case "UP":
            // Transition to DOWN when we detect downward movement
            if (downFrameCountRef.current >= FRAMES_FOR_STATE && isInDownPosition && hipMovement < -HIP_MOVE_MIN_CM) {
              currentStateRef.current = "DOWN"
              setRepState("DOWN")
              bottomTimeRef.current = timestamp
              stateChangeTimeRef.current = timestamp
            }
            break

          case "DOWN":
            const timeAtBottom = timestamp - bottomTimeRef.current
            const timeSinceLastRep = timestamp - lastRepTimeRef.current

            // Check if we've stayed at bottom long enough
            const hasStayedAtBottom = timeAtBottom >= BOTTOM_DWELL_MS

            // Transition back to UP for valid rep
            if (
              upFrameCountRef.current >= FRAMES_FOR_STATE &&
              isInUpPosition &&
              hipMovement > HIP_MOVE_MIN_CM &&
              hasStayedAtBottom &&
              timeSinceLastRep > MIN_REP_MS
            ) {
              // Valid rep completed!
              setValidReps((prev) => {
                const newCount = prev + 1

                // Check for early completion
                if (
                  config.scoringKey === "first_n_valid_reps" &&
                  config.minValidReps &&
                  newCount >= config.minValidReps &&
                  earlyCompleteCallbackRef.current
                ) {
                  setTimeout(() => earlyCompleteCallbackRef.current?.(), 100)
                }

                return newCount
              })

              currentStateRef.current = "UP"
              setRepState("UP")
              lastRepTimeRef.current = timestamp
              stateChangeTimeRef.current = timestamp
            }
            // Invalid rep - bounced up too quickly or didn't stay at bottom
            else if (
              upFrameCountRef.current >= FRAMES_FOR_STATE &&
              (!hasStayedAtBottom || timeSinceLastRep <= MIN_REP_MS)
            ) {
              if (config.rules.track_invalid_reps) {
                setInvalidReps((prev) => prev + 1)
              }

              currentStateRef.current = "INVALID"
              setRepState("INVALID")
              stateChangeTimeRef.current = timestamp

              // Return to UP after brief invalid state
              setTimeout(() => {
                currentStateRef.current = "UP"
                setRepState("UP")
              }, 1000)
            }
            break

          case "INVALID":
            // Wait for return to stable up position
            if (upFrameCountRef.current >= FRAMES_FOR_STATE && isInUpPosition) {
              currentStateRef.current = "UP"
              setRepState("UP")
              stateChangeTimeRef.current = timestamp
            }
            break
        }

        // Debug overlay
        if (config.debug) {
          window.__debugOverlay?.({
            leftKneeAngle,
            rightKneeAngle,
            hipMovement,
            state: currentStateRef.current,
          })
        }
      } catch (error) {
        console.error("Error processing pose frame:", error)
      }
    },
    [setValidReps, setInvalidReps, setRepState],
  )

  const initDetector = useCallback(
    async (videoEl: HTMLVideoElement, cfg: DetectorConfig) => {
      try {
        configRef.current = cfg

        // Initialize debug overlay if enabled
        if (cfg.debug) {
          debugOverlay.init()
        }

        // Load MediaPipe dynamically
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
        document.head.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })

        // Initialize MediaPipe Pose
        const { Pose } = window as any
        const pose = new Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        })

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        })

        pose.onResults(processFrame)
        poseRef.current = pose

        // Start processing video frames
        const processVideo = async () => {
          if (poseRef.current && videoEl.videoWidth > 0) {
            await poseRef.current.send({ image: videoEl })
          }
          animationFrameRef.current = requestAnimationFrame(processVideo)
        }

        processVideo()

        // Reset all state
        resetSmoothingState()
        setValidReps(0)
        setInvalidReps(0)
        setRepState("ARMED")
        currentStateRef.current = "ARMED"
        upFrameCountRef.current = 0
        downFrameCountRef.current = 0
        bottomTimeRef.current = 0
        lastRepTimeRef.current = 0
        stateChangeTimeRef.current = performance.now()

        console.log("Real pose detector initialized successfully")
      } catch (error) {
        console.error("Failed to initialize pose detector:", error)
        throw error
      }
    },
    [processFrame],
  )

  const destroyDetector = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (poseRef.current) {
      poseRef.current.close()
      poseRef.current = null
    }

    if (configRef.current?.debug) {
      debugOverlay.destroy()
    }

    resetSmoothingState()
    configRef.current = null
  }, [])

  const onEarlyComplete = useCallback((callback: () => void) => {
    earlyCompleteCallbackRef.current = callback
    return () => {
      earlyCompleteCallbackRef.current = null
    }
  }, [])

  return {
    initDetector,
    validReps,
    invalidReps,
    repState: repState.toLowerCase() as "ready" | "descending" | "bottom" | "ascending" | "complete" | "invalid",
    destroyDetector,
    onEarlyComplete,
  }
}

export default useRepDetector
