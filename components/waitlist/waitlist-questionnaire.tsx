"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Trophy, Zap, Medal, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

type WaitlistQuestionnaireProps = {
  theme: any
}

// Define the steps and questions
const TOTAL_STEPS = 5

export function WaitlistQuestionnaire({ theme }: WaitlistQuestionnaireProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    primarySport: "",
    skillLevel: "",
    goal: "",
    trainingFrequency: "",
    competitionInterest: "",
    email: "",
    phone: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileScore, setProfileScore] = useState({ skill: 0, potential: 0, viral: 0 })

  // Calculate profile scores based on answers
  useEffect(() => {
    if (step === TOTAL_STEPS) {
      // Generate "personalized" scores based on answers
      const skillMap = { beginner: 35, intermediate: 65, advanced: 85, pro: 95 }
      const freqMap = { rarely: 30, sometimes: 60, regularly: 80, daily: 95 }
      const goalMap = { fun: 50, improve: 70, compete: 85, pro: 95 }

      const baseSkill = skillMap[formData.skillLevel as keyof typeof skillMap] || 50
      const basePotential = freqMap[formData.trainingFrequency as keyof typeof freqMap] || 50
      const baseViral = goalMap[formData.goal as keyof typeof goalMap] || 50

      // Add some randomness
      const randomize = (base: number) => Math.min(99, Math.max(30, base + (Math.random() * 20 - 10)))

      setProfileScore({
        skill: Math.round(randomize(baseSkill)),
        potential: Math.round(randomize(basePotential)),
        viral: Math.round(randomize(baseViral)),
      })
    }
  }, [step, formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionSelect = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < TOTAL_STEPS + 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Collect your form data here
    const data = {
      email: formData.email,
      mobile: formData.phone,
      primary_sport: formData.primarySport,
      skill_level: formData.skillLevel,
      goal: formData.goal,
      training_frequency: formData.trainingFrequency,
      competition_interest: formData.competitionInterest,
    };
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

    try {
      const response = await fetch(`${API_BASE_URL}/waitlist/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // handle error
      }
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-md w-full mx-auto">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#ff073a]/20 to-[#8667ff]/20 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-[#8667ff]" />
          </div>
          <h3 className="text-2xl font-bold mb-2">You're In!</h3>
          <p className="text-white/80 mb-6">You've secured your spot on the waitlist.</p>

          <div className="bg-black/40 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-lg mb-2">Your Sportyfy Profile</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Skill Level</span>
                  <span className="text-[#ff073a]">{profileScore.skill}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileScore.skill}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-[#ff073a]"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Growth Potential</span>
                  <span className="text-[#8667ff]">{profileScore.potential}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileScore.potential}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-[#8667ff]"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Viral Potential</span>
                  <span className="text-[#ff073a]">{profileScore.viral}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileScore.viral}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-[#ff073a] to-[#8667ff]"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-sm mb-4">Share to move up 50 spots in line:</p>
          <div className="flex justify-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2]/30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#4267B2]/20 flex items-center justify-center text-[#4267B2] hover:bg-[#4267B2]/30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Your Profile</span>
              <span>
                {step} of {TOTAL_STEPS + 1}
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff073a] to-[#8667ff] transition-all duration-300 ease-out"
                style={{ width: `${(step / (TOTAL_STEPS + 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">What's your primary sport?</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {["Basketball", "Soccer", "Fitness", "Tennis"].map((sport) => (
                      <button
                        key={sport}
                        onClick={() => handleOptionSelect("primarySport", sport)}
                        className={`p-4 rounded-lg border transition-all ${
                          formData.primarySport === sport
                            ? "border-[#ff073a] bg-[#ff073a]/10 text-white"
                            : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Running", "Volleyball", "Other"].map((sport) => (
                      <button
                        key={sport}
                        onClick={() => handleOptionSelect("primarySport", sport)}
                        className={`p-4 rounded-lg border transition-all ${
                          formData.primarySport === sport
                            ? "border-[#ff073a] bg-[#ff073a]/10 text-white"
                            : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">How would you rate your skill level?</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "beginner", label: "Beginner", desc: "Just starting out" },
                      { id: "intermediate", label: "Intermediate", desc: "Comfortable with basics" },
                      { id: "advanced", label: "Advanced", desc: "Skilled competitor" },
                      { id: "pro", label: "Professional", desc: "Elite level athlete" },
                    ].map((level) => (
                      <button
                        key={level.id}
                        onClick={() => handleOptionSelect("skillLevel", level.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          formData.skillLevel === level.id
                            ? "border-[#8667ff] bg-[#8667ff]/10 text-white"
                            : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                        }`}
                      >
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-white/60">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">What's your main goal?</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "fun", label: "Have Fun", icon: <Activity className="h-5 w-5" /> },
                      { id: "improve", label: "Improve Skills", icon: <Zap className="h-5 w-5" /> },
                      { id: "compete", label: "Compete & Win", icon: <Trophy className="h-5 w-5" /> },
                      { id: "pro", label: "Go Pro", icon: <Medal className="h-5 w-5" /> },
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => handleOptionSelect("goal", goal.id)}
                        className={`w-full p-4 rounded-lg border flex items-center transition-all ${
                          formData.goal === goal.id
                            ? "border-[#ff073a] bg-[#ff073a]/10 text-white"
                            : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                        }`}
                      >
                        <div className={`mr-3 ${formData.goal === goal.id ? "text-[#ff073a]" : "text-white/60"}`}>
                          {goal.icon}
                        </div>
                        <div className="font-medium">{goal.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">How often do you train?</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "rarely", label: "Rarely", desc: "A few times a month" },
                      { id: "sometimes", label: "Sometimes", desc: "Once a week" },
                      { id: "regularly", label: "Regularly", desc: "2-4 times a week" },
                      { id: "daily", label: "Daily", desc: "5+ times a week" },
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        onClick={() => handleOptionSelect("trainingFrequency", freq.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          formData.trainingFrequency === freq.id
                            ? "border-[#8667ff] bg-[#8667ff]/10 text-white"
                            : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                        }`}
                      >
                        <div className="font-medium">{freq.label}</div>
                        <div className="text-sm text-white/60">{freq.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Are you interested in competing?</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "very", label: "Very Interested", desc: "Can't wait to compete!" },
                      { id: "somewhat", label: "Somewhat Interested", desc: "Might try it out" },
                      { id: "casual", label: "Casual Only", desc: "Just for fun with friends" },
                      { id: "not", label: "Not Interested", desc: "Just want to improve skills" },
                    ].map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => handleOptionSelect("competitionInterest", interest.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          formData.competitionInterest === interest.id
                            ? "border-[#ff073a] bg-[#ff073a]/10 text-white"
                            : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                        }`}
                      >
                        <div className="font-medium">{interest.label}</div>
                        <div className="text-sm text-white/60">{interest.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Your Sportyfy Profile</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Based on your answers, we've created your athlete profile. Join the waitlist to save it and get
                      early access!
                    </p>

                    <div className="bg-black/40 rounded-lg p-4 mb-6">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Skill Level</span>
                            <span className="text-[#ff073a]">{profileScore.skill}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${profileScore.skill}%` }}
                              transition={{ duration: 1 }}
                              className="h-full bg-[#ff073a]"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Growth Potential</span>
                            <span className="text-[#8667ff]">{profileScore.potential}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${profileScore.potential}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-[#8667ff]"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Viral Potential</span>
                            <span className="text-[#ff073a]">{profileScore.viral}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${profileScore.viral}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                              className="h-full bg-gradient-to-r from-[#ff073a] to-[#8667ff]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8667ff]/50"
                        placeholder="Your email address"
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8667ff]/50"
                        placeholder="Phone for WhatsApp alerts (optional)"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          SAVE PROFILE & JOIN WAITLIST <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>

                    <p className="text-white/50 text-xs mt-4 text-center">We respect your privacy. No spam, ever.</p>
                  </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center text-white/70 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </button>
            ) : (
              <div></div>
            )}
            {step < TOTAL_STEPS + 1 && (
              <button
                onClick={nextStep}
                disabled={
                  (step === 1 && !formData.primarySport) ||
                  (step === 2 && !formData.skillLevel) ||
                  (step === 3 && !formData.goal) ||
                  (step === 4 && !formData.trainingFrequency) ||
                  (step === 5 && !formData.competitionInterest)
                }
                className={`flex items-center ${
                  (step === 1 && !formData.primarySport) ||
                  (step === 2 && !formData.skillLevel) ||
                  (step === 3 && !formData.goal) ||
                  (step === 4 && !formData.trainingFrequency) ||
                  (step === 5 && !formData.competitionInterest)
                    ? "text-white/30 cursor-not-allowed"
                    : "text-[#8667ff] hover:text-[#8667ff]/80 transition-colors"
                }`}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
