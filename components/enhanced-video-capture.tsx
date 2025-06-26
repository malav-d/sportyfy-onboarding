"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { X, Target, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMediaPipePoseDetector } from "@/hooks/useMediaPipePoseDetector"
import { useCountdownTimer } from "@/hooks/useCountdownTimer"

interface ChallengeData {
  title: string
  duration_limit: number
  requirements: {
    min_valid_reps: number
  }
}

interface RecordingResult {
  validReps: number
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

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { startDetector, stopDetector, validReps, repState, debugData, isModelReady } = useMediaPipePoseDetector()

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    stopDetector()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    onComplete({ validReps })
  }, [onComplete, validReps, stopDetector])

  const { start: startTimer } = useCountdownTimer({
    duration: challengeData.duration_limit,
    onExpire: stopRecording,
  })

  useEffect(() => {
    initializeCamera()
    return () => {
      stopDetector()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [stopDetector])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setCameraReady(true)
      }
    } catch (err) {
      setCameraError("Could not access camera. Please check permissions.")
    }
  }

  const startRecordingFlow = () => {
    if (!cameraReady || !videoRef.current || !canvasRef.current || !isModelReady) return
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsRecording(true)
          startDetector(videoRef.current!, canvasRef.current!)
          startTimer()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black relative font-mono">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

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
        </div>
      )}

      <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="flex flex-col items-end space-y-2">
            <Badge className="bg-green-500/90 text-white px-3 py-1 text-sm font-bold">
              <Target className="h-4 w-4 mr-1" />
              {validReps} / {challengeData.requirements.min_valid_reps}
            </Badge>
            <Badge className="bg-purple-500/70 text-white px-2 py-1 text-xs">Pose Detection</Badge>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
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
        </div>

        <div className="flex justify-center">
          {!isRecording && countdown === 0 && (
            <Button
              onClick={startRecordingFlow}
              disabled={!cameraReady || !isModelReady}
              className="w-full max-w-xs bg-white text-black text-xl py-6 rounded-full font-bold"
            >
              <Camera className="h-6 w-6 mr-2" />
              {isModelReady ? "Start" : "Loading AI..."}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
