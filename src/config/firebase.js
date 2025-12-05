// Firebase Configuration
// Configuration is loaded from environment variables (.env.local)
// See .env.example for the required variables

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Load Firebase config from environment variables
// Vite uses VITE_ prefix for environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.apiKey !== undefined

let app = null
let db = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.log('✅ Firebase connected - Data will sync across all devices!')
    console.log('📊 Firestore database initialized:', db ? 'Yes' : 'No')
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
    console.log('⚠️ Falling back to localStorage')
    db = null
  }
} else {
  console.log('ℹ️ Firebase not configured - Using localStorage (data is local only)')
}

export { db, isFirebaseConfigured }

