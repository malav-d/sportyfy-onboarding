"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export function FinalCTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setEmail("")

      // Trigger confetti
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff073a", "#00d9ff", "#ffffff"],
        })
      }
    }, 1500)
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden animate-section">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/futuristic-sports-grid.png')] opacity-10 z-0"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff073a]/10 to-[#00d9ff]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#00d9ff]">
            JOIN THE MOVEMENT
          </h2>

          <p className="text-white/80 mb-12 text-lg">
            Be among the first to experience the future of sports training. Limited spots available for early access.
          </p>

          {isSubmitted ? (
            <div className="bg-gradient-to-r from-[#ff073a]/20 to-[#00d9ff]/20 backdrop-blur-sm p-8 rounded-xl border border-white/10 mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#ff073a]/20 to-[#00d9ff]/20 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-[#00d9ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">You're In!</h3>
              <p className="text-white/80">
                Thank you for joining the SportSkill revolution. We'll be in touch soon with your exclusive early
                access.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-12">
              <div className="relative max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] rounded-full blur-md opacity-70"></div>
                <div className="relative bg-black/60 backdrop-blur-sm p-1 rounded-full flex overflow-hidden">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-transparent border-0 text-white px-6 py-4 focus:outline-none focus:ring-0 placeholder-white/50"
                  />
                  <Button type="submit" disabled={isLoading} className="relative group overflow-hidden rounded-full">
                    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white font-medium">
                      {isLoading ? "SENDING..." : "GET EARLY ACCESS"}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] group-hover:opacity-80 transition-opacity duration-300"></span>
                  </Button>
                </div>
              </div>
              <p className="text-white/50 text-xs mt-4">
                By joining, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}

          {/* Social proof */}
          <div className="flex items-center justify-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                  <img
                    src={`/placeholder.svg?key=7bgy2&height=50&width=50&text=${i}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="ml-4 flex items-center">
              <div className="w-2 h-2 bg-[#00d9ff] rounded-full animate-pulse mr-2"></div>
              <span className="text-white/70 text-sm">1,729 athletes joined this week</span>
            </div>
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
