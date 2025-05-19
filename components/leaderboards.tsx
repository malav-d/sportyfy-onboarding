"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { ArrowLeft, ChevronDown, Filter, Medal, Trophy } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

interface LeaderboardEntry {
  id: number
  name: string
  avatar: string
  country: string
  points: number
  rank: number
  change?: "up" | "down" | "same"
  changeAmount?: number
  isCurrentUser?: boolean
}

const globalLeaderboard: LeaderboardEntry[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "US",
    points: 12450,
    rank: 1,
    change: "same",
  },
  {
    id: 2,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "CA",
    points: 11320,
    rank: 2,
    change: "up",
    changeAmount: 1,
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "CN",
    points: 10890,
    rank: 3,
    change: "down",
    changeAmount: 1,
  },
  {
    id: 4,
    name: "Jordan Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "US",
    points: 9870,
    rank: 4,
    change: "up",
    changeAmount: 2,
    isCurrentUser: true,
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "UK",
    points: 9650,
    rank: 5,
    change: "down",
    changeAmount: 1,
  },
  {
    id: 6,
    name: "Ryan Garcia",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "MX",
    points: 9320,
    rank: 6,
    change: "same",
  },
  {
    id: 7,
    name: "Olivia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "ES",
    points: 8970,
    rank: 7,
    change: "up",
    changeAmount: 3,
  },
  {
    id: 8,
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "KR",
    points: 8760,
    rank: 8,
    change: "down",
    changeAmount: 1,
  },
  {
    id: 9,
    name: "Jessica Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "AU",
    points: 8540,
    rank: 9,
    change: "same",
  },
  {
    id: 10,
    name: "Mohammed Ali",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "AE",
    points: 8320,
    rank: 10,
    change: "up",
    changeAmount: 2,
  },
]

export function Leaderboards() {
  const [leaderboardType, setLeaderboardType] = useState("global")
  const [timeFrame, setTimeFrame] = useState("weekly")
  const [category, setCategory] = useState("all")
  const theme = useTheme()

  const currentUserRank = globalLeaderboard.find((entry) => entry.isCurrentUser)?.rank || 0

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22] p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-[#0f0f13]/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-poppins text-xl font-bold">Leaderboards</h1>
          <div className="ml-auto">
            <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-[#0f0f13] text-white">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Leaderboard Type Tabs */}
          <Tabs defaultValue="global" onValueChange={setLeaderboardType} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#1a1a22]">
              <TabsTrigger
                value="global"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Global
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="local"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Local
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Teams
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Time Period Filter */}
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Time Period:</span>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-0 bg-[#1a1a22] text-white">
                {timeFrame === "weekly" ? "Weekly" : timeFrame === "monthly" ? "Monthly" : "All Time"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Category:</span>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-0 bg-[#1a1a22] text-white">
                {category === "all"
                  ? "All Sports"
                  : category === "basketball"
                    ? "Basketball"
                    : category === "soccer"
                      ? "Soccer"
                      : "Fitness"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 py-4">
            {/* 2nd Place */}
            {globalLeaderboard.length > 1 && (
              <div className="flex flex-col items-center">
                <Avatar className="mb-2 h-16 w-16 border-2 border-[#1a1a22]">
                  <AvatarImage
                    src={globalLeaderboard[1].avatar || "/placeholder.svg"}
                    alt={globalLeaderboard[1].name}
                  />
                  <AvatarFallback>{globalLeaderboard[1].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex h-24 w-20 flex-col items-center justify-center rounded-t-lg bg-[#1a1a22]">
                  <Medal className={`mb-1 h-6 w-6 text-[${theme.colors.secondary}]`} />
                  <p className="font-poppins text-sm font-medium">{globalLeaderboard[1].name}</p>
                  <p className="text-xs text-gray-400">{globalLeaderboard[1].points} pts</p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {globalLeaderboard.length > 0 && (
              <div className="flex flex-col items-center">
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-white`}
                >
                  <Trophy className="h-5 w-5" />
                </div>
                <Avatar className={`mb-2 h-20 w-20 border-4 border-[${theme.colors.primary}]`}>
                  <AvatarImage
                    src={globalLeaderboard[0].avatar || "/placeholder.svg"}
                    alt={globalLeaderboard[0].name}
                  />
                  <AvatarFallback>{globalLeaderboard[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div
                  className={`flex h-32 w-24 flex-col items-center justify-center rounded-t-lg bg-[${theme.colors.primary}] text-white`}
                >
                  <p className="font-poppins text-lg font-bold">#1</p>
                  <p className="text-center font-poppins font-medium">{globalLeaderboard[0].name}</p>
                  <p className="text-sm">{globalLeaderboard[0].points} pts</p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {globalLeaderboard.length > 2 && (
              <div className="flex flex-col items-center">
                <Avatar className={`mb-2 h-16 w-16 border-2 border-[${theme.colors.secondary}]`}>
                  <AvatarImage
                    src={globalLeaderboard[2].avatar || "/placeholder.svg"}
                    alt={globalLeaderboard[2].name}
                  />
                  <AvatarFallback>{globalLeaderboard[2].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-t-lg bg-[${theme.colors.secondary}]`}
                >
                  <Medal className="mb-1 h-6 w-6 text-white" />
                  <p className="font-poppins text-sm font-medium text-white">{globalLeaderboard[2].name}</p>
                  <p className="text-xs text-white/80">{globalLeaderboard[2].points} pts</p>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard List */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#0f0f13]">
                {globalLeaderboard.slice(3).map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-4 ${entry.isCurrentUser ? `bg-[${theme.colors.primary}]/10` : ""}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center font-medium">{entry.rank}</div>
                    <Avatar>
                      <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium">{entry.name}</p>
                        {entry.isCurrentUser && <Badge className={`ml-2 bg-[${theme.colors.primary}]`}>You</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">{entry.points} pts</span>
                        {entry.change && (
                          <span
                            className={`flex items-center text-xs ${
                              entry.change === "up"
                                ? `text-[${theme.colors.secondary}]`
                                : entry.change === "down"
                                  ? `text-[${theme.colors.primary}]`
                                  : "text-gray-400"
                            }`}
                          >
                            {entry.change === "up" && "↑"}
                            {entry.change === "down" && "↓"}
                            {entry.change === "same" && "–"}
                            {entry.changeAmount && entry.changeAmount}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-8 border-[${theme.colors.primary}] text-[${theme.colors.primary}] hover:bg-[${theme.colors.primary}] hover:text-white`}
                    >
                      Challenge
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Jump to Your Position */}
          {currentUserRank > 10 && (
            <div className="flex justify-center">
              <Button className={`bg-[${theme.colors.primary}]`}>Jump to Your Position (#{currentUserRank})</Button>
            </div>
          )}
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
