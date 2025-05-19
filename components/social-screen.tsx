"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { Bell, Plus, Search, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

interface Friend {
  id: number
  name: string
  avatar: string
  status: "online" | "offline" | "in-challenge"
  level: number
  lastActive?: string
}

interface Team {
  id: number
  name: string
  members: number
  avatar: string
  sport: string
  recentActivity: string
}

const friends: Friend[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    level: 12,
  },
  {
    id: 2,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "in-challenge",
    level: 15,
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    level: 9,
    lastActive: "2h ago",
  },
  {
    id: 4,
    name: "Jessica Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    level: 14,
  },
  {
    id: 5,
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    level: 11,
    lastActive: "1d ago",
  },
]

const teams: Team[] = [
  {
    id: 1,
    name: "Downtown Ballers",
    members: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    sport: "Basketball",
    recentActivity: "Team challenge completed: Free Throw Contest",
  },
  {
    id: 2,
    name: "Fitness Fanatics",
    members: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    sport: "Fitness",
    recentActivity: "New team record: 500 collective push-ups",
  },
  {
    id: 3,
    name: "Soccer Stars",
    members: 11,
    avatar: "/placeholder.svg?height=40&width=40",
    sport: "Soccer",
    recentActivity: "Team challenge started: Penalty Kick Precision",
  },
]

const friendSuggestions: Friend[] = [
  {
    id: 6,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    level: 8,
  },
  {
    id: 7,
    name: "Ryan Garcia",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    level: 10,
    lastActive: "5h ago",
  },
  {
    id: 8,
    name: "Olivia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    level: 13,
  },
]

export function SocialScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const theme = useTheme()

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22] p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="font-poppins text-xl font-bold">Social</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-[#0f0f13] text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/leaderboards">
              <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-[#0f0f13] text-white">
                <Trophy className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9 bg-[#1a1a22] border-0 text-white"
              placeholder="Search friends or teams"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="friends" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1a1a22]">
              <TabsTrigger
                value="friends"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Teams
              </TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="mt-4 space-y-4">
              {/* Online Friends */}
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredFriends.length > 0 ? (
                      filteredFriends.map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1a22] ${
                                  friend.status === "online"
                                    ? "bg-green-500"
                                    : friend.status === "in-challenge"
                                      ? `bg-[${theme.colors.primary}]`
                                      : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <p className="font-medium">{friend.name}</p>
                              <p className="text-xs text-gray-400">
                                {friend.status === "online"
                                  ? "Online"
                                  : friend.status === "in-challenge"
                                    ? "In Challenge"
                                    : `Last active ${friend.lastActive}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-[#0f0f13] border-0">
                              Lvl {friend.level}
                            </Badge>
                            <Button size="sm" className={`h-8 bg-[${theme.colors.primary}]`}>
                              Challenge
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-gray-400">No friends found</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Friend Suggestions */}
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Suggested Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {friendSuggestions.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1a22] ${
                                friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <p className="font-medium">{friend.name}</p>
                            <p className="text-xs text-gray-400">
                              {friend.status === "online" ? "Online" : `Last active ${friend.lastActive}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-8 border-[${theme.colors.secondary}] text-[${theme.colors.secondary}] hover:bg-[${theme.colors.secondary}] hover:text-white`}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="teams" className="mt-4 space-y-4">
              {/* My Teams */}
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">My Teams</CardTitle>
                  <Button size="sm" className={`bg-[${theme.colors.primary}]`}>
                    <Plus className="mr-1 h-4 w-4" />
                    Create Team
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div key={team.id} className="rounded-lg border border-[#0f0f13] p-4">
                        <div className="mb-2 flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={team.avatar || "/placeholder.svg"} alt={team.name} />
                            <AvatarFallback className="bg-[#0f0f13]">
                              <Users className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-poppins text-lg font-medium">{team.name}</h3>
                              <Badge className={`bg-[${theme.colors.primary}]`}>{team.sport}</Badge>
                            </div>
                            <p className="text-sm text-gray-400">{team.members} members</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-[#0f0f13] p-3 text-sm text-gray-300">
                          <p>{team.recentActivity}</p>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#0f0f13] bg-[#0f0f13] text-white hover:bg-[#0f0f13]/80"
                          >
                            Team Chat
                          </Button>
                          <Button size="sm" className={`bg-[${theme.colors.primary}]`}>
                            View Team
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Invitations */}
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Team Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed border-[#0f0f13] p-6 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-gray-400">No pending team invitations</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
