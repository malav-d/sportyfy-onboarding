"use client"

import { useState, useEffect } from "react"
import { GamifiedNavbar } from "./gamified-navbar"
import { HeroSection } from "./sections/hero-section"
import { ChallengeTypes } from "./sections/challenge-types"
import { SportsGrid } from "./sections/sports-grid"
import { HowItWorks } from "./sections/how-it-works"
import { FinalCTASection } from "./sections/final-cta-section"
import { GamifiedFooter } from "./gamified-footer"
import { WaitlistHero } from "./waitlist/waitlist-hero"
import { WaitlistBenefits } from "./waitlist/waitlist-benefits"
import { WaitlistPrimary } from "./waitlist/waitlist-primary"
import { WaitlistUrgency } from "./waitlist/waitlist-urgency"
import { WaitlistCTA } from "./waitlist/waitlist-cta"
import { WaitlistFooter } from "./waitlist/waitlist-footer"
import { ThemeProvider, useTheme } from "./theme-context"

// Set this to false to show the regular landing page
const WAITLIST_MODE = true

export default function WaitlistLanding() {
  const theme = useTheme()
  const [isWaitlistMode, setIsWaitlistMode] = useState(WAITLIST_MODE)

  // For development purposes - toggle with key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Shift+W
      if (e.shiftKey && e.key === "W") {
        setIsWaitlistMode((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-dark text-white overflow-hidden">
        <GamifiedNavbar theme={theme} isWaitlistMode={isWaitlistMode} />

        {isWaitlistMode ? (
          // Waitlist Mode
          <>
            <WaitlistHero theme={theme} />
            <WaitlistPrimary theme={theme} />

            {/* Existing sections with waitlist overlays */}
            <div className="relative">
              <div id="challenges" className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-lg border border-white/10">
                  <span className="text-xl font-bold text-white">COMING SOON</span>
                </div>
              </div>
              <ChallengeTypes theme={theme} />
            </div>

            <WaitlistBenefits theme={theme} />

            <div className="relative">
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-lg border border-white/10">
                  <span className="text-xl font-bold text-white">PREVIEW</span>
                </div>
              </div>
              <HowItWorks />
            </div>

            <WaitlistUrgency theme={theme} />

            <div className="relative">
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-lg border border-white/10">
                  <span className="text-xl font-bold text-white">EARLY ACCESS</span>
                </div>
              </div>
              <SportsGrid theme={theme} />
            </div>

            <WaitlistCTA theme={theme} />
            <WaitlistFooter theme={theme} />
          </>
        ) : (
          // Regular Mode - Original landing page
          <>
            <HeroSection theme={theme} />
            <ChallengeTypes theme={theme} />
            <HowItWorks />
            <SportsGrid theme={theme} />
            <FinalCTASection />
            <GamifiedFooter theme={theme} />
          </>
        )}
      </div>
    </ThemeProvider>
  )
}
