"use client"

import { useState } from "react"
import { Brain, GitBranch, Users, Award } from "lucide-react"
import { useInView } from "react-intersection-observer"

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-[#f23c21]" />,
      title: "AI ANALYSIS",
      description:
        "Our proprietary technology analyzes your form in real-time, providing instant feedback and corrections.",
    },
    {
      icon: <GitBranch className="h-8 w-8 text-[#f23c21]" />,
      title: "SKILL TREE",
      description:
        "Follow structured paths to develop sport-specific abilities with clear progression and achievements.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#f23c21]" />,
      title: "SOCIAL CHALLENGES",
      description: "Compete with friends, join teams, and climb the leaderboards to prove your skills.",
    },
    {
      icon: <Award className="h-8 w-8 text-[#f23c21]" />,
      title: "DIGITAL RESUME",
      description: "Showcase verified achievements to coaches and recruiters with your digital sports portfolio.",
    },
  ]

  return (
    <section className="py-20 bg-[#1c1c1c]" id="features">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          FEATURE <span className="text-[#f23c21]">HIGHLIGHTS</span>
        </h2>

        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Mobile Swipeable Cards */}
          <div className="md:hidden relative">
            <div className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-[280px] bg-[#252525] p-6 rounded-sm border-t-2 ${
                      activeFeature === index ? "border-[#f23c21]" : "border-gray-700"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="w-12 h-12 bg-[#1c1c1c] rounded-full flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeFeature === index ? "bg-[#f23c21]" : "bg-gray-600"}`}
                ></div>
              ))}
            </div>
            <div className="absolute right-4 bottom-6 text-sm text-gray-400">Swipe for more</div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-[#252525] p-6 rounded-sm border-t-2 ${
                  activeFeature === index ? "border-[#f23c21]" : "border-gray-700"
                } hover:border-[#f23c21] transition-colors cursor-pointer`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 bg-[#1c1c1c] rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Detail */}
          <div className="mt-12 bg-[#252525] p-6 rounded-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#1c1c1c] rounded-full flex items-center justify-center mr-4">
                {features[activeFeature].icon}
              </div>
              <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">{features[activeFeature].title}</h3>
            </div>

            <div className="aspect-video bg-[#1c1c1c] rounded-sm flex items-center justify-center mb-4">
              <img
                src="/placeholder.svg?height=400&width=700"
                alt={features[activeFeature].title}
                className="w-full h-full object-cover rounded-sm"
              />
            </div>

            <p className="text-gray-300">{features[activeFeature].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
