"use client"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type WaitlistCTAProps = {
  theme: any
}

export function WaitlistCTA({ theme }: WaitlistCTAProps) {
  // No state needed for simple scroll functionality

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/futuristic-sports-grid.png')] opacity-10 z-0"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff073a]/10 to-[#8667ff]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#8667ff]">
            READY TO GO VIRAL?
          </h2>

          <p className="text-white/80 mb-12 text-lg">Join thousands of athletes creating epic sports moments</p>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff073a] to-[#8667ff] rounded-full blur-md opacity-70 animate-pulse-slow"></div>
              <Button
                onClick={() => {
                  // Scroll to the questionnaire section
                  const questionnaireSection = document.getElementById("waitlist-questionnaire")
                  if (questionnaireSection) {
                    questionnaireSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="relative w-full py-6 text-lg font-bold group overflow-hidden rounded-full bg-black/60 backdrop-blur-sm border-0"
              >
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
                  JOIN THE WAITLIST
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff073a] to-[#8667ff] group-hover:opacity-80 transition-opacity duration-300"></span>
                <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </Button>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-white/60 mb-4"></p>
            <div className="flex justify-center gap-4">
              <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-6 py-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Facebook
              </button>
              <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-6 py-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                Twitter
              </button>
            </div>
          </div>

          <a href="#" className="text-[#8667ff] hover:underline flex items-center justify-center">
            Watch more challenges <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
