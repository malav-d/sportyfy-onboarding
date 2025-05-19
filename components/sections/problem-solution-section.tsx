"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { CheckCircle, XCircle, TrendingUp } from "lucide-react"

export function ProblemSolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  // Connection lines animation
  useEffect(() => {
    if (isInView && sectionRef.current) {
      gsap.fromTo(".connection-line", { width: 0 }, { width: "100%", duration: 1.5, ease: "power3.out", stagger: 0.2 })
    }
  }, [isInView])

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden animate-section" id="features">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff073a]/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d9ff]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#00d9ff]"
        >
          THE SPORTYFY ADVANTAGE
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Problem Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff073a]/50 to-[#ff073a]/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-[#ff073a]/20 h-full">
              <div className="w-16 h-16 bg-[#ff073a]/20 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-8 w-8 text-[#ff073a]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">TRADITIONAL TRAINING</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span>Subjective feedback without data</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span>Expensive coaching with limited access</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span>Inconsistent progress tracking</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-[#ff073a] mr-3 shrink-0 mt-0.5" />
                  <span>No verified achievements</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Connection lines */}
          <div className="hidden md:flex flex-col justify-center items-center">
            <div className="connection-line h-0.5 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] w-0 mb-8"></div>
            <div className="connection-line h-0.5 bg-gradient-to-r from-[#00d9ff] to-[#ff073a] w-0 mb-8"></div>
            <div className="connection-line h-0.5 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] w-0 mb-8"></div>
            <div className="connection-line h-0.5 bg-gradient-to-r from-[#00d9ff] to-[#ff073a] w-0"></div>
          </div>

          {/* Solution Card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00d9ff]/30 to-[#00d9ff]/50 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-[#00d9ff]/20 h-full">
              <div className="w-16 h-16 bg-[#00d9ff]/20 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-[#00d9ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">SPORTYFY METHOD</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span>AI-powered analysis and feedback</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span>Affordable subscription with unlimited access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span>Data-driven progress measurement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#00d9ff] mr-3 shrink-0 mt-0.5" />
                  <span>Gamified skill development</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 relative group max-w-2xl mx-auto"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff073a]/30 to-[#00d9ff]/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 h-full">
            <h3 className="text-2xl font-bold mb-6 text-center text-white">YOUR RESULTS</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#00d9ff] mb-2">
                  37%
                </div>
                <p className="text-sm text-white/70">Average Skill Improvement</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00d9ff] to-[#ff073a] mb-2">
                  100%
                </div>
                <p className="text-sm text-white/70">Verified Achievements</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#00d9ff] mb-2">
                  24/7
                </div>
                <p className="text-sm text-white/70">Training Access</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00d9ff] to-[#ff073a] mb-2">
                  5X
                </div>
                <p className="text-sm text-white/70">Recruitment Visibility</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
