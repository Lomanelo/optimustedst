import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase/firebase';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [dbConnectionError, setDbConnectionError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const { t } = useTranslation();

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkDatabaseConnection(); // Re-check database when back online
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check database connection
  const checkDatabaseConnection = async () => {
    if (!isOnline) return;
    
    setIsRetrying(true);
    
    try {
      // Use the imported db instance rather than creating a new one
      // Try to fetch a single document from programs collection (which is publicly readable)
      const q = query(collection(db, 'programs'), limit(1));
      await getDocs(q);
      
      // If successful, clear any database errors
      setDbConnectionError(false);
      setIsVisible(false);
    } catch (error) {
      console.error('Database connection error:', error);
      setDbConnectionError(true);
      setIsVisible(true);
    } finally {
      setIsRetrying(false);
    }
  };

  // Initial database connection check - only if online
  useEffect(() => {
    if (isOnline) {
      // Small delay to allow Firebase to initialize properly
      const initTimer = setTimeout(() => {
        checkDatabaseConnection();
      }, 2000);
      
      return () => clearTimeout(initTimer);
    }
  }, [isOnline]);

  const handleRetry = () => {
    checkDatabaseConnection();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 animate-slide-up">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          <span>
            {!isOnline
              ? t('network.offline', 'You are offline. Please check your internet connection.')
              : dbConnectionError
                ? t('network.dbError', 'Connection to database lost. Please try again later.')
                : ''}
          </span>
        </div>
        <button onClick={handleClose} className="text-red-500 hover:text-red-700">
          <X size={18} />
        </button>
        </div>
      <div className="mt-2 flex justify-end">
          <button 
          onClick={handleRetry}
          disabled={isRetrying}
          className={`${
            isRetrying ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
          } text-white text-sm py-1 px-3 rounded flex items-center`}
        >
          {isRetrying ? (
            <>
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              {t('network.retrying', 'Retrying...')}
            </>
          ) : (
            t('network.retry', 'Retry')
          )}
          </button>
        </div>
    </div>
  );
};

export default NetworkStatus; 