"use client"
import { useState, useEffect, useRef, useCallback } from "react"

interface CountdownTimerProps {
  duration: number
  onExpire: () => void
}

export function useCountdownTimer({ duration, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRunning(false)
  }, [])

  const start = useCallback(() => {
    stop() // Ensure no multiple timers
    setIsRunning(true)
    const startTime = Date.now()
    setTimeLeft(duration)

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const newTimeLeft = duration - elapsed

      if (newTimeLeft <= 0) {
        setTimeLeft(0)
        stop()
        onExpire()
      } else {
        setTimeLeft(newTimeLeft)
      }
    }, 100)
  }, [duration, onExpire, stop])

  useEffect(() => {
    return () => stop() // Cleanup on unmount
  }, [stop])

  const progress = timeLeft > 0 ? (duration - timeLeft) / duration : 1

  return { timeLeft, isRunning, start, stop, progress }
}
