"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { GamifiedNavbar } from "./gamified-navbar"
import AuthPanel from "./auth/auth-panel"
import { useAuth } from "@/contexts/auth-context"
import { HeroSection } from "./sections/hero-section"
import { TrendingChallenges } from "./sections/trending-challenges"
import { ChallengeTypes } from "./sections/challenge-types"
import { LiveLeaderboard } from "./sections/live-leaderboard"
import { SocialProof } from "./sections/social-proof"
import { HowItWorks } from "./sections/how-it-works"
import { SportsGrid } from "./sections/sports-grid"
import { AchievementSystem } from "./sections/achievement-system"
import { CommunityHighlights } from "./sections/community-highlights"
import { FinalCTA } from "./sections/final-cta"
import { GamifiedFooter } from "./gamified-footer"
import { AchievementPopup } from "./achievement-popup"
import { theme } from "@/lib/theme"

export default function GamifiedLanding() {
  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementType, setAchievementType] = useState("")
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasRedirected, setHasRedirected] = useState(false)

  // Redirect to dashboard if authenticated (only once)
  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.push("/dashboard")
    }
  }, [isAuthenticated, hasRedirected, router])

  // Optimize the scroll handler to be less resource-intensive
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Show explorer achievement when scrolled 30% down the page
      if (scrollPosition > windowHeight * 0.3 && !showAchievement && achievementType !== "explorer") {
        setAchievementType("explorer")
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 3000)
      }

      // Show social achievement when scrolled 70% down the page
      if (scrollPosition > windowHeight * 0.7 && !showAchievement && achievementType !== "social") {
        setAchievementType("social")
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 3000)
      }
    }

    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showAchievement, achievementType])

  // Don't render the landing page if user is authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="min-h-screen bg-dark text-white overflow-hidden">
      {/* Achievement popup */}
      <AnimatePresence>{showAchievement && <AchievementPopup type={achievementType} theme={theme} />}</AnimatePresence>

      {/* Navbar */}
      <GamifiedNavbar theme={theme} onOpenAuth={() => setIsAuthPanelOpen(true)} />

      {/* Main content */}
      <main>
        <HeroSection theme={theme} />
        <TrendingChallenges theme={theme} />
        <ChallengeTypes theme={theme} />
        <LiveLeaderboard theme={theme} />
        <SocialProof theme={theme} />
        <HowItWorks theme={theme} />
        <SportsGrid theme={theme} />
        <AchievementSystem theme={theme} />
        <CommunityHighlights theme={theme} />
        <FinalCTA theme={theme} />
      </main>

      {/* Footer */}
      <GamifiedFooter theme={theme} />

      {/* Authentication Panel */}
      <AuthPanel isOpen={isAuthPanelOpen} onClose={() => setIsAuthPanelOpen(false)} />
    </div>
  )
}
