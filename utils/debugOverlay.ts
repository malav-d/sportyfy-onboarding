interface DebugData {
  leftKneeAngle: number
  rightKneeAngle: number
  hipMovement: number
  state: string
  timestamp: number
}

class DebugOverlay {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private dataHistory: DebugData[] = []
  private maxHistory = 300 // 10 seconds at 30fps

  init() {
    if (typeof window === "undefined") return

    // Create debug canvas
    this.canvas = document.createElement("canvas")
    this.canvas.id = "pose-debug-overlay"
    this.canvas.width = 400
    this.canvas.height = 300
    this.canvas.style.position = "fixed"
    this.canvas.style.top = "10px"
    this.canvas.style.right = "10px"
    this.canvas.style.zIndex = "9999"
    this.canvas.style.backgroundColor = "rgba(0,0,0,0.8)"
    this.canvas.style.border = "1px solid #333"
    this.canvas.style.borderRadius = "8px"

    this.ctx = this.canvas.getContext("2d")
    document.body.appendChild(this.canvas)
  }

  update(data: Omit<DebugData, "timestamp">) {
    if (!this.ctx || !this.canvas) return

    const debugData: DebugData = {
      ...data,
      timestamp: Date.now(),
    }

    this.dataHistory.push(debugData)
    if (this.dataHistory.length > this.maxHistory) {
      this.dataHistory.shift()
    }

    this.render()
  }

  private render() {
    if (!this.ctx || !this.canvas) return

    const { width, height } = this.canvas
    this.ctx.clearRect(0, 0, width, height)

    // Draw background
    this.ctx.fillStyle = "rgba(0,0,0,0.9)"
    this.ctx.fillRect(0, 0, width, height)

    if (this.dataHistory.length === 0) return

    const latest = this.dataHistory[this.dataHistory.length - 1]

    // Draw current state
    this.ctx.fillStyle = "#fff"
    this.ctx.font = "14px monospace"
    this.ctx.fillText(`State: ${latest.state}`, 10, 20)
    this.ctx.fillText(`L Knee: ${latest.leftKneeAngle.toFixed(1)}°`, 10, 40)
    this.ctx.fillText(`R Knee: ${latest.rightKneeAngle.toFixed(1)}°`, 10, 60)
    this.ctx.fillText(`Hip Δ: ${latest.hipMovement.toFixed(1)}cm`, 10, 80)

    // Draw angle history graph
    if (this.dataHistory.length > 1) {
      const graphY = 100
      const graphHeight = 150
      const graphWidth = width - 20

      // Draw graph background
      this.ctx.strokeStyle = "#333"
      this.ctx.strokeRect(10, graphY, graphWidth, graphHeight)

      // Draw angle lines
      this.ctx.strokeStyle = "#00ff00" // Left knee - green
      this.ctx.beginPath()
      this.dataHistory.forEach((data, i) => {
        const x = 10 + (i / this.dataHistory.length) * graphWidth
        const y = graphY + graphHeight - (data.leftKneeAngle / 180) * graphHeight
        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      })
      this.ctx.stroke()

      this.ctx.strokeStyle = "#0088ff" // Right knee - blue
      this.ctx.beginPath()
      this.dataHistory.forEach((data, i) => {
        const x = 10 + (i / this.dataHistory.length) * graphWidth
        const y = graphY + graphHeight - (data.rightKneeAngle / 180) * graphHeight
        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      })
      this.ctx.stroke()

      // Draw threshold lines
      this.ctx.strokeStyle = "#ff0000"
      this.ctx.setLineDash([5, 5])
      // Down threshold (90°)
      const downY = graphY + graphHeight - (90 / 180) * graphHeight
      this.ctx.beginPath()
      this.ctx.moveTo(10, downY)
      this.ctx.lineTo(10 + graphWidth, downY)
      this.ctx.stroke()

      // Up threshold (160°)
      const upY = graphY + graphHeight - (160 / 180) * graphHeight
      this.ctx.beginPath()
      this.ctx.moveTo(10, upY)
      this.ctx.lineTo(10 + graphWidth, upY)
      this.ctx.stroke()
      this.ctx.setLineDash([])
    }

    // Legend
    this.ctx.fillStyle = "#00ff00"
    this.ctx.fillText("Left Knee", 10, height - 40)
    this.ctx.fillStyle = "#0088ff"
    this.ctx.fillText("Right Knee", 100, height - 40)
    this.ctx.fillStyle = "#ff0000"
    this.ctx.fillText("Thresholds", 200, height - 40)
  }

  destroy() {
    if (this.canvas) {
      document.body.removeChild(this.canvas)
      this.canvas = null
      this.ctx = null
    }
    this.dataHistory = []
  }
}

export const debugOverlay = new DebugOverlay()

// Global function for the hook to call
declare global {
  interface Window {
    __debugOverlay?: (data: Omit<DebugData, "timestamp">) => void
  }
}

if (typeof window !== "undefined") {
  window.__debugOverlay = (data) => debugOverlay.update(data)
}
