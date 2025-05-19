"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-sm py-2 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <h1 className="font-['Bebas_Neue'] text-2xl md:text-3xl tracking-wider">
            SPORT<span className="text-[#f23c21]">SKILL</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="#how" className="text-sm font-medium hover:text-[#f23c21] transition-colors">
            HOW IT WORKS
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-[#f23c21] transition-colors">
            FEATURES
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-[#f23c21] transition-colors">
            PRICING
          </Link>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" className="mr-2 text-sm hidden md:flex hover:text-[#f23c21] hover:bg-transparent">
            LOG IN
          </Button>
          <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-4 py-2 rounded-sm">
            SIGN UP
          </Button>
          <Button variant="ghost" size="icon" className="ml-2 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#how"
              className="text-sm font-medium py-2 hover:text-[#f23c21] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              HOW IT WORKS
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium py-2 hover:text-[#f23c21] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FEATURES
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium py-2 hover:text-[#f23c21] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              PRICING
            </Link>
            <Button
              variant="ghost"
              className="justify-start px-0 text-sm hover:text-[#f23c21] hover:bg-transparent"
              onClick={() => setIsMenuOpen(false)}
            >
              LOG IN
            </Button>
          </div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      {isScrolled && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm py-3 px-4 border-t border-[#252525] md:hidden">
          <Button className="w-full bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium py-2 rounded-sm">
            GET STARTED <span className="ml-1">→</span>
          </Button>
        </div>
      )}
    </header>
  )
}
