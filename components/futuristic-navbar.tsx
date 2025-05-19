"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function FuturisticNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-2 border-b border-[#ff073a]/20" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <div className="relative">
            <div className="text-2xl font-bold tracking-wider">
              SPORT<span className="text-[#ff073a]">SKILL</span>
            </div>
            <div className="absolute -inset-1 bg-[#ff073a]/20 blur-md rounded-full -z-10"></div>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          {["FEATURES", "PRICING", "TESTIMONIALS", "DEMO"].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="text-sm font-medium relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center"
        >
          <Button
            variant="ghost"
            className="mr-2 text-sm hidden md:flex hover:text-[#00d9ff] hover:bg-[#00d9ff]/10 border border-[#00d9ff]/0 hover:border-[#00d9ff]/50 transition-all duration-300"
          >
            LOG IN
          </Button>
          <Button className="relative group">
            <span className="relative z-10 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] bg-clip-text text-transparent font-medium">
              SIGN UP
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] opacity-20 group-hover:opacity-30 rounded transition-opacity duration-300"></span>
            <span className="absolute -inset-0.5 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] rounded opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"></span>
          </Button>

          <button
            className="ml-4 md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
            <span
              className={`w-6 h-0.5 bg-white mt-1.5 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-md border-b border-[#ff073a]/20 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {["FEATURES", "PRICING", "TESTIMONIALS", "DEMO"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium py-2 hover:text-[#00d9ff] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                variant="ghost"
                className="justify-start px-0 text-sm hover:text-[#00d9ff] hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                LOG IN
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
