import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [language, setLanguage] = React.useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // In a real implementation, this would trigger a context update or similar
    // to propagate the language change throughout the app
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={`flex items-center gap-1 text-sm font-medium ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
    >
      <Globe size={16} />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle; 