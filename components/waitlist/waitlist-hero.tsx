"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type WaitlistHeroProps = {
  theme: any
}

export function WaitlistHero({ theme }: WaitlistHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [counter, setCounter] = useState<number | null>(null)

  // Play video on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error)
      })
    }
    // Fetch waitlist count from API
    fetch("https://api.sportyfy.live/api/v1/waitlist/count")
      .then((res) => res.json())
      .then((data) => setCounter(data.total_prospects))
      .catch((err) => setCounter(0))
  }, [])

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

      {/* Particle effect */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ top: "70%", left: "20%", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ top: "40%", left: "80%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ top: "80%", left: "85%", animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ top: "30%", left: "40%", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ top: "60%", left: "60%", animationDelay: "2.5s" }}
        ></div>
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Button
              size="lg"
              className="bg-primary text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-lg relative group overflow-hidden"
              onClick={() => {
                const el = document.getElementById('waitlist-questionnaire');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">JOIN THE WAITLIST</span>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              <span className="absolute -inset-3 bg-primary/30 rounded-full blur animate-pulse"></span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto text-lg"
            >
              <Play className="h-4 w-4 mr-2" /> WATCH DEMO
            </Button>
          </motion.div>

          {/* Founding badge text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-white/70 mb-8"
          >
            Be one of the first 500 athletes to unlock the{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff073a] to-[#8667ff] relative inline-block group cursor-pointer">
              Founding Badge
              <span className="absolute -inset-1 scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 rounded-lg blur-sm"></span>
            </span>
            .
          </motion.p>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 flex items-center">
              <div className="w-2 h-2 bg-[#8667ff] rounded-full animate-pulse mr-2"></div>
              <span className="text-white/80">
                <span className="font-bold text-white">{counter !== null ? counter : '...'}</span> athletes already on the waitlist
              </span>
            </div>
          </motion.div>

          {/* Down arrow */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.5 },
              y: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
            }}
            className="flex justify-center"
          >
            <ChevronRight className="h-8 w-8 text-white/50 transform rotate-90" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
