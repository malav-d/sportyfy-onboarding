// Debug overlay for pose detection visualization

interface DebugData {
  leftKneeAngle: number
  rightKneeAngle: number
  hipMovement: number
  state: string
  timestamp?: number
}

class DebugOverlay {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private angleHistory: number[] = []
  private hipHistory: number[] = []
  private maxHistory = 300 // 10 seconds at 30fps

  init() {
    if (typeof window === "undefined") return

    // Create debug canvas
    this.canvas = document.createElement("canvas")
    this.canvas.id = "debug-overlay"
    this.canvas.width = 400
    this.canvas.height = 300
    this.canvas.style.position = "fixed"
    this.canvas.style.top = "10px"
    this.canvas.style.left = "10px"
    this.canvas.style.zIndex = "9999"
    this.canvas.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
    this.canvas.style.border = "2px solid #00ff00"
    this.canvas.style.borderRadius = "8px"

    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d")

    // Add global debug function
    ;(window as any).__debugOverlay = this.update.bind(this)
  }

  update(data: DebugData) {
    if (!this.canvas || !this.ctx) return

    const { leftKneeAngle, rightKneeAngle, hipMovement, state } = data
    const avgAngle = (leftKneeAngle + rightKneeAngle) / 2

    // Add to history
    this.angleHistory.push(avgAngle)
    this.hipHistory.push(hipMovement)

    // Trim history
    if (this.angleHistory.length > this.maxHistory) {
      this.angleHistory.shift()
      this.hipHistory.shift()
    }

    // Clear canvas
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw angle graph
    this.drawAngleGraph()

    // Draw hip movement graph
    this.drawHipGraph()

    // Draw current values
    this.drawCurrentValues(data)
  }

  private drawAngleGraph() {
    if (!this.ctx || !this.canvas) return

    const graphHeight = 120
    const graphY = 20
    const graphWidth = this.canvas.width - 40

    // Draw background
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    this.ctx.fillRect(20, graphY, graphWidth, graphHeight)

    // Draw threshold lines
    this.ctx.strokeStyle = "#ff0000"
    this.ctx.lineWidth = 1
    this.ctx.setLineDash([5, 5])

    // Down threshold (90 degrees)
    const downY = graphY + graphHeight - (90 / 180) * graphHeight
    this.ctx.beginPath()
    this.ctx.moveTo(20, downY)
    this.ctx.lineTo(20 + graphWidth, downY)
    this.ctx.stroke()

    // Up threshold (160 degrees)
    const upY = graphY + graphHeight - (160 / 180) * graphHeight
    this.ctx.beginPath()
    this.ctx.moveTo(20, upY)
    this.ctx.lineTo(20 + graphWidth, upY)
    this.ctx.stroke()

    // Draw angle line
    this.ctx.strokeStyle = "#00ff00"
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([])

    if (this.angleHistory.length > 1) {
      this.ctx.beginPath()
      for (let i = 0; i < this.angleHistory.length; i++) {
        const x = 20 + (i / this.angleHistory.length) * graphWidth
        const y = graphY + graphHeight - (this.angleHistory[i] / 180) * graphHeight
        if (i === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      this.ctx.stroke()
    }

    // Labels
    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "12px monospace"
    this.ctx.fillText("Knee Angle", 25, graphY - 5)
    this.ctx.fillText("90°", 25, downY - 5)
    this.ctx.fillText("160°", 25, upY - 5)
  }

  private drawHipGraph() {
    if (!this.ctx || !this.canvas) return

    const graphHeight = 80
    const graphY = 160
    const graphWidth = this.canvas.width - 40

    // Draw background
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    this.ctx.fillRect(20, graphY, graphWidth, graphHeight)

    // Draw zero line
    this.ctx.strokeStyle = "#ffffff"
    this.ctx.lineWidth = 1
    this.ctx.setLineDash([2, 2])
    const zeroY = graphY + graphHeight / 2
    this.ctx.beginPath()
    this.ctx.moveTo(20, zeroY)
    this.ctx.lineTo(20 + graphWidth, zeroY)
    this.ctx.stroke()

    // Draw hip movement line
    this.ctx.strokeStyle = "#ffff00"
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([])

    if (this.hipHistory.length > 1) {
      this.ctx.beginPath()
      for (let i = 0; i < this.hipHistory.length; i++) {
        const x = 20 + (i / this.hipHistory.length) * graphWidth
        const normalizedHip = Math.max(-20, Math.min(20, this.hipHistory[i])) // Clamp to ±20cm
        const y = zeroY - (normalizedHip / 20) * (graphHeight / 2)
        if (i === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      this.ctx.stroke()
    }

    // Labels
    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "12px monospace"
    this.ctx.fillText("Hip Movement", 25, graphY - 5)
  }

  private drawCurrentValues(data: DebugData) {
    if (!this.ctx) return

    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "14px monospace"

    const y = 260
    this.ctx.fillText(`State: ${data.state}`, 25, y)
    this.ctx.fillText(`L Knee: ${data.leftKneeAngle.toFixed(1)}°`, 25, y + 20)
    this.ctx.fillText(`R Knee: ${data.rightKneeAngle.toFixed(1)}°`, 150, y + 20)
    this.ctx.fillText(`Hip: ${data.hipMovement.toFixed(1)}cm`, 275, y + 20)
  }

  destroy() {
    if (this.canvas) {
      document.body.removeChild(this.canvas)
      this.canvas = null
      this.ctx = null
    }
    this.angleHistory = []
    this.hipHistory = []

    // Remove global debug function
    if (typeof window !== "undefined") {
      delete (window as any).__debugOverlay
    }
  }
}

export const debugOverlay = new DebugOverlay()
