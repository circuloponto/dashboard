import { db, isFirebaseConfigured } from '../config/firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore'

const COLLECTION_NAME = 'foodItems'
const DOCUMENT_ID = 'items'

// Get data from Firebase or localStorage
export const getItems = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data().items || []
      }
      return null
    } catch (error) {
      console.error('Error reading from Firebase:', error)
      // Fallback to localStorage
      return getItemsFromLocalStorage()
    }
  }
  
  return getItemsFromLocalStorage()
}

// Save data to Firebase or localStorage
export const saveItems = async (items) => {
  // Always save to localStorage as backup
  saveItemsToLocalStorage(items)
  
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
      console.log('💾 Saving to Firebase:', items.length, 'items')
      await setDoc(docRef, { items }, { merge: false })
      console.log('✅ Successfully saved to Firebase!')
      return true
    } catch (error) {
      console.error('❌ Error saving to Firebase:', error)
      console.error('Error details:', error.message, error.code)
      return false
    }
  } else {
    console.log('ℹ️ Firebase not configured, using localStorage only')
  }
  
  return true
}

// Subscribe to real-time updates (Firebase only)
export const subscribeToItems = (callback) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const items = docSnap.data().items || []
          console.log('📥 Received data from Firebase:', items.length, 'items')
          callback(items)
        } else {
          // Document doesn't exist yet - return null so caller can initialize
          console.log('📭 No data in Firebase yet')
          callback(null)
        }
      }, (error) => {
        console.error('❌ Error subscribing to Firebase:', error)
        // Fallback to localStorage
        callback(getItemsFromLocalStorage())
      })
    } catch (error) {
      console.error('❌ Error setting up Firebase subscription:', error)
      callback(getItemsFromLocalStorage())
      return () => {} // Return empty unsubscribe function
    }
  }
  
  // Return empty unsubscribe function for localStorage mode
  return () => {}
}

// LocalStorage helpers (fallback)
const getItemsFromLocalStorage = () => {
  try {
    const savedItems = localStorage.getItem('foodItems')
    return savedItems ? JSON.parse(savedItems) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

const saveItemsToLocalStorage = (items) => {
  try {
    localStorage.setItem('foodItems', JSON.stringify(items))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

