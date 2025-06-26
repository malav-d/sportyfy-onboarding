"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"

// --- Configuration ---
const UP_ANGLE_THRESHOLD = 160
const DOWN_ANGLE_THRESHOLD = 100
const MIN_REP_DURATION_MS = 800
const MIN_CONFIDENCE = 0.5

type RepState = "ready" | "descending" | "bottom" | "ascending"

export interface DebugData {
  state: RepState
  leftKneeAngle: number
  rightKneeAngle: number
}

export const useMediaPipePoseDetector = () => {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null)
  const [validReps, setValidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastRepTimestamp = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  // Load the MediaPipe PoseLandmarker model
  useEffect(() => {
    const createPoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
        )
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        })
        setPoseLandmarker(landmarker)
        setIsModelReady(true)
        console.log("Pose Landmarker model loaded.")
      } catch (error) {
        console.error("Error loading Pose Landmarker model:", error)
      }
    }
    createPoseLandmarker()
  }, [])

  const calculateAngle = (p1: any, p2: any, p3: any) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x)
    let angle = Math.abs((radians * 180.0) / Math.PI)
    if (angle > 180.0) angle = 360 - angle
    return angle
  }

  const predictWebcam = useCallback(() => {
    if (!poseLandmarker || !videoRef.current || !canvasRef.current) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return

    if (video.videoWidth === 0) {
      animationFrameId.current = requestAnimationFrame(predictWebcam)
      return
    }

    canvas.width = video.clientWidth
    canvas.height = video.clientHeight

    const startTimeMs = performance.now()
    const results = poseLandmarker.detectForVideo(video, startTimeMs)

    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    const drawingUtils = new DrawingUtils(canvasCtx)

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0]

      // Draw skeleton
      drawingUtils.drawLandmarks(landmarks, {
        radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
        color: "#5c3bfe",
      })
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "#FFFFFF" })

      // Rep counting logic
      const leftHip = landmarks[23]
      const leftKnee = landmarks[25]
      const leftAnkle = landmarks[27]
      const rightHip = landmarks[24]
      const rightKnee = landmarks[26]
      const rightAnkle = landmarks[28]

      if (
        [leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle].every(
          (p) => p && p.visibility && p.visibility > MIN_CONFIDENCE,
        )
      ) {
        const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
        const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
        const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2

        setDebugData({ state: repState, leftKneeAngle, rightKneeAngle })

        const now = performance.now()
        if (repState === "ready" && avgKneeAngle < DOWN_ANGLE_THRESHOLD + 20) {
          setRepState("descending")
        } else if (repState === "descending" && avgKneeAngle < DOWN_ANGLE_THRESHOLD) {
          setRepState("bottom")
        } else if (repState === "bottom" && avgKneeAngle > UP_ANGLE_THRESHOLD - 20) {
          setRepState("ascending")
        } else if (repState === "ascending" && avgKneeAngle > UP_ANGLE_THRESHOLD) {
          if (now - lastRepTimestamp.current > MIN_REP_DURATION_MS) {
            setValidReps((prev) => prev + 1)
            lastRepTimestamp.current = now
          }
          setRepState("ready")
        }
      }
    }
    canvasCtx.restore()

    animationFrameId.current = requestAnimationFrame(predictWebcam)
  }, [poseLandmarker, repState])

  const startDetector = useCallback(
    (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      videoRef.current = video
      canvasRef.current = canvas
      setValidReps(0)
      setRepState("ready")
      lastRepTimestamp.current = 0
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      predictWebcam()
    },
    [predictWebcam],
  )

  const stopDetector = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }, [])

  return { startDetector, stopDetector, validReps, repState, debugData, isModelReady }
}
