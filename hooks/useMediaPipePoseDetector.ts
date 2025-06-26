"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useScript } from "./useScript"

// Define types for MediaPipe classes that will be on the window object
declare global {
  interface Window {
    PoseLandmarker: any
    FilesetResolver: any
    DrawingUtils: any
  }
}

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
  const scriptStatus = useScript("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/vision_bundle.js")
  const [poseLandmarker, setPoseLandmarker] = useState<any | null>(null)
  const [validReps, setValidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastRepTimestamp = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const drawingUtilsRef = useRef<any | null>(null)

  useEffect(() => {
    if (scriptStatus === "error") {
      setError("Failed to load the AI library. Please check your network connection.")
    }
    if (scriptStatus !== "ready" || poseLandmarker) {
      return
    }

    const createPoseLandmarker = async () => {
      try {
        const vision = await window.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm",
        )
        const landmarker = await window.PoseLandmarker.createFromOptions(vision, {
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
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error"
        console.error("Error loading Pose Landmarker model:", errorMessage, e)
        setError(`Error initializing AI model: ${errorMessage}`)
      }
    }
    createPoseLandmarker()
  }, [scriptStatus, poseLandmarker])

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

    if (!drawingUtilsRef.current) {
      drawingUtilsRef.current = new window.DrawingUtils(canvasCtx)
    }

    if (video.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(predictWebcam)
      return
    }

    canvas.width = video.clientWidth
    canvas.height = video.clientHeight

    const startTimeMs = performance.now()
    const results = poseLandmarker.detectForVideo(video, startTimeMs)

    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0]
      drawingUtilsRef.current.drawLandmarks(landmarks, { color: "#5c3bfe", lineWidth: 2 })
      drawingUtilsRef.current.drawConnectors(landmarks, window.PoseLandmarker.POSE_CONNECTIONS, {
        color: "#FFFFFF",
        lineWidth: 2,
      })

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
      animationFrameId.current = requestAnimationFrame(predictWebcam)
    },
    [predictWebcam],
  )

  const stopDetector = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }, [])

  return { startDetector, stopDetector, validReps, debugData, isModelReady, error }
}
