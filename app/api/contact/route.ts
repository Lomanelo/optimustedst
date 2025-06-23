import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

// Email routing configuration
const EMAIL_ROUTING: Record<string, string> = {
  general: 'info@optimusksa.com',
  admissions: 'admissions@optimusksa.com',
  support: 'support@optimusksa.com',
  marketing: 'marketing@optimusksa.com',
  executive: 'ceo@optimusksa.com'
};

// Create transporter (configure with your SMTP settings)
const createTransporter = () => {
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  console.log('SMTP Configuration:', {
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    user: smtpConfig.auth.user ? '***configured***' : 'NOT_SET',
    pass: smtpConfig.auth.pass ? '***configured***' : 'NOT_SET'
  });

  return nodemailer.createTransport(smtpConfig);
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    const { name, email, phone, inquiryType, message } = body;

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: 'Required fields: name, email, inquiry type, and message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP not configured. Missing environment variables:', {
        SMTP_HOST: process.env.SMTP_HOST || 'NOT_SET',
        SMTP_PORT: process.env.SMTP_PORT || 'NOT_SET',
        SMTP_USER: process.env.SMTP_USER ? 'SET' : 'NOT_SET',
        SMTP_PASSWORD: process.env.SMTP_PASSWORD ? 'SET' : 'NOT_SET',
        SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'NOT_SET'
      });

      // For development, log the form data and return success
      console.log('Contact form submission (SMTP not configured):', {
        name,
        email,
        phone,
        inquiryType,
        message,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { 
          message: 'Message received! (Note: Email sending is not configured yet)',
          warning: 'SMTP configuration required for email delivery',
          recipientEmail: EMAIL_ROUTING[inquiryType] || EMAIL_ROUTING.general
        },
        { status: 200 }
      );
    }

    // Get recipient email based on inquiry type
    const recipientEmail = EMAIL_ROUTING[inquiryType] || EMAIL_ROUTING.general;

    // Create transporter
    const transporter = createTransporter();

    // Test the connection first
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      throw new Error(`SMTP configuration error: ${verifyError instanceof Error ? verifyError.message : 'Unknown SMTP error'}`);
    }

    // Email content for the recipient
    const recipientEmailContent = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: recipientEmail,
      subject: `New ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)} Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2B1F4F; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #2B1F4F; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Inquiry Type:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}</td>
              </tr>
            </table>
            
            <h3 style="color: #2B1F4F; margin-top: 20px;">Message:</h3>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #058C42; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background-color: #2B1F4F; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">Optimus Education - Contact Form System</p>
          </div>
        </div>
      `,
    };

    // Confirmation email for the user
    const confirmationEmail = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting Optimus Education',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2B1F4F; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Thank You for Your Inquiry</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            
            <p>Thank you for reaching out to Optimus Education. We have received your inquiry and our team will get back to you within 24 hours.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #058C42; margin: 20px 0;">
              <h3 style="color: #2B1F4F; margin-top: 0;">Your Inquiry Summary:</h3>
              <p><strong>Inquiry Type:</strong> ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
            
            <p>In the meantime, feel free to explore our programs and services on our website.</p>
            
            <p>If you have any urgent questions, you can also reach us via WhatsApp at +971569852211.</p>
            
            <p>Best regards,<br>
            The Optimus Education Team</p>
          </div>
          
          <div style="background-color: #2B1F4F; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">Optimus Education - Transforming Careers, Shaping Futures</p>
          </div>
        </div>
      `,
    };

    // Send emails
    console.log('Sending emails to:', recipientEmail, 'and', email);
    await Promise.all([
      transporter.sendMail(recipientEmailContent),
      transporter.sendMail(confirmationEmail)
    ]);

    console.log('Emails sent successfully');

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully. We will get back to you soon!',
        recipientEmail: recipientEmail
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in contact form submission:', error);
    
    // Return detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to send email. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
  
  return NextResponse.json(
    { 
      message: 'Contact API endpoint is working',
      availableInquiryTypes: Object.keys(EMAIL_ROUTING),
      emailRouting: EMAIL_ROUTING,
      smtpConfigured,
      configuration: {
        host: process.env.SMTP_HOST || 'NOT_SET',
        port: process.env.SMTP_PORT || 'NOT_SET',
        user: process.env.SMTP_USER ? 'SET' : 'NOT_SET',
        password: process.env.SMTP_PASSWORD ? 'SET' : 'NOT_SET',
        fromEmail: process.env.SMTP_FROM_EMAIL || 'NOT_SET'
      }
    },
    { status: 200 }
  );
} 