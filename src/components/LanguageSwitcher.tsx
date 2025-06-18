'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useCMS } from '../../app/contexts/cms-context';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useCMS();

  const handleLanguageChange = (language: 'en' | 'ar') => {
    changeLanguage(language);
  };

  return (
    <div className="flex items-center gap-2" dir="ltr">
      <Globe size={16} className="text-gray-600" />
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            currentLanguage === 'en' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            currentLanguage === 'ar' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          ع
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 