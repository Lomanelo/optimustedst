import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface EnrollmentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
  email: string;
  phone: string;
  countryCode: string;
  programId: string;
  programTitle: string;
  price: number;
  status: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const enrollmentData: EnrollmentData = await request.json();
    
    // Validate required fields
    const {
      firstName,
      lastName,
      dateOfBirth,
      sex,
      email,
      phone,
      countryCode,
      programId,
      programTitle,
      price
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

    // Generate enrollment ID
    const enrollmentId = uuidv4();

    // Calculate total with VAT
    const basePrice = price;
    const vatAmount = basePrice * 0.05;
    const totalAmount = basePrice + vatAmount;

    // Create enrollment record
    const enrollmentRecord = {
      enrollmentId,
      ...enrollmentData,
      basePrice,
      vatAmount,
      totalAmount,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // For now, we'll store this in a simple way
    // In a production app, you'd save this to a database
    console.log('Enrollment created:', enrollmentRecord);

    // You could also save to Google Sheets for now
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
    } catch (sheetsError) {
      console.warn('Failed to save to Google Sheets:', sheetsError);
      // Don't fail the enrollment if sheets fails
    }

    return NextResponse.json({
      success: true,
      enrollmentId,
      totalAmount
    });

  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 