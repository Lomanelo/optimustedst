'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/firebase/firebase';

interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  snapchat: string;
  linkedin: string;
  tiktok: string;
}

interface WebsiteSettings {
  socialMedia: SocialMediaLinks;
  lastUpdated: string;
  updatedBy: string;
}

interface SettingsContextType {
  settings: WebsiteSettings | null;
  socialMedia: SocialMediaLinks;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSocialMedia: SocialMediaLinks = {
  facebook: '',
  instagram: '',
  twitter: '',
  snapchat: '',
  linkedin: '',
  tiktok: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>(defaultSocialMedia);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener for settings
    const settingsRef = doc(db, 'websiteSettings', 'general');
    
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as WebsiteSettings;
        setSettings(data);
        setSocialMedia(data.socialMedia || defaultSocialMedia);
      } else {
        setSettings(null);
        setSocialMedia(defaultSocialMedia);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error listening to settings:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const settingsRef = doc(db, 'websiteSettings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data() as WebsiteSettings;
        setSettings(data);
        setSocialMedia(data.socialMedia || defaultSocialMedia);
      } else {
        setSettings(null);
        setSocialMedia(defaultSocialMedia);
      }
    } catch (error) {
      console.error('Error refreshing settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: SettingsContextType = {
    settings,
    socialMedia,
    isLoading,
    refreshSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 