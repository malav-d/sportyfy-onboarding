"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, Clock, Trophy, Target, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { EnhancedVideoCapture } from "./enhanced-video-capture"

interface TutorialChallengeProps {
  onComplete: () => void
}

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

type OnboardingStep = "welcome" | "prep" | "recording" | "feedback" | "failed"

export function TutorialChallenge({ onComplete }: TutorialChallengeProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [prepFrame, setPrepFrame] = useState(0)
  const [repCount, setRepCount] = useState(0)
  const [invalidCount, setInvalidCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(true)

  // Calculate success threshold from requirements
  const getSuccessThreshold = () => {
    return challengeData?.requirements.min_valid_reps || 3
  }

  // Check if challenge was successful
  const isSuccessful = () => {
    return repCount >= getSuccessThreshold()
  }

  // Fetch tutorial challenge data on component mount
  useEffect(() => {
    fetchTutorialChallenge()
  }, [])

  const fetchTutorialChallenge = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching tutorial challenge...")
      const response = await apiClient.getTutorialChallenge()

      console.log("API Response:", response)
      console.log("Response data:", response.data)

      if (response.error) {
        throw new Error(response.error)
      }

      if (!response.data) {
        throw new Error("No data received from API")
      }

      // Check if response has the expected structure
      if (!response.data.data || !response.data.data.attributes) {
        console.error("Unexpected response structure:", response.data)
        throw new Error(
          `Invalid response structure. Expected data.data.attributes, got: ${JSON.stringify(response.data)}`,
        )
      }

      const attributes = response.data.data.attributes
      console.log("Challenge attributes:", attributes)

      setChallengeData({
        id: response.data.data.id,
        ...attributes,
      })
    } catch (error) {
      console.error("Failed to fetch tutorial challenge:", error)
      setError(error instanceof Error ? error.message : "Failed to load challenge. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setToastVisible(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleContinue = async () => {
    // Don't make API call - just complete tutorial
    onComplete()
  }

  const handleTryAgain = () => {
    // Reset state and go back to recording
    setRepCount(0)
    setInvalidCount(0)
    setShowToast(false)
    setToastVisible(true)
    setCurrentStep("recording")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center font-mono">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading your challenge...</p>
      </div>
    )
  }

  // Error state
  if (error || !challengeData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center font-mono">
        <div className="text-red-400 mb-4 text-sm max-w-md">
          <div className="font-bold mb-2">Error loading challenge:</div>
          <div className="text-xs bg-red-900/20 p-3 rounded border border-red-800">
            {error || "Challenge data not available"}
          </div>
        </div>
        <Button onClick={fetchTutorialChallenge} className="bg-white text-black hover:bg-gray-100 mb-4">
          Retry
        </Button>
        <button onClick={onComplete} className="text-gray-400 text-sm">
          Skip Tutorial
        </button>
      </div>
    )
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
            <span className="text-2xl">{challengeData.title}</span>
          </h1>
          <p className="text-lg text-gray-300">{challengeData.description}</p>
        </div>

        {/* Challenge Stats */}
        <div className="bg-gray-900 p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Target Reps</span>
            <span className="text-xl font-bold text-white">{getSuccessThreshold()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Duration</span>
            <span className="text-xl font-bold text-white">{challengeData.duration_limit}s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Difficulty</span>
            <span className="text-xl font-bold text-white">{challengeData.difficulty.label}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Type</span>
            <span className="text-xl font-bold text-white">{challengeData.challenge_type.label}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Reward</span>
            <span className="text-xl font-bold text-white">+{challengeData.xp_reward} XP</span>
          </div>
        </div>

        {/* Primary CTA */}
        <Button
          onClick={() => setCurrentStep("prep")}
          className="w-full bg-white text-black hover:bg-gray-100 text-lg py-6 rounded-full font-bold shadow-lg"
          size="lg"
        >
          Start Challenge
        </Button>
      </motion.div>
    </div>
  )

  // Screen 2: Swipeable Prep Cards
  const renderPrepScreen = () => {
    const frames = [
      // Frame 1: Challenge Overview
      {
        content: (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto">
                <div className="text-4xl font-bold text-white">{getSuccessThreshold()}</div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-black">{challengeData.title}</h2>
                <p className="text-gray-600 text-lg">{challengeData.description}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Target Reps</span>
                <span className="text-xl font-bold text-black">{getSuccessThreshold()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Duration</span>
                <span className="text-xl font-bold text-black">{challengeData.duration_limit}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Difficulty</span>
                <span className="text-xl font-bold text-black">{challengeData.difficulty.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Scoring</span>
                <span className="text-xl font-bold text-black">{challengeData.scoring_method.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">XP Reward</span>
                <span className="text-xl font-bold text-black">+{challengeData.xp_reward}</span>
              </div>
            </div>
          </div>
        ),
      },
      // Frame 2: Setup Requirements
      {
        content: (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black">Setup Requirements</h2>
              <p className="text-gray-600">{challengeData.requirements.camera_pose.label}</p>
            </div>

            <div className="space-y-6">
              {challengeData.requirements.environment_tips.map((tip, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-lg text-black font-bold block">{tip.label}</span>
                  </div>
                </div>
              ))}

              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <span className="text-lg text-black font-bold block">Min Valid Reps</span>
                  <span className="text-sm text-gray-600">{challengeData.requirements.min_valid_reps} required</span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      // Frame 3: Ready to Start
      {
        content: (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-black">Ready to Start</h2>
                <p className="text-gray-600">Recording will begin automatically</p>
              </div>
              <div className="text-8xl font-bold text-black tracking-tight">
                <Clock className="h-20 w-20 mx-auto" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black">Challenge Details:</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Exercise: {challengeData.verification_rules.pose}</p>
                <p className="text-sm text-gray-700">Duration: {challengeData.duration_limit} seconds</p>
                <p className="text-sm text-gray-700">Target: {getSuccessThreshold()} reps</p>
                <p className="text-sm text-gray-700">Scoring: {challengeData.scoring_method.label}</p>
                <p className="text-sm text-gray-700">Camera: {challengeData.requirements.camera_pose.label}</p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("recording")}
              className="w-full bg-black text-white hover:bg-gray-800 text-xl py-6 rounded-full font-bold transform hover:scale-105 transition-transform"
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

  // Screen 3: Recording Screen
  const renderRecordingScreen = () => {
    return (
      <EnhancedVideoCapture
        challengeData={challengeData}
        onComplete={(result) => {
          console.log("Recording completed with result:", result)
          setRepCount(result.validReps)
          setInvalidCount(result.invalidReps)

          // Check if challenge was successful
          if (result.validReps >= getSuccessThreshold()) {
            setCurrentStep("feedback")
            setShowToast(true)
          } else {
            setCurrentStep("failed")
          }
        }}
        onCancel={() => {
          setCurrentStep("prep")
          setPrepFrame(2)
        }}
      />
    )
  }

  // Screen 4: Success Feedback Screen
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

        {/* Animated Toast */}
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
                  <div className="font-bold text-lg">Challenge Complete!</div>
                  <div className="text-sm text-gray-300">+{challengeData.xp_reward} XP earned</div>
                </div>
                <div className="bg-white text-black px-3 py-1 rounded-full font-bold text-sm">
                  +{challengeData.xp_reward} XP
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-sm space-y-8 relative z-5"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto relative"
          >
            <Trophy className="h-12 w-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-black">Challenge Complete!</h1>
            <p className="text-lg text-gray-600">You've mastered the {challengeData.title}!</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-gray-100 p-6 rounded-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">{challengeData.metrics_spec.primary.label}</span>
              <span className="text-2xl font-bold text-black">
                {repCount}/{getSuccessThreshold()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">XP Earned</span>
              <span className="text-2xl font-bold text-black">+{challengeData.xp_reward}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Points</span>
              <span className="text-2xl font-bold text-black">+{challengeData.points_reward}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Difficulty</span>
              <span className="text-2xl font-bold text-black">{challengeData.difficulty.label}</span>
            </div>
            {challengeData.badge_reward && (
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Badge Earned</span>
                <span className="text-sm font-bold text-black capitalize">
                  {challengeData.badge_reward.replace("_", " ")}
                </span>
              </div>
            )}
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

  // Screen 5: Failed Challenge Screen
  const renderFailedScreen = () => {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center font-mono relative overflow-hidden">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Failed Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto relative"
          >
            <X className="h-12 w-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-black">Challenge Failed</h1>
            <p className="text-lg text-gray-600">You need {getSuccessThreshold()} valid reps to pass</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-gray-100 p-6 rounded-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Valid Reps</span>
              <span className="text-2xl font-bold text-red-500">
                {repCount}/{getSuccessThreshold()}
              </span>
            </div>
            {invalidCount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Invalid Reps</span>
                <span className="text-2xl font-bold text-orange-500">{invalidCount}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Required</span>
              <span className="text-2xl font-bold text-black">{getSuccessThreshold()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Difficulty</span>
              <span className="text-2xl font-bold text-black">{challengeData.difficulty.label}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-4"
          >
            <Button
              onClick={handleTryAgain}
              className="w-full bg-black text-white hover:bg-gray-800 text-xl py-6 rounded-full font-bold transform hover:scale-105 transition-transform"
              size="lg"
            >
              <RotateCcw className="h-6 w-6 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={handleContinue}
              variant="outline"
              className="w-full border-black text-black hover:bg-gray-100 text-lg py-6 rounded-full font-bold"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          </motion.div>

          {/* Encouragement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-sm text-gray-500"
          >
            <p>💪 Keep practicing! You'll get it next time.</p>
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

        {currentStep === "failed" && (
          <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {renderFailedScreen()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
