"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { X, Target, AlertTriangle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRepDetector, type DetectorConfig } from "@/hooks/useRepDetector"
import { useCountdownTimer } from "@/hooks/useCountdownTimer"

// Check for debug mode
const DEBUG_MODE = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "true"

interface ChallengeData {
  id: string
  title: string
  description: string
  duration_limit: number
  points_reward: number
  xp_reward: number
  badge_reward: string
  video_url: string
  video_example_url: string
  category: string
  starts_at: string
  ends_at: string | null
  is_paid: boolean
  entry_fee: string
  is_tutorial: boolean
  difficulty: {
    key: string
    label: string
  }
  challenge_type: {
    key: string
    label: string
  }
  scoring_method: {
    key: string
    label: string
  }
  requirements: {
    camera_pose: {
      key: string
      label: string
    }
    min_valid_reps: number
    duration_seconds: number
    environment_tips: Array<{
      label: string
    }>
  }
  verification_rules: {
    pose: string
    down_knee_angle: {
      max: number
      tol: number
    }
    up_leg_straight: {
      min: number
      tol: number
    }
    track_invalid_reps: boolean
  }
  metrics_spec: {
    primary: {
      key: string
      unit: string
      label: string
    }
    secondary: {
      key: string
      unit: string
      label: string
    }
  }
}

interface RecordingResult {
  validReps: number
  invalidReps: number
  elapsed: number
}

interface EnhancedVideoCaptureProps {
  challengeData: ChallengeData
  onComplete: (result: RecordingResult) => void
  onCancel: () => void
}

