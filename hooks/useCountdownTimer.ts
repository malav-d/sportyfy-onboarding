"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseCountdownTimerProps {
  duration: number // Duration in seconds
  onExpire: () => void
}

export const useCountdownTimer = ({ duration, onExpire }: UseCountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(1) // 1 = full, 0 = empty

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  const updateTimer = useCallback(() => {
    const now = Date.now()
    const elapsed = (now - startTimeRef.current - pausedTimeRef.current) / 1000
    const remaining = Math.max(0, duration - elapsed)

    setTimeLeft(remaining)
    setProgress(remaining / duration)

    if (remaining <= 0) {
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      onExpire()
    }
  }, [duration, onExpire])

  const start = useCallback(() => {
    if (isRunning) return

    startTimeRef.current = Date.now()
    pausedTimeRef.current = 0
    setIsRunning(true)

    intervalRef.current = setInterval(updateTimer, 100) // Update every 100ms for smooth progress
  }, [isRunning, updateTimer])

  const stop = useCallback(() => {
    if (!isRunning) return

    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning])

  const pause = useCallback(() => {
    if (!isRunning) return

    const now = Date.now()
    pausedTimeRef.current += now - startTimeRef.current
    setIsRunning(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning])

  const resume = useCallback(() => {
    if (isRunning) return

    startTimeRef.current = Date.now()
    setIsRunning(true)
    intervalRef.current = setInterval(updateTimer, 100)
  }, [isRunning, updateTimer])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(duration)
    setProgress(1)
    pausedTimeRef.current = 0

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [duration])

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
    progress,
    start,
    stop,
    pause,
    resume,
    reset,
  }
}

export default useCountdownTimer
