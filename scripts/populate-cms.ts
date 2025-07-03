import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { extractedContent } from './extract-website-content';

// Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyDi9eeNQkXHVbDAAJJM9B3Hq4vqYJqOb7Y",
  authDomain: "optimus-a4aa8.firebaseapp.com",
  projectId: "optimus-a4aa8",
  storageBucket: "optimus-a4aa8.firebasestorage.app",
  messagingSenderId: "1026468327632",
  appId: "1:1026468327632:web:f8071b777a3e9da95e2da0",
  measurementId: "G-54VDCVDH7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function populateCMSDatabase() {
  console.log('Starting CMS database population...');
  
  try {
    // Check if content already exists
    const existingContentSnapshot = await getDocs(collection(db, 'cms_content'));
    console.log(`Found ${existingContentSnapshot.size} existing content items`);
    
    let addedCount = 0;
    let updatedCount = 0;
    
    for (const contentItem of extractedContent) {
      try {
        // Check if this key already exists
        const existingDoc = existingContentSnapshot.docs.find(doc => 
          doc.data().key === contentItem.key
        );
        
        if (existingDoc) {
          console.log(`Updating existing content: ${contentItem.key}`);
          await setDoc(doc(db, 'cms_content', existingDoc.id), contentItem);
          updatedCount++;
        } else {
          console.log(`Adding new content: ${contentItem.key}`);
          await setDoc(doc(db, 'cms_content', contentItem.id), contentItem);
          addedCount++;
        }
      } catch (error) {
        console.error(`Error processing content item ${contentItem.key}:`, error);
      }
    }
    
    console.log(`CMS population complete!`);
    console.log(`Added: ${addedCount} items`);
    console.log(`Updated: ${updatedCount} items`);
    console.log(`Total content items: ${extractedContent.length}`);
    
  } catch (error) {
    console.error('Error populating CMS database:', error);
  }
}

// Run the population if this script is executed directly
if (require.main === module) {
  populateCMSDatabase().then(() => {
    console.log('Script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { populateCMSDatabase }; 