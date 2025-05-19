import Link from "next/link"
import { Instagram, Twitter, Youtube, Github } from "lucide-react"

export function FuturisticFooter() {
  return (
    <footer className="py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="relative inline-block">
              <div className="text-2xl font-bold tracking-wider mb-4">
                SPORT<span className="text-[#ff073a]">SKILL</span>
              </div>
              <div className="absolute -inset-1 bg-[#ff073a]/20 blur-md rounded-full -z-10 opacity-50"></div>
            </div>
            <p className="text-white/60 text-sm">
              India's first AI-powered sports skill development platform. Transform your game through AI analysis,
              verified achievements, and social competition.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00d9ff] transition-colors text-sm">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm mb-4 md:mb-0">© 2025 SportSkill. All rights reserved.</p>

          <div className="flex space-x-6">
            <Link href="#" className="text-white/60 hover:text-[#ff073a] transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>

            <Link href="#" className="text-white/60 hover:text-[#ff073a] transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </Link>

            <Link href="#" className="text-white/60 hover:text-[#ff073a] transition-colors">
              <span className="sr-only">YouTube</span>
              <Youtube className="h-5 w-5" />
            </Link>

            <Link href="#" className="text-white/60 hover:text-[#ff073a] transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
