"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import AuthPanel from "@/components/auth/auth-panel"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, ArrowRight, Target, Zap, Brain } from "lucide-react"

export default function MonoLanding() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold tracking-tight">
                SPORTYFY<span className="text-gray-600">.LIVE</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("challenges")}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Challenges
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-black transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("horizon")}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Pathways
              </button>
            </div>

            {/* Auth Button */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black text-black hover:bg-black hover:text-white bg-white"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthOpen(true)} className="bg-black text-white hover:bg-gray-800" size="sm">
                  Sign Up
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => {
                  scrollToSection("challenges")
                  setIsMobileMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-black"
              >
                Challenges
              </button>
              <button
                onClick={() => {
                  scrollToSection("how-it-works")
                  setIsMobileMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-black"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  scrollToSection("horizon")
                  setIsMobileMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-black"
              >
                Pathways
              </button>
              {!isAuthenticated && (
                <Button
                  onClick={() => {
                    setIsAuthOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="bg-black text-white hover:bg-gray-800 w-full"
                  size="sm"
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Break Free.
            <br />
            Pick Any Challenge.
            <br />
            <span className="text-gray-600">Right Now.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Easy, Medium, Hard. Yoga, Fitness, Basketball—you decide.
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => scrollToSection("how-it-works")}
              className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg"
              size="lg"
            >
              Start a Random Challenge
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Instant Spark */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Open your phone, tap Start, and you're live in 5 seconds.
          </h2>

          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span>No downloads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span>No delays</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <blockquote className="text-2xl md:text-3xl leading-relaxed text-center font-light">
            Ditch rigid programs and endless tracking. Whether it's a sunrise yoga flow, a backyard trick shot, or a
            midnight body-weight blast, Sportyfy.live hands you spontaneous, one-off challenges whenever inspiration
            strikes.
          </blockquote>
        </div>
      </section>

      {/* Core Perks */}
      <section id="challenges" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white border border-gray-200">
              <Target className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-bold mb-4">Unlimited Variety</h3>
              <p className="text-gray-600">30+ bite-sized drills across disciplines</p>
            </div>

            <div className="text-center p-8 bg-white border border-gray-200">
              <Brain className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-bold mb-4">AI Feedback</h3>
              <p className="text-gray-600">Instant form tips from your camera coach</p>
            </div>

            <div className="text-center p-8 bg-white border border-gray-200">
              <Zap className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-bold mb-4">Zero Pressure</h3>
              <p className="text-gray-600">No schedules—repeat, skip, or mix it up</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Sign Up</h3>
              <p className="text-gray-600">Phone auth in 10 seconds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Browse & Filter</h3>
              <p className="text-gray-600">Swipe by difficulty and category</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Record & Submit</h3>
              <p className="text-gray-600">One tap to capture, one to send</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">Get Insights</h3>
              <p className="text-gray-600">AI flags your wins and tweaks</p>
            </div>
          </div>
        </div>
      </section>

      {/* On the Horizon */}
      <section id="horizon" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Coming Soon: Skill Pathways</h2>

          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Curated courses like "3-Point Mastery," "Bigger Biceps," or "Gut-Health Yoga" for deeper skill
            sprints—always optional, always yours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold tracking-tight">
                SPORTYFY<span className="text-gray-400">.LIVE</span>
              </div>
            </div>

            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-xs">T</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-xs">I</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-xs">Y</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Panel - Preserved exactly as is */}
      <AuthPanel isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
