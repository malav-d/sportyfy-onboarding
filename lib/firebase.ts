"use client"

import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null

// Check if all required Firebase config values are present and not empty
const isFirebaseConfigValid = () => {
  const requiredFields = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId,
  ]

  const isValid = requiredFields.every((field) => field && field.trim() !== "" && field !== "undefined")

  if (!isValid) {
    console.log("Firebase config check:", {
      apiKey: firebaseConfig.apiKey ? "✓ Present" : "✗ Missing",
      authDomain: firebaseConfig.authDomain ? "✓ Present" : "✗ Missing",
      projectId: firebaseConfig.projectId ? "✓ Present" : "✗ Missing",
      storageBucket: firebaseConfig.storageBucket ? "✓ Present" : "✗ Missing",
      messagingSenderId: firebaseConfig.messagingSenderId ? "✓ Present" : "✗ Missing",
      appId: firebaseConfig.appId ? "✓ Present" : "✗ Missing",
    })
  }

  return isValid
}

try {
  if (isFirebaseConfigValid()) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)

    // Set language code for better localization
    auth.languageCode = "en"

    console.log("✅ Firebase initialized successfully")
  } else {
    console.warn("⚠️ Firebase configuration incomplete. Some environment variables are missing or empty.")
    console.warn("Required variables: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc.")
    console.warn("Authentication features will be disabled.")
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error)
  console.warn("Authentication features will be disabled.")
}

// Export auth with null check
export { auth }
export default app

// Helper function to check if Firebase is available
export const isFirebaseAvailable = () => {
  return app !== null && auth !== null
}

// Debug function to check config
export const debugFirebaseConfig = () => {
  console.log("Firebase Config Debug:", {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    hasStorageBucket: !!firebaseConfig.storageBucket,
    hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
    hasAppId: !!firebaseConfig.appId,
    isFirebaseAvailable: isFirebaseAvailable(),
  })
}
