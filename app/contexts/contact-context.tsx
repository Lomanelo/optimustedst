'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import contactService, { ContactInfo, DEFAULT_CONTACT_INFO, DayHours } from '../../src/services/contactService';

interface ContactContextType {
  contactInfo: ContactInfo;
  updateContactInfo: (contactInfo: Partial<ContactInfo>, updatedBy?: string) => Promise<void>;
  loading: boolean;
}

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates
    const unsubscribe = contactService.listenToContactInfo((newContactInfo: ContactInfo) => {
      // Ensure operatingHours is properly structured with migration support
      const migrateOperatingHours = (hours: any) => {
        // If it's the old format, migrate it
        if (hours && typeof hours.mondayToFriday === 'string') {
          return {
            monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
            tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
            wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
            thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
            friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
            saturday: { isOpen: true, openTime: '10:00', closeTime: '14:00' },
            sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' }
          };
        }
        
        // If it's already in the new format, ensure all days are present
        const defaultDay: DayHours = { isOpen: false, openTime: '09:00', closeTime: '18:00' };
        return {
          monday: hours?.monday || defaultDay,
          tuesday: hours?.tuesday || defaultDay,
          wednesday: hours?.wednesday || defaultDay,
          thursday: hours?.thursday || defaultDay,
          friday: hours?.friday || defaultDay,
          saturday: hours?.saturday || defaultDay,
          sunday: hours?.sunday || defaultDay
        };
      };

      const safeContactInfo = {
        ...newContactInfo,
        operatingHours: migrateOperatingHours(newContactInfo.operatingHours)
      };
      
      setContactInfo(safeContactInfo);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const updateContactInfo = async (newContactInfo: Partial<ContactInfo>, updatedBy: string = 'admin'): Promise<void> => {
    try {
      await contactService.updateContactInfo(newContactInfo, updatedBy);
      // The real-time listener will automatically update the state
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  };

  return (
    <ContactContext.Provider value={{
      contactInfo,
      updateContactInfo,
      loading
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
}; 