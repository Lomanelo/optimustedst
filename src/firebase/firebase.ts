import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator, 
  setPersistence, 
  browserLocalPersistence,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  FirestoreError,
  Firestore,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { 
  getStorage, 
  connectStorageEmulator,
  FirebaseStorage
} from 'firebase/storage';
import { 
  getFunctions, 
  connectFunctionsEmulator,
  Functions
} from 'firebase/functions';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0RLwqptWTOQJOawiM1pAHqE7wqjVgDps",
  authDomain: "optimus-3fb40.firebaseapp.com",
  projectId: "optimus-3fb40",
  storageBucket: "optimus-3fb40.firebasestorage.app",
  messagingSenderId: "425553770778",
  appId: "1:425553770778:web:e31b845a1b1a0fd13a54a3",
  measurementId: "G-79TCMTMSLF"
};

// Initialize Firebase with retry logic for network issues
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;
let analytics: Analytics | undefined;

try {
  console.log("Initializing Firebase...");
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  functions = getFunctions(app);
  
  // Set persistence to LOCAL (keeps user logged in even after browser restart)
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Firebase auth persistence set to LOCAL");
    })
    .catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
  
  // Only initialize analytics in browser environments
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  console.log("Firebase services initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Configure Firestore for offline persistence (only in browser environment)
// Only enable if not already enabled to avoid the multi-tab warning
if (typeof window !== 'undefined' && db) {
  // Check if persistence is already enabled by looking for a flag
  const persistenceKey = 'firestore_persistence_enabled';
  const isPersistenceEnabled = sessionStorage.getItem(persistenceKey);
  
  if (!isPersistenceEnabled) {
    try {
      enableIndexedDbPersistence(db).then(() => {
        console.log("Firestore offline persistence enabled");
        sessionStorage.setItem(persistenceKey, 'true');
      }).catch((err: FirestoreError) => {
      if (err.code === 'failed-precondition') {
          console.log("Firestore persistence: Multiple tabs open, using memory cache");
      } else if (err.code === 'unimplemented') {
          console.log("Firestore persistence: Browser doesn't support offline persistence");
        } else {
          console.warn("Firestore persistence error:", err);
      }
    });
  } catch (e) {
      console.log("Could not enable offline persistence, using memory cache");
    }
  }
}



export { app, auth, db, storage, functions, analytics }; 