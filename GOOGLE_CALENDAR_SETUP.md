# Google Calendar Auto-Create Events (Optimus)

This project supports **automatic Google Calendar event creation** for Book-a-Call submissions.

## What it does

- Admin connects **one Google account** once (OAuth).
- The app stores a **refresh token** in Firestore at `settings/googleCalendar`.
- Every new Book-a-Call submission:
  - creates a Google Calendar event (if connected)
  - still sends the email + `.ics` attachment as a fallback

## Required Netlify environment variables

Set these in **Netlify → Site configuration → Environment variables** (do NOT commit secrets to git):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
  - Must match the Google OAuth client redirect URI exactly.
  - Example: `https://optimus-solutions.org/api/google-calendar/callback`
- `GOOGLE_CALENDAR_ID` (optional)
  - Default: `primary`
- `GOOGLE_CALENDAR_OWNER_EMAIL` (optional)
  - Default: `optimusksa@gmail.com`
  - Only this email is allowed to connect; prevents connecting the wrong Google account.
- `MEETING_DEFAULT_ATTENDEE_EMAILS` (optional)
  - Comma-separated list of emails that will be added as **attendees** on every new Book-a-Call calendar event.
  - They will receive the calendar invite email and see it on their calendars (depending on their Google Calendar settings).
  - Example: `abdulrahman-alkhassafi@optimus-solutions.org, shereen.akhun@optimus-solutions.org, Ceo@optimusksa.com`

## Tip: use a Google Group (recommended for teams)

Instead of listing multiple individual emails, you can create a Google Group (mailing list) like `meetings@optimus-solutions.org` and set `MEETING_DEFAULT_ATTENDEE_EMAILS` to that single address. This makes it easy to add/remove employees without redeploying.

## Google Cloud Console checklist

1. Create/select a project
2. Enable **Google Calendar API**
3. Configure **OAuth consent screen**
4. Create **OAuth Client ID** (Web application)
5. Add authorized redirect URI:
   - `https://optimus-solutions.org/api/google-calendar/callback`
   - and for local dev: `http://localhost:3000/api/google-calendar/callback`
6. Add `optimusksa@gmail.com` as a test user (if consent screen is in Testing)

## Connect flow (admin)

1. Login as admin
2. Go to `/admin/settings`
3. Click **Connect Google Calendar**
4. Sign in with the allowed account (`optimusksa@gmail.com`)
5. Accept permissions

If the connection succeeds, the status will show **Connected**.

## Security note (important)

Treat `GOOGLE_CLIENT_SECRET` like a password. If it is ever pasted into chat, rotated, or leaked, **rotate it immediately** in Google Cloud Console and update Netlify.
