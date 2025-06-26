"use client"

import { useState, useRef, useCallback } from "react"

// Remove the direct imports and replace with dynamic loading
// import { Pose, Results } from '@mediapipe/pose'
// import { Camera } from '@mediapipe/camera_utils'

// Add dynamic types
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

interface DetectorConfig {
  repThreshold: number
  angleThreshold: number
  side: "left" | "right"
  exercise: "squat" | "bicepCurl"
}

interface RepDetectionState {
  inRep: boolean
  bottomReached: boolean
  topReached: boolean
  invalidRepStarted: boolean
}

interface SmoothedAngles {
  leftKnee: number | null
  rightKnee: number | null
  leftHip: number | null
  rightHip: number | null
}

const useRepDetector = () => {
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<"ready" | "detecting" | "complete">("ready")
  const poseRef = useRef<Pose | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  const configRef = useRef<DetectorConfig | null>(null)
  const repDetectionRef = useRef<RepDetectionState>({
    inRep: false,
    bottomReached: false,
    topReached: true,
    invalidRepStarted: false,
  })
  const smoothedAnglesRef = useRef<SmoothedAngles>({
    leftKnee: null,
    rightKnee: null,
    leftHip: null,
    rightHip: null,
  })

  const onResults = useCallback((results: Results) => {
    if (!results.poseLandmarks || !configRef.current) return

    const { repThreshold, angleThreshold, side, exercise } = configRef.current
    const { poseLandmarks } = results

    // Function to calculate angle
    const calculateAngle = (a: any, b: any, c: any) => {
      const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
      let angle = Math.abs((radians * 180.0) / Math.PI)
      angle = angle > 180.0 ? 360 - angle : angle
      return angle
    }

    // Function to smooth angles
    const smoothAngle = (newAngle: number, existingAngle: number | null, smoothingFactor = 0.8) => {
      if (existingAngle === null) {
        return newAngle
      }
      return smoothingFactor * existingAngle + (1 - smoothingFactor) * newAngle
    }

    // Squat Detection Logic
    if (exercise === "squat") {
      const leftHip = poseLandmarks[11]
      const leftKnee = poseLandmarks[13]
      const leftAnkle = poseLandmarks[15]

      const rightHip = poseLandmarks[12]
      const rightKnee = poseLandmarks[14]
      const rightAnkle = poseLandmarks[16]

      let leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
      let rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

      smoothedAnglesRef.current = {
        leftKnee: smoothAngle(leftKneeAngle, smoothedAnglesRef.current.leftKnee),
        rightKnee: smoothAngle(rightKneeAngle, smoothedAnglesRef.current.rightKnee),
        leftHip: null,
        rightHip: null,
      }

      leftKneeAngle = smoothedAnglesRef.current.leftKnee!
      rightKneeAngle = smoothedAnglesRef.current.rightKnee!

      const isGoodForm = leftKneeAngle > 60 && rightKneeAngle > 60

      if (repDetectionRef.current.inRep) {
        if (leftKneeAngle > angleThreshold && rightKneeAngle > angleThreshold) {
          repDetectionRef.current.topReached = true
        }

        if (repDetectionRef.current.bottomReached && repDetectionRef.current.topReached) {
          setValidReps((prev) => prev + 1)
          repDetectionRef.current = {
            inRep: false,
            bottomReached: false,
            topReached: true,
            invalidRepStarted: false,
          }
        }
      } else {
        if (leftKneeAngle < angleThreshold && rightKneeAngle < angleThreshold) {
          repDetectionRef.current.bottomReached = true
        }

        if (repDetectionRef.current.bottomReached && isGoodForm) {
          repDetectionRef.current.inRep = true
        }
      }

      if (!isGoodForm && !repDetectionRef.current.invalidRepStarted && repDetectionRef.current.bottomReached) {
        setInvalidReps((prev) => prev + 1)
        repDetectionRef.current.invalidRepStarted = true
      }
    }

    // Bicep Curl Detection Logic
    if (exercise === "bicepCurl") {
      const leftShoulder = poseLandmarks[11]
      const leftElbow = poseLandmarks[13]
      const leftWrist = poseLandmarks[15]

      const rightShoulder = poseLandmarks[12]
      const rightElbow = poseLandmarks[14]
      const rightWrist = poseLandmarks[16]

      let leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)
      let rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)

      smoothedAnglesRef.current = {
        leftKnee: null,
        rightKnee: null,
        leftHip: smoothAngle(leftElbowAngle, smoothedAnglesRef.current.leftHip),
        rightHip: smoothAngle(rightElbowAngle, smoothedAnglesRef.current.rightHip),
      }

      leftElbowAngle = smoothedAnglesRef.current.leftHip!
      rightElbowAngle = smoothedAnglesRef.current.rightHip!

      if (side === "left") {
        if (repDetectionRef.current.inRep) {
          if (leftElbowAngle > repThreshold) {
            setValidReps((prev) => prev + 1)
            repDetectionRef.current.inRep = false
          }
        } else {
          if (leftElbowAngle < angleThreshold) {
            repDetectionRef.current.inRep = true
          }
        }
      } else if (side === "right") {
        if (repDetectionRef.current.inRep) {
          if (rightElbowAngle > repThreshold) {
            setValidReps((prev) => prev + 1)
            repDetectionRef.current.inRep = false
          }
        } else {
          if (rightElbowAngle < angleThreshold) {
            repDetectionRef.current.inRep = true
          }
        }
      }
    }
  }, [])

  const initDetector = useCallback(
    async (videoEl: HTMLVideoElement, cfg: DetectorConfig) => {
      try {
        configRef.current = cfg

        // Load MediaPipe libraries dynamically
        await import("@/lib/mediapipe-loader").then(({ loadMediaPipeLibraries }) => loadMediaPipeLibraries())

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
        }
        smoothedAnglesRef.current = {
          leftKnee: null,
          rightKnee: null,
          leftHip: null,
          rightHip: null,
        }
      } catch (error) {
        console.error("Failed to initialize pose detector:", error)
        throw error
      }
    },
    [onResults],
  )

  const stopDetector = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop()
      cameraRef.current = null
    }
    if (poseRef.current) {
      poseRef.current.close()
      poseRef.current = null
    }
  }, [])

  return {
    validReps,
    invalidReps,
    repState,
    initDetector,
    stopDetector,
  }
}

export default useRepDetector
