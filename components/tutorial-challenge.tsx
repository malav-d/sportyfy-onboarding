"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Trophy, Star, Play, CheckCircle, ArrowLeft, FileVideo, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api"

interface TutorialChallengeProps {
  onComplete: () => void
}

type TutorialStep =
  | "introduction"
  | "recording-options"
  | "movement-selection"
  | "camera-setup"
  | "recording"
  | "upload-instructions"
  | "upload-progress"
  | "submission-confirmation"
  | "celebration"

type RecordingMethod = "live" | "upload" | null

const movements = [
  {
    id: "jump",
    name: "JUMPING",
    description: "3 high jumps",
    detail: "No skills needed!",
    icon: "🦘",
    instructions: "Show your full body in frame and perform 3 good jumps",
    demo: "/placeholder.svg?height=200&width=200&text=Jump+Demo",
  },
  {
    id: "squat",
    name: "SQUATTING",
    description: "3 simple squats",
    detail: "Great for fitness!",
    icon: "🏋️",
    instructions: "Show your full body in frame and perform 3 good squats",
    demo: "/placeholder.svg?height=200&width=200&text=Squat+Demo",
  },
  {
    id: "dribble",
    name: "DRIBBLING",
    description: "5 ball bounces",
    detail: "Need a ball",
    icon: "⚽",
    instructions: "Show yourself dribbling a ball 5 times",
    demo: "/placeholder.svg?height=200&width=200&text=Dribble+Demo",
  },
]

