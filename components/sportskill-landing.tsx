"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, ChevronDown, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SportskillLanding() {
  const [userCount, setUserCount] = useState(7000)
  const [isNavbarVisible, setIsNavbarVisible] = useState(false)
  const [selectedSport, setSelectedSport] = useState("basketball")
  const [daysToLaunch, setDaysToLaunch] = useState(14)

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null)

  // Increment user count randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsNavbarVisible(true)
      } else {
        setIsNavbarVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Countdown to launch
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const launchDate = new Date("2025-06-01")
      const diffTime = Math.abs(launchDate.getTime() - now.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysToLaunch(diffDays)
    }, 86400000) // Update once per day

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavbarVisible ? "bg-black/90 shadow-lg" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bebas text-2xl tracking-wider">
            SPORT<span className="text-[#f23c21]">SKILL</span>
          </div>
          <Button
            variant="destructive"
            className="bg-[#f23c21] hover:bg-[#d92c11] text-white rounded-md px-4 py-2 text-sm font-medium"
          >
            LOGIN / SIGNUP
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center pt-16 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1c1c1c]/80 to-[#1c1c1c] z-10"></div>
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="#" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto relative z-10 mt-16 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-bebas text-5xl md:text-7xl mb-4 tracking-wide leading-tight">
              MASTER SKILLS. <br />
              <span className="text-[#f23c21]">GET NOTICED.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-300">
              India's First AI-Powered Sports Skill Development Platform
            </p>
            <p className="text-base md:text-lg mb-8 max-w-xl mx-auto text-gray-400">
              Transform your game through AI analysis, verified achievements, and social competition
            </p>

            <Button
              variant="destructive"
              size="lg"
              className="bg-[#f23c21] hover:bg-[#d92c11] text-white rounded-md px-8 py-6 text-lg font-medium"
            >
              GET STARTED <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-8 text-gray-300 text-sm md:text-base">
              <p className="animate-pulse">
                <span className="font-bold">{userCount.toLocaleString()}+</span> athletes already improving
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="h-8 w-8 text-white/70 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Advantage Section */}
      <section className="py-16 px-4 bg-[#252525]">
        <div className="container mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            THE SPORTSKILL <span className="text-[#f23c21]">ADVANTAGE</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Traditional Training */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#1c1c1c] p-6 rounded-lg"
            >
              <h3 className="font-bebas text-2xl mb-4">TRADITIONAL TRAINING</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Subjective feedback without data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Expensive personal coaching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Inconsistent progress tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Limited access to expertise</span>
                </li>
              </ul>
            </motion.div>

            {/* SportSkill Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1c1c1c] p-6 rounded-lg border border-[#f23c21]"
            >
              <h3 className="font-bebas text-2xl mb-4 text-[#f23c21]">SPORTSKILL METHOD</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>AI-powered data-driven feedback</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Affordable for all athletes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Precise progress measurement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Expert guidance at scale</span>
                </li>
              </ul>
            </motion.div>

            {/* Your Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#1c1c1c] p-6 rounded-lg"
            >
              <h3 className="font-bebas text-2xl mb-4">YOUR RESULTS</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#f23c21] font-bold mr-2">→</span>
                  <span>Verified skills with digital badges</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f23c21] font-bold mr-2">→</span>
                  <span>Professional digital resume</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f23c21] font-bold mr-2">→</span>
                  <span>Recruitment opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f23c21] font-bold mr-2">→</span>
                  <span>
                    <span className="text-[#f23c21] font-bold">37%</span> average skill improvement
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-[#1c1c1c]">
        <div className="container mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            LEVEL UP YOUR <span className="text-[#f23c21]">GAME</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#f23c21] flex items-center justify-center mx-auto mb-4">
                <span className="font-bebas text-3xl">1</span>
              </div>
              <h3 className="font-bebas text-2xl mb-2">CAPTURE</h3>
              <p className="text-gray-300">Record your performance with any smartphone</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#f23c21] flex items-center justify-center mx-auto mb-4">
                <span className="font-bebas text-3xl">2</span>
              </div>
              <h3 className="font-bebas text-2xl mb-2">ANALYZE</h3>
              <p className="text-gray-300">Our AI instantly breaks down your form and technique</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#f23c21] flex items-center justify-center mx-auto mb-4">
                <span className="font-bebas text-3xl">3</span>
              </div>
              <h3 className="font-bebas text-2xl mb-2">IMPROVE</h3>
              <p className="text-gray-300">Track progress, compete with friends, earn badges</p>
            </motion.div>
          </div>

          {/* App Showcase */}
          <div className="relative h-[500px] md:h-[600px] mb-8 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c1c1c] z-10"></div>
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="SportSkill App Showcase"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-[#f23c21] text-[#f23c21] hover:bg-[#f23c21] hover:text-white"
            >
              SEE HOW IT WORKS
            </Button>

            <div className="mt-8 max-w-lg mx-auto">
              <ul className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Real-time feedback</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Personalized drills</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Social challenges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Carousel */}
      <section className="py-16 px-4 bg-[#252525]">
        <div className="container mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            ATHLETES WHO <span className="text-[#f23c21]">LEVELED UP</span>
          </h2>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-4 min-w-max">
              {/* Testimonial 1 */}
              <div className="bg-[#1c1c1c] rounded-lg p-6 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Athlete"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">Rahul Singh</h3>
                    <p className="text-sm text-gray-400">18, Basketball</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium">Free throw accuracy:</p>
                  <div className="flex items-center">
                    <span className="text-gray-400">63%</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-[#f23c21]" />
                    <span className="text-[#f23c21] font-bold">84%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "SportSkill helped me identify flaws in my shooting form that my coach couldn't see. My confidence is
                  at an all-time high!"
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-xs bg-[#f23c21]/20 text-[#f23c21] px-2 py-1 rounded">VERIFIED</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-[#1c1c1c] rounded-lg p-6 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Athlete"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">Priya Patel</h3>
                    <p className="text-sm text-gray-400">16, Soccer</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium">Ball control score:</p>
                  <div className="flex items-center">
                    <span className="text-gray-400">42/100</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-[#f23c21]" />
                    <span className="text-[#f23c21] font-bold">78/100</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "The skill tree made it clear what I needed to work on. I've improved more in 3 months than in the
                  past 2 years!"
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-xs bg-[#f23c21]/20 text-[#f23c21] px-2 py-1 rounded">VERIFIED</span>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-[#1c1c1c] rounded-lg p-6 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Athlete"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">Arjun Mehta</h3>
                    <p className="text-sm text-gray-400">22, Fitness</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium">Squat form score:</p>
                  <div className="flex items-center">
                    <span className="text-gray-400">5.2/10</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-[#f23c21]" />
                    <span className="text-[#f23c21] font-bold">9.1/10</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "The AI caught issues with my form that were causing knee pain. Now I lift heavier with zero
                  discomfort!"
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-xs bg-[#f23c21]/20 text-[#f23c21] px-2 py-1 rounded">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-400 mb-2">Swipe for more testimonials</p>
            <Button variant="destructive" size="lg" className="bg-[#f23c21] hover:bg-[#d92c11]">
              JOIN THEM
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-4 bg-[#1c1c1c]">
        <div className="container mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            CORE <span className="text-[#f23c21]">FEATURES</span>
          </h2>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-6 min-w-max">
              {/* Feature 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#252525] rounded-lg p-6 w-72 border-t-2 border-[#f23c21]"
              >
                <div className="w-12 h-12 rounded-full bg-[#f23c21]/20 flex items-center justify-center mb-4">
                  <span className="text-[#f23c21] font-bold text-xl">AI</span>
                </div>
                <h3 className="font-bebas text-xl mb-2">AI ANALYSIS</h3>
                <p className="text-sm text-gray-300">
                  Our proprietary technology analyzes your form in real-time, providing instant feedback
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#252525] rounded-lg p-6 w-72 border-t-2 border-[#f23c21]"
              >
                <div className="w-12 h-12 rounded-full bg-[#f23c21]/20 flex items-center justify-center mb-4">
                  <span className="text-[#f23c21] font-bold text-xl">🌳</span>
                </div>
                <h3 className="font-bebas text-xl mb-2">SKILL TREE</h3>
                <p className="text-sm text-gray-300">
                  Structured paths to develop sport-specific abilities with clear progression
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#252525] rounded-lg p-6 w-72 border-t-2 border-[#f23c21]"
              >
                <div className="w-12 h-12 rounded-full bg-[#f23c21]/20 flex items-center justify-center mb-4">
                  <span className="text-[#f23c21] font-bold text-xl">🏆</span>
                </div>
                <h3 className="font-bebas text-xl mb-2">SOCIAL CHALLENGES</h3>
                <p className="text-sm text-gray-300">
                  Compete with friends and climb the leaderboards to earn recognition
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#252525] rounded-lg p-6 w-72 border-t-2 border-[#f23c21]"
              >
                <div className="w-12 h-12 rounded-full bg-[#f23c21]/20 flex items-center justify-center mb-4">
                  <span className="text-[#f23c21] font-bold text-xl">📊</span>
                </div>
                <h3 className="font-bebas text-xl mb-2">DIGITAL RESUME</h3>
                <p className="text-sm text-gray-300">Showcase verified achievements to coaches and recruiters</p>
              </motion.div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">Swipe for more features</p>
          </div>
        </div>
      </section>

      {/* Sports Coverage */}
      <section className="py-16 px-4 bg-[#252525]">
        <div className="container mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            YOUR SPORT, <span className="text-[#f23c21]">YOUR WAY</span>
          </h2>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-4 min-w-max">
              {/* Basketball */}
              <button
                onClick={() => setSelectedSport("basketball")}
                className={`p-4 rounded-lg flex flex-col items-center w-32 ${selectedSport === "basketball" ? "bg-[#f23c21]" : "bg-[#1c1c1c]"}`}
              >
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">🏀</span>
                </div>
                <span className="font-medium text-sm">Basketball</span>
              </button>

              {/* Soccer */}
              <button
                onClick={() => setSelectedSport("soccer")}
                className={`p-4 rounded-lg flex flex-col items-center w-32 ${selectedSport === "soccer" ? "bg-[#f23c21]" : "bg-[#1c1c1c]"}`}
              >
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">⚽</span>
                </div>
                <span className="font-medium text-sm">Soccer</span>
              </button>

              {/* Fitness */}
              <button
                onClick={() => setSelectedSport("fitness")}
                className={`p-4 rounded-lg flex flex-col items-center w-32 ${selectedSport === "fitness" ? "bg-[#f23c21]" : "bg-[#1c1c1c]"}`}
              >
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">💪</span>
                </div>
                <span className="font-medium text-sm">Fitness</span>
              </button>

              {/* Tennis - Coming Soon */}
              <div className="p-4 rounded-lg flex flex-col items-center w-32 bg-[#1c1c1c] opacity-60">
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">🎾</span>
                </div>
                <span className="font-medium text-sm">Tennis</span>
                <span className="text-xs text-[#f23c21]">Coming Soon</span>
              </div>

              {/* Volleyball - Coming Soon */}
              <div className="p-4 rounded-lg flex flex-col items-center w-32 bg-[#1c1c1c] opacity-60">
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">🏐</span>
                </div>
                <span className="font-medium text-sm">Volleyball</span>
                <span className="text-xs text-[#f23c21]">Coming Soon</span>
              </div>

              {/* Running - Coming Soon */}
              <div className="p-4 rounded-lg flex flex-col items-center w-32 bg-[#1c1c1c] opacity-60">
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">🏃</span>
                </div>
                <span className="font-medium text-sm">Running</span>
                <span className="text-xs text-[#f23c21]">Coming Soon</span>
              </div>

              {/* Request Sport */}
              <button className="p-4 rounded-lg flex flex-col items-center w-32 bg-[#1c1c1c] border border-dashed border-gray-600">
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-2">
                  <span className="text-2xl">➕</span>
                </div>
                <span className="font-medium text-sm">Request Sport</span>
              </button>
            </div>
          </div>

          {/* Sport-specific challenges */}
          <div className="mt-8 bg-[#1c1c1c] rounded-lg p-6">
            <h3 className="font-bebas text-2xl mb-4">
              {selectedSport === "basketball" && "BASKETBALL CHALLENGES"}
              {selectedSport === "soccer" && "SOCCER CHALLENGES"}
              {selectedSport === "fitness" && "FITNESS CHALLENGES"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSport === "basketball" && (
                <>
                  <div className="bg-[#252525] p-4 rounded">
                    <h4 className="font-medium">Free Throw Mastery</h4>
                    <p className="text-sm text-gray-400">Perfect your shooting form and consistency</p>
                  </div>
                  <div className="bg-[#252525] p-4 rounded">
                    <h4 className="font-medium">Dribble Challenge</h4>
                    <p className="text-sm text-gray-400">Improve ball handling and control</p>
                  </div>
                </>
              )}

              {selectedSport === "soccer" && (
                <>
                  <div className="bg-[#252525] p-4 rounded">
                    <h4 className="font-medium">Precision Passing</h4>
                    <p className="text-sm text-gray-400">Master passing accuracy and weight</p>
                  </div>
                  <div className="bg-[#252525] p-4 rounded">
                    <h4 className="font-medium">Free Kick Technique</h4>
                    <p className="text-sm text-gray-400">Perfect your set piece execution</p>
                  </div>
                </>
              )}

              {selectedSport === "fitness" && (
                <>
                  <div className="bg-[#252525] p-4 rounded">
                    <h4 className="font-medium">Perfect Squat Form</h4>
                    <p className="text-sm text-gray-400">Optimize your technique for safety and results</p>
                  </div>
                  <div className="bg-[#252525] p-4 rounded">
                    <h4 className="font-medium">HIIT Performance</h4>
                    <p className="text-sm text-gray-400">Track and improve your high-intensity intervals</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-16 px-4 bg-[#1c1c1c]">
        <div className="container mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            CHOOSE YOUR <span className="text-[#f23c21]">PATH</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#252525] rounded-lg p-6">
              <h3 className="font-bebas text-2xl mb-2">FREE</h3>
              <p className="text-sm text-gray-400 mb-4">Get started with basic features</p>
              <div className="text-3xl font-bold mb-6">
                ₹0<span className="text-sm font-normal text-gray-400">/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>3 daily challenges</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Basic form analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Public leaderboards</span>
                </li>
                <li className="flex items-start text-gray-500">
                  <span className="h-5 w-5 mr-2 flex-shrink-0">✗</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start text-gray-500">
                  <span className="h-5 w-5 mr-2 flex-shrink-0">✗</span>
                  <span>Personalized skill tree</span>
                </li>
              </ul>

              <Button variant="outline" size="lg" className="w-full">
                SIGN UP FREE
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#252525] rounded-lg p-6 border border-[#f23c21] relative">
              <div className="absolute -top-3 right-4 bg-[#f23c21] text-white text-xs font-bold px-3 py-1 rounded">
                BEST VALUE
              </div>
              <h3 className="font-bebas text-2xl mb-2">PREMIUM</h3>
              <p className="text-sm text-gray-400 mb-4">Unlock your full potential</p>
              <div className="text-3xl font-bold mb-1">
                ₹149<span className="text-sm font-normal text-gray-400">/month</span>
              </div>
              <div className="mb-6">
                <span className="text-sm text-gray-400 line-through">₹299</span>
                <span className="text-xs bg-[#f23c21]/20 text-[#f23c21] px-2 py-1 rounded ml-2">LAUNCH SPECIAL</span>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Unlimited challenges</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Personalized skill tree</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Exclusive challenges & content</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 flex-shrink-0" />
                  <span>Digital athletic resume</span>
                </li>
              </ul>

              <Button variant="destructive" size="lg" className="w-full bg-[#f23c21] hover:bg-[#d92c11]">
                TRY FREE FOR 7 DAYS
              </Button>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-400">No credit card required. Cancel anytime.</p>
                <div className="flex items-center justify-center mt-2">
                  <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">30-DAY GUARANTEE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassador Section */}
      <section className="py-16 px-4 bg-[#252525] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Athletes in action"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto relative z-10">
          <h2 className="font-bebas text-4xl md:text-5xl mb-12 text-center">
            OUR <span className="text-[#f23c21]">AMBASSADORS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ambassador 1 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Ambassador"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold mb-1">Virat Sharma</h3>
              <p className="text-sm text-gray-400 mb-2">National Basketball Player</p>
              <p className="text-sm text-gray-300 italic">
                "SportSkill transformed how I approach training. The data-driven insights are game-changing."
              </p>
            </div>

            {/* Ambassador 2 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Ambassador"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold mb-1">Anjali Desai</h3>
              <p className="text-sm text-gray-400 mb-2">Professional Soccer Player</p>
              <p className="text-sm text-gray-300 italic">
                "I recommend SportSkill to all young athletes looking to get noticed by scouts and coaches."
              </p>
            </div>

            {/* Ambassador 3 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Ambassador"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold mb-1">Raj Patel</h3>
              <p className="text-sm text-gray-400 mb-2">Fitness Influencer</p>
              <p className="text-sm text-gray-300 italic">
                "The AI form analysis has helped thousands of my followers avoid injuries and maximize results."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-16 px-4 bg-[#1c1c1c]">
        <div className="container mx-auto max-w-xl">
          <h2 className="font-bebas text-4xl md:text-5xl mb-6 text-center">
            JOIN THE <span className="text-[#f23c21]">MOVEMENT</span>
          </h2>

          <p className="text-center text-gray-300 mb-8">
            Be among the first to experience the future of sports skill development. Limited spots available for early
            access.
          </p>

          <div className="bg-[#252525] rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-[#1c1c1c] border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f23c21]"
              />
              <Button variant="destructive" size="lg" className="bg-[#f23c21] hover:bg-[#d92c11]">
                GET EARLY ACCESS <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center">We respect your privacy. No spam, ever.</p>
          </div>

          <div className="text-center mb-8">
            <div className="font-bebas text-xl mb-2">OFFICIAL LAUNCH IN</div>
            <div className="font-bebas text-4xl text-[#f23c21]">{daysToLaunch} DAYS</div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm" className="rounded-full">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Share
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="font-bebas text-2xl tracking-wider mb-4 md:mb-0">
              SPORT<span className="text-[#f23c21]">SKILL</span>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white">
                About
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">&copy; 2025 SportSkill. All rights reserved.</p>

            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
