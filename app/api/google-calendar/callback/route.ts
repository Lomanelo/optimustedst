import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import googleCalendarSettingsService from '../../../../src/services/googleCalendarSettingsService';
import { upsertGoogleCalendarSettingsAdmin } from '../../../../src/server/googleCalendarStore';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const allowedEmail = process.env.GOOGLE_CALENDAR_OWNER_EMAIL || process.env.CALENDAR_ORGANIZER_EMAIL || 'optimusksa@gmail.com';
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_REDIRECT_URI' },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/admin/settings?gcal=error&reason=${encodeURIComponent(error)}`, url.origin));
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2.getToken(code);

  // Ensure we get a refresh token (required for server-side automation)
  if (!tokens.refresh_token) {
    return NextResponse.redirect(
      new URL('/admin/settings?gcal=error&reason=missing_refresh_token', url.origin)
    );
  }

  oauth2.setCredentials(tokens);

  // Validate connected account email
  try {
    const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 });
    const me = await oauth2Api.userinfo.get();
    const email = me.data.email || '';
    if (email.toLowerCase() !== allowedEmail.toLowerCase()) {
      return NextResponse.redirect(
        new URL(`/admin/settings?gcal=error&reason=wrong_account&email=${encodeURIComponent(email)}`, url.origin)
      );
    }

    // Prefer storing via Firebase Admin (server-side) so API routes can read it reliably.
    try {
      await upsertGoogleCalendarSettingsAdmin({
        refreshToken: tokens.refresh_token,
        connectedEmail: email,
        calendarId,
        updatedBy: email || 'google-oauth'
      });
    } catch (adminErr) {
      // Fallback: client SDK Firestore (may fail depending on security rules)
      console.warn('Firebase Admin store failed, falling back to client SDK store:', adminErr);
      await googleCalendarSettingsService.upsert(
        {
          refreshToken: tokens.refresh_token,
          connectedEmail: email,
          calendarId
        },
        email || 'google-oauth'
      );
    }
  } catch (e) {
    console.error('Failed to verify/store Google Calendar connection:', e);
    return NextResponse.redirect(new URL('/admin/settings?gcal=error&reason=verify_failed', url.origin));
  }

  return NextResponse.redirect(new URL('/admin/settings?gcal=connected', url.origin));
}