export function EnhancedVideoCapture({ challengeData, onComplete, onCancel }: EnhancedVideoCaptureProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [recordingComplete, setRecordingComplete] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameId = useRef<number | null>(null)

  const detectorConfig: DetectorConfig = {
    pose: challengeData.verification_rules.pose,
    rules: challengeData.verification_rules,
    minValidReps: challengeData.requirements?.min_valid_reps ?? null,
    scoringKey: challengeData.scoring_method.key as "max_reps_in_time" | "first_n_valid_reps",
    debug: true, // Always enable debug data generation
  }

  const { initDetector, validReps, invalidReps, repState, destroyDetector, onEarlyComplete, debugData } =
    useRepDetector()

  const handleTimerExpire = useCallback(() => {
    if (isRecording) {
      stopRecording()
    }
  }, [isRecording])

  const {
    timeLeft,
    isRunning: timerRunning,
    start: startTimer,
    stop: stopTimer,
    progress,
  } = useCountdownTimer({
    duration: challengeData.duration_limit,
    onExpire: handleTimerExpire,
  })

  const shouldStop = useCallback(() => {
    if (detectorConfig.scoringKey === "max_reps_in_time") {
      return timeLeft <= 0
    }
    if (detectorConfig.scoringKey === "first_n_valid_reps") {
      return (detectorConfig.minValidReps && validReps >= detectorConfig.minValidReps) || timeLeft <= 0
    }
    return timeLeft <= 0
  }, [detectorConfig.scoringKey, detectorConfig.minValidReps, validReps, timeLeft])

  useEffect(() => {
    const cleanup = onEarlyComplete(() => {
      if (isRecording) {
        stopRecording()
      }
    })
    return cleanup
  }, [isRecording, onEarlyComplete])

  useEffect(() => {
    initializeCamera()
    return () => {
      cleanupCamera()
    }
  }, [])

  const initializeCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true)
          videoRef.current?.play().catch(console.warn)
        }
      }
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "Unable to access camera")
    }
  }

  const cleanupCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    destroyDetector()
  }

  const startPoseFeed = (video: HTMLVideoElement, pose: any) => {
    const processFrame = async () => {
      if (video.readyState >= 2) {
        await pose.send({ image: video })
      }
      animationFrameId.current = requestAnimationFrame(processFrame)
    }
    processFrame()
  }

  const beginRecording = async () => {
    if (!videoRef.current) return
    try {
      const pose = await initDetector(videoRef.current, detectorConfig)
      startPoseFeed(videoRef.current, pose)
      setIsRecording(true)
      startTimer()
    } catch (error) {
      console.error("Failed to initialize detector:", error)
      setCameraError("Failed to start motion detection")
    }
  }

  const startRecordingFlow = () => {
    if (!cameraReady) return
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          beginRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    setIsRecording(false)
    stopTimer()
    destroyDetector()
    setRecordingComplete(true)
    const result = {
      validReps,
      invalidReps,
      elapsed: challengeData.duration_limit - timeLeft,
    }
    setTimeout(() => onComplete(result), 2000)
  }

  const handleCancel = () => {
    if (isRecording) {
      stopRecording()
    } else {
      onCancel()
    }
  }

  useEffect(() => {
    if (isRecording && shouldStop()) {
      stopRecording()
    }
  }, [isRecording, shouldStop])

  if (cameraError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <div className="text-red-400 mb-4 text-lg">{cameraError}</div>
        <Button onClick={initializeCamera} className="bg-white text-black hover:bg-gray-100 mb-4">
          Try Again
        </Button>
        <button onClick={onCancel} className="text-white/70 text-sm">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative font-mono">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

      {isRecording && debugData && (
        <div className="absolute top-24 left-6 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg text-xs space-y-1 font-mono shadow-lg">
          <h3 className="font-bold text-sm mb-2 border-b border-white/20 pb-1">Live Pose Analysis</h3>
          <div>
            State: <span className="font-bold text-yellow-300">{debugData.state.toUpperCase()}</span>
          </div>
          <div>
            Knee Angle: <span className="font-bold">{debugData.kneeAngle}°</span>
          </div>
          <div>
            Hip ΔY: <span className="font-bold">{debugData.hipDy}</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/20">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <button
            onClick={handleCancel}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="flex flex-col items-end space-y-2">
            <Badge className="bg-green-500/90 text-white px-3 py-1 text-sm font-bold">
              <Target className="h-4 w-4 mr-1" />
              {validReps} {challengeData.metrics_spec.primary.label}
            </Badge>
            {challengeData.verification_rules.track_invalid_reps && invalidReps > 0 && (
              <Badge className="bg-red-500/90 text-white px-3 py-1 text-sm font-bold">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {invalidReps} Invalid
              </Badge>
            )}
            {isRecording && (
              <Badge
                className={`backdrop-blur-sm px-3 py-1 text-sm font-bold transition-colors ${
                  repState === "complete"
                    ? "bg-green-500/90 text-white"
                    : repState === "invalid"
                      ? "bg-red-500/90 text-white"
                      : repState === "descending"
                        ? "bg-blue-500/90 text-white"
                        : repState === "bottom"
                          ? "bg-yellow-500/90 text-black"
                          : repState === "ascending"
                            ? "bg-purple-500/90 text-white"
                            : "bg-white/20 text-white"
                }`}
              >
                {repState.charAt(0).toUpperCase() + repState.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-9xl font-bold text-white"
            >
              {countdown}
            </motion.div>
          )}
          {recordingComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/90 backdrop-blur-sm text-black px-8 py-6 rounded-2xl text-center"
            >
              <div className="text-2xl font-bold mb-2">Recording Complete!</div>
              <div className="text-lg">{validReps} valid reps</div>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          {timerRunning && (
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{Math.ceil(timeLeft)}</span>
                </div>
              </div>
            </div>
          )}
          {!isRecording && !recordingComplete && countdown === 0 && (
            <div className="space-y-4">
              <Button
                onClick={startRecordingFlow}
                disabled={!cameraReady}
                className="w-full bg-white text-black hover:bg-gray-100 text-xl py-6 rounded-full font-bold"
              >
                <Camera className="h-6 w-6 mr-2" />
                Start Challenge
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
