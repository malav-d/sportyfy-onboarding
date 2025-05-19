"use client"

import { Home, LayoutGrid, Trophy, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

export function NavigationBar() {
  const pathname = usePathname()
  const theme = useTheme()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: LayoutGrid, label: "Discover", path: "/challenges" },
    { icon: Trophy, label: "Challenges", path: "/my-challenges" },
    { icon: MessageSquare, label: "Social", path: "/social" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  return (
    <div className="sticky bottom-0 border-t border-[#1a1a22] bg-[#0f0f13] py-2 z-10">
      <div className="mx-auto flex max-w-5xl justify-around">
        {navItems.map((item) => (
          <Link href={item.path} key={item.path}>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-1 py-2 ${
                isActive(item.path) ? `text-[${theme.colors.primary}]` : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive(item.path) ? `text-[${theme.colors.primary}]` : "text-gray-400"}`}
              />
              <span
                className={`text-xs ${
                  isActive(item.path) ? `font-medium text-[${theme.colors.primary}]` : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
