import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';

export interface LogoProps {
  className?: string;
  withText?: boolean;
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = '', withText = true, variant = 'default' }) => {
  const { currentLanguage } = useCMS();
  const isArabic = currentLanguage === 'ar';
  
  // Select the appropriate logo based on language (use new branding assets)
  let logoSrc = isArabic ? '/Final%20Logo%20AR-03.jpg' : '/Final%20Logo01-03.jpg';
  
  return (
    <div className={`logo-container flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Optimus Solutions Logo" 
        className="h-16 md:h-20" 
        style={{ width: 'auto' }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.onerror = null;
          target.src = isArabic ? '/purplelogoArabic.png' : '/Logo.jpeg';
        }}
      />
    </div>
  );
};

export default Logo; 