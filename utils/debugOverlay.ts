// Debug overlay for pose detection visualization

interface DebugData {
  leftKneeAngle: number
  rightKneeAngle: number
  hipMovement: number
  state: string
}

class DebugOverlay {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private angleHistory: number[] = []
  private hipHistory: number[] = []
  private stateHistory: string[] = []
  private maxHistory = 300 // 10 seconds at 30fps

  init() {
    if (typeof window === "undefined") return

    // Create debug canvas
    this.canvas = document.createElement("canvas")
    this.canvas.id = "debug-overlay"
    this.canvas.width = 300
    this.canvas.height = 200
    this.canvas.style.position = "fixed"
    this.canvas.style.top = "10px"
    this.canvas.style.left = "10px"
    this.canvas.style.zIndex = "9999"
    this.canvas.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
    this.canvas.style.border = "1px solid white"
    this.canvas.style.borderRadius = "8px"

    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d")

    // Add to global scope for access from detector
    ;(window as any).__debugOverlay = this.update.bind(this)
  }

  update(data: DebugData) {
    if (!this.ctx || !this.canvas) return

    const { leftKneeAngle, rightKneeAngle, hipMovement, state } = data
    const avgAngle = (leftKneeAngle + rightKneeAngle) / 2

    // Store history
    this.angleHistory.push(avgAngle)
    this.hipHistory.push(hipMovement)
    this.stateHistory.push(state)

    // Trim history
    if (this.angleHistory.length > this.maxHistory) {
      this.angleHistory.shift()
      this.hipHistory.shift()
      this.stateHistory.shift()
    }

    // Clear canvas
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw angle graph
    this.ctx.strokeStyle = "#00ff00"
    this.ctx.lineWidth = 2
    this.ctx.beginPath()

    const angleRange = 180 // 0-180 degrees
    const graphHeight = 80
    const graphTop = 20

    for (let i = 0; i < this.angleHistory.length; i++) {
      const x = (i / this.maxHistory) * this.canvas.width
      const y = graphTop + ((180 - this.angleHistory[i]) / angleRange) * graphHeight

      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.stroke()

    // Draw thresholds
    this.ctx.strokeStyle = "#ff0000"
    this.ctx.lineWidth = 1
    this.ctx.setLineDash([5, 5])

    // Down threshold (90 degrees)
    const downY = graphTop + ((180 - 90) / angleRange) * graphHeight
    this.ctx.beginPath()
    this.ctx.moveTo(0, downY)
    this.ctx.lineTo(this.canvas.width, downY)
    this.ctx.stroke()

    // Up threshold (160 degrees)
    const upY = graphTop + ((180 - 160) / angleRange) * graphHeight
    this.ctx.beginPath()
    this.ctx.moveTo(0, upY)
    this.ctx.lineTo(this.canvas.width, upY)
    this.ctx.stroke()

    this.ctx.setLineDash([])

    // Draw hip movement graph
    this.ctx.strokeStyle = "#0088ff"
    this.ctx.lineWidth = 2
    this.ctx.beginPath()

    const hipRange = 40 // -20 to +20 cm
    const hipGraphTop = 120
    const hipGraphHeight = 60

    for (let i = 0; i < this.hipHistory.length; i++) {
      const x = (i / this.maxHistory) * this.canvas.width
      const y = hipGraphTop + ((20 - this.hipHistory[i]) / hipRange) * hipGraphHeight

      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.stroke()

    // Draw labels
    this.ctx.fillStyle = "white"
    this.ctx.font = "12px monospace"
    this.ctx.fillText("Knee Angle", 5, 15)
    this.ctx.fillText("Hip Movement", 5, 115)

    // Current state
    this.ctx.fillStyle = "#ffff00"
    this.ctx.font = "14px monospace"
    const currentState = this.stateHistory[this.stateHistory.length - 1] || "UNKNOWN"
    this.ctx.fillText(`State: ${currentState}`, 5, this.canvas.height - 10)

    // Current values
    this.ctx.fillStyle = "#00ff00"
    this.ctx.font = "10px monospace"
    this.ctx.fillText(`Angle: ${avgAngle.toFixed(1)}°`, 150, 15)
    this.ctx.fillText(`Hip: ${hipMovement.toFixed(1)}cm`, 150, 115)
  }

  destroy() {
    if (this.canvas) {
      document.body.removeChild(this.canvas)
      this.canvas = null
      this.ctx = null
    }

    if (typeof window !== "undefined") {
      delete (window as any).__debugOverlay
    }

    this.angleHistory = []
    this.hipHistory = []
    this.stateHistory = []
  }
}

export const debugOverlay = new DebugOverlay()
