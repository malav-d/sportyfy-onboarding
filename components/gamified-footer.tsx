import Link from "next/link"
import { Instagram, Twitter, Youtube, Twitch } from "lucide-react"

type GamifiedFooterProps = {
  theme: any
}

export function GamifiedFooter({ theme }: GamifiedFooterProps) {
  return (
    <footer className="py-12 bg-dark border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-bold tracking-tight mb-4">
              SPORT<span className="text-primary">SKILL</span>
            </div>
            <p className="text-white/60 text-sm">
              The ultimate platform for sports challenges, trick shots, and viral moments. Film, share, compete, and
              become a legend.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Challenges</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Trending Challenges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Daily Challenges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Create a Challenge
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Challenge Rules
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Creator Program
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Discord
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-secondary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm mb-4 md:mb-0">© 2025 SportSkill. All rights reserved.</p>

          <div className="flex space-x-6">
            <Link href="#" className="text-white/60 hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>

            <Link href="#" className="text-white/60 hover:text-secondary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>

            <Link href="#" className="text-white/60 hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>

            <Link href="#" className="text-white/60 hover:text-secondary transition-colors">
              <Twitch className="h-5 w-5" />
              <span className="sr-only">Twitch</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
