import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
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
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
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
  const existingApps = getApps();
  if (existingApps.length === 0) {
    console.log("Initializing Firebase (client)...");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Reusing existing Firebase app (client)...");
    app = getApp();
  }
  
  // Initialize Firebase services
  auth = getAuth(app);

  // Firestore init (defensive):
  // - In the browser: try persistent cache, but fall back to memory if IndexedDB isn't available.
  // - On the server: always use getFirestore() (no IndexedDB).
  if (typeof window === 'undefined') {
    db = getFirestore(app);
  } else {
    try {
      // Firestore offline cache (modern API). Replaces enableIndexedDbPersistence(), which is deprecated.
      // Multi-tab support avoids "failed-precondition" when the site is open in multiple tabs.
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
    } catch (e) {
      console.warn('Firestore persistent cache unavailable; falling back to default cache:', e);
      db = getFirestore(app);
    }
  }
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



export { app, auth, db, storage, functions, analytics }; 