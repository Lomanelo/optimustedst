import { NextResponse } from 'next/server';
import { getGoogleCalendarSettingsAdmin } from '../../../../src/server/googleCalendarStore';

export async function GET() {
  const envOk = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);

  // Connected if either admin-store has token OR env refresh token is set.
  const envRefresh = !!process.env.GOOGLE_REFRESH_TOKEN;
  let adminConnected = false;
  let connectedEmail: string | undefined;
  let calendarId: string | undefined;
  let adminOk = true;

  try {
    const s = await getGoogleCalendarSettingsAdmin();
    adminConnected = !!s?.refreshToken;
    connectedEmail = s?.connectedEmail || undefined;
    calendarId = s?.calendarId || undefined;
  } catch (e) {
    adminOk = false;
  }

  return NextResponse.json({
    envOk,
    adminOk,
    connected: adminConnected || envRefresh,
    connectedEmail: connectedEmail || (process.env.GOOGLE_CALENDAR_OWNER_EMAIL || process.env.CALENDAR_ORGANIZER_EMAIL || undefined),
    calendarId: calendarId || process.env.GOOGLE_CALENDAR_ID || 'primary',
    using: adminConnected ? 'firestore_admin' : envRefresh ? 'env_refresh_token' : 'none'
  });
}


