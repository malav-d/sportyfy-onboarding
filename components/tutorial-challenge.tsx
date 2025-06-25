"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"

interface TutorialChallengeProps {
  onComplete: () => void
}

type OnboardingStep = "welcome" | "prep" | "recording" | "feedback"

export function TutorialChallenge({ onComplete }: TutorialChallengeProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [prepFrame, setPrepFrame] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [repCount, setRepCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(true)

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setToastVisible(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (currentStep === "recording") {
      initializeCamera()
    }
  }, [currentStep])

  const initializeCamera = async () => {
    setCameraLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        try {
          await videoRef.current.play()
        } catch (playError) {
          console.log("Video play failed:", playError)
        }
      }
    } catch (error) {
      console.error("Camera access failed:", error)
    } finally {
      setCameraLoading(false)
    }
  }

  const startRecording = async () => {
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsRecording(true)
          simulateSquatDetection()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const simulateSquatDetection = () => {
    let count = 0
    const squatInterval = setInterval(() => {
      count++
      setRepCount(count)

      if (count >= 5) {
        clearInterval(squatInterval)
        setTimeout(() => {
          setIsRecording(false)
          completeRecording()
        }, 1000)
      }
    }, 1500)
  }

  const completeRecording = () => {
    setCurrentStep("feedback")
    setShowToast(true)

    // Clean up camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const handleContinue = async () => {
    try {
      await apiClient.completeTutorial()
      onComplete()
    } catch (error) {
      console.error("Failed to complete tutorial:", error)
      onComplete()
    }
  }

  // Screen 1: Welcome & Hook
  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center font-mono">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Welcome to Sportyfy!
            <br />
            <span className="text-2xl">Your First Win: 5 Air Squats</span>
          </h1>
          <p className="text-lg text-gray-300">Build strength, nail your form, earn XP.</p>
        </div>

        {/* Primary CTA */}
        <Button
          onClick={() => setCurrentStep("prep")}
          className="w-full bg-white text-black hover:bg-gray-100 text-lg py-6 rounded-full font-bold shadow-lg"
          size="lg"
        >
          Start My First Challenge
        </Button>
      </motion.div>
    </div>
  )

  // Screen 2: Swipeable Prep Cards
  const renderPrepScreen = () => {
    const frames = [
      // Frame 1: Challenge Overview - Enhanced with more details
      {
        content: (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto">
                <div className="text-4xl font-bold text-white">5</div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-black">Air Squats</h2>
                <p className="text-gray-600 text-lg">Perfect your form, build lower body strength</p>
              </div>
            </div>

            {/* Added details for symmetry */}
            <div className="bg-gray-100 p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Target Reps</span>
                <span className="text-xl font-bold text-black">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Difficulty</span>
                <span className="text-xl font-bold text-black">Beginner</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Time</span>
                <span className="text-xl font-bold text-black">~30s</span>
              </div>
            </div>
          </div>
        ),
      },
      // Frame 2: Setup Checklist - Enhanced layout
      {
        content: (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black">Quick Setup</h2>
              <p className="text-gray-600">Get your space ready for recording</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <span className="text-lg text-black font-bold block">Clear Space</span>
                  <span className="text-sm text-gray-600">2-3 feet around you</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <span className="text-lg text-black font-bold block">Camera Position</span>
                  <span className="text-sm text-gray-600">Hip height, side view</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <span className="text-lg text-black font-bold block">Ready to Move</span>
                  <span className="text-sm text-gray-600">Comfortable clothing</span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      // Frame 3: Countdown - Enhanced with more context
      {
        content: (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-black">Ready to Start</h2>
                <p className="text-gray-600">Recording will begin automatically</p>
              </div>
              <div className="text-8xl font-bold text-black tracking-tight">3-2-1</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black">Quick Tips:</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Keep your back straight</p>
                <p className="text-sm text-gray-700">Lower until thighs are parallel</p>
                <p className="text-sm text-gray-700">Push through your heels</p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("recording")}
              className="w-full bg-black text-white hover:bg-gray-800 text-xl py-6 rounded-full font-bold"
              size="lg"
            >
              Start Recording
            </Button>
          </div>
        ),
      },
    ]

    return (
      <div className="min-h-screen bg-white flex flex-col font-mono">
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 pt-8 pb-4">
          {frames.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === prepFrame ? "bg-black w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Swipeable Content */}
        <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={prepFrame}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm"
            >
              {frames[prepFrame].content}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {prepFrame > 0 && (
            <button
              onClick={() => setPrepFrame(prepFrame - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}

          {prepFrame < frames.length - 1 && (
            <button
              onClick={() => setPrepFrame(prepFrame + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="p-6 text-center">
          <button onClick={() => setCurrentStep("recording")} className="text-gray-500 text-sm font-medium">
            Skip setup
          </button>
        </div>
      </div>
    )
  }

  // Screen 3: In-Context Recording Overlay
  const renderRecordingScreen = () => {
    return (
      <div className="min-h-screen bg-black relative font-mono">
        {/* Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error)
            }
          }}
        />
        {cameraLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-white text-xl font-bold">Initializing camera...</div>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/20">
          {/* Top Bar */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <button
              onClick={() => {
                setCurrentStep("prep")
                setPrepFrame(2)
              }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-bold">Air Squats</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {countdown > 0 && (
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-9xl font-bold text-white"
              >
                {countdown}
              </motion.div>
            )}

            {isRecording && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/90 backdrop-blur-sm text-black px-8 py-6 rounded-2xl text-center"
              >
                <div className="text-5xl font-bold">{repCount}</div>
                <div className="text-lg font-bold">/ 5 reps</div>
              </motion.div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-6 right-6">
            {!isRecording && countdown === 0 && (
              <div className="space-y-4">
                <Button
                  onClick={startRecording}
                  className="w-full bg-white text-black hover:bg-gray-100 text-xl py-6 rounded-full font-bold"
                  size="lg"
                >
                  Start Recording
                </Button>
                <div className="text-center">
                  <button onClick={() => setCurrentStep("prep")} className="text-white/70 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isRecording && (
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-bold">Recording...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Screen 4: Instant Feedback & Dashboard Redirect
  const renderFeedbackScreen = () => {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center font-mono relative overflow-hidden">
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -100,
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== "undefined" ? window.innerHeight : 800) + 100,
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 3,
                ease: "easeOut",
              }}
              className={`absolute w-3 h-3 rounded-full ${
                i % 3 === 0 ? "bg-black" : i % 3 === 1 ? "bg-gray-600" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Firework Bursts */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`firework-${i}`}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              ease: "easeOut",
            }}
            className="absolute w-2 h-2 bg-black rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + (i % 2) * 20}%`,
            }}
          />
        ))}

        {/* Animated Toast with Auto-Hide */}
        <AnimatePresence>
          {showToast && toastVisible && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute top-8 left-6 right-6 bg-black text-white p-6 rounded-2xl shadow-2xl z-10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-black" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg">Nice work—5 squats complete!</div>
                  <div className="text-sm text-gray-300">+50 XP earned</div>
                </div>
                <div className="bg-white text-black px-3 py-1 rounded-full font-bold text-sm">+50 XP</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content with Enhanced Animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-sm space-y-8 relative z-5"
        >
          {/* Success Icon with Pulse Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto relative"
          >
            <Check className="h-12 w-12 text-white" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute inset-0 bg-black rounded-full opacity-20"
            />
          </motion.div>

          {/* Title with Bounce Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-black">Challenge Complete!</h1>
            <p className="text-lg text-gray-600">You've earned your first XP and unlocked the arena.</p>
          </motion.div>

          {/* Stats with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-gray-100 p-6 rounded-2xl space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="flex justify-between items-center"
            >
              <span className="text-black font-bold">Reps Completed</span>
              <span className="text-2xl font-bold text-black">5/5</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
              className="flex justify-between items-center"
            >
              <span className="text-black font-bold">XP Earned</span>
              <span className="text-2xl font-bold text-black">+50</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="flex justify-between items-center"
            >
              <span className="text-black font-bold">Streak</span>
              <span className="text-2xl font-bold text-black">1 day</span>
            </motion.div>
          </motion.div>

          {/* Continue Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
            <Button
              onClick={handleContinue}
              className="w-full bg-black text-white hover:bg-gray-800 text-xl py-6 rounded-full font-bold transform hover:scale-105 transition-transform"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="font-mono antialiased">
      <AnimatePresence mode="wait">
        {currentStep === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderWelcomeScreen()}
          </motion.div>
        )}

        {currentStep === "prep" && (
          <motion.div
            key="prep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderPrepScreen()}
          </motion.div>
        )}

        {currentStep === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderRecordingScreen()}
          </motion.div>
        )}

        {currentStep === "feedback" && (
          <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {renderFeedbackScreen()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