export function TutorialChallenge({ onComplete }: TutorialChallengeProps) {
  const [currentStep, setCurrentStep] = useState<TutorialStep>("introduction")
  const [recordingMethod, setRecordingMethod] = useState<RecordingMethod>(null)
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [submissionNote, setSubmissionNote] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stepProgress = {
    introduction: 10,
    "recording-options": 20,
    "movement-selection": 30,
    "camera-setup": 40,
    recording: 60,
    "upload-instructions": 30,
    "upload-progress": 60,
    "submission-confirmation": 80,
    celebration: 100,
  }

  useEffect(() => {
    if (currentStep === "recording" && recordingMethod === "live") {
      initializeCamera()
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [currentStep, recordingMethod])

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setCurrentStep("upload-progress")

      // Simulate upload progress
      setIsUploading(true)
      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setIsUploading(false)
            setCurrentStep("submission-confirmation")
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const submitChallenge = async () => {
    setCurrentStep("celebration")

    try {
      await apiClient.updateTutorialProgress(4)
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

  const getSelectedMovement = () => movements.find((m) => m.id === selectedMovement)

  const renderIntroduction = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 max-w-3xl mx-auto"
    >
      {/* Hero Visual */}
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-primary via-purple-500 to-secondary rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
          <div className="text-5xl">🎯</div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Punchy Title */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-white leading-tight">
          Your First{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Win</span>
        </h1>
        <p className="text-xl text-gray-300">3 minutes to unlock your potential</p>
      </div>

      {/* Reward Preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-primary font-bold text-lg">100 XP</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-yellow-400 font-bold text-lg">First Badge</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-green-400 font-bold text-lg">Arena Access</div>
          </div>
        </div>
      </motion.div>

      {/* Social Proof */}
      <div className="flex items-center justify-center gap-4 text-gray-400">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <span className="text-sm">50K+ athletes started here</span>
      </div>

      {/* CTA */}
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} className="pt-4">
        <Button
          onClick={() => setCurrentStep("recording-options")}
          className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 text-xl px-12 py-8 h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          size="lg"
        >
          <Sparkles className="h-6 w-6 mr-3" />
          Let's Go! 🚀
        </Button>
      </motion.div>
    </motion.div>
  )

  const renderRecordingOptions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-4xl mx-auto"
    >
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-white">How will you show us?</h2>
        <p className="text-gray-400">Pick your style</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Live Recording */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className={`cursor-pointer transition-all h-full border-2 ${
              recordingMethod === "live"
                ? "border-primary bg-primary/20 shadow-2xl shadow-primary/25"
                : "border-gray-600 bg-gray-800/30 hover:border-primary/50"
            }`}
            onClick={() => setRecordingMethod("live")}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">📱</div>
              <h3 className="text-2xl font-bold text-white">RECORD NOW</h3>
              <p className="text-gray-300">Use your camera</p>
              {recordingMethod === "live" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className="bg-primary text-white text-sm px-4 py-1">✓ Selected</Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Option */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className={`cursor-pointer transition-all h-full border-2 ${
              recordingMethod === "upload"
                ? "border-primary bg-primary/20 shadow-2xl shadow-primary/25"
                : "border-gray-600 bg-gray-800/30 hover:border-primary/50"
            }`}
            onClick={() => setRecordingMethod("upload")}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">📤</div>
              <h3 className="text-2xl font-bold text-white">UPLOAD</h3>
              <p className="text-gray-300">From your gallery</p>
              {recordingMethod === "upload" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className="bg-primary text-white text-sm px-4 py-1">✓ Selected</Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {recordingMethod && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
          <Button
            onClick={() => {
              if (recordingMethod === "live") {
                setCurrentStep("movement-selection")
              } else {
                setCurrentStep("upload-instructions")
              }
            }}
            className="bg-primary text-white hover:opacity-90 text-lg px-8 py-4 rounded-xl"
            size="lg"
          >
            Continue →
          </Button>
        </motion.div>
      )}
    </motion.div>
  )

  const renderMovementSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-5xl mx-auto"
    >
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-white">Choose Your Move</h2>
        <p className="text-gray-400">What feels easy right now?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {movements.map((movement, index) => (
          <motion.div
            key={movement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`cursor-pointer transition-all border-2 ${
                selectedMovement === movement.id
                  ? "border-primary bg-primary/20 shadow-2xl shadow-primary/25"
                  : "border-gray-600 bg-gray-800/30 hover:border-primary/50"
              }`}
              onClick={() => setSelectedMovement(movement.id)}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">{movement.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{movement.name}</h3>
                  <p className="text-primary font-medium">{movement.description}</p>
                  <p className="text-gray-400 text-sm">{movement.detail}</p>
                </div>
                {selectedMovement === movement.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Badge className="bg-primary text-white">✓ Let's do this!</Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedMovement && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
          <Button
            onClick={() => setCurrentStep("camera-setup")}
            className="bg-primary text-white hover:opacity-90 text-lg px-8 py-4 rounded-xl"
            size="lg"
          >
            Ready to {getSelectedMovement()?.name.toLowerCase()}! →
          </Button>
        </motion.div>
      )}
    </motion.div>
  )

  const renderCameraSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-3xl mx-auto"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">🎬 Ready to Record Your {getSelectedMovement()?.name}?</h2>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 space-y-6">
          <div className="text-left space-y-4">
            <h3 className="text-lg font-bold text-white">📋 Quick Setup Checklist:</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Find a space with good lighting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Make sure you have room to move</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Hold your phone steady (or prop it up)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>You'll record for just 10 seconds</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-left space-y-4">
            <h3 className="text-lg font-bold text-white">🎯 What We're Looking For:</h3>
            <div className="space-y-2 text-gray-300">
              <p>• {getSelectedMovement()?.instructions}</p>
              <p>• Don't worry about being perfect!</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 text-sm">⏱️ You'll get a 3-second countdown before recording</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button
          onClick={() => setCurrentStep("recording")}
          className="bg-primary text-white hover:opacity-90"
          size="lg"
        >
          <Camera className="h-5 w-5 mr-2" />
          Open Camera & Start Recording
        </Button>

        <Button
          variant="ghost"
          onClick={() => setCurrentStep("movement-selection")}
          className="text-gray-400 hover:text-white"
        >
          💭 Changed your mind? Choose Different Movement
        </Button>
      </div>
    </motion.div>
  )

  const renderRecording = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
      <div className="relative mx-auto w-80 h-60 bg-gray-900 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
          {!isRecording && countdown === 0 && !recordingComplete && (
            <div className="bg-black/50 rounded-lg p-4">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-white text-sm">Ready for {getSelectedMovement()?.description}? You've got this!</p>
            </div>
          )}
        </div>

        {countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary animate-pulse">{countdown}</div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            RECORDING
          </div>
        )}

        {isRecording && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
            <p className="text-sm">Great! Keep going!</p>
          </div>
        )}
      </div>

      {recordingComplete ? (
        <div className="space-y-4">
          <div className="text-green-400 font-bold">✓ Recording Complete!</div>
          <Button
            onClick={() => setCurrentStep("submission-confirmation")}
            className="bg-primary text-white hover:opacity-90"
            size="lg"
          >
            Continue to Submission
          </Button>
        </div>
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
  )

  const renderUploadInstructions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-3xl mx-auto"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">📤 Upload Your Movement Video</h2>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 space-y-6">
          <div className="text-left space-y-4">
            <h3 className="text-lg font-bold text-white">📋 What We're Looking For:</h3>
            <div className="space-y-2 text-gray-300">
              <p>• Any athletic movement (jump, squat, kick, etc.)</p>
              <p>• You visible in the video doing the movement</p>
              <p>• 5-30 seconds long</p>
              <p>• Decent lighting (we can see you clearly)</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-left space-y-4">
            <h3 className="text-lg font-bold text-white">📱 Video Requirements:</h3>
            <div className="space-y-2 text-gray-300">
              <p>• Format: MP4, MOV, or AVI</p>
              <p>• Size: Under 100MB</p>
              <p>• Quality: Phone camera quality is perfect!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary text-white hover:opacity-90"
          size="lg"
        >
          <FileVideo className="h-5 w-5 mr-2" />
          Choose Video from Gallery
        </Button>

        <div className="text-gray-400">
          <p className="text-sm">💡 Don't have a video? No problem!</p>
          <Button
            variant="ghost"
            onClick={() => setCurrentStep("recording-options")}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back to Record Live
          </Button>
        </div>
      </div>
    </motion.div>
  )

  const renderUploadProgress = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">📤 Uploading Your Video</h2>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 space-y-6">
          <div className="w-32 h-32 bg-gray-700 rounded-lg mx-auto flex items-center justify-center">
            <FileVideo className="h-16 w-16 text-gray-400" />
          </div>

          <div className="space-y-3">
            <p className="text-white font-medium">{uploadedFile?.name}</p>
            <Progress value={uploadProgress} className="h-3" />
            <p className="text-gray-400">Uploading... {uploadProgress}%</p>
          </div>

          {uploadProgress < 100 && (
            <div className="text-sm text-gray-400">
              <p>✓ Video looks great! Processing...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderSubmissionConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">🎬 Your Video is Ready!</h2>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 space-y-6">
          <div className="w-48 h-32 bg-gray-700 rounded-lg mx-auto flex items-center justify-center">
            <Play className="h-12 w-12 text-white" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white font-medium block mb-2">📝 Add a Quick Note (Optional):</label>
              <Textarea
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                placeholder="My first challenge attempt!"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="text-white font-bold mb-3">🏆 You're About to Earn:</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">XP Points</span>
                  <span className="text-primary font-bold">+100 XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Badge</span>
                  <span className="text-yellow-400">"First Steps" 🏆</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Access</span>
                  <span className="text-green-400">Real Challenges</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button onClick={submitChallenge} className="bg-primary text-white hover:opacity-90" size="lg">
          <Sparkles className="h-5 w-5 mr-2" />
          Submit & Earn Rewards!
        </Button>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            🔄 Record Again
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            📤 Upload Different
          </Button>
        </div>
      </div>
    </motion.div>
  )

  const renderCelebration = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
      {/* Confetti Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative"
      >
        <div className="w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-16 w-16 text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 -right-4"
        >
          <Star className="h-12 w-12 text-yellow-400 fill-current" />
        </motion.div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-white">Excellent Work!</h2>
        <p className="text-gray-300 max-w-md mx-auto text-lg">
          You've completed your first challenge! Your {getSelectedMovement()?.name.toLowerCase()} form shows great
          potential. Keep practicing to improve your technique.
        </p>
      </div>

      {/* XP Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto"
      >
        <h3 className="text-xl font-bold text-white mb-6">🎉 Rewards Earned</h3>
        <div className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-between"
          >
            <span className="text-gray-300">XP Earned</span>
            <span className="text-primary font-bold text-xl">+100 XP</span>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-between"
          >
            <span className="text-gray-300">Badge Unlocked</span>
            <span className="text-yellow-400 text-lg">🏆 First Steps</span>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex items-center justify-between"
          >
            <span className="text-gray-300">Level</span>
            <span className="text-white font-bold">Level 1</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
        <Button
          onClick={completeTutorial}
          className="bg-primary text-white hover:opacity-90 text-lg px-8 py-6 h-auto"
          size="lg"
        >
          <Trophy className="h-5 w-5 mr-2" />
          Enter the Arena
        </Button>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Getting in the Game</h1>
            <div className="text-sm text-gray-400">
              {currentStep === "introduction" && "Welcome"}
              {currentStep === "recording-options" && "Step 1 of 4"}
              {(currentStep === "movement-selection" ||
                currentStep === "camera-setup" ||
                currentStep === "recording") &&
                "Step 2 of 4"}
              {(currentStep === "upload-instructions" || currentStep === "upload-progress") && "Step 2 of 4"}
              {currentStep === "submission-confirmation" && "Step 3 of 4"}
              {currentStep === "celebration" && "Complete!"}
            </div>
          </div>
          <Progress value={stepProgress[currentStep]} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-secondary rounded-full animate-ping" />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />

        {/* Main Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-full p-6">
          <div className="max-w-6xl mx-auto w-full">
            {/* Progress Dots */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {[
                  "introduction",
                  "recording-options",
                  "movement-selection",
                  "submission-confirmation",
                  "celebration",
                ].map((step, index) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      Object.keys(stepProgress).indexOf(currentStep) >= index ? "bg-primary scale-125" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content with Enhanced Animation */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur opacity-30" />

              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                <AnimatePresence mode="wait">
                  {currentStep === "introduction" && renderIntroduction()}
                  {currentStep === "recording-options" && renderRecordingOptions()}
                  {currentStep === "movement-selection" && renderMovementSelection()}
                  {currentStep === "camera-setup" && renderCameraSetup()}
                  {currentStep === "recording" && renderRecording()}
                  {currentStep === "upload-instructions" && renderUploadInstructions()}
                  {currentStep === "upload-progress" && renderUploadProgress()}
                  {currentStep === "submission-confirmation" && renderSubmissionConfirmation()}
                  {currentStep === "celebration" && renderCelebration()}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Motivational Footer */}
            {currentStep !== "celebration" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>47,832 athletes completed this</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span>Average time: 3 minutes</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
