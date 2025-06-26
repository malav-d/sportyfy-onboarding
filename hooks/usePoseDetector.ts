"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import { calculateAngle } from "@/utils/poseMath"

// --- Configuration ---
const SQUAT_UP_THRESHOLD = 160 // Angle for standing position
const SQUAT_DOWN_THRESHOLD = 90 // Angle for squat depth
const CONFIDENCE_THRESHOLD = 0.5

type RepState = "up" | "down"
export interface DebugData {
  state: RepState
  leftKneeAngle: number
  rightKneeAngle: number
  leftHipAngle: number
  rightHipAngle: number
}

export const usePoseDetector = () => {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [validReps, setValidReps] = useState(0)
  const [repState, setRepState] = useState<RepState>("up")
  const [debugData, setDebugData] = useState<DebugData | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameId = useRef<number | null>(null)

  // Load the MoveNet model from TensorFlow.js
  useEffect(() => {
    const loadDetector = async () => {
      try {
        setError(null)
        await tf.ready()
        await tf.setBackend("webgl")
        const model = poseDetection.SupportedModels.MoveNet
        const detectorConfig: poseDetection.MoveNetModelConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
        const createdDetector = await poseDetection.createDetector(model, detectorConfig)
        setDetector(createdDetector)
        setIsModelReady(true)
        console.log("MoveNet model loaded successfully.")
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error"
        console.error("Failed to load pose detector:", e)
        setError(`Failed to load AI model: ${errorMessage}`)
      }
    }
    loadDetector()

    return () => {
      detector?.dispose()
    }
  }, [])

  const processPose = (pose: poseDetection.Pose) => {
    const keypoints = pose.keypoints.reduce(
      (acc, keypoint) => {
        acc[keypoint.name!] = keypoint
        return acc
      },
      {} as { [key: string]: poseDetection.Keypoint },
    )

    const requiredKeypoints = [
      "left_shoulder",
      "right_shoulder",
      "left_hip",
      "right_hip",
      "left_knee",
      "right_knee",
      "left_ankle",
      "right_ankle",
    ]
    for (const kpName of requiredKeypoints) {
      if (!keypoints[kpName] || (keypoints[kpName].score ?? 0) < CONFIDENCE_THRESHOLD) {
        // Not all keypoints are visible, do not process
        return
      }
    }

    const leftKneeAngle = calculateAngle(keypoints.left_hip, keypoints.left_knee, keypoints.left_ankle)
    const rightKneeAngle = calculateAngle(keypoints.right_hip, keypoints.right_knee, keypoints.right_ankle)
    const leftHipAngle = calculateAngle(keypoints.left_shoulder, keypoints.left_hip, keypoints.left_knee)
    const rightHipAngle = calculateAngle(keypoints.right_shoulder, keypoints.right_hip, keypoints.right_knee)

    setDebugData({ state: repState, leftKneeAngle, rightKneeAngle, leftHipAngle, rightHipAngle })

    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2

    // State machine for rep counting
    if (repState === "up" && avgKneeAngle < SQUAT_DOWN_THRESHOLD) {
      setRepState("down")
    } else if (repState === "down" && avgKneeAngle > SQUAT_UP_THRESHOLD) {
      setValidReps((prev) => prev + 1)
      setRepState("up")
    }
  }

  const detectPoses = useCallback(async () => {
    if (detector && videoRef.current && videoRef.current.readyState >= 2) {
      try {
        const poses = await detector.estimatePoses(videoRef.current)
        if (poses && poses.length > 0) {
          processPose(poses[0])
        }
      } catch (e) {
        console.error("Error during pose estimation:", e)
      }
    }
    animationFrameId.current = requestAnimationFrame(detectPoses)
  }, [detector])

  const startDetector = useCallback(
    (video: HTMLVideoElement) => {
      videoRef.current = video
      setValidReps(0)
      setRepState("up")
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      animationFrameId.current = requestAnimationFrame(detectPoses)
    },
    [detectPoses],
  )

  const stopDetector = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }, [])

  return { startDetector, stopDetector, validReps, debugData, isModelReady, error }
}
