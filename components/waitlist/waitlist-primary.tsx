"use client"
import { motion } from "framer-motion"
import { WaitlistQuestionnaire } from "./waitlist-questionnaire"

type WaitlistPrimaryProps = {
  theme: any
}

export function WaitlistPrimary({ theme }: WaitlistPrimaryProps) {
  return (
    <section id="waitlist-questionnaire" className="py-20 bg-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#ff073a]/10 to-[#8667ff]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] via-white to-[#8667ff] animate-gradient">
              BE THE FIRST TO GO VIRAL
            </h2>
            <p className="text-xl text-white/80">Early access. Exclusive perks. Founding athlete status.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Perks list */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ul className="space-y-6">
                {[
                  { icon: "🏆", title: "Founding Athlete Badge", desc: "Limited Edition" },
                  { icon: "⚡", title: "Priority Access", desc: "To Launch Challenges" },
                  { icon: "🥇", title: "Featured on Launch", desc: "Leaderboard" },
                  { icon: "🎮", title: "Early Creator", desc: "Application Rights" },
                ].map((perk, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="mr-4 text-2xl">{perk.icon}</div>
                    <div>
                      <h3 className="font-bold text-white">{perk.title}</h3>
                      <p className="text-white/60 text-sm">{perk.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Questionnaire */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <WaitlistQuestionnaire theme={theme} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
