"use client"

import { motion } from "framer-motion"
import { Rocket, Award, MessageSquare } from "lucide-react"

type WaitlistBenefitsProps = {
  theme: any
}

export function WaitlistBenefits({ theme }: WaitlistBenefitsProps) {
  const benefits = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "EARLY ACCESS",
      description: "Be among the first to create and share challenges",
    },
    {
      icon: <Award className="h-8 w-8 text-[#8667ff]" />,
      title: "EXCLUSIVE PERKS",
      description: "Founder-only badges and rewards can't be earned later",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "SHAPE THE PLATFORM",
      description: "Your feedback will influence our features",
    },
  ]

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8667ff]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          WHY JOIN THE WAITLIST?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div
                className="absolute -inset-0.5 rounded-lg opacity-50 blur group-hover:opacity-100 transition duration-300"
                style={{
                  background:
                    index % 2 === 0
                      ? `linear-gradient(45deg, ${theme.colors.primary}, transparent)`
                      : `linear-gradient(45deg, ${theme.colors.secondary}, transparent)`,
                }}
              ></div>
              <div className="relative bg-dark rounded-lg p-6 border border-gray-800 h-full">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: index % 2 === 0 ? `${theme.colors.primary}20` : `${theme.colors.secondary}20` }}
                >
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
