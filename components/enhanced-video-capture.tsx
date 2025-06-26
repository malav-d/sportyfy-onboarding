"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { X, Target, AlertTriangle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePoseDetector, type DetectorConfig } from "@/hooks/usePoseDetector"
import { useCountdownTimer } from "@/hooks/useCountdownTimer"
import * as poseDetection from "@tensorflow-models/pose-detection"

// This interface should match the structure of your actual challenge data
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
  difficulty: { key: string; label: string }
  challenge_type: { key: string; label: string }
  scoring_method: { key: "max_reps_in_time" | "first_n_valid_reps"; label: string }
  requirements: {
    camera_pose: { key: string; label: string }
    min_valid_reps: number
    duration_seconds: number
    environment_tips: Array<{ label: string }>
  }
  verification_rules: {
    pose: string
    down_knee_angle: { max: number; tol: number }
    up_leg_straight: { min: number; tol: number }
    track_invalid_reps: boolean
  }
  metrics_spec: {
    primary: { key: string; unit: string; label: string }
    secondary: { key: string; unit: string; label: string }
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const detectorConfig: DetectorConfig = {
    minValidReps: challengeData.requirements?.min_valid_reps ?? null,
    scoringKey: challengeData.scoring_method.key,
  }

  const { initDetector, destroyDetector, onEarlyComplete, validReps, invalidReps, repState, debugData, isModelReady } =
    usePoseDetector()

  const handleTimerExpire = useCallback(() => {
    if (isRecording) {
      stopRecording()
    }
  }, [isRecording])

  const {
    timeLeft,
    start: startTimer,
    stop: stopTimer,
    progress,
  } = useCountdownTimer({
    duration: challengeData.duration_limit,
    onExpire: handleTimerExpire,
  })

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

  useEffect(() => {
    if (!isRecording || !debugData || !canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.clientWidth
    canvas.height = video.clientHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scaleX = canvas.width / video.videoWidth
    const scaleY = canvas.height / video.videoHeight

    const connections = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
    ctx.lineWidth = 2
    connections.forEach(([i, j]) => {
      const kp1 = debugData.keypoints[i]
      const kp2 = debugData.keypoints[j]
      if (kp1 && kp2 && kp1.score! > 0.3 && kp2.score! > 0.3) {
        ctx.beginPath()
        ctx.moveTo(kp1.x * scaleX, kp1.y * scaleY)
        ctx.lineTo(kp2.x * scaleX, kp2.y * scaleY)
        ctx.stroke()
      }
    })

    ctx.fillStyle = "#5c3bfe"
    debugData.keypoints.forEach((kp) => {
      if (kp.score! > 0.3) {
        ctx.beginPath()
        ctx.arc(kp.x * scaleX, kp.y * scaleY, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    })
  }, [debugData, isRecording])

  const initializeCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
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
      console.error("Camera access failed:", error)
      setCameraError(error instanceof Error ? error.message : "Unable to access camera")
    }
  }

  const cleanupCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    destroyDetector()
  }

  const startRecording = () => {
    if (!cameraReady || !videoRef.current || !isModelReady) return
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

  const beginRecording = () => {
    if (!videoRef.current) return
    initDetector(videoRef.current, detectorConfig)
    setIsRecording(true)
    startTimer()
  }

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    stopTimer()
    destroyDetector()
    setRecordingComplete(true)
    const result: RecordingResult = {
      validReps,
      invalidReps,
      elapsed: challengeData.duration_limit - timeLeft,
    }
    setTimeout(() => onComplete(result), 2000)
  }, [validReps, invalidReps, timeLeft, challengeData.duration_limit, onComplete, stopTimer, destroyDetector])

  const handleCancel = () => {
    if (isRecording) {
      stopRecording()
    } else {
      onCancel()
    }
  }

  const getLoadingMessage = () => {
    if (!cameraReady) return "Initializing camera..."
    if (!isModelReady) return "Loading AI model..."
    return "Ready"
  }

  return (
    <div className="min-h-screen bg-black relative font-mono">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

      {isRecording && debugData && (
        <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg text-xs space-y-1 font-mono shadow-lg">
          <h3 className="font-bold text-sm mb-2 border-b border-white/20 pb-1">Live Analysis</h3>
          <div>
            State: <span className="font-bold text-yellow-300">{debugData.state.toUpperCase()}</span>
          </div>
          <div>
            L.Knee: <span className="font-bold">{debugData.leftKneeAngle.toFixed(1)}°</span>
          </div>
          <div>
            R.Knee: <span className="font-bold">{debugData.rightKneeAngle.toFixed(1)}°</span>
          </div>
          <div>
            Hip Move: <span className="font-bold">{(debugData.hipMovement * 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/20">
        <div className="absolute top-6 right-6 flex flex-col items-end space-y-2">
          <button
            onClick={handleCancel}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors absolute -top-0 -left-16"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <Badge className="bg-green-500/90 text-white backdrop-blur-sm px-3 py-1 text-sm font-bold">
            <Target className="h-4 w-4 mr-1" />
            {validReps} Valid Squats
          </Badge>
          {challengeData.verification_rules.track_invalid_reps && invalidReps > 0 && (
            <Badge className="bg-red-500/90 text-white backdrop-blur-sm px-3 py-1 text-sm font-bold">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {invalidReps} Invalid
            </Badge>
          )}
          <Badge className="bg-purple-500/70 text-white backdrop-blur-sm px-2 py-1 text-xs">Pose Detection</Badge>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-9xl font-bold text-white drop-shadow-lg"
            >
              {countdown}
            </motion.div>
          )}
          {recordingComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/90 backdrop-blur-sm text-black px-8 py-6 rounded-2xl text-center shadow-xl"
            >
              <div className="text-2xl font-bold mb-2">Recording Complete!</div>
              <div className="text-lg">{validReps} valid reps</div>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          {isRecording && (
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
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
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
                onClick={startRecording}
                disabled={!cameraReady || !isModelReady}
                className="w-full bg-white text-black hover:bg-gray-100 text-xl py-6 rounded-full font-bold transition-all"
                size="lg"
              >
                <Camera className="h-6 w-6 mr-2" />
                {isModelReady ? "Start Challenge" : "Loading AI..."}
              </Button>
            </div>
          )}
          {(!cameraReady || !isModelReady) && !isRecording && !recordingComplete && (
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span className="text-white font-bold">{getLoadingMessage()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
