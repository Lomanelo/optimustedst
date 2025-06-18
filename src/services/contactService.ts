import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface ContactInfo {
  phoneNumber: string;
  ceoEmail: string;
  marketingEmail: string;
  supportEmail: string;
  admissionsEmail: string;
  generalInquiriesEmail: string;
  address: string;
  lastUpdated?: any;
  updatedBy?: string;
}

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  phoneNumber: '+971569852211',
  ceoEmail: 'ceo@optimusksa.com',
  marketingEmail: 'marketing@optimusksa.com',
  supportEmail: 'support@optimusksa.com',
  admissionsEmail: 'admissions@optimusksa.com',
  generalInquiriesEmail: 'info@optimusksa.com',
  address: 'Riyadh, Saudi Arabia'
};

class ContactService {
  private contactDocRef = doc(db, 'settings', 'contactInfo');

  /**
   * Get contact information
   */
  async getContactInfo(): Promise<ContactInfo> {
    try {
      const docSnap = await getDoc(this.contactDocRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ContactInfo;
      } else {
        // If no contact info exists, create default one
        await this.updateContactInfo(DEFAULT_CONTACT_INFO);
        return DEFAULT_CONTACT_INFO;
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return DEFAULT_CONTACT_INFO;
    }
  }

  /**
   * Update contact information
   */
  async updateContactInfo(contactInfo: Partial<ContactInfo>, updatedBy: string = 'admin'): Promise<void> {
    try {
      const updateData = {
        ...contactInfo,
        lastUpdated: serverTimestamp(),
        updatedBy
      };

      await setDoc(this.contactDocRef, updateData, { merge: true });
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }

  /**
   * Listen to contact information changes in real-time
   */
  listenToContactInfo(callback: (contactInfo: ContactInfo) => void): () => void {
    return onSnapshot(
      this.contactDocRef,
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as ContactInfo);
        } else {
          callback(DEFAULT_CONTACT_INFO);
        }
      },
      (error) => {
        console.error('Error listening to contact info:', error);
        callback(DEFAULT_CONTACT_INFO);
      }
    );
  }

  /**
   * Get WhatsApp URL with default message
   */
  getWhatsAppUrl(message?: string): string {
    const defaultMessage = 'Hello! I would like to know more about your programs.';
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    // Remove any non-numeric characters from phone number for WhatsApp
    const cleanPhoneNumber = DEFAULT_CONTACT_INFO.phoneNumber.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
  }
}

const contactService = new ContactService();
export default contactService; 