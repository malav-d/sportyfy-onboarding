"use client"

import { useState } from "react"
import { Search, Bell } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import AuthPanel from "@/components/auth/auth-panel"

export default function Header() {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-full px-4 py-2">
                <span className="text-white font-bold text-lg">SPORTYFY</span>
                <span className="text-red-400 font-bold text-lg">.LIVE</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#challenges" className="text-gray-300 hover:text-white transition-colors">
                Challenges
              </a>
              <a href="#leaderboard" className="text-gray-300 hover:text-white transition-colors">
                Leaderboard
              </a>
              <a href="#sports" className="text-gray-300 hover:text-white transition-colors">
                Sports
              </a>
              <a href="#community" className="text-gray-300 hover:text-white transition-colors">
                Community
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm">Hi, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthPanelOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthPanel isOpen={isAuthPanelOpen} onClose={() => setIsAuthPanelOpen(false)} />
    </>
  )
}
