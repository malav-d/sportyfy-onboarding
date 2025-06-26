"use client"

import { useState } from "react"
import { EnhancedVideoCapture } from "./enhanced-video-capture"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Repeat } from "lucide-react"

// Mock challenge data for the tutorial
const tutorialChallengeData = {
  title: "First Squats Challenge",
  duration_limit: 60, // 60 seconds
  scoring_method: { key: "first_n_valid_reps" as const },
  requirements: {
    min_valid_reps: 5,
    track_invalid_reps: false,
  },
  metrics_spec: {
    primary: { label: "Reps" },
  },
}

interface RecordingResult {
  validReps: number
}

export function TutorialChallenge() {
  const [step, setStep] = useState<"prep" | "recording" | "results">("prep")
  const [lastResult, setLastResult] = useState<RecordingResult | null>(null)

  const handleStart = () => {
    setStep("recording")
  }

  const handleComplete = (result: RecordingResult) => {
    setLastResult(result)
    setStep("results")
  }

  const handleCancel = () => {
    setStep("prep")
  }

  const handleRetry = () => {
    setLastResult(null)
    setStep("prep")
  }

  if (step === "recording") {
    return (
      <EnhancedVideoCapture challengeData={tutorialChallengeData} onComplete={handleComplete} onCancel={handleCancel} />
    )
  }

  if (step === "results" && lastResult) {
    const success = lastResult.validReps >= tutorialChallengeData.requirements.min_valid_reps
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <Card className="w-full max-w-md bg-gray-800 border-purple-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className={`h-16 w-16 ${success ? "text-green-500" : "text-yellow-500"}`} />
            </div>
            <CardTitle className="text-2xl">{success ? "Challenge Complete!" : "Good Effort!"}</CardTitle>
            <CardDescription>{success ? "You've mastered the basics." : "Let's give it another shot."}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-5xl font-bold">
              {lastResult.validReps}{" "}
              <span className="text-xl">/ {tutorialChallengeData.requirements.min_valid_reps} Reps</span>
            </div>
            <Button onClick={handleRetry} className="w-full bg-purple-600 hover:bg-purple-700">
              <Repeat className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-purple-500">
        <CardHeader>
          <CardTitle className="text-2xl">Tutorial: Your First Challenge</CardTitle>
          <CardDescription>Let's calibrate the AI by performing 5 good squats.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Instructions:</h3>
            <ul className="list-disc list-inside text-sm text-gray-400">
              <li>Find a well-lit area.</li>
              <li>Ensure your full body is visible.</li>
              <li>Perform 5 squats with good form.</li>
            </ul>
          </div>
          <Button onClick={handleStart} className="w-full bg-purple-600 hover:bg-purple-700">
            Begin Calibration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
