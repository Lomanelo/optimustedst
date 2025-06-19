import { NextRequest, NextResponse } from 'next/server';

interface UpdateStatusData {
  enrollmentId: string;
  status: string;
  paymentId?: string;
  paymentDetails?: any;
}

export async function POST(request: NextRequest) {
  try {
    const { enrollmentId, status, paymentId, paymentDetails }: UpdateStatusData = await request.json();
    
    if (!enrollmentId || !status) {
      return NextResponse.json(
        { error: 'Enrollment ID and status are required' },
        { status: 400 }
      );
    }

    // Update enrollment status
    const updateRecord = {
      enrollmentId,
      status,
      paymentId,
      paymentDetails,
      updatedAt: new Date().toISOString()
    };

    console.log('Updating enrollment status:', updateRecord);

    // Update in Google Sheets or database
    try {
      const sheetsResponse = await fetch('https://script.google.com/macros/s/AKfycbw34SQTApLrfOF4mvjNqCljQSj1HeopLHwh-Oz47gYEVCoRfgUIIQ-Ae0X06lYsYJWI/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'enrollment_update',
          enrollmentId,
          status,
          paymentId,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (sheetsError) {
      console.warn('Failed to update Google Sheets:', sheetsError);
    }

    return NextResponse.json({
      success: true,
      enrollmentId,
      status
    });

  } catch (error) {
    console.error('Error updating enrollment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 