"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, BarChart2, Trophy } from "lucide-react"
import { useInView } from "react-intersection-observer"

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      number: 1,
      title: "CAPTURE",
      description: "Record your performance with any smartphone",
      icon: <Camera className="h-8 w-8" />,
    },
    {
      number: 2,
      title: "ANALYZE",
      description: "Our AI instantly breaks down your form and technique",
      icon: <BarChart2 className="h-8 w-8" />,
    },
    {
      number: 3,
      title: "IMPROVE",
      description: "Track progress, compete with friends, earn badges",
      icon: <Trophy className="h-8 w-8" />,
    },
  ]

  return (
    <section className="py-20 bg-[#1c1c1c]" id="how">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          LEVEL UP YOUR <span className="text-[#f23c21]">GAME</span>
        </h2>

        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#252525] -translate-y-1/2 z-0"></div>

            {steps.map((step) => (
              <div
                key={step.number}
                className={`relative z-10 flex flex-col items-center cursor-pointer`}
                onClick={() => setActiveStep(step.number)}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-colors duration-300 ${
                    activeStep >= step.number ? "bg-[#f23c21] text-white" : "bg-[#252525] text-gray-400"
                  }`}
                >
                  {step.number}
                </div>
                <p
                  className={`mt-2 font-['Bebas_Neue'] text-xl tracking-wide transition-colors duration-300 ${
                    activeStep >= step.number ? "text-white" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#252525] p-8 rounded-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h3 className="font-['Bebas_Neue'] text-3xl mb-4 tracking-wide">{steps[activeStep - 1].title}</h3>
                <p className="text-gray-300 mb-6">{steps[activeStep - 1].description}</p>

                <div className="flex items-center gap-4">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                        activeStep === step.number ? "bg-[#f23c21]" : "bg-gray-600"
                      }`}
                      onClick={() => setActiveStep(step.number)}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="border-8 border-[#1c1c1c] rounded-3xl overflow-hidden shadow-xl w-64">
                    <div className="bg-[#1c1c1c] p-2 flex items-center justify-between">
                      <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                      <div className="w-3 h-3 bg-[#f23c21] rounded-full"></div>
                    </div>
                    <div className="aspect-[9/16] bg-black/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#f23c21]/20 flex items-center justify-center">
                        {steps[activeStep - 1].icon}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 -left-4 h-8 bg-[#f23c21]/20 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
              SEE HOW IT WORKS <span className="ml-1">→</span>
            </Button>
          </div>

          <div className="mt-12 bg-[#252525] p-6 rounded-sm">
            <h4 className="font-['Bebas_Neue'] text-xl mb-4">KEY BENEFITS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#f23c21] rounded-full mt-2 mr-2"></div>
                <p className="text-gray-300">Real-time feedback on your technique</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#f23c21] rounded-full mt-2 mr-2"></div>
                <p className="text-gray-300">Personalized improvement plans</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#f23c21] rounded-full mt-2 mr-2"></div>
                <p className="text-gray-300">Track progress with detailed metrics</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#f23c21] rounded-full mt-2 mr-2"></div>
                <p className="text-gray-300">Compare with friends and pros</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
