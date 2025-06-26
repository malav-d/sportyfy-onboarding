"use client"

import { useState, useRef, useCallback } from "react"

// Dynamic types for MediaPipe
interface Results {
  poseLandmarks?: Array<{ x: number; y: number; z: number }>
}

interface Pose {
  setOptions: (options: any) => void
  onResults: (callback: (results: Results) => void) => void
  send: (input: { image: HTMLVideoElement }) => Promise<void>
  close: () => void
}

interface Camera {
  start: () => Promise<void>
  stop: () => void
}

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
}

interface SmoothedAngles {
  leftKnee: number | null
  rightKnee: number | null
  leftElbow: number | null
  rightElbow: number | null
}

export const useRepDetector = () => {
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")

  const poseRef = useRef<Pose | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  const configRef = useRef<DetectorConfig | null>(null)
  const earlyCompleteCallbackRef = useRef<(() => void) | null>(null)

  const repDetectionRef = useRef<RepDetectionState>({
    inRep: false,
    bottomReached: false,
    topReached: true,
    invalidRepStarted: false,
    currentState: "ready",
  })

  const smoothedAnglesRef = useRef<SmoothedAngles>({
    leftKnee: null,
    rightKnee: null,
    leftElbow: null,
    rightElbow: null,
  })

  const onResults = useCallback((results: Results) => {
    if (!results.poseLandmarks || !configRef.current) return

    const { pose, rules } = configRef.current
    const { poseLandmarks } = results

    // Function to calculate angle between three points
    const calculateAngle = (a: any, b: any, c: any) => {
      const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
      let angle = Math.abs((radians * 180.0) / Math.PI)
      angle = angle > 180.0 ? 360 - angle : angle
      return angle
    }

    // Function to smooth angles using exponential moving average
    const smoothAngle = (newAngle: number, existingAngle: number | null, smoothingFactor = 0.7) => {
      if (existingAngle === null) {
        return newAngle
      }
      return smoothingFactor * existingAngle + (1 - smoothingFactor) * newAngle
    }

    // Squat Detection Logic
    if (pose === "squat") {
      const leftHip = poseLandmarks[23] // Left hip
      const leftKnee = poseLandmarks[25] // Left knee
      const leftAnkle = poseLandmarks[27] // Left ankle

      const rightHip = poseLandmarks[24] // Right hip
      const rightKnee = poseLandmarks[26] // Right knee
      const rightAnkle = poseLandmarks[28] // Right ankle

      let leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
      let rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

      // Smooth the angles
      smoothedAnglesRef.current = {
        ...smoothedAnglesRef.current,
        leftKnee: smoothAngle(leftKneeAngle, smoothedAnglesRef.current.leftKnee),
        rightKnee: smoothAngle(rightKneeAngle, smoothedAnglesRef.current.rightKnee),
      }

      leftKneeAngle = smoothedAnglesRef.current.leftKnee!
      rightKneeAngle = smoothedAnglesRef.current.rightKnee!

      const downKneeAngle = rules.down_knee_angle || { max: 90, tol: 10 }
      const upLegStraight = rules.up_leg_straight || { min: 160, tol: 10 }

      const isAtBottom = leftKneeAngle <= downKneeAngle.max && rightKneeAngle <= downKneeAngle.max
      const isAtTop = leftKneeAngle >= upLegStraight.min && rightKneeAngle >= upLegStraight.min
      const isGoodForm = leftKneeAngle > 60 && rightKneeAngle > 60 // Basic form check

      // State machine logic
      const currentDetection = repDetectionRef.current

      if (currentDetection.currentState === "ready" && isAtTop) {
        // Ready to start a rep
        setRepState("ready")
      } else if (currentDetection.currentState === "ready" && !isAtTop) {
        // Starting to descend
        currentDetection.currentState = "descending"
        currentDetection.inRep = true
        setRepState("descending")
      } else if (currentDetection.currentState === "descending" && isAtBottom) {
        // Reached bottom position
        currentDetection.currentState = "bottom"
        currentDetection.bottomReached = true
        setRepState("bottom")
      } else if (currentDetection.currentState === "bottom" && !isAtBottom && isGoodForm) {
        // Starting to ascend with good form
        currentDetection.currentState = "ascending"
        setRepState("ascending")
      } else if (currentDetection.currentState === "ascending" && isAtTop) {
        // Completed a valid rep
        currentDetection.currentState = "complete"
        setRepState("complete")
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
      } else if (currentDetection.inRep && !isGoodForm && !currentDetection.invalidRepStarted) {
        // Invalid rep detected
        if (rules.track_invalid_reps) {
          setInvalidReps((prev) => prev + 1)
          currentDetection.invalidRepStarted = true
          setRepState("invalid")

          // Reset after invalid rep
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

        // Load MediaPipe libraries dynamically
        const script1 = document.createElement("script")
        script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        document.head.appendChild(script1)

        const script2 = document.createElement("script")
        script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js"
        document.head.appendChild(script2)

        const script3 = document.createElement("script")
        script3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
        document.head.appendChild(script3)

        const script4 = document.createElement("script")
        script4.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
        document.head.appendChild(script4)

        // Wait for scripts to load
        await new Promise((resolve) => {
          script4.onload = resolve
        })

        // Initialize MediaPipe Pose using global objects
        const { Pose, Camera } = window as any

        const pose = new Pose({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
          },
        })

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        pose.onResults(onResults)
        poseRef.current = pose

        // Initialize camera
        const camera = new Camera(videoEl, {
          onFrame: async () => {
            if (poseRef.current) {
              await poseRef.current.send({ image: videoEl })
            }
          },
          width: 1280,
          height: 720,
        })

        cameraRef.current = camera
        await camera.start()

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
        }
        smoothedAnglesRef.current = {
          leftKnee: null,
          rightKnee: null,
          leftElbow: null,
          rightElbow: null,
        }
      } catch (error) {
        console.error("Failed to initialize pose detector:", error)
        throw error
      }
    },
    [onResults],
  )

  const destroyDetector = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop()
      cameraRef.current = null
    }
    if (poseRef.current) {
      poseRef.current.close()
      poseRef.current = null
    }
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
