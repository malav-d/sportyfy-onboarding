"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CustomCursorProps {
  mousePosition: { x: number; y: number }
}

export function CustomCursor({ mousePosition }: CustomCursorProps) {
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const handleMouseOver = () => setCursorVariant("hover")
    const handleMouseOut = () => setCursorVariant("default")

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll("button, a, .interactive")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver)
      el.addEventListener("mouseout", handleMouseOut)
    })

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver)
        el.removeEventListener("mouseout", handleMouseOut)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
    },
  }

  const trailVariants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      opacity: 0.3,
      scale: 0.5,
      transition: { delay: 0.05 },
    },
    hover: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      opacity: 0.5,
      scale: 0.8,
      transition: { delay: 0.05 },
    },
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#ff073a] mix-blend-difference pointer-events-none z-50"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#00d9ff] mix-blend-difference pointer-events-none z-50"
        variants={trailVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.3 }}
      />
    </>
  )
}
