import { NextRequest, NextResponse } from 'next/server';

interface FormSubmission {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  email: string;
  gender: string;
  certificate: string;
  timestamp: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  page_url?: string;
}

// Add GET handler for debugging
export async function GET() {
  return NextResponse.json(
    { 
      message: 'API endpoint is working',
      endpoint: '/api/submit-form',
      methods: ['GET', 'POST']
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: FormSubmission = await request.json();
    
    const { 
      firstName, 
      lastName, 
      countryCode,
      phone, 
      email, 
      gender,
      certificate,
      timestamp,
      utm_source = '',
      utm_medium = '',
      utm_campaign = '',
      utm_term = '',
      utm_content = '',
      page_url = ''
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !countryCode || !phone || !email || !gender || !certificate) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Google Sheets Web App URL
    // Replace this with your actual Google Apps Script Web App URL
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw34SQTApLrfOF4mvjNqCljQSj1HeopLHwh-Oz47gYEVCoRfgUIIQ-Ae0X06lYsYJWI/exec';

    // Create current timestamp with correct timezone (UTC+3 for Saudi Arabia)
    const now = new Date(timestamp);
    
    // Use the current time without adding extra hours since it seems to be already in the correct timezone
    const dateOnly = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const timeOnly = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Prepare data for Google Sheets
    const sheetsData = {
      firstName,
      lastName,
      countryCode,
      phone,
      email,
      gender,
      certificate,
      date: dateOnly,
      timestamp: timeOnly,
      // UTM tracking parameters
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      page_url
    };

    console.log('Sending data to Google Sheets:', sheetsData);

    // Submit to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetsData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Google Sheets');
    }

    const responseData = await response.json();
    console.log('Google Sheets response:', responseData);

    // Check if it's a duplicate
    if (responseData.status === 'duplicate') {
      // Return success response for duplicates to show success message to user
      // but the data won't be added to the sheet
      return NextResponse.json(
        { 
          message: 'Form submitted successfully with UTM tracking',
          isDuplicate: true,
          duplicateType: responseData.duplicateType,
          existingData: responseData.existingData
        },
        { status: 200 } // Return 200 success instead of 409 conflict
      );
    }

    // Check for other errors
    if (responseData.status === 'error') {
      throw new Error(responseData.message || 'Google Sheets error');
    }

    return NextResponse.json(
      { 
        message: 'Form submitted successfully with UTM tracking',
        serialNumber: responseData.serialNumber
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
} 