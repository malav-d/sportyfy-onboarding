"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import { angleBetween, calculateHipMovement, getKeypoint } from "@/utils/poseMath"

// Configuration for the rep detection logic
const MIN_REP_MS = 800 // A rep must take at least 800ms
const BOTTOM_DWELL_MS = 100 // Must be in the 'bottom' position for at least 100ms
const UP_ANGLE_THRESHOLD = 160 // Angle for standing straight
const DOWN_ANGLE_THRESHOLD = 100 // Angle for being in a squat
const HIP_MOVEMENT_THRESHOLD = 0.01 // Min normalized hip movement to detect motion

export interface DetectorConfig {
  minValidReps: number | null
  scoringKey: "max_reps_in_time" | "first_n_valid_reps"
}

export interface DebugData {
  leftKneeAngle: number
  rightKneeAngle: number
  hipVerticalPosition: number
  hipMovement: number
  state: RepState
  keypoints: poseDetection.Keypoint[]
}

type RepState = "ready" | "descending" | "bottom" | "ascending" | "complete" | "invalid"

export const usePoseDetector = () => {
  const [validReps, setValidReps] = useState(0)
  const [invalidReps, setInvalidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("ready")
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null)

  const animationFrameRef = useRef<number | null>(null)
  const configRef = useRef<DetectorConfig | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const earlyCompleteCallbackRef = useRef<(() => void) | null>(null)

  // State machine refs
  const currentStateRef = useRef<RepState>("ready")
  const previousHipRef = useRef<poseDetection.Keypoint | null>(null)
  const bottomTimeRef = useRef(0)
  const lastRepTimeRef = useRef(0)

  // Initialize the TensorFlow.js model
  const initModel = useCallback(async () => {
    try {
      await tf.ready()
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      }
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
      setModel(detector)
      console.log("MoveNet model loaded successfully.")
    } catch (error) {
      console.error("Failed to load MoveNet model:", error)
    }
  }, [])

  useEffect(() => {
    initModel()
  }, [initModel])

  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !configRef.current) {
      if (model) animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }

    const video = videoRef.current
    if (video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }

    const poses = await model.estimatePoses(video, {
      flipHorizontal: false,
    })

    const pose = poses[0]
    if (!pose || pose.score! < 0.4) {
      // No person detected or low confidence
      setDebugData((prev) => (prev ? { ...prev, keypoints: [] } : null))
      animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }

    // Get keypoints for squat analysis
    const leftHip = getKeypoint(pose.keypoints, "left_hip")
    const rightHip = getKeypoint(pose.keypoints, "right_hip")
    const leftKnee = getKeypoint(pose.keypoints, "left_knee")
    const rightKnee = getKeypoint(pose.keypoints, "right_knee")
    const leftAnkle = getKeypoint(pose.keypoints, "left_ankle")
    const rightAnkle = getKeypoint(pose.keypoints, "right_ankle")

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }

    // Calculate angles and hip position
    const leftKneeAngle = angleBetween(leftHip, leftKnee, leftAnkle)
    const rightKneeAngle = angleBetween(rightHip, rightKnee, rightAnkle)
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2

    const hipCenter = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2,
    }

    const hipMovement = calculateHipMovement(hipCenter, previousHipRef.current)
    previousHipRef.current = hipCenter

    const timestamp = performance.now()
    const timeSinceLastRep = timestamp - lastRepTimeRef.current
    const currentState = currentStateRef.current

    // --- Rep Counting State Machine ---
    switch (currentState) {
      case "ready":
        if (avgKneeAngle < UP_ANGLE_THRESHOLD - 10 && hipMovement > HIP_MOVEMENT_THRESHOLD) {
          currentStateRef.current = "descending"
        }
        break

      case "descending":
        if (avgKneeAngle < DOWN_ANGLE_THRESHOLD) {
          currentStateRef.current = "bottom"
          bottomTimeRef.current = timestamp
        }
        break

      case "bottom":
        const timeAtBottom = timestamp - bottomTimeRef.current
        if (timeAtBottom > BOTTOM_DWELL_MS) {
          if (avgKneeAngle > DOWN_ANGLE_THRESHOLD + 10 && hipMovement < -HIP_MOVEMENT_THRESHOLD) {
            currentStateRef.current = "ascending"
          }
        }
        break

      case "ascending":
        if (avgKneeAngle > UP_ANGLE_THRESHOLD) {
          if (timeSinceLastRep > MIN_REP_MS) {
            // Valid Rep!
            setValidReps((prev) => {
              const newCount = prev + 1
              if (
                configRef.current?.scoringKey === "first_n_valid_reps" &&
                configRef.current?.minValidReps &&
                newCount >= configRef.current.minValidReps
              ) {
                earlyCompleteCallbackRef.current?.()
              }
              return newCount
            })
            currentStateRef.current = "complete"
            lastRepTimeRef.current = timestamp
            setTimeout(() => {
              currentStateRef.current = "ready"
            }, 500)
          } else {
            // Rep was too fast
            setInvalidReps((prev) => prev + 1)
            currentStateRef.current = "invalid"
            setTimeout(() => {
              currentStateRef.current = "ready"
            }, 500)
          }
        }
        break
      case "complete":
      case "invalid":
        // Handled by timeouts
        break
    }

    setRepState(currentStateRef.current)
    setDebugData({
      leftKneeAngle,
      rightKneeAngle,
      hipVerticalPosition: hipCenter.y,
      hipMovement,
      state: currentStateRef.current,
      keypoints: pose.keypoints,
    })

    animationFrameRef.current = requestAnimationFrame(detectPose)
  }, [model])

  const initDetector = useCallback(
    (videoEl: HTMLVideoElement, cfg: DetectorConfig) => {
      if (!model) {
        console.warn("Detector model not ready yet.")
        return
      }
      videoRef.current = videoEl
      configRef.current = cfg

      // Reset state
      setValidReps(0)
      setInvalidReps(0)
      setRepState("ready")
      currentStateRef.current = "ready"
      previousHipRef.current = null
      lastRepTimeRef.current = performance.now()

      // Start detection loop
      detectPose()
    },
    [model, detectPose],
  )

  const destroyDetector = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
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
    destroyDetector,
    onEarlyComplete,
    validReps,
    invalidReps,
    repState,
    debugData,
    isModelReady: !!model,
  }
}
