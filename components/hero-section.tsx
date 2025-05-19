"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface HeroSectionProps {
  athleteCount: number
}

export function HeroSection({ athleteCount }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c1c]/80 z-10"></div>
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
          <source src="/placeholder.svg?height=1080&width=1920" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-10 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-7xl lg:text-8xl tracking-wide leading-none mb-2 animate-fade-in">
            MASTER SKILLS.
            <div className="text-[#f23c21] mt-2">GET NOTICED.</div>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            India's First AI-Powered Sports Skill Development Platform
          </p>

          <p className="mt-4 text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Transform your game through AI analysis, verified achievements, and social competition
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
              GET STARTED <span className="ml-1">→</span>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-sm">
              <span className="text-sm md:text-base font-medium">
                <span className="text-[#f23c21]">{athleteCount.toLocaleString()}+</span> athletes already improving
              </span>
            </div>
          </div>

          {/* Mobile App Preview */}
          <div className="mt-12 relative max-w-xs mx-auto">
            <div className="relative z-10 border-8 border-[#252525] rounded-3xl overflow-hidden shadow-2xl">
              <img src="/placeholder.svg?height=600&width=300" alt="Sportyfy mobile interface" className="w-full" />
              <div className="absolute top-4 left-4 flex items-center">
                <div className="h-2 w-2 bg-[#f23c21] rounded-full animate-pulse"></div>
                <span className="ml-2 text-xs font-medium">LIVE</span>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-[#f23c21]/20 rounded-3xl blur-xl"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white opacity-70" />
        </div>
      </div>
    </section>
  )
}
