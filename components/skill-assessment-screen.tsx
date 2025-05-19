"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface SkillAssessmentScreenProps {
  selectedSports: string[]
}

interface Question {
  id: number
  text: string
  options: string[]
}

export function SkillAssessmentScreen({ selectedSports }: SkillAssessmentScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  // Example questions based on the first selected sport
  const questions: Question[] = [
    {
      id: 1,
      text: `How often do you practice ${selectedSports[0] || "sports"}?`,
      options: ["Daily", "3-5 times a week", "1-2 times a week", "Occasionally"],
    },
    {
      id: 2,
      text: `How would you rate your ${selectedSports[0] || "sports"} skill level?`,
      options: ["Beginner", "Intermediate", "Advanced", "Professional"],
    },
    {
      id: 3,
      text: "What's your primary goal?",
      options: ["Improve technique", "Build strength", "Increase endurance", "Compete at higher level"],
    },
    {
      id: 4,
      text: "How much time can you dedicate to training per day?",
      options: ["30 minutes", "1 hour", "2 hours", "More than 2 hours"],
    },
    {
      id: 5,
      text: "Do you prefer training alone or with others?",
      options: ["Always alone", "Mostly alone", "Mostly with others", "Always with others"],
    },
  ]

  const handleSelectAnswer = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white/95 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-bold">Let's Assess Your Skills</h2>
              <div className="text-xs text-gray-500">Step 3 of 3</div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-[#5c3bfe]" style={{ width: `100%` }}></div>
            </div>
          </div>
        </div>

        {!isCompleted ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button className="text-xs text-[#5c3bfe]">Skip assessment</button>
            </div>

            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-[#5c3bfe] transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="mb-6 rounded-lg bg-[#5c3bfe]/5 p-4">
              <h3 className="mb-1 font-poppins text-lg font-medium">{currentQuestion.text}</h3>
            </div>

            <div className="mb-6 space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-[#5c3bfe] bg-[#5c3bfe]/5"
                      : "border-gray-200 hover:border-[#5c3bfe]/30"
                  }`}
                  onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full ${
                        selectedAnswers[currentQuestion.id] === index
                          ? "bg-[#5c3bfe] text-white"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {selectedAnswers[currentQuestion.id] === index && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-600"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Back
              </Button>
              <Button className="bg-[#5c3bfe] hover:bg-[#4c2fe0]" onClick={handleNext} disabled={!isAnswered}>
                {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#5c3bfe]/10">
              <CheckCircle className="h-10 w-10 text-[#5c3bfe]" />
            </div>
            <h3 className="mb-2 text-center font-poppins text-2xl font-bold">All Set!</h3>
            <p className="mb-6 text-center text-gray-600">
              We've created a personalized skill development plan based on your assessment.
            </p>
            <Button className="w-full bg-[#5c3bfe] hover:bg-[#4c2fe0]">Go to Dashboard</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
