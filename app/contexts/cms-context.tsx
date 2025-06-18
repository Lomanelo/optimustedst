'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/firebase/firebase';
import { CMSContent, CMSSectionKey } from '../../src/types/cms';
import { useAuth } from './auth-context';

interface CMSContextType {
  content: Map<string, CMSContent>;
  loading: boolean;
  error: string | null;
  currentLanguage: 'en' | 'ar';
  getContent: (key: string, language?: 'en' | 'ar') => string;
  updateContent: (key: string, content_en: string, content_ar: string) => Promise<void>;
  getAllContent: () => CMSContent[];
  getContentBySection: (section: CMSSectionKey) => CMSContent[];
  refreshContent: () => Promise<void>;
  changeLanguage: (language: 'en' | 'ar') => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Map<string, CMSContent>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const { currentUser } = useAuth();
  
  // Initialize language from localStorage or default to 'en'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'en' | 'ar';
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        // Set initial language attributes without changing document direction
        document.documentElement.lang = savedLanguage;
        document.documentElement.setAttribute('data-language', savedLanguage);
      }
    }
  }, []);

  // Change language function
  const changeLanguage = (language: 'en' | 'ar') => {
    setCurrentLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      // Only update document language, not direction
      // Direction should be handled at component level for content areas
      document.documentElement.lang = language;
      
      // Add a data attribute for CSS styling if needed
      document.documentElement.setAttribute('data-language', language);
    }
  };

  // Load content from Firestore
  const loadContent = async () => {
    try {
      setLoading(true);
      const contentCollection = collection(db, 'cms_content');
      const snapshot = await getDocs(contentCollection);
      
      const contentMap = new Map<string, CMSContent>();
      snapshot.forEach((doc) => {
        const data = doc.data() as CMSContent;
        contentMap.set(data.key, { ...data, id: doc.id });
      });
      
      setContent(contentMap);
      setError(null);
    } catch (err) {
      console.error('Error loading CMS content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time updates
  useEffect(() => {
    const contentCollection = collection(db, 'cms_content');
    const unsubscribe = onSnapshot(contentCollection, (snapshot) => {
      const contentMap = new Map<string, CMSContent>();
      snapshot.forEach((doc) => {
        const data = doc.data() as CMSContent;
        contentMap.set(data.key, { ...data, id: doc.id });
      });
      setContent(contentMap);
    });

    return () => unsubscribe();
  }, []);

  // Get content by key
  const getContent = (key: string, language?: 'en' | 'ar'): string => {
    const lang = language || currentLanguage;
    const item = content.get(key);
    
    if (!item) {
      console.warn(`CMS content not found for key: ${key}`);
      return key; // Return the key as fallback
    }
    
    return lang === 'ar' ? item.content_ar : item.content_en;
  };

  // Update content (admin only)
  const updateContent = async (key: string, content_en: string, content_ar: string) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update content');
    }

    try {
      const existingContent = content.get(key);
      if (!existingContent) {
        throw new Error(`Content with key ${key} not found`);
      }

      const updatedContent: CMSContent = {
        ...existingContent,
        content_en,
        content_ar,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser.email || 'Unknown'
      };

      await setDoc(doc(db, 'cms_content', existingContent.id), updatedContent);
      
      // Update local state
      const newContent = new Map(content);
      newContent.set(key, updatedContent);
      setContent(newContent);
    } catch (err) {
      console.error('Error updating content:', err);
      throw err;
    }
  };

  // Get all content
  const getAllContent = (): CMSContent[] => {
    return Array.from(content.values());
  };

  // Get content by section
  const getContentBySection = (section: CMSSectionKey): CMSContent[] => {
    return Array.from(content.values()).filter(item => item.section === section);
  };

  // Refresh content
  const refreshContent = async () => {
    await loadContent();
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <CMSContext.Provider
      value={{
        content,
        loading,
        error,
        currentLanguage,
        getContent,
        updateContent,
        getAllContent,
        getContentBySection,
        refreshContent,
        changeLanguage
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}; 