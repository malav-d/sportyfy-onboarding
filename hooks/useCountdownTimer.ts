"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseCountdownTimerProps {
  duration: number // in seconds
  onExpire: () => void
}

export const useCountdownTimer = ({ duration, onExpire }: UseCountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const start = useCallback(() => {
    if (isRunning) return

    setIsRunning(true)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current!) / 1000
      const remaining = Math.max(0, duration - elapsed)

      setTimeLeft(remaining)

      if (remaining <= 0) {
        setIsRunning(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        onExpire()
      }
    }, 100) // Update every 100ms for smooth progress
  }, [duration, isRunning, onExpire])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setTimeLeft(duration)
    startTimeRef.current = null
  }, [duration, stop])

  // Calculate progress (0 to 1)
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    timeLeft,
    isRunning,
    start,
    stop,
    reset,
    progress,
  }
}

export default useCountdownTimer
