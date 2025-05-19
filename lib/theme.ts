export const theme = {
    colors: {
      primary: "#ff073a", // Red
      secondary: "#8667ff", // Purple (changed from blue)
      dark: "#0f0f13", // Dark background
      background: "#0f0f13", // Dark background
      darkGray: "#1a1a22", // Slightly lighter than background for cards
      lightGray: "#8a8a9a", // For less important text
      white: "#ffffff",
      black: "#000000",
      overlay: "rgba(15, 15, 19, 0.8)", // For modal backgrounds
      success: "#ff073a", // Using primary for consistency
      error: "#ff073a", // Using primary for consistency
      warning: "#8667ff", // Using secondary for consistency (changed from #00d9ff)
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
    },
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      glow: {
        primary: "0 0 15px rgba(255, 7, 58, 0.5)",
        secondary: "0 0 15px rgba(134, 103, 255, 0.5)", // Changed from rgba(0, 217, 255, 0.5)
      },
    },
    borderRadius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
      xl: "1.5rem",
      full: "9999px",
    },
    transitions: {
      fast: "0.15s ease",
      normal: "0.3s ease",
      slow: "0.5s ease",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      xxl: "3rem",
    },
  }
  
  export type Theme = typeof theme
  