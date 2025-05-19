"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function FinalCTASection() {
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 20,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ email })
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#1c1c1c] to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#f23c21]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f23c21]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-6">
            JOIN THE <span className="text-[#f23c21]">MOVEMENT</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Be among the first to experience the future of sports training. Limited spots available for early access.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-[#252525] p-8 rounded-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1c1c1c] border-0 rounded-sm p-3 text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium py-6 text-lg rounded-sm"
              >
                GET EARLY ACCESS <span className="ml-1">→</span>
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#1c1c1c] absolute w-full"></div>
                <span className="bg-[#252525] px-2 relative text-xs text-gray-400">OR</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-[#1c1c1c] font-medium py-3 rounded-sm"
              >
                CONTINUE WITH GOOGLE
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">By joining, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <h3 className="font-['Bebas_Neue'] text-xl text-center mb-4">OFFICIAL LAUNCH COUNTDOWN</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#1c1c1c] p-3 rounded-sm text-center">
              <div className="font-['Bebas_Neue'] text-3xl text-[#f23c21]">{countdown.days}</div>
              <div className="text-xs text-gray-400">DAYS</div>
            </div>
            <div className="bg-[#1c1c1c] p-3 rounded-sm text-center">
              <div className="font-['Bebas_Neue'] text-3xl text-[#f23c21]">{countdown.hours}</div>
              <div className="text-xs text-gray-400">HOURS</div>
            </div>
            <div className="bg-[#1c1c1c] p-3 rounded-sm text-center">

\
