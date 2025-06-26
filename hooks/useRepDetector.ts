"use client"

import { useState, useRef, useCallback } from "react"

export interface DetectorConfig {
  pose: string
  rules: Record<string, any>
  minValidReps: number | null
  scoringKey: "max_reps_in_time" | "first_n_valid_reps"
}

type RepState = "ready" | "descending" | "bottom" | "ascending" | "complete" | "invalid"

interface RepDetectionState {
  inRep: boolean
  bottomReached: boolean
  topReached: boolean
  invalidRepStarted: boolean
  currentState: RepState
  lastValidTime: number
}

export const useRepDetector = () => {
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")

  const configRef = useRef<DetectorConfig | null>(null)
  const earlyCompleteCallbackRef = useRef<(() => void) | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const repDetectionRef = useRef<RepDetectionState>({
    inRep: false,
    bottomReached: false,
    topReached: true,
    invalidRepStarted: false,
    currentState: "ready",
    lastValidTime: 0,
  })

  // Simplified motion detection using video frame analysis
  const analyzeMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !configRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for motion analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Simple motion detection based on brightness changes in key areas
    // This is a simplified approach - in production you'd use proper pose detection
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const regionSize = 50

    let totalBrightness = 0
    let pixelCount = 0

    // Analyze center region for motion
    for (let y = centerY - regionSize; y < centerY + regionSize; y++) {
      for (let x = centerX - regionSize; x < centerX + regionSize; x++) {
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const index = (y * canvas.width + x) * 4
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3
          totalBrightness += brightness
          pixelCount++
        }
      }
    }

    const avgBrightness = totalBrightness / pixelCount
    const currentTime = Date.now()

    // Simulate rep detection based on motion patterns
    // This is a mock implementation - replace with actual pose detection
    simulateRepDetection(avgBrightness, currentTime)

    // Continue analysis
    animationFrameRef.current = requestAnimationFrame(analyzeMotion)
  }, [])

  const simulateRepDetection = useCallback((brightness: number, currentTime: number) => {
    if (!configRef.current) return

    const currentDetection = repDetectionRef.current
    const timeSinceLastRep = currentTime - currentDetection.lastValidTime

    // Simulate squat detection based on time intervals and motion
    // This creates a realistic demo experience
    if (configRef.current.pose === "squat") {
      // Simulate a rep every 3-4 seconds with some randomness
      const repInterval = 3000 + Math.random() * 1000 // 3-4 seconds

      if (timeSinceLastRep > repInterval && currentDetection.currentState === "ready") {
        // Start descending
        currentDetection.currentState = "descending"
        currentDetection.inRep = true
        setRepState("descending")

        setTimeout(() => {
          // Reach bottom
          currentDetection.currentState = "bottom"
          currentDetection.bottomReached = true
          setRepState("bottom")

          setTimeout(() => {
            // Start ascending
            currentDetection.currentState = "ascending"
            setRepState("ascending")

            setTimeout(() => {
              // Complete rep
              currentDetection.currentState = "complete"
              setRepState("complete")
              currentDetection.lastValidTime = currentTime

              setValidReps((prev) => {
                const newCount = prev + 1

                // Check for early completion
                if (
                  configRef.current?.scoringKey === "first_n_valid_reps" &&
                  configRef.current?.minValidReps &&
                  newCount >= configRef.current.minValidReps &&
                  earlyCompleteCallbackRef.current
                ) {
                  setTimeout(() => earlyCompleteCallbackRef.current?.(), 100)
                }

                return newCount
              })

              // Reset for next rep
              setTimeout(() => {
                currentDetection.currentState = "ready"
                currentDetection.inRep = false
                currentDetection.bottomReached = false
                currentDetection.topReached = true
                currentDetection.invalidRepStarted = false
                setRepState("ready")
              }, 500)
            }, 800) // ascending time
          }, 600) // bottom hold time
        }, 1000) // descending time
      }

      // Occasionally simulate invalid reps
      if (Math.random() < 0.1 && currentDetection.inRep && !currentDetection.invalidRepStarted) {
        if (configRef.current.rules.track_invalid_reps) {
          setInvalidReps((prev) => prev + 1)
          currentDetection.invalidRepStarted = true
          setRepState("invalid")

          setTimeout(() => {
            currentDetection.currentState = "ready"
            currentDetection.inRep = false
            currentDetection.bottomReached = false
            currentDetection.topReached = true
            currentDetection.invalidRepStarted = false
            setRepState("ready")
          }, 1000)
        }
      }
    }
  }, [])

  const initDetector = useCallback(
    async (videoEl: HTMLVideoElement, cfg: DetectorConfig) => {
      try {
        configRef.current = cfg
        videoRef.current = videoEl

        // Create hidden canvas for motion analysis
        const canvas = document.createElement("canvas")
        canvas.style.display = "none"
        document.body.appendChild(canvas)
        canvasRef.current = canvas

        // Reset state
        setValidReps(0)
        setInvalidReps(0)
        setRepState("ready")
        repDetectionRef.current = {
          inRep: false,
          bottomReached: false,
          topReached: true,
          invalidRepStarted: false,
          currentState: "ready",
          lastValidTime: Date.now(),
        }

        // Start motion analysis
        analyzeMotion()

        console.log("Pose detector initialized (demo mode)")
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

    videoRef.current = null
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
    repState,
    destroyDetector,
    onEarlyComplete,
  }
}

export default useRepDetector
