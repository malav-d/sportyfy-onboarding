"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FuturisticNavbar } from "./futuristic-navbar"
import { HeroSection } from "./sections/hero-section"
import { ProblemSolutionSection } from "./sections/problem-solution-section"
import { FeatureCarousel } from "./sections/feature-carousel"
import { SocialProofSection } from "./sections/social-proof-section"
import { InteractiveDemo } from "./sections/interactive-demo"
import { PricingSection } from "./sections/pricing-section"
import { FinalCTASection } from "./sections/final-cta-section"
import { FuturisticFooter } from "./futuristic-footer"
import { ParticleBackground } from "./particle-background"
import { CustomCursor } from "./custom-cursor"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FuturisticLanding() {
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mainRef = useRef<HTMLDivElement>(null)

  // Handle mouse movement for custom cursor and effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Initialize scroll animations
  useEffect(() => {
    if (!isLoading && mainRef.current) {
      // Animate sections on scroll
      const sections = document.querySelectorAll(".animate-section")
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      // Initialize progress bar
      gsap.to(".progress-bar", {
        width: "100%",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      })
    }
  }, [isLoading])

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div ref={mainRef} className="relative bg-black text-white overflow-hidden">
          {/* Progress bar */}
          <div className="fixed top-0 left-0 right-0 h-1 z-50">
            <div className="progress-bar h-full bg-gradient-to-r from-[#ff073a] to-[#00d9ff] w-0"></div>
          </div>

          {/* Custom cursor */}
          <CustomCursor mousePosition={mousePosition} />

          {/* Particle background */}
          <div className="fixed inset-0 z-0">
            <ParticleBackground />
          </div>

          {/* Navbar */}
          <FuturisticNavbar />

          {/* Main content */}
          <main className="relative z-10">
            <HeroSection />
            <ProblemSolutionSection />
            <FeatureCarousel />
            <SocialProofSection />
            <InteractiveDemo />
            <PricingSection />
            <FinalCTASection />
          </main>

          {/* Footer */}
          <FuturisticFooter />
        </div>
      )}
    </>
  )
}

// Loading screen component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-t-[#ff073a] border-r-[#00d9ff] border-b-[#ff073a] border-l-[#00d9ff] rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
            <span className="text-[#ff073a] font-bold text-xl">SK</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#00d9ff] animate-pulse">
          LOADING EXPERIENCE
        </h2>
      </div>
    </div>
  )
}
