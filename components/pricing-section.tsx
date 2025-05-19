"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useInView } from "react-intersection-observer"

export function PricingSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-[#1c1c1c]" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          CHOOSE YOUR <span className="text-[#f23c21]">PATH</span>
        </h2>

        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#252525] p-6 rounded-sm border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">FREE</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">₹0</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">Perfect for casual athletes</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Limited daily challenges</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Basic form analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Public leaderboards</span>
                </div>
                <div className="flex items-center">
                  <X className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                  <span className="text-gray-500">Advanced analytics</span>
                </div>
                <div className="flex items-center">
                  <X className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                  <span className="text-gray-500">Exclusive content</span>
                </div>
                <div className="flex items-center">
                  <X className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                  <span className="text-gray-500">Digital sports resume</span>
                </div>
              </div>

              <div className="mt-8">
                <Button className="w-full bg-[#252525] hover:bg-[#333] text-white border border-gray-700 font-medium py-6 rounded-sm">
                  GET STARTED
                </Button>
              </div>
            </div>

            <div className="bg-[#252525] p-6 rounded-sm border-2 border-[#f23c21] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#f23c21] px-4 py-1 text-sm font-medium">
                BEST VALUE
              </div>

              <div className="text-center mb-6">
                <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">PREMIUM</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">₹149</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-[#f23c21]">LAUNCH SPECIAL (Reg. ₹299)</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#f23c21] mr-2 shrink-0" />
                  <span>Unlimited challenges</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#f23c21] mr-2 shrink-0" />
                  <span>Advanced AI form analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#f23c21] mr-2 shrink-0" />
                  <span>Private & public leaderboards</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#f23c21] mr-2 shrink-0" />
                  <span>Detailed performance analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#f23c21] mr-2 shrink-0" />
                  <span>Exclusive training content</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#f23c21] mr-2 shrink-0" />
                  <span>Verified digital sports resume</span>
                </div>
              </div>

              <div className="mt-8">
                <Button className="w-full bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium py-6 rounded-sm">
                  TRY FREE FOR 7 DAYS
                </Button>
                <p className="text-center text-xs text-gray-400 mt-2">No credit card required</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#252525] p-6 rounded-sm text-center">
            <div className="inline-block bg-[#1c1c1c] px-4 py-2 rounded-full mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#f23c21]/20 rounded-full flex items-center justify-center mr-2">
                  <Check className="h-4 w-4 text-[#f23c21]" />
                </div>
                <span className="text-sm font-medium">30-DAY MONEY-BACK GUARANTEE</span>
              </div>
            </div>
            <p className="text-gray-300">
              Not satisfied with SportSkill Premium? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
