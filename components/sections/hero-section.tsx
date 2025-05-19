"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, ChevronRight, Flame, Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeroSectionProps = {
  theme: any
}

export function HeroSection({ theme }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [challengeIndex, setChallengeIndex] = useState(0)

  const recentChallenges = [
    { user: "b_ball_king", challenge: "360 No-Look Shot", time: "2m ago" },
    { user: "soccer_queen", challenge: "Crossbar Challenge", time: "5m ago" },
    { user: "trick_master", challenge: "Bottle Flip Dunk", time: "8m ago" },
    { user: "fitness_beast", challenge: "One-Arm Pushup", time: "12m ago" },
    { user: "hoop_dreams", challenge: "Half-Court Swish", time: "15m ago" },
  ]

  // Auto-rotate recent challenges
  useEffect(() => {
    const interval = setInterval(() => {
      setChallengeIndex((prev) => (prev + 1) % recentChallenges.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [recentChallenges.length])

  // Play video on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error)
      })
    }
  }, [])

  // Floating challenge bubbles - alternating between primary and secondary colors
  const bubbles = [
    { name: "Trick Shots", color: theme.colors.primary, delay: 0 },
    { name: "Freestyle", color: theme.colors.secondary, delay: 0.5 },
    { name: "Challenges", color: theme.colors.primary, delay: 1 },
    { name: "Battles", color: theme.colors.secondary, delay: 1.5 },
    { name: "Combos", color: theme.colors.primary, delay: 2 },
  ]

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black z-20"></div>
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/placeholder.svg?height=1080&width=1920" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-10 md:pt-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#8667ff]">
                EPIC CHALLENGES.
              </span>
              <span className="block">LEGENDARY MOMENTS.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Film. Share. Compete. Become a Sports Legend.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="bg-primary text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-lg"
            >
              START A CHALLENGE
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto text-lg"
            >
              <Play className="h-4 w-4 mr-2" /> Watch Challenges
            </Button>
          </motion.div>

          {/* Recent challenges ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-md mx-auto mb-16"
          >
            <div className="bg-dark/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Flame className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">LIVE CHALLENGES</span>
              </div>
              <div className="h-12 relative overflow-hidden">
                {recentChallenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: challengeIndex === index ? 1 : 0,
                      y: challengeIndex === index ? 0 : 20,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff073a] to-[#8667ff] flex items-center justify-center text-xs font-bold mr-3">
                      {challenge.user.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-white">{challenge.user}</span>
                        <span className="mx-2 text-white/40">•</span>
                        <span className="text-white/60 text-sm">{challenge.time}</span>
                      </div>
                      <p className="text-sm text-white/80">
                        Completed the <span className="text-[#8667ff]">{challenge.challenge}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-white/60">{recentChallenges.length} new challenges</span>
                <button className="text-xs text-[#8667ff] flex items-center">
                  See all <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Interactive Challenge Selector - replacing floating bubbles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative py-8"
          >
            <h3 className="text-center text-sm uppercase tracking-wider mb-4 text-white/70">Popular Challenges</h3>
            <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-3 px-4 md:px-0 md:justify-center">
              {[
                { name: "Trick Shots", icon: "🎯", color: theme.colors.primary },
                { name: "Freestyle", icon: "🔄", color: theme.colors.secondary },
                { name: "Strength", icon: "💪", color: theme.colors.primary },
                { name: "Speed", icon: "⚡", color: theme.colors.secondary },
                { name: "Precision", icon: "🎯", color: theme.colors.primary },
              ].map((challenge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <div
                    className="flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-xl backdrop-blur-sm border border-white/10 p-3"
                    style={{
                      background: `linear-gradient(135deg, ${challenge.color}20, ${challenge.color}05)`,
                      boxShadow: `0 0 15px ${challenge.color}30`,
                    }}
                  >
                    <div
                      className="text-2xl md:text-3xl mb-2 rounded-full w-12 h-12 flex items-center justify-center"
                      style={{ background: challenge.color }}
                    >
                      {challenge.icon}
                    </div>
                    <span className="text-sm font-medium text-white">{challenge.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="absolute left-0 top-1/2 w-8 bg-gradient-to-r from-black to-transparent h-full -translate-y-1/2 pointer-events-none md:hidden"></div>
            <div className="absolute right-0 top-1/2 w-8 bg-gradient-to-l from-black to-transparent h-full -translate-y-1/2 pointer-events-none md:hidden"></div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center gap-8 md:gap-16"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="h-4 w-4 text-primary mr-1" />
                <span className="text-2xl font-bold">10K+</span>
              </div>
              <p className="text-xs text-white/60">Daily Challenges</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-4 w-4 text-[#8667ff] mr-1" />
                <span className="text-2xl font-bold">50K+</span>
              </div>
              <p className="text-xs text-white/60">Athletes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Flame className="h-4 w-4 text-primary mr-1" />
                <span className="text-2xl font-bold">1M+</span>
              </div>
              <p className="text-xs text-white/60">Videos Shared</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
