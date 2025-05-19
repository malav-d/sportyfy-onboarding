"use client"

import { useInView } from "react-intersection-observer"
import { CheckCircle, XCircle, TrendingUp } from "lucide-react"

export function AdvantageSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-[#252525]" id="advantage">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          THE SPORT<span className="text-[#f23c21]">SKILL</span> ADVANTAGE
        </h2>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-[#1c1c1c] p-6 rounded-sm border-t-2 border-gray-500">
            <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">TRADITIONAL TRAINING</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <XCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                <span>Subjective feedback without data</span>
              </li>
              <li className="flex items-start">
                <XCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                <span>Expensive coaching with limited access</span>
              </li>
              <li className="flex items-start">
                <XCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                <span>Inconsistent progress tracking</span>
              </li>
              <li className="flex items-start">
                <XCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                <span>No verified achievements</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm border-t-2 border-[#f23c21]">
            <div className="w-12 h-12 bg-[#f23c21]/20 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-[#f23c21]" />
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">SPORTSKILL METHOD</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 shrink-0 mt-0.5" />
                <span>AI-powered analysis and feedback</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 shrink-0 mt-0.5" />
                <span>Affordable subscription with unlimited access</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 shrink-0 mt-0.5" />
                <span>Data-driven progress measurement</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#f23c21] mr-2 shrink-0 mt-0.5" />
                <span>Gamified skill development</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm border-t-2 border-green-500">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">YOUR RESULTS</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>
                  <span className="text-[#f23c21] font-medium">37%</span> average skill improvement
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Verified digital sports resume</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Recruitment opportunities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Community recognition and rewards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
