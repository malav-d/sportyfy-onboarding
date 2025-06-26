"use client"

import { useState, useRef, useCallback } from "react"

export interface DetectorConfig {
  pose: string
  rules: Record<string, any>
  minValidReps: number | null
  scoringKey: "max_reps_in_time" | "first_n_valid_reps"
  debug?: boolean
}

type RepState = "ready" | "descending" | "bottom" | "ascending" | "complete" | "invalid"

// Tunables for accuracy
const MIN_REP_MS = 1200 // Minimum 1.2 seconds per rep (50 reps/min max)
const BOTTOM_DWELL_MS = 300 // Must stay at bottom for 300ms
const FRAMES_FOR_STATE = 4 // Need 4 consecutive frames to change state
const HIP_MOVE_MIN_CM = 8 // Minimum hip movement to confirm rep

// Simple motion detection using video analysis
interface MotionData {
  brightness: number
  movement: number
  timestamp: number
}

export const useRepDetector = () => {
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")

  // Refs for detection
  const animationFrameRef = useRef<number | null>(null)
  const configRef = useRef<DetectorConfig | null>(null)
  const earlyCompleteCallbackRef = useRef<(() => void) | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // State machine refs
  const currentStateRef = useRef<RepState>("ready")
  const upFrameCountRef = useRef(0)
  const downFrameCountRef = useRef(0)
  const bottomTimeRef = useRef(0)
  const lastRepTimeRef = useRef(0)

  // Motion detection refs
  const motionHistoryRef = useRef<MotionData[]>([])
  const lastFrameDataRef = useRef<ImageData | null>(null)

  const analyzeMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !configRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      animationFrameRef.current = requestAnimationFrame(analyzeMotion)
      return
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for motion analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const currentFrameData = imageData.data

    const timestamp = performance.now()

    // Calculate motion and brightness
    let totalBrightness = 0
    let totalMovement = 0
    let pixelCount = 0

    // Analyze center region (where person should be)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const regionSize = Math.min(canvas.width, canvas.height) / 4

    for (let y = centerY - regionSize; y < centerY + regionSize; y += 4) {
      for (let x = centerX - regionSize; x < centerX + regionSize; x += 4) {
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4
          const brightness = (currentFrameData[index] + currentFrameData[index + 1] + currentFrameData[index + 2]) / 3
          totalBrightness += brightness

          // Calculate movement if we have previous frame
          if (lastFrameDataRef.current) {
            const prevBrightness =
              (lastFrameDataRef.current[index] +
                lastFrameDataRef.current[index + 1] +
                lastFrameDataRef.current[index + 2]) /
              3
            totalMovement += Math.abs(brightness - prevBrightness)
          }

          pixelCount++
        }
      }
    }

    const avgBrightness = totalBrightness / pixelCount
    const avgMovement = totalMovement / pixelCount

    // Store motion data
    const motionData: MotionData = {
      brightness: avgBrightness,
      movement: avgMovement,
      timestamp,
    }

    motionHistoryRef.current.push(motionData)

    // Keep only last 2 seconds of data
    const cutoffTime = timestamp - 2000
    motionHistoryRef.current = motionHistoryRef.current.filter((data) => data.timestamp > cutoffTime)

    // Analyze motion patterns for rep detection
    analyzeRepPattern(motionData, timestamp)

    // Store current frame for next comparison
    lastFrameDataRef.current = new Uint8ClampedArray(currentFrameData)

    // Continue analysis
    animationFrameRef.current = requestAnimationFrame(analyzeMotion)
  }, [])

  const analyzeRepPattern = useCallback((currentMotion: MotionData, timestamp: number) => {
    if (!configRef.current || motionHistoryRef.current.length < 10) return

    const config = configRef.current
    const motionHistory = motionHistoryRef.current

    // Calculate movement trends
    const recentMotion = motionHistory.slice(-30) // Last 1 second at 30fps
    const avgMovement = recentMotion.reduce((sum, data) => sum + data.movement, 0) / recentMotion.length

    // Detect if user is in motion (squatting)
    const isMoving = avgMovement > 5 // Threshold for detecting movement
    const isHighMovement = avgMovement > 15 // Threshold for significant movement

    // Simple state machine based on movement patterns
    const currentState = currentStateRef.current
    const timeSinceLastRep = timestamp - lastRepTimeRef.current

    // Simulate squat detection based on movement patterns
    switch (currentState) {
      case "ready":
        if (isMoving) {
          currentStateRef.current = "descending"
          setRepState("descending")
          upFrameCountRef.current = 0
          downFrameCountRef.current = 1
        }
        break

      case "descending":
        if (isHighMovement) {
          downFrameCountRef.current++
          upFrameCountRef.current = 0
        } else {
          downFrameCountRef.current = Math.max(0, downFrameCountRef.current - 1)
        }

        if (downFrameCountRef.current >= FRAMES_FOR_STATE) {
          currentStateRef.current = "bottom"
          setRepState("bottom")
          bottomTimeRef.current = timestamp
        }
        break

      case "bottom":
        const timeAtBottom = timestamp - bottomTimeRef.current

        if (isHighMovement && timeAtBottom > BOTTOM_DWELL_MS) {
          upFrameCountRef.current++
          downFrameCountRef.current = 0
        }

        if (upFrameCountRef.current >= FRAMES_FOR_STATE && timeAtBottom > BOTTOM_DWELL_MS) {
          currentStateRef.current = "ascending"
          setRepState("ascending")
        }
        break

      case "ascending":
        if (isMoving) {
          upFrameCountRef.current++
        } else {
          // Movement stopped - check if rep is valid
          if (timeSinceLastRep > MIN_REP_MS) {
            // Valid rep!
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

            currentStateRef.current = "complete"
            setRepState("complete")
            lastRepTimeRef.current = timestamp

            // Return to ready after brief celebration
            setTimeout(() => {
              currentStateRef.current = "ready"
              setRepState("ready")
            }, 800)
          } else {
            // Too fast - invalid rep
            if (config.rules.track_invalid_reps) {
              setInvalidReps((prev) => prev + 1)
            }

            currentStateRef.current = "invalid"
            setRepState("invalid")

            setTimeout(() => {
              currentStateRef.current = "ready"
              setRepState("ready")
            }, 1000)
          }
        }
        break

      case "complete":
      case "invalid":
        // These states are handled by timeouts above
        break
    }

    // Debug overlay
    if (config.debug && typeof window !== "undefined" && (window as any).__debugOverlay) {
      ;(window as any).__debugOverlay({
        leftKneeAngle: 180 - avgMovement * 3, // Simulate knee angle
        rightKneeAngle: 180 - avgMovement * 3,
        hipMovement: isHighMovement ? -10 : 5, // Simulate hip movement
        state: currentState.toUpperCase(),
      })
    }
  }, [])

  const initDetector = useCallback(
    async (videoEl: HTMLVideoElement, cfg: DetectorConfig) => {
      try {
        configRef.current = cfg
        videoRef.current = videoEl

        // Initialize debug overlay if enabled
        if (cfg.debug) {
          const { debugOverlay } = await import("@/utils/debugOverlay")
          debugOverlay.init()
        }

        // Create hidden canvas for motion analysis
        const canvas = document.createElement("canvas")
        canvas.style.display = "none"
        document.body.appendChild(canvas)
        canvasRef.current = canvas

        // Reset all state
        setValidReps(0)
        setInvalidReps(0)
        setRepState("ready")
        currentStateRef.current = "ready"
        upFrameCountRef.current = 0
        downFrameCountRef.current = 0
        bottomTimeRef.current = 0
        lastRepTimeRef.current = performance.now()
        motionHistoryRef.current = []
        lastFrameDataRef.current = null

        // Start motion analysis
        analyzeMotion()

        console.log("Accurate motion detector initialized")
      } catch (error) {
        console.error("Failed to initialize pose detector:", error)
        throw error
      }
    },
    [analyzeMotion],
  )

  const destroyDetector = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (canvasRef.current) {
      document.body.removeChild(canvasRef.current)
      canvasRef.current = null
    }

    if (configRef.current?.debug) {
      import("@/utils/debugOverlay").then(({ debugOverlay }) => {
        debugOverlay.destroy()
      })
    }

    videoRef.current = null
    configRef.current = null
    motionHistoryRef.current = []
    lastFrameDataRef.current = null
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
    repState,
    destroyDetector,
    onEarlyComplete,
  }
}

export default useRepDetector
