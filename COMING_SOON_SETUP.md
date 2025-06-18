# Coming Soon Page Setup Guide

## Overview

This guide will help you set up the coming soon page for Optimus KSA with Google Sheets integration for form submissions.

## What's Included

✅ **Coming Soon Page** (`/app/coming-soon/page.tsx`)

- Responsive design matching your provided mockups
- Form with first name, last name, phone, and email fields
- Social media links pulled from admin dashboard
- Server-side rendering (SSR) enabled
- Success/failure states for form submission

✅ **API Endpoint** (`/app/api/submit-form/route.ts`)

- Handles form submissions
- Validates form data
- Sends data to Google Sheets via Google Apps Script

✅ **Netlify Configuration** (`netlify.toml`)

- Redirects all traffic to coming soon page
- Preserves admin access for configuration
- API routes remain functional

✅ **SEO Optimization**

- Proper meta tags and Open Graph data
- Server-side rendering for better search engine visibility

## Setup Instructions

### Step 1: Deploy Google Apps Script

1. **Open Google Apps Script**

   - Go to [script.google.com](https://script.google.com)
   - Click "New project"

2. **Add the Script Code**

   - Copy the code from `google-apps-script.js`
   - Replace the default `Code.gs` content with this code
   - The script is already configured with your Google Sheet ID: `1R8hH8PnOuHIESWEylyu3Lcc-KisTTSVMEzYYhSzlhdY`

3. **Deploy as Web App**

   - Click "Deploy" → "New deployment"
   - Choose type: "Web app"
   - Description: "Optimus KSA Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - **Copy the Web App URL** (you'll need this for Step 2)

4. **Grant Permissions**
   - You'll be prompted to authorize the script
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"

### Step 2: Update API Configuration

1. **Update the API Route**
   - Open `app/api/submit-form/route.ts`
   - Find line 23: `const GOOGLE_SHEETS_URL = '...'`
   - Replace the placeholder URL with your actual Google Apps Script Web App URL from Step 1

### Step 3: Configure Social Media Links

1. **Access Admin Dashboard**

   - Go to `/admin/login` on your website
   - Login with your admin credentials
   - Navigate to "Settings"

2. **Add Social Media Links**
   - Enter your social media URLs in the provided fields:
     - Facebook
     - Instagram
     - Twitter
     - LinkedIn
     - Snapchat
     - TikTok
   - Click "Save"

### Step 4: Deploy and Test

1. **Deploy to Netlify**

   ```bash
   npm run build
   git add .
   git commit -m "Add coming soon page with Google Sheets integration"
   git push
   ```

2. **Test the Setup**
   - Visit your website - you should be redirected to `/coming-soon`
   - Fill out and submit the form
   - Check your Google Sheet for the new entry
   - Verify social media links appear if configured

## Google Sheet Structure

The script will automatically create a sheet named "Coming Soon Leads" with these columns:

- **Timestamp** - When the form was submitted (in Riyadh timezone)
- **First Name** - User's first name
- **Last Name** - User's last name
- **Phone Number** - User's phone number
- **Email Address** - User's email address

## Admin Access

Admin functionality remains accessible at:

- `/admin` - Admin dashboard
- `/admin/settings` - Social media configuration
- `/admin/*` - All other admin routes

## Troubleshooting

### Form Not Submitting

1. Check browser console for errors
2. Verify Google Apps Script deployment is active
3. Ensure API route URL is correct in `app/api/submit-form/route.ts`

### Social Media Links Not Showing

1. Login to admin dashboard
2. Go to Settings
3. Ensure social media URLs are properly saved
4. Check Firebase connection in browser console

### Google Sheet Not Updating

1. Verify Google Apps Script permissions
2. Check that the script is deployed as "Anyone" can access
3. Test the script directly in the Apps Script editor using the `testScript()` function

## Security Considerations

- ✅ Server-side rendering prevents client-side vulnerabilities
- ✅ Form validation on both client and server
- ✅ Firebase security rules protect admin data
- ✅ Google Apps Script runs with proper permissions
- ✅ Admin routes are preserved for configuration access

## Performance

- ✅ Static generation for fast loading
- ✅ Optimized images and fonts
- ✅ Proper caching headers via Netlify
- ✅ Minimal JavaScript bundle size

## Next Steps

After your website is ready to launch:

1. **Remove Redirects**

   - Edit `netlify.toml`
   - Remove or comment out the coming soon redirects
   - Deploy the changes

2. **Archive Coming Soon Data**
   - Export data from Google Sheets
   - Import leads into your main CRM system
   - Update admin dashboard with launch announcement

## Support

If you encounter any issues during setup:

1. Check the browser console for error messages
2. Verify all URLs and IDs are correctly configured
3. Test each component individually (API, Google Script, Firebase)
4. Ensure all permissions are granted for Google Apps Script
