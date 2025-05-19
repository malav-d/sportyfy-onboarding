"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AdvantageSection } from "@/components/advantage-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FeaturesSection } from "@/components/features-section"
import { SportsSection } from "@/components/sports-section"
import { PricingSection } from "@/components/pricing-section"
import { AmbassadorSection } from "@/components/ambassador-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export function LandingPage() {
  const [athleteCount, setAthleteCount] = useState(7000)

  // Simulate live athlete count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAthleteCount((prev) => {
        const change = Math.floor(Math.random() * 3) // 0 to 2
        return prev + change
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white overflow-hidden">
      <Navbar />
      <main>
        <HeroSection athleteCount={athleteCount} />
        <AdvantageSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FeaturesSection />
        <SportsSection />
        <PricingSection />
        <AmbassadorSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}
