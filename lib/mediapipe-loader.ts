// MediaPipe dependency loader for Next.js environment
export async function loadMediaPipeLibraries() {
  // Check if already loaded
  if (typeof window !== "undefined" && (window as any).MediaPipe) {
    return (window as any).MediaPipe
  }

  // Load MediaPipe from CDN
  const script1 = document.createElement("script")
  script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
  document.head.appendChild(script1)

  const script2 = document.createElement("script")
  script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js"
  document.head.appendChild(script2)

  const script3 = document.createElement("script")
  script3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
  document.head.appendChild(script3)

  const script4 = document.createElement("script")
  script4.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
  document.head.appendChild(script4)

  // Wait for scripts to load
  return new Promise((resolve, reject) => {
    let loadedCount = 0
    const totalScripts = 4

    const checkLoaded = () => {
      loadedCount++
      if (loadedCount === totalScripts) {
        resolve((window as any).MediaPipe)
      }
    }

    script1.onload = checkLoaded
    script2.onload = checkLoaded
    script3.onload = checkLoaded
    script4.onload = checkLoaded

    script1.onerror = script2.onerror = script3.onerror = script4.onerror = reject

    // Timeout after 10 seconds
    setTimeout(() => reject(new Error("MediaPipe libraries failed to load")), 10000)
  })
}
