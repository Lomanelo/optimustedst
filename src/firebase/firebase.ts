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
  FirebaseStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
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
  storageBucket: "optimus-3fb40.appspot.com",
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

// Helper function for file uploads that handles CORS issues
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    
    // Create metadata with CORS headers
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
    
    // Use uploadBytesResumable to handle large files and track progress
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can track progress here if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          // Upload complete, get download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export { app, auth, db, storage, functions, analytics }; 