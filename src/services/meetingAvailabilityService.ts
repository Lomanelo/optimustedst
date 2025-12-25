import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type WeekdayKey =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface DayAvailability {
  isOpen: boolean;
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
}

export interface MeetingAvailabilitySettings {
  slotDurationMinutes: number; // e.g. 30
  timezone: string; // e.g. "Asia/Riyadh"
  weekly: Record<WeekdayKey, DayAvailability>;
  lastUpdated?: any;
  updatedBy?: string;
}

export const DEFAULT_MEETING_AVAILABILITY: MeetingAvailabilitySettings = {
  slotDurationMinutes: 30,
  timezone: 'Asia/Riyadh',
  weekly: {
    sunday: { isOpen: true, openTime: '12:00', closeTime: '22:00' },
    monday: { isOpen: true, openTime: '12:00', closeTime: '22:00' },
    tuesday: { isOpen: true, openTime: '12:00', closeTime: '22:00' },
    wednesday: { isOpen: true, openTime: '12:00', closeTime: '22:00' },
    thursday: { isOpen: true, openTime: '12:00', closeTime: '22:00' },
    friday: { isOpen: true, openTime: '15:00', closeTime: '22:00' },
    saturday: { isOpen: true, openTime: '12:00', closeTime: '22:00' }
  }
};

class MeetingAvailabilityService {
  private settingsDocRef = doc(db, 'settings', 'meetingAvailability');

  async getSettings(): Promise<MeetingAvailabilitySettings> {
    try {
      const snap = await getDoc(this.settingsDocRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<MeetingAvailabilitySettings>;
        return this.normalize(data);
      }
      // If not found, create defaults
      await this.updateSettings(DEFAULT_MEETING_AVAILABILITY, 'system');
      return DEFAULT_MEETING_AVAILABILITY;
    } catch (e) {
      console.error('Error fetching meeting availability settings:', e);
      return DEFAULT_MEETING_AVAILABILITY;
    }
  }

  listenToSettings(callback: (settings: MeetingAvailabilitySettings) => void): () => void {
    return onSnapshot(
      this.settingsDocRef,
      (snap) => {
        if (snap.exists()) callback(this.normalize(snap.data() as any));
        else callback(DEFAULT_MEETING_AVAILABILITY);
      },
      (error) => {
        console.error('Error listening to meeting availability settings:', error);
        callback(DEFAULT_MEETING_AVAILABILITY);
      }
    );
  }

  async updateSettings(
    settings: Partial<MeetingAvailabilitySettings>,
    updatedBy: string = 'admin'
  ): Promise<void> {
    const updateData = {
      ...settings,
      lastUpdated: serverTimestamp(),
      updatedBy
    };
    await setDoc(this.settingsDocRef, updateData, { merge: true });
  }

  private normalize(raw: Partial<MeetingAvailabilitySettings>): MeetingAvailabilitySettings {
    const weekly = raw.weekly || ({} as any);
    return {
      slotDurationMinutes:
        typeof raw.slotDurationMinutes === 'number' && raw.slotDurationMinutes > 0
          ? raw.slotDurationMinutes
          : DEFAULT_MEETING_AVAILABILITY.slotDurationMinutes,
      timezone: raw.timezone || DEFAULT_MEETING_AVAILABILITY.timezone,
      weekly: {
        sunday: weekly.sunday || DEFAULT_MEETING_AVAILABILITY.weekly.sunday,
        monday: weekly.monday || DEFAULT_MEETING_AVAILABILITY.weekly.monday,
        tuesday: weekly.tuesday || DEFAULT_MEETING_AVAILABILITY.weekly.tuesday,
        wednesday: weekly.wednesday || DEFAULT_MEETING_AVAILABILITY.weekly.wednesday,
        thursday: weekly.thursday || DEFAULT_MEETING_AVAILABILITY.weekly.thursday,
        friday: weekly.friday || DEFAULT_MEETING_AVAILABILITY.weekly.friday,
        saturday: weekly.saturday || DEFAULT_MEETING_AVAILABILITY.weekly.saturday
      },
      lastUpdated: raw.lastUpdated,
      updatedBy: raw.updatedBy
    };
  }
}

const meetingAvailabilityService = new MeetingAvailabilityService();
export default meetingAvailabilityService;


