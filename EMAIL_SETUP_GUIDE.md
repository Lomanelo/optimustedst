# Email Setup Guide for Optimus Education Contact Form

## Overview

The contact form now sends emails to different departments based on the inquiry type selected by the user. This guide explains how to set up the email functionality.

## Email Routing

Based on the inquiry type selected, emails are automatically routed to:

- **General Inquiry** → `info@optimusksa.com`
- **Admissions & Enrollment** → `admissions@optimusksa.com`
- **Student Support** → `support@optimusksa.com`
- **Partnerships & Marketing** → `marketing@optimusksa.com`
- **Executive Contact** → `ceo@optimusksa.com`

## SMTP Configuration

### Step 1: Create Environment File

1. Copy the `env.example.txt` file to `.env.local` in your project root
2. Update the SMTP settings with your email provider's configuration

### Step 2: Configure SMTP Settings

#### For Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

**Important for Gmail:**

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use the generated app password (not your regular Gmail password)

#### For Outlook/Hotmail:

```env
SMTP_HOST=smtp.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email@outlook.com
```

#### For Other Providers:

- **Yahoo:** `smtp.mail.yahoo.com`, port 587
- **Custom SMTP:** Contact your email provider for specific settings

### Step 3: Test the Configuration

1. Start your development server: `npm run dev`
2. Go to `/api/contact` to see the API status
3. Try submitting the contact form on `/contact`

## Features

### User Experience:

- **Inquiry Type Selection**: Users select the type of inquiry for proper routing
- **Form Validation**: Client-side and server-side validation
- **Success Feedback**: Users see confirmation when email is sent
- **Loading States**: Visual feedback during submission
- **Error Handling**: Clear error messages if submission fails

### Email Features:

- **Automatic Routing**: Emails go to the appropriate department
- **Confirmation Email**: Users receive a confirmation email
- **Professional Templates**: HTML-formatted emails with Optimus branding
- **Duplicate Prevention**: Form includes validation to prevent spam

### Admin Benefits:

- **Department-Specific**: Each department only receives relevant inquiries
- **Rich Information**: Emails include all form data in a structured format
- **Professional Presentation**: Branded email templates
- **Contact Details**: Full contact information included in emails

## Troubleshooting

### Common Issues:

1. **Email Not Sending**

   - Check SMTP credentials in `.env.local`
   - Verify app password for Gmail (not regular password)
   - Check firewall/security settings

2. **Form Shows Error**

   - Check browser console for detailed error messages
   - Verify API endpoint is accessible at `/api/contact`
   - Check server logs for SMTP connection issues

3. **Emails Going to Spam**
   - Configure SPF, DKIM, and DMARC records for your domain
   - Use a professional email address as the sender
   - Consider using a transactional email service

### Testing in Development:

For testing purposes, you can use services like:

- **Mailtrap.io**: Catches emails in development
- **MailHog**: Local email testing tool
- **Gmail**: Use a dedicated Gmail account for testing

## Production Considerations

### Recommended Email Services:

- **SendGrid**: Reliable transactional email service
- **Mailgun**: Developer-friendly email API
- **Amazon SES**: Cost-effective option
- **Office 365**: For organizations using Microsoft services

### Security:

- Always use environment variables for credentials
- Enable app passwords for Gmail
- Consider using OAuth2 for enhanced security
- Regular monitoring of email delivery rates

### Monitoring:

- Set up email delivery monitoring
- Track bounce rates and delivery failures
- Monitor for spam reports
- Regular testing of all inquiry types

## API Endpoints

- `GET /api/contact` - Check API status and view email routing
- `POST /api/contact` - Submit contact form with email sending

## Contact Form Fields

- **Name** (required): User's full name
- **Email** (required): User's email address
- **Phone** (optional): User's phone number
- **Inquiry Type** (required): Determines email routing
- **Program Interest** (optional): Specific program inquiry
- **Message** (required): User's detailed message
