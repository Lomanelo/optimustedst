import { getAdminFirestore } from '../firebase/firebaseAdmin';

export interface GoogleCalendarStoredSettings {
  refreshToken: string;
  calendarId?: string;
  connectedEmail?: string;
  updatedBy?: string;
  lastUpdated?: any;
}

const DOC_PATH = { collection: 'settings', doc: 'googleCalendar' };

export async function getGoogleCalendarSettingsAdmin(): Promise<GoogleCalendarStoredSettings | null> {
  const db = getAdminFirestore();
  const snap = await db.collection(DOC_PATH.collection).doc(DOC_PATH.doc).get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<GoogleCalendarStoredSettings> | undefined;
  if (!data?.refreshToken) return null;
  return data as GoogleCalendarStoredSettings;
}

export async function upsertGoogleCalendarSettingsAdmin(settings: Partial<GoogleCalendarStoredSettings>) {
  const db = getAdminFirestore();
  await db.collection(DOC_PATH.collection).doc(DOC_PATH.doc).set(
    {
      ...settings,
      lastUpdated: new Date().toISOString()
    },
    { merge: true }
  );
}

export async function disconnectGoogleCalendarAdmin(updatedBy?: string) {
  const db = getAdminFirestore();
  await db.collection(DOC_PATH.collection).doc(DOC_PATH.doc).set(
    {
      refreshToken: null,
      connectedEmail: null,
      calendarId: null,
      updatedBy: updatedBy || 'admin',
      lastUpdated: new Date().toISOString()
    },
    { merge: true }
  );
}



