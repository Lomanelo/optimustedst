'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/firebase/firebase';
import { CMSContent, CMSSectionKey } from '../../src/types/cms';
import { useAuth } from './auth-context';
import { extractedContent } from '../../scripts/extract-website-content';

// Utility function to format text content with proper line breaks and paragraphs
const formatTextContent = (text: string): React.ReactNode => {
  if (!text) return text;
  
  // Split by double line breaks (paragraphs)
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  if (paragraphs.length <= 1) {
    // Single paragraph, just handle line breaks
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length <= 1) {
      return text; // Single line, return as is
    }
    return (
      <>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  }
  
  // Multiple paragraphs
  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split('\n').filter(line => line.trim());
        return (
          <p key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
            {lines.map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {line}
                {lIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

interface CMSContextType {
  content: Map<string, CMSContent>;
  loading: boolean;
  error: string | null;
  currentLanguage: 'en' | 'ar';
  getContent: (key: string, language?: 'en' | 'ar') => string;
  getFormattedContent: (key: string, language?: 'en' | 'ar') => React.ReactNode;
  updateContent: (key: string, content_en: string, content_ar: string) => Promise<void>;
  getAllContent: () => CMSContent[];
  getContentBySection: (section: CMSSectionKey) => CMSContent[];
  refreshContent: () => Promise<void>;
  changeLanguage: (language: 'en' | 'ar') => void;
  forceRepopulateContent: () => Promise<{ success: number; errors: number; }>;
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
        // Set initial language attributes including direction
        document.documentElement.lang = savedLanguage;
        document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('data-language', savedLanguage);
      } else {
        // Set default attributes even if no saved language
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        document.documentElement.setAttribute('data-language', 'en');
      }
    }
  }, []);

  // Change language function
  const changeLanguage = (language: 'en' | 'ar') => {
    setCurrentLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      // Update document language and direction
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      // Add a data attribute for CSS styling
      document.documentElement.setAttribute('data-language', language);
    }
  };

  // Automatically populate database if empty or missing content
  // This works for all users (authenticated and anonymous) to ensure consistent translations
  const populateIfEmpty = async () => {
    try {
      const contentCollection = collection(db, 'cms_content');
      const snapshot = await getDocs(contentCollection);
      
      // Check if we have essential content
      const existingKeys = new Set<string>();
      snapshot.forEach(doc => {
        const data = doc.data();
        existingKeys.add(data.key);
      });
      
      // Check for missing content (prioritize essential and filter content)
      const missingContent = extractedContent.filter(item => !existingKeys.has(item.key));
      
      // If database is empty, has less than 50 items, or missing essential content, populate it
      if (snapshot.size < 50 || missingContent.length > 0) {
        console.log(`CMS auto-population: Adding ${missingContent.length} missing items...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const item of missingContent) {
          try {
            await setDoc(doc(contentCollection, item.id), item);
            successCount++;
          } catch (error: any) {
            errorCount++;
            // Only log errors in development, continue silently in production
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Failed to add ${item.key}:`, error?.message || error);
            }
          }
        }
        
        console.log(`CMS auto-population completed: ${successCount} added, ${errorCount} failed`);
      }
    } catch (error) {
      // Silently handle errors to not break the user experience
      if (process.env.NODE_ENV === 'development') {
        console.error('CMS auto-population error:', error);
      }
    }
  };

  // Load content from Firestore
  const loadContent = async () => {
    try {
      setLoading(true);
      
      // First, check if we need to populate the database
      await populateIfEmpty();
      
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
    const setupRealtimeUpdates = async () => {
      // Check if we need to populate first
      await populateIfEmpty();
      
    const contentCollection = collection(db, 'cms_content');
    const unsubscribe = onSnapshot(contentCollection, (snapshot) => {
      const contentMap = new Map<string, CMSContent>();
      snapshot.forEach((doc) => {
        const data = doc.data() as CMSContent;
        contentMap.set(data.key, { ...data, id: doc.id });
      });
      setContent(contentMap);
        setLoading(false); // Set loading to false when we get data
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    
    setupRealtimeUpdates().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Get content by key with robust fallbacks
  const getContent = (key: string, language?: 'en' | 'ar'): string => {
    const lang = language || currentLanguage;
    const item = content.get(key);
    
    if (!item) {
      // Try to find content in the static extract as fallback
      const extractItem = extractedContent.find(extract => extract.key === key);
      if (extractItem) {
        const fallbackValue = lang === 'ar' ? extractItem.content_ar : extractItem.content_en;
        return fallbackValue || key;
      }
      
      // Only log in development to avoid console spam
      if (process.env.NODE_ENV === 'development') {
        console.warn(`CMS content not found for key: ${key}`);
      }
      return key; // Return the key as fallback
    }
    
    const contentValue = lang === 'ar' ? item.content_ar : item.content_en;
    
    // Ensure we return a string, not an object
    if (typeof contentValue === 'object') {
      if (process.env.NODE_ENV === 'development') {
        console.error(`CMS content for key "${key}" is an object, expected string:`, contentValue);
      }
      return key; // Return the key as fallback
    }
    
    return contentValue || key;
  };

  // Get formatted content (for rich text rendering)
  const getFormattedContent = (key: string, language?: 'en' | 'ar'): React.ReactNode => {
    const lang = language || currentLanguage;
    const item = content.get(key);

    if (!item) {
      // Try to find content in the static extract as fallback
      const extractItem = extractedContent.find(extract => extract.key === key);
      if (extractItem) {
        const fallbackValue = lang === 'ar' ? extractItem.content_ar : extractItem.content_en;
        return formatTextContent(fallbackValue || key);
      }
      
      // Only log in development to avoid console spam
      if (process.env.NODE_ENV === 'development') {
        console.warn(`CMS formatted content not found for key: ${key}`);
      }
      return key; // Return the key as fallback
    }

    const contentValue = lang === 'ar' ? item.content_ar : item.content_en;

    // Ensure we return a string, not an object
    if (typeof contentValue === 'object') {
      if (process.env.NODE_ENV === 'development') {
        console.error(`CMS formatted content for key "${key}" is an object, expected string:`, contentValue);
      }
      return key; // Return the key as fallback
    }

    return formatTextContent(contentValue || key);
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

  // Force refresh and repopulate content (for admin use or system initialization)
  const forceRepopulateContent = async () => {
    try {
      console.log('Force repopulating CMS content...');
      const contentCollection = collection(db, 'cms_content');
      
      let successCount = 0;
      let errorCount = 0;
      
      // Add/update all content from extract script
      for (const item of extractedContent) {
        try {
          await setDoc(doc(contentCollection, item.id), item);
          successCount++;
        } catch (error: any) {
          errorCount++;
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Failed to update ${item.key}:`, error?.message || error);
          }
        }
      }
      
      console.log(`Force repopulation completed: ${successCount} updated, ${errorCount} failed`);
      await loadContent(); // Reload after update
      
      return { success: successCount, errors: errorCount };
    } catch (error) {
      console.error('Error force repopulating CMS database:', error);
      return { success: 0, errors: extractedContent.length };
    }
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
        getFormattedContent,
        updateContent,
        getAllContent,
        getContentBySection,
        refreshContent,
        changeLanguage,
        forceRepopulateContent
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}; 