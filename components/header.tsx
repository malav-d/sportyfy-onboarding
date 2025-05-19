"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LiveIndicator } from "@/components/live-indicator"
import Link from "next/link"

interface HeaderProps {
  viewerCount: number
}

export function Header({ viewerCount }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1c1c1c]/95 backdrop-blur-sm py-2 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="font-['Bebas_Neue'] text-2xl md:text-3xl tracking-wider">
              SPORTYFY <span className="text-[#f23c21]">.LIVE</span>
            </h1>
          </Link>

          {isScrolled && (
            <div className="ml-4 hidden md:flex items-center">
              <LiveIndicator />
              <span className="ml-2 text-sm font-medium">{viewerCount.toLocaleString()} LIVE</span>
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#vision" className="text-sm font-medium hover:text-[#f23c21] transition-colors">
            VISION
          </Link>
          <Link href="#how" className="text-sm font-medium hover:text-[#f23c21] transition-colors">
            HOW
          </Link>
          <Link href="#sports" className="text-sm font-medium hover:text-[#f23c21] transition-colors">
            SPORTS
          </Link>
        </nav>

        <div className="flex items-center">
          <Button variant="ghost" className="mr-2 text-sm hidden md:flex">
            LOG IN
          </Button>
          <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-4 py-2 rounded-sm">
            JOIN <span className="ml-1">→</span>
          </Button>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {isScrolled && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1c]/95 backdrop-blur-sm py-3 px-4 border-t border-[#252525] md:hidden">
          <Button className="w-full bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium py-2 rounded-sm">
            JOIN NOW <span className="ml-1">→</span>
          </Button>
        </div>
      )}
    </header>
  )
}
