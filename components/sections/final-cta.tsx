"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

type FinalCTAProps = {
  theme: any
}

export function FinalCTA({ theme }: FinalCTAProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1500)
  }

  return (
    <section className="py-16 bg-dark relative overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10"></div>
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/placeholder.svg?height=1080&width=1920" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#8667ff]">
            READY TO GO VIRAL?
          </h2>

          <p className="text-white/80 text-lg mb-8">
            Join thousands of athletes creating epic sports moments and building their legacy
          </p>

          {isSubmitted ? (
            <div className="bg-dark/50 backdrop-blur-sm rounded-lg border border-white/10 p-8 mb-8">
              <div className="w-16 h-16 mx-auto bg-[#8667ff]/20 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-[#8667ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">You're In!</h3>
              <p className="text-white/80">Get ready for epic challenges! Check your email for next steps.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to join"
                  required
                  className="flex-1 bg-dark/50 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#8667ff]"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? (
                    "Joining..."
                  ) : (
                    <>
                      JOIN THE CHALLENGE <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-center mt-4 space-x-4">
                <button
                  type="button"
                  className="flex items-center text-white text-sm hover:text-primary transition-colors"
                >
                  <img src="/placeholder.svg?height=20&width=20&text=G" alt="Google" className="w-5 h-5 mr-2" />
                  Sign up with Google
                </button>

                <button
                  type="button"
                  className="flex items-center text-white text-sm hover:text-primary transition-colors"
                >
                  <img src="/placeholder.svg?height=20&width=20&text=A" alt="Apple" className="w-5 h-5 mr-2" />
                  Sign up with Apple
                </button>
              </div>
            </form>
          )}

          <div className="flex justify-center">
            <button className="flex items-center text-[#8667ff] hover:text-[#8667ff]/80 transition-colors">
              <Play className="h-5 w-5 mr-2" fill={theme.colors.secondary} />
              Watch more challenges
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
