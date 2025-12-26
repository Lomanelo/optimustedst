import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_REDIRECT_URI' },
      { status: 500 }
    );
  }

  // Important: if someone opens this endpoint from a Netlify preview domain but your redirect URI is
  // configured for production (recommended), the OAuth flow will always come back to the configured
  // domain. To avoid confusing cross-domain redirects (preview -> prod -> preview), we bounce the user
  // to the configured origin to start the flow there.
  try {
    const configuredOrigin = new URL(redirectUri).origin;
    const configuredHost = new URL(redirectUri).host;

    // On Netlify/proxies, req.nextUrl.origin can reflect an internal protocol and cause loops.
    // Compare by hostname/host only, and prefer forwarded host headers.
    const forwardedHost =
      req.headers.get('x-forwarded-host')?.split(',')[0].trim() ||
      req.headers.get('host')?.split(',')[0].trim() ||
      '';

    const requestHost = forwardedHost || req.nextUrl.host;
    if (configuredOrigin && configuredHost && requestHost && configuredHost !== requestHost) {
      return NextResponse.redirect(new URL('/api/google-calendar/auth', configuredOrigin));
    }
  } catch {
    // ignore URL parse errors; we'll let OAuth2 throw if redirectUri is invalid
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    // Keep scopes minimal. We need Calendar write access + identity (to enforce the allowedEmail check in callback).
    scope: ['https://www.googleapis.com/auth/calendar.events', 'openid', 'email', 'profile'],
    include_granted_scopes: true
  });

  return NextResponse.redirect(authUrl);
}



