// Firebase Configuration
// To enable cloud sync, create a Firebase project at https://console.firebase.google.com/
// Then copy your config here and uncomment the code below

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Replace these with your Firebase config values
// You can find these in your Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyB7GwjUtnIbwAYBrMwY9_YQY4N7QiIUW20",
    authDomain: "inventary-donations.firebaseapp.com",
    databaseURL: "https://inventary-donations-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "inventary-donations",
    storageBucket: "inventary-donations.firebasestorage.app",
    messagingSenderId: "278513112462",
    appId: "1:278513112462:web:ca7bda44def555d9b580df"
  };

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY"

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

