'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import contactService, { ContactInfo, DEFAULT_CONTACT_INFO } from '../../src/services/contactService';

interface ContactContextType {
  contactInfo: ContactInfo;
  loading: boolean;
  updateContactInfo: (contactInfo: Partial<ContactInfo>, updatedBy?: string) => Promise<void>;
  getWhatsAppUrl: (message?: string) => string;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates
    const unsubscribe = contactService.listenToContactInfo((newContactInfo) => {
      setContactInfo(newContactInfo);
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

  const getWhatsAppUrl = (message?: string): string => {
    const defaultMessage = 'Hello! I would like to know more about your programs.';
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    // Remove any non-numeric characters from phone number for WhatsApp
    const cleanPhoneNumber = contactInfo.phoneNumber.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
  };

  const value: ContactContextType = {
    contactInfo,
    loading,
    updateContactInfo,
    getWhatsAppUrl
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
}; 