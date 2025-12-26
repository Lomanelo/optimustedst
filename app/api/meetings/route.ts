import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import googleCalendarSettingsService from '../../../src/services/googleCalendarSettingsService';
import { getGoogleCalendarSettingsAdmin } from '../../../src/server/googleCalendarStore';

interface MeetingRequestBody {
  name: string;
  email: string;
  phone?: string;
  preferredLanguage?: 'en' | 'ar';
  notes?: string;
  // ISO string for selected slot start time in user's local time
  slotStartIso: string;
  timezone?: string; // display-only
  slotDurationMinutes?: number;
}

const CALENDAR_ORGANIZER_EMAIL = process.env.CALENDAR_ORGANIZER_EMAIL || 'optimusksa@gmail.com';

function icsEscape(value: string) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function toIcsDateUtc(date: Date) {
  // YYYYMMDDTHHMMSSZ
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}

function buildIcsInvite(params: {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  organizerEmail: string;
  attendeeEmail: string;
}) {
  const dtStamp = toIcsDateUtc(new Date());
  const dtStart = toIcsDateUtc(params.start);
  const dtEnd = toIcsDateUtc(params.end);

  // Keep it simple: attachment allows "Add to calendar" easily across clients.
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Optimus Solutions//Book-a-Call//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${icsEscape(params.uid)}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${icsEscape(params.summary)}`,
    `DESCRIPTION:${icsEscape(params.description)}`,
    `ORGANIZER:mailto:${icsEscape(params.organizerEmail)}`,
    `ATTENDEE;CN=${icsEscape(params.attendeeEmail)}:mailto:${icsEscape(params.attendeeEmail)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

const createTransporter = () => {
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  };

  return nodemailer.createTransport(smtpConfig);
};

export async function POST(req: NextRequest) {
  try {
    const body: MeetingRequestBody = await req.json();
    const { name, email, phone, preferredLanguage, notes, slotStartIso, timezone, slotDurationMinutes } = body;

    if (!name || !email || !slotStartIso) {
      return NextResponse.json(
        { error: 'Required fields: name, email, slotStartIso' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const recipientEmail = process.env.MEETING_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'info@optimus-solutions.org';

    const durationMin = typeof slotDurationMinutes === 'number' && slotDurationMinutes > 0 ? slotDurationMinutes : 30;
    const startDate = new Date(slotStartIso);
    const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000);
    const uid = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
      ? (globalThis.crypto as Crypto).randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const prettySlot = (() => {
      try {
        const d = new Date(slotStartIso);
        return d.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return slotStartIso;
      }
    })();

    const ics = buildIcsInvite({
      uid,
      start: startDate,
      end: endDate,
      summary: `Optimus Solutions Call — ${name}`,
      description: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Preferred language: ${preferredLanguage || 'Not specified'}`,
        `Requested slot: ${prettySlot}${timezone ? ` (${timezone})` : ''}`,
        notes ? `Notes: ${notes}` : ''
      ]
        .filter(Boolean)
        .join('\n'),
      organizerEmail: CALENDAR_ORGANIZER_EMAIL,
      attendeeEmail: email
    });

    const calendarAttachment = {
      filename: 'meeting-invite.ics',
      content: ics,
      contentType: 'text/calendar; charset=utf-8'
    };

    // If Google Calendar is connected, create an event automatically
    let createdCalendarEventLink: string | undefined;
    let calendarMode: 'firestore_admin' | 'env_refresh_token' | 'firestore_client' | 'none' = 'none';
    let calendarError:
      | {
          message: string;
          status?: number;
          reason?: string;
        }
      | undefined;
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

      // Prefer Firebase Admin store if available
      let refreshToken: string | undefined;
      let calendarIdFromStore: string | undefined;
      try {
        const adminStored = await getGoogleCalendarSettingsAdmin();
        if (adminStored?.refreshToken) {
          refreshToken = adminStored.refreshToken;
          calendarIdFromStore = adminStored.calendarId;
          calendarMode = 'firestore_admin';
        }
      } catch (e) {
        // ignore; will fall back
      }

      // Fallback: env var (quickest way if Firebase Admin isn't configured)
      if (!refreshToken && envRefreshToken) {
        refreshToken = envRefreshToken;
        calendarMode = 'env_refresh_token';
      }

      // Last resort fallback: client SDK store (may fail depending on Firestore rules)
      let gcal = null as any;
      if (!refreshToken) {
        gcal = await googleCalendarSettingsService.get();
        if (gcal?.refreshToken) {
          refreshToken = gcal.refreshToken;
          calendarIdFromStore = gcal.calendarId;
          calendarMode = 'firestore_client';
        }
      }

      if (clientId && clientSecret && redirectUri && refreshToken) {
        const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        oauth2.setCredentials({ refresh_token: refreshToken });
        const calendar = google.calendar({ version: 'v3', auth: oauth2 });

        const calendarId = calendarIdFromStore || process.env.GOOGLE_CALENDAR_ID || 'primary';
        // Since slotStartIso is already an absolute ISO timestamp (UTC, from browser toISOString()),
        // we send RFC3339 dateTime with offset ("Z") and omit timeZone to avoid mismatches.
        // (Google will display it in the calendar/account timezone automatically.)
        const startIso = startDate.toISOString();
        const endIso = endDate.toISOString();

        const event = await calendar.events.insert({
          calendarId,
          sendUpdates: 'all',
          requestBody: {
            summary: `Optimus Solutions Call — ${name}`,
            description: [
              `Name: ${name}`,
              `Email: ${email}`,
              `Phone: ${phone || 'Not provided'}`,
              `Preferred language: ${preferredLanguage || 'Not specified'}`,
              notes ? `Notes: ${notes}` : ''
            ].filter(Boolean).join('\n'),
            start: { dateTime: startIso },
            end: { dateTime: endIso },
            attendees: [{ email }]
          }
        });

        createdCalendarEventLink = event.data.htmlLink || undefined;
      }
    } catch (e) {
      const anyErr = e as any;
      const status = typeof anyErr?.code === 'number' ? anyErr.code : typeof anyErr?.response?.status === 'number' ? anyErr.response.status : undefined;
      const reason =
        anyErr?.errors?.[0]?.reason ||
        anyErr?.response?.data?.error?.errors?.[0]?.reason ||
        anyErr?.response?.data?.error?.status ||
        undefined;
      const message =
        anyErr?.response?.data?.error?.message ||
        (e instanceof Error ? e.message : 'unknown_error');
      calendarError = { message, status, reason };
      console.error('Google Calendar event creation failed:', { status, reason, message, raw: anyErr });
    }

    const smtpConfigured = !!process.env.SMTP_USER && !!process.env.SMTP_PASSWORD;
    if (!smtpConfigured) {
      console.log('Meeting request (SMTP not configured):', {
        name,
        email,
        phone,
        preferredLanguage,
        notes,
        slotStartIso,
        timezone,
        timestamp: new Date().toISOString(),
        recipientEmail,
        calendar: {
          created: !!createdCalendarEventLink,
          link: createdCalendarEventLink,
          mode: calendarMode,
          error: calendarError
        }
      });

      // Still return success so the booking flow works; calendar creation may still succeed.
      return NextResponse.json(
        {
          message: 'Meeting request received.',
          warning: 'SMTP is not configured, so emails were not sent.',
          recipientEmail,
          calendar: {
            created: !!createdCalendarEventLink,
            link: createdCalendarEventLink,
            mode: calendarMode,
            error: calendarError
          }
        },
        { status: 200 }
      );
    }

    const transporter = createTransporter();
    await transporter.verify();

    const adminEmail = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: recipientEmail,
      subject: `New Meeting Request from ${name}`,
      attachments: [calendarAttachment],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background-color: #2B1F4F; color: white; padding: 18px; text-align: center;">
            <h2 style="margin: 0;">New Book-a-Call Request</h2>
          </div>
          <div style="padding: 18px; background-color: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Name</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Email</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Phone</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Preferred language</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${preferredLanguage || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Requested slot</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${prettySlot} ${timezone ? `(${timezone})` : ''}</td>
              </tr>
            </table>
            ${createdCalendarEventLink ? `<p style="margin-top: 12px;"><strong>Calendar event:</strong> <a href="${createdCalendarEventLink}">Open in Google Calendar</a></p>` : ``}
            ${
              notes
                ? `<h3 style="color: #2B1F4F; margin-top: 16px;">Notes</h3>
                   <div style="background-color: white; padding: 12px; border-left: 4px solid #058C42;">${String(notes)
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/\n/g, '<br>')}</div>`
                : ''
            }
          </div>
          <div style="background-color: #2B1F4F; color: white; padding: 12px; text-align: center;">
            <p style="margin: 0;">Optimus Solutions · Book-a-Call</p>
          </div>
        </div>
      `
    };

    const userEmail = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: preferredLanguage === 'ar' ? 'تم استلام طلب موعدك' : 'We received your meeting request',
      attachments: [calendarAttachment],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background-color: #2B1F4F; color: white; padding: 18px; text-align: center;">
            <h2 style="margin: 0;">${preferredLanguage === 'ar' ? 'شكرًا لتواصلك' : 'Thank you for reaching out'}</h2>
          </div>
          <div style="padding: 18px;">
            <p>${preferredLanguage === 'ar' ? `عزيزي/عزيزتي ${name},` : `Dear ${name},`}</p>
            <p>
              ${
                preferredLanguage === 'ar'
                  ? 'تم استلام طلب حجز موعد مكالمة. سيتواصل معك فريقنا لتأكيد الموعد.'
                  : 'We received your request to book a call. Our team will contact you to confirm.'
              }
            </p>
            <p><strong>${preferredLanguage === 'ar' ? 'الوقت المطلوب:' : 'Requested time:'}</strong> ${prettySlot} ${
              timezone ? `(${timezone})` : ''
            }</p>
            ${createdCalendarEventLink ? `<p><a href="${createdCalendarEventLink}">${preferredLanguage === 'ar' ? 'فتح الموعد في التقويم' : 'Open event in calendar'}</a></p>` : ``}
            <p style="margin-top: 18px;">
              ${preferredLanguage === 'ar' ? 'مع التحية،<br>فريق Optimus Solutions' : 'Best regards,<br>The Optimus Solutions Team'}
            </p>
          </div>
        </div>
      `
    };

    await Promise.all([transporter.sendMail(adminEmail), transporter.sendMail(userEmail)]);

    return NextResponse.json(
      {
        message: 'Meeting request submitted successfully. We will contact you soon!',
        calendar: {
          created: !!createdCalendarEventLink,
          link: createdCalendarEventLink,
          mode: calendarMode,
          error: calendarError
        }
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error in meeting request submission:', e);
    return NextResponse.json(
      { error: 'Failed to submit meeting request. Please try again later.' },
      { status: 500 }
    );
  }
}


