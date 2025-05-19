"use client"

import { useInView } from "react-intersection-observer"

export function AmbassadorSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const ambassadors = [
    {
      name: "Vikram Mehta",
      sport: "Basketball",
      quote: "Sportyfy transformed my training routine completely.",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      name: "Ananya Desai",
      sport: "Soccer",
      quote: "The analytics helped me secure a college scholarship.",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      name: "Rajiv Kumar",
      sport: "Fitness",
      quote: "I've seen more progress in 3 months than in the past year.",
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-[#252525] to-[#1c1c1c] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#f23c21]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f23c21]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          OUR <span className="text-[#f23c21]">AMBASSADORS</span>
        </h2>

        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ambassadors.map((ambassador, index) => (
              <div key={index} className="bg-[#252525] p-6 rounded-sm text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#f23c21]">
                  <img
                    src={ambassador.image || "/placeholder.svg"}
                    alt={ambassador.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-['Bebas_Neue'] text-xl tracking-wide">{ambassador.name}</h3>
                <p className="text-[#f23c21] text-sm">{ambassador.sport}</p>
                <p className="mt-4 text-gray-300 italic">"{ambassador.quote}"</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#252525] p-6 rounded-sm">
            <h3 className="font-['Bebas_Neue'] text-xl mb-4 text-center">JOIN OUR AMBASSADOR PROGRAM</h3>
            <p className="text-center text-gray-300">
              Are you passionate about sports and technology? Join our ambassador program and help shape the future of
              sports training while earning rewards.
            </p>
            <div className="mt-6 text-center">
              <button className="bg-transparent hover:bg-[#f23c21]/10 text-[#f23c21] border border-[#f23c21] font-medium px-6 py-2 rounded-sm transition-colors">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
