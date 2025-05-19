"use client"

import { createContext, useContext, type ReactNode } from "react"

type ThemeColors = {
  primary: string
  secondary: string
  background: string
}

type ThemeContextType = {
  colors: ThemeColors
}

const defaultColors: ThemeColors = {
  primary: "#ff073a",
  secondary: "#8667ff",
  background: "#0f0f13",
}

const ThemeContext = createContext<ThemeContextType>({ colors: defaultColors })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = { colors: defaultColors }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
