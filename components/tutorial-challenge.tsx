"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedVideoCapture } from "./enhanced-video-capture"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

const tutorialChallenge = {
  title: "First Squat Challenge",
  duration_limit: 60,
  requirements: {
    min_valid_reps: 3,
  },
}

interface RecordingResult {
  validReps: number
}

export function TutorialChallenge({ onComplete }: { onComplete: () => void }) {
  const [flowState, setFlowState] = useState<"prep" | "recording" | "complete" | "failed">("prep")
  const [result, setResult] = useState<RecordingResult | null>(null)

  const handleChallengeComplete = (res: RecordingResult) => {
    setResult(res)
    if (res.validReps >= tutorialChallenge.requirements.min_valid_reps) {
      setFlowState("complete")
    } else {
      setFlowState("failed")
    }
  }

  const handleTryAgain = () => {
    setResult(null)
    setFlowState("recording")
  }

  return (
    <div className="font-mono antialiased">
      <AnimatePresence mode="wait">
        {flowState === "prep" && (
          <motion.div key="prep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
              <Card className="w-full max-w-md bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-purple-400">Tutorial Challenge</CardTitle>
                  <CardDescription className="text-gray-300">{tutorialChallenge.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Complete{" "}
                    <span className="font-bold text-white">{tutorialChallenge.requirements.min_valid_reps}</span>{" "}
                    squats.
                  </p>
                  <p className="text-sm text-gray-400">Ensure your whole body is visible and well-lit.</p>
                  <Button
                    onClick={() => setFlowState("recording")}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {flowState === "recording" && (
          <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EnhancedVideoCapture
              challengeData={tutorialChallenge}
              onComplete={handleChallengeComplete}
              onCancel={() => setFlowState("prep")}
            />
          </motion.div>
        )}

        {flowState === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
              <Card className="w-full max-w-md bg-gray-800 border-green-500">
                <CardHeader className="text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                  <CardTitle className="text-3xl font-bold mt-4">Challenge Complete!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-lg">
                    You completed <span className="font-bold text-purple-400">{result?.validReps}</span> valid squats.
                  </div>
                  <Button onClick={onComplete} className="w-full bg-purple-600 hover:bg-purple-700">
                    Continue to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {flowState === "failed" && (
          <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
              <Card className="w-full max-w-md bg-gray-800 border-red-500">
                <CardHeader className="text-center">
                  <XCircle className="mx-auto h-16 w-16 text-red-500" />
                  <CardTitle className="text-3xl font-bold mt-4">Challenge Failed</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-lg">
                    You completed <span className="font-bold text-red-400">{result?.validReps}</span> out of{" "}
                    <span className="font-bold text-gray-300">{tutorialChallenge.requirements.min_valid_reps}</span>{" "}
                    required.
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleTryAgain}
                      variant="outline"
                      className="w-full text-white border-gray-600 hover:bg-gray-700"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={onComplete} className="w-full bg-purple-600 hover:bg-purple-700">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
