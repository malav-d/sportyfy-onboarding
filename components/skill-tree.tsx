"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { NavigationBar } from "@/components/navigation-bar"
import { ArrowLeft, Lock, Maximize, Minimize, Search, Zap } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

interface SkillNode {
  id: string
  name: string
  description: string
  status: "mastered" | "in-progress" | "locked" | "available"
  progress: number
  xpReward: number
  position: { x: number; y: number }
  connections: string[]
}

const skillNodes: SkillNode[] = [
  {
    id: "basic-dribbling",
    name: "Basic Dribbling",
    description: "Master the fundamentals of ball handling",
    status: "mastered",
    progress: 100,
    xpReward: 100,
    position: { x: 50, y: 80 },
    connections: ["crossover-dribble", "behind-back-dribble"],
  },
  {
    id: "crossover-dribble",
    name: "Crossover Dribble",
    description: "Learn to switch hands quickly while maintaining control",
    status: "mastered",
    progress: 100,
    xpReward: 150,
    position: { x: 30, y: 60 },
    connections: ["advanced-crossover"],
  },
  {
    id: "behind-back-dribble",
    name: "Behind-the-Back",
    description: "Master dribbling behind your back to protect the ball",
    status: "in-progress",
    progress: 65,
    xpReward: 150,
    position: { x: 70, y: 60 },
    connections: ["spin-move"],
  },
  {
    id: "advanced-crossover",
    name: "Advanced Crossover",
    description: "Combine multiple crossovers with changes in speed",
    status: "available",
    progress: 0,
    xpReward: 200,
    position: { x: 20, y: 40 },
    connections: ["combo-dribble"],
  },
  {
    id: "spin-move",
    name: "Spin Move",
    description: "Execute a quick spin to evade defenders",
    status: "locked",
    progress: 0,
    xpReward: 200,
    position: { x: 80, y: 40 },
    connections: ["combo-dribble"],
  },
  {
    id: "combo-dribble",
    name: "Combo Dribble",
    description: "Chain multiple dribble moves together seamlessly",
    status: "locked",
    progress: 0,
    xpReward: 300,
    position: { x: 50, y: 20 },
    connections: [],
  },
]

