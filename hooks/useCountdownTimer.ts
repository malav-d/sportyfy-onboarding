"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseCountdownTimerOptions {
  duration: number // in seconds
  onExpire: () => void
  autoStart?: boolean
}

export function useCountdownTimer({ duration, onExpire, autoStart = false }: UseCountdownTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true)
      startTimeRef.current = Date.now()

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000
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
    }
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
    progress: duration > 0 ? (duration - timeLeft) / duration : 0,
  }
}
