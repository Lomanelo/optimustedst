import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Server-side Firebase configuration (without browser-specific features)
const firebaseConfig = {
  apiKey: "AIzaSyB0RLwqptWTOQJOawiM1pAHqE7wqjVgDps",
  authDomain: "optimus-3fb40.firebaseapp.com",
  projectId: "optimus-3fb40",
  storageBucket: "optimus-3fb40.appspot.com",
  messagingSenderId: "425553770778",
  appId: "1:425553770778:web:e31b845a1b1a0fd13a54a3",
  measurementId: "G-79TCMTMSLF"
};

// Singleton Firebase initialization for server-side use
function getServerFirebase() {
  try {
    console.log("Getting server-side Firebase instance for enrollment creation...");
    
    // Check if Firebase app already exists
    const existingApps = getApps();
    console.log("Existing Firebase apps:", existingApps.length);
    
    let app;
    if (existingApps.length === 0) {
      console.log("No existing Firebase app found, initializing new one...");
      app = initializeApp(firebaseConfig);
    } else {
      console.log("Using existing Firebase app...");
      app = getApp();
    }
    
    const db = getFirestore(app);
    console.log("Server-side Firebase initialized successfully for enrollment creation");
    
    return { app, db };
  } catch (error) {
    console.error("Error initializing server-side Firebase for enrollment creation:", error);
    throw error;
  }
}

interface EnrollmentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
  email: string;
  phone: string;
  countryCode: string;
  programId: string;
  programTitle?: string;
  price?: number;
  status: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const enrollmentData: EnrollmentData = await request.json();
    
    console.log('Creating enrollment with data:', enrollmentData);
    
    // Validate required fields
    const {
      firstName,
      lastName,
      dateOfBirth,
      sex,
      email,
      phone,
      countryCode,
      programId
    } = enrollmentData;

    if (!firstName || !lastName || !dateOfBirth || !sex || !email || !phone || !programId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate age (must be at least 16)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
    
    if (actualAge < 16) {
      return NextResponse.json(
        { error: 'You must be at least 16 years old to enroll' },
        { status: 400 }
      );
    }

    // Fetch actual program data from Firestore to get real pricing
    let programData = null;
    let actualPrice = 0;
    let programTitle = 'Unknown Program';

    try {
      const firebase = getServerFirebase();
      const { db } = firebase;
      
      console.log('Fetching program data for ID:', programId);
      const programDoc = await getDoc(doc(db, 'programs', programId));
      
      if (programDoc.exists()) {
        programData = programDoc.data();
        actualPrice = programData.price || 0;
        programTitle = programData.title || 'Unknown Program';
        console.log('Found program in database:', { 
          title: programTitle, 
          price: actualPrice,
          category: programData.category,
          status: programData.status
        });
      } else {
        console.warn('Program not found in database, using fallback pricing');
        // Use the price from the request if program not found in database
        actualPrice = enrollmentData.price || 0;
        programTitle = enrollmentData.programTitle || 'Unknown Program';
      }
    } catch (programFetchError) {
      console.error('Error fetching program data:', programFetchError);
      // Fallback to request data if Firebase fails
      actualPrice = enrollmentData.price || 0;
      programTitle = enrollmentData.programTitle || 'Unknown Program';
    }

    // Generate enrollment ID
    const enrollmentId = uuidv4();

    // Calculate total with VAT using actual program price
    const basePrice = actualPrice;
    const vatAmount = basePrice * 0.05;
    const totalAmount = basePrice + vatAmount;

    console.log('Calculated pricing - Base:', basePrice, 'VAT:', vatAmount, 'Total:', totalAmount);

    // Create enrollment record
    const enrollmentRecord = {
      enrollmentId,
      firstName,
      lastName,
      dateOfBirth,
      sex,
      email,
      phone,
      countryCode,
      programId,
      programTitle,
      basePrice,
      vatAmount,
      totalAmount,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Store program data for reference
      programData: programData ? {
        category: programData.category,
        level: programData.level,
        type: programData.type,
        duration: programData.duration
      } : null
    };

    console.log('Enrollment record to save:', enrollmentRecord);

    // Save enrollment to Firestore using server-side Firebase
    try {
      const firebase = getServerFirebase();
      const { db } = firebase;
      
      await setDoc(doc(db, 'enrollments', enrollmentId), enrollmentRecord);
      console.log('Enrollment successfully saved to Firestore:', enrollmentRecord);
    } catch (firestoreError) {
      console.error('Error saving to Firestore:', firestoreError);
      // Continue with the process even if Firestore fails
    }

    // Also save to Google Sheets for backup
    try {
      const sheetsResponse = await fetch('https://script.google.com/macros/s/AKfycbw34SQTApLrfOF4mvjNqCljQSj1HeopLHwh-Oz47gYEVCoRfgUIIQ-Ae0X06lYsYJWI/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'enrollment',
          enrollmentId,
          firstName,
          lastName,
          email,
          phone: `${countryCode}${phone}`,
          dateOfBirth,
          sex,
          programId,
          programTitle,
          basePrice,
          vatAmount,
          totalAmount,
          status: 'pending_payment',
          timestamp: new Date().toISOString()
        }),
      });
      
      console.log('Enrollment also saved to Google Sheets');
    } catch (sheetsError) {
      console.warn('Failed to save to Google Sheets:', sheetsError);
      // Don't fail the enrollment if sheets fails
    }

    console.log('Enrollment creation completed successfully');

    return NextResponse.json({
      success: true,
      enrollmentId,
      totalAmount,
      programTitle,
      basePrice,
      vatAmount
    });

  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 