export function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [activeCategory, setActiveCategory] = useState("Basketball")
  const theme = useTheme()

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node)
  }

  const getNodeColor = (status: SkillNode["status"]) => {
    switch (status) {
      case "mastered":
        return `bg-[${theme.colors.secondary}] border-[${theme.colors.secondary}]`
      case "in-progress":
        return `bg-[${theme.colors.primary}] border-[${theme.colors.primary}]`
      case "available":
        return "bg-white border-gray-300"
      case "locked":
        return "bg-gray-300 border-gray-400"
    }
  }

  const getNodeTextColor = (status: SkillNode["status"]) => {
    switch (status) {
      case "mastered":
      case "in-progress":
        return "text-white"
      case "available":
        return "text-gray-800"
      case "locked":
        return "text-gray-500"
    }
  }

  const getConnectionColor = (node1: SkillNode, node2: SkillNode) => {
    if (node1.status === "mastered" && node2.status === "mastered") {
      return `stroke-[${theme.colors.secondary}]`
    } else if (
      (node1.status === "mastered" || node1.status === "in-progress") &&
      (node2.status === "in-progress" || node2.status === "available")
    ) {
      return `stroke-[${theme.colors.primary}]`
    } else {
      return "stroke-gray-300"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22] p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-[#0f0f13]/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-poppins text-xl font-bold">Skill Tree</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-[#0f0f13]/50">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="scrollbar-hide overflow-x-auto bg-[#1a1a22] px-4 py-2">
        <div className="mx-auto flex max-w-5xl gap-2">
          {["Basketball", "Soccer", "Fitness"].map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "secondary" : "ghost"}
              className={`shrink-0 ${
                activeCategory === category
                  ? `bg-[${theme.colors.primary}] text-white`
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative flex-1 overflow-hidden p-4">
        {/* Zoom Controls */}
        <div className="absolute right-6 top-4 z-10 flex flex-col gap-2 rounded-lg bg-[#1a1a22]/80 p-2 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-[#0f0f13]/50"
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-[#0f0f13]/50"
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}
          >
            <Minimize className="h-4 w-4" />
          </Button>
        </div>

        {/* Mini-map */}
        <div className="absolute bottom-6 right-6 z-10 h-32 w-32 rounded-lg border border-[#1a1a22] bg-[#1a1a22]/80 p-2 backdrop-blur-sm">
          <div className="relative h-full w-full">
            {skillNodes.map((node) => (
              <div
                key={node.id}
                className={`absolute h-2 w-2 rounded-full ${
                  node.status === "mastered"
                    ? `bg-[${theme.colors.secondary}]`
                    : node.status === "in-progress"
                      ? `bg-[${theme.colors.primary}]`
                      : node.status === "available"
                        ? "bg-white"
                        : "bg-gray-400"
                }`}
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            ))}
            <div className="absolute h-8 w-8 rounded border border-white/50 border-dashed"></div>
          </div>
        </div>

        {/* Skill Tree Visualization */}
        <div
          className="relative mx-auto h-[600px] w-full max-w-3xl transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Connections */}
          <svg className="absolute inset-0 h-full w-full">
            {skillNodes.map((node) =>
              node.connections.map((targetId) => {
                const targetNode = skillNodes.find((n) => n.id === targetId)
                if (!targetNode) return null

                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.position.x}%`}
                    y1={`${node.position.y}%`}
                    x2={`${targetNode.position.x}%`}
                    y2={`${targetNode.position.y}%`}
                    className={`${getConnectionColor(node, targetNode)} stroke-2`}
                  />
                )
              }),
            )}
          </svg>

          {/* Nodes */}
          {skillNodes.map((node) => (
            <div
              key={node.id}
              className={`absolute flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full border-2 ${getNodeColor(
                node.status,
              )} transition-transform hover:scale-110`}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handleNodeClick(node)}
            >
              {node.status === "locked" ? (
                <Lock className="h-6 w-6 text-gray-500" />
              ) : (
                <Zap className={`h-6 w-6 ${getNodeTextColor(node.status)}`} />
              )}
              <div
                className={`absolute -bottom-7 whitespace-nowrap text-center text-xs font-medium ${
                  node.status === "locked" ? "text-gray-400" : "text-white"
                }`}
              >
                {node.name}
              </div>
            </div>
          ))}
        </div>

        {/* Skill Detail Panel */}
        {selectedNode && (
          <div className="fixed bottom-0 left-0 right-0 z-20 rounded-t-xl bg-[#1a1a22] p-4 shadow-lg">
            <div className="mx-auto max-w-5xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${getNodeColor(
                      selectedNode.status,
                    )}`}
                  >
                    {selectedNode.status === "locked" ? (
                      <Lock className="h-6 w-6 text-gray-500" />
                    ) : (
                      <Zap className={`h-6 w-6 ${getNodeTextColor(selectedNode.status)}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-poppins text-lg font-bold">{selectedNode.name}</h3>
                    <Badge
                      className={
                        selectedNode.status === "mastered"
                          ? `bg-[${theme.colors.secondary}]`
                          : selectedNode.status === "in-progress"
                            ? `bg-[${theme.colors.primary}]`
                            : selectedNode.status === "available"
                              ? "bg-green-500"
                              : "bg-gray-400"
                      }
                    >
                      {selectedNode.status === "locked"
                        ? "Locked"
                        : selectedNode.status === "available"
                          ? "Available"
                          : selectedNode.status === "in-progress"
                            ? "In Progress"
                            : "Mastered"}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                  Close
                </Button>
              </div>

              <p className="mb-4 text-gray-300">{selectedNode.description}</p>

              {selectedNode.status === "in-progress" && (
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium">{selectedNode.progress}%</span>
                  </div>
                  <Progress
                    value={selectedNode.progress}
                    className={`h-2 bg-[${theme.colors.primary}]`}
                  />
                </div>
              )}

              <div className="mb-4 rounded-lg bg-[#0f0f13] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">XP Reward</span>
                  <span className={`font-medium text-[${theme.colors.primary}]`}>+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              {selectedNode.status === "available" && (
                <Button className={`w-full bg-[${theme.colors.primary}]`}>Start Training</Button>
              )}
              {selectedNode.status === "in-progress" && (
                <Button className={`w-full bg-[${theme.colors.primary}]`}>Continue Training</Button>
              )}
              {selectedNode.status === "locked" && (
                <Button className="w-full bg-[#1a1a22] text-gray-400" disabled>
                  Unlock Previous Skills First
                </Button>
              )}
              {selectedNode.status === "mastered" && (
                <Button className={`w-full bg-[${theme.colors.secondary}]`}>Review Skill</Button>
              )}
            </div>
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  )
}
