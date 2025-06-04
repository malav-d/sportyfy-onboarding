"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { apiClient } from "@/lib/api"

interface TutorialChallengeProps {
  onComplete: () => void
}

type TutorialStep = "camera" | "movement" | "submission" | "feedback"

const movements = [
  {
    id: "jump",
    name: "Jump",
    description: "Simple vertical jump",
    icon: "🦘",
    demo: "/placeholder.svg?height=200&width=200&text=Jump+Demo",
  },
  {
    id: "dribble",
    name: "Ball Dribble",
    description: "Basketball dribbling motion",
    icon: "⛹️",
    demo: "/placeholder.svg?height=200&width=200&text=Dribble+Demo",
  },
  {
    id: "squat",
    name: "Squat",
    description: "Basic squat movement",
    icon: "🏋️",
    demo: "/placeholder.svg?height=200&width=200&text=Squat+Demo",
  },
]

export function TutorialChallenge({ onComplete }: TutorialChallengeProps) {
  const [currentStep, setCurrentStep] = useState<TutorialStep>("camera")
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stepProgress = {
    camera: 25,
    movement: 50,
    submission: 75,
    feedback: 100,
  }

  useEffect(() => {
    if (currentStep === "camera") {
      initializeCamera()
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [currentStep])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access failed:", error)
    }
  }

  const startRecording = async () => {
    if (!selectedMovement) return

    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsRecording(true)

          // Record for 10 seconds
          setTimeout(() => {
            setIsRecording(false)
            setRecordingComplete(true)
          }, 10000)

          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const submitVideo = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setCurrentStep("feedback")
          return 100
        }
        return prev + 10
      })
    }, 200)

    try {
      await apiClient.updateTutorialProgress(3)
    } catch (error) {
      console.error("Failed to update tutorial progress:", error)
    }
  }

  const completeTutorial = async () => {
    try {
      await apiClient.completeTutorial()
      onComplete()
    } catch (error) {
      console.error("Failed to complete tutorial:", error)
      onComplete() // Continue anyway
    }
  }

  const renderCameraStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
      <div className="relative mx-auto w-80 h-60 bg-gray-900 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
          <div className="bg-black/50 rounded-lg p-4">
            <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-white text-sm">Position yourself in frame</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Camera Setup</h2>
        <p className="text-gray-300">
          Position your camera so you're clearly visible in the frame. Make sure you have enough space to move around.
        </p>
        <Button onClick={() => setCurrentStep("movement")} className="bg-primary text-white hover:opacity-90" size="lg">
          Camera Looks Good!
        </Button>
      </div>
    </motion.div>
  )

  const renderMovementStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-white">Choose Your Movement</h2>
      <p className="text-gray-300">Select a movement to perform for your first challenge</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {movements.map((movement) => (
          <motion.div
            key={movement.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMovement(movement.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMovement === movement.id
                ? "border-primary bg-primary/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
          >
            <div className="text-4xl mb-3">{movement.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{movement.name}</h3>
            <p className="text-gray-400 text-sm">{movement.description}</p>
          </motion.div>
        ))}
      </div>

      {selectedMovement && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {countdown > 0 && <div className="text-6xl font-bold text-primary">{countdown}</div>}

          {isRecording && (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-500 animate-pulse">RECORDING</div>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto"></div>
            </div>
          )}

          {recordingComplete ? (
            <Button
              onClick={() => setCurrentStep("submission")}
              className="bg-primary text-white hover:opacity-90"
              size="lg"
            >
              Continue to Submission
            </Button>
          ) : (
            <Button
              onClick={startRecording}
              disabled={countdown > 0 || isRecording}
              className="bg-primary text-white hover:opacity-90"
              size="lg"
            >
              {countdown > 0 ? "Get Ready..." : isRecording ? "Recording..." : "Start Recording"}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )

  const renderSubmissionStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-white">Submit Your Video</h2>
      <p className="text-gray-300">Great job! Now let's submit your video to get feedback and earn your first XP.</p>

      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Ready to Submit</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your {movements.find((m) => m.id === selectedMovement)?.name} video is ready for submission
        </p>

        {isUploading ? (
          <div className="space-y-3">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-400">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <Button onClick={submitVideo} className="bg-primary text-white hover:opacity-90 w-full" size="lg">
            Submit Video
          </Button>
        )}
      </div>
    </motion.div>
  )

  const renderFeedbackStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-2 -right-2"
        >
          <Star className="h-8 w-8 text-yellow-400 fill-current" />
        </motion.div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Excellent Work!</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          You've completed your first challenge! Your {movements.find((m) => m.id === selectedMovement)?.name} form
          shows great potential. Keep practicing to improve your technique.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Rewards Earned</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">XP Earned</span>
            <span className="text-primary font-bold">+100 XP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Badge Unlocked</span>
            <span className="text-yellow-400">🏆 First Steps</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Level</span>
            <span className="text-white font-bold">Level 1</span>
          </div>
        </div>
      </div>

      <Button onClick={completeTutorial} className="bg-primary text-white hover:opacity-90" size="lg">
        Enter the Arena
      </Button>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Getting in the Game</h1>
            <div className="text-sm text-gray-400">Step {Object.keys(stepProgress).indexOf(currentStep) + 1} of 4</div>
          </div>
          <Progress value={stepProgress[currentStep]} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {currentStep === "camera" && renderCameraStep()}
            {currentStep === "movement" && renderMovementStep()}
            {currentStep === "submission" && renderSubmissionStep()}
            {currentStep === "feedback" && renderFeedbackStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}