import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics, setUserProperties } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | undefined
let analytics: Analytics | undefined

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'development') {
    window.sessionStorage.setItem('firebase_analytics_debug', 'true')
  }
  
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  
  if (app && firebaseConfig.measurementId) {
    try {
      analytics = getAnalytics(app)
      
      setUserProperties(analytics, {
        app_name: 'marketplace',
        app_type: 'b2c_storefront'
      })
      
      console.log('Firebase Analytics initialized for marketplace')
    } catch (error) {
      console.error('Firebase Analytics initialization error:', error)
    }
  } else {
    console.warn('Firebase Measurement ID not found')
  }
}

export { analytics }
