import { NextResponse } from 'next/server';
import { getGoogleCalendarSettingsAdmin, getGoogleCalendarSettingsAdminDebug } from '../../../../src/server/googleCalendarStore';
import { getAdminApp } from '../../../../src/firebase/firebaseAdmin';

export async function GET() {
  const missingEnv: string[] = [];
  if (!process.env.GOOGLE_CLIENT_ID) missingEnv.push('GOOGLE_CLIENT_ID');
  if (!process.env.GOOGLE_CLIENT_SECRET) missingEnv.push('GOOGLE_CLIENT_SECRET');
  if (!process.env.GOOGLE_REDIRECT_URI) missingEnv.push('GOOGLE_REDIRECT_URI');
  const envOk = missingEnv.length === 0;

  // Connected if either admin-store has token OR env refresh token is set.
  const envRefresh = !!process.env.GOOGLE_REFRESH_TOKEN;
  let adminConnected = false;
  let connectedEmail: string | undefined;
  let calendarId: string | undefined;
  let adminOk = true;
  let adminError: string | undefined;
  let adminProjectId: string | undefined;
  let debug:
    | {
        settingsDoc: Awaited<ReturnType<typeof getGoogleCalendarSettingsAdminDebug>>;
      }
    | undefined;

  const missingAdminEnv: string[] = [];
  const hasServiceAccountJson = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const hasSplitAdmin =
    !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
    !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!hasServiceAccountJson && !hasSplitAdmin) {
    missingAdminEnv.push(
      'FIREBASE_SERVICE_ACCOUNT_JSON (recommended) OR FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY'
    );
  }

  try {
    adminProjectId = getAdminApp().options.projectId;
    const s = await getGoogleCalendarSettingsAdmin();
    adminConnected = !!s?.refreshToken;
    connectedEmail = s?.connectedEmail || undefined;
    calendarId = s?.calendarId || undefined;

    // Safe debug: does the settings doc exist / have refresh token (no secret values returned)
    debug = { settingsDoc: await getGoogleCalendarSettingsAdminDebug() };
  } catch (e) {
    adminOk = false;
    adminError = e instanceof Error ? e.message : 'unknown_admin_error';
  }

  return NextResponse.json({
    envOk,
    adminOk,
    connected: adminConnected || envRefresh,
    connectedEmail: connectedEmail || (process.env.GOOGLE_CALENDAR_OWNER_EMAIL || process.env.CALENDAR_ORGANIZER_EMAIL || undefined),
    calendarId: calendarId || process.env.GOOGLE_CALENDAR_ID || 'primary',
    using: adminConnected ? 'firestore_admin' : envRefresh ? 'env_refresh_token' : 'none',
    missingEnv,
    missingAdminEnv,
    adminError,
    adminProjectId,
    debug
  });
}


