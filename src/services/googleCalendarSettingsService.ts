import { doc, getDoc, setDoc, deleteField, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface GoogleCalendarSettings {
  refreshToken: string;
  calendarId?: string;
  connectedEmail?: string;
  lastUpdated?: any;
  updatedBy?: string;
}

class GoogleCalendarSettingsService {
  private docRef = doc(db, 'settings', 'googleCalendar');

  async get(): Promise<GoogleCalendarSettings | null> {
    try {
      const snap = await getDoc(this.docRef);
      if (!snap.exists()) return null;
      const data = snap.data() as Partial<GoogleCalendarSettings>;
      if (!data.refreshToken) return null;
      return data as GoogleCalendarSettings;
    } catch (e) {
      console.error('Error fetching google calendar settings:', e);
      return null;
    }
  }

  async upsert(settings: Partial<GoogleCalendarSettings>, updatedBy: string = 'system'): Promise<void> {
    await setDoc(
      this.docRef,
      {
        ...settings,
        lastUpdated: serverTimestamp(),
        updatedBy
      },
      { merge: true }
    );
  }

  async disconnect(updatedBy: string = 'system'): Promise<void> {
    try {
      await updateDoc(this.docRef, {
        refreshToken: deleteField(),
        connectedEmail: deleteField(),
        calendarId: deleteField(),
        lastUpdated: serverTimestamp(),
        updatedBy
      });
    } catch (e) {
      // If doc doesn't exist, ignore.
      console.warn('Error disconnecting google calendar settings:', e);
    }
  }
}

const googleCalendarSettingsService = new GoogleCalendarSettingsService();
export default googleCalendarSettingsService;





