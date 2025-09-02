# Firebase Storage CORS Configuration

## Issue

The Firebase Storage is blocking requests from `https://optimusksa.com` due to CORS policy.

## Solution 1: Manual CORS Setup (Recommended)

### Via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/optimus-3fb40/storage)
2. Click on "Storage"
3. Go to "Rules" tab
4. The CORS settings are managed automatically by Firebase

### Via Google Cloud Console (More Control)

1. Go to [Google Cloud Console](https://console.cloud.google.com/storage/browser)
2. Select project `optimus-3fb40`
3. Find bucket `optimus-3fb40.appspot.com`
4. Click "Edit bucket"
5. Go to "CORS" tab
6. Add this configuration:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://optimus-3fb40.web.app",
      "https://optimustesting.netlify.app",
      "https://optimusksa.com"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "User-Agent",
      "x-goog-resumable",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ]
  }
]
```

## Solution 2: Install Google Cloud SDK (If you want command line)

### Windows

1. Download from: https://cloud.google.com/sdk/docs/install
2. Run the installer
3. Restart terminal
4. Run: `gcloud auth login`
5. Run: `gsutil cors set cors.json gs://optimus-3fb40.appspot.com`

## Solution 3: Code Fallback (Already Implemented)

The code now includes:

- ✅ Primary: Firebase Storage upload (for production)
- ✅ Fallback: Data URL upload (for CORS issues)
- ✅ Same pattern as program creation page

## Test the Fix

1. Try uploading a photo in admin panel
2. Check browser console for logs
3. If you see "CORS issue detected, falling back to data URL..." the fallback is working
4. For production, set up proper CORS via Google Cloud Console

## Current Status

- ✅ Code updated to match program creation upload method
- ✅ CORS fallback implemented using data URLs
- ✅ Maximum quality preserved in both methods
- ⚠️ CORS configuration needs manual setup via Google Cloud Console
