"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })
  const [countdown, setCountdown] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  // Countdown timer
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

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0")
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden animate-section" id="pricing">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff073a]/5 to-[#00d9ff]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#00d9ff]"
        >
          CHOOSE YOUR PATH
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center text-white/70 max-w-2xl mx-auto mb-16"
        >
          Unlock your full potential with our flexible pricing plans. Special launch pricing available for a limited
          time.
        </motion.p>

        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto mb-12 text-center"
        >
          <p className="text-white/70 mb-4">Launch pricing ends in:</p>
          <div className="flex justify-center gap-4">
            <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center border border-white/10">
              <span className="text-2xl font-bold text-[#ff073a]">{formatTime(countdown.days)}</span>
              <span className="text-xs text-white/50">DAYS</span>
            </div>
            <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center border border-white/10">
              <span className="text-2xl font-bold text-[#ff073a]">{formatTime(countdown.hours)}</span>
              <span className="text-xs text-white/50">HOURS</span>
            </div>
            <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center border border-white/10">
              <span className="text-2xl font-bold text-[#ff073a]">{formatTime(countdown.minutes)}</span>
              <span className="text-xs text-white/50">MINS</span>
            </div>
            <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center border border-white/10">
              <span className="text-2xl font-bold text-[#ff073a]">{formatTime(countdown.seconds)}</span>
              <span className="text-xs text-white/50">SECS</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 h-full">
              <h3 className="text-2xl font-bold mb-2 text-white">FREE</h3>
              <p className="text-white/60 mb-6">Get started with basic features</p>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">₹0</span>
                <span className="text-white/60 ml-2">/month</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">3 daily challenges</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Basic form analysis</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Public leaderboards</span>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-white/40 mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/40">Advanced analytics</span>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-white/40 mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/40">Personalized skill tree</span>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-white/40 mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/40">Digital sports resume</span>
                </div>
              </div>

              <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                SIGN UP FREE
              </Button>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 h-full">
              <div className="absolute -top-5 right-8 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] px-4 py-1 rounded-full text-white text-sm font-bold">
                BEST VALUE
              </div>

              <h3 className="text-2xl font-bold mb-2 text-white">PREMIUM</h3>
              <p className="text-white/60 mb-6">Unlock your full potential</p>

              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#00d9ff]">
                  ₹149
                </span>
                <span className="text-white/60 ml-2">/month</span>
              </div>

              <div className="mb-6">
                <span className="text-white/60 line-through">₹299</span>
                <span className="ml-2 bg-gradient-to-r from-[#ff073a]/20 to-[#00d9ff]/20 text-white/90 px-2 py-0.5 rounded text-xs">
                  LAUNCH SPECIAL
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Unlimited challenges</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Advanced AI analysis</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Public & private leaderboards</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Detailed performance analytics</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Personalized skill tree</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span className="text-white/80">Verified digital sports resume</span>
                </div>
              </div>

              <Button className="w-full relative group overflow-hidden">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white font-medium">
                  TRY FREE FOR 7 DAYS
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] group-hover:opacity-80 transition-opacity duration-300"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] opacity-50 group-hover:opacity-100 blur-md transition-opacity duration-300"></span>
              </Button>

              <p className="text-center text-white/50 text-xs mt-4">No credit card required. Cancel anytime.</p>
            </div>
          </motion.div>
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 max-w-md mx-auto text-center"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-[#ff073a]/10 to-[#00d9ff]/10 px-4 py-2 rounded-full border border-white/10">
            <Check className="h-5 w-5 text-[#00d9ff] mr-2" />
            <span className="text-white/80 text-sm">30-DAY MONEY-BACK GUARANTEE</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
