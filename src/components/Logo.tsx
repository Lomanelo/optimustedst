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
  
  // Select the appropriate logo based on language and variant
  let logoSrc = '/Logo.jpeg';
  
  if (isArabic) {
    logoSrc = variant === 'white' ? "/whitelogoArabic.png" : "/purplelogoArabic.png";
  } else {
    logoSrc = variant === 'white' ? "/OptimusLogoOnPurple.png" : "/Logo.jpeg";
  }
  
  return (
    <div className={`logo-container flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="OPTIMUS Logo" 
        className="h-12 md:h-14" 
        style={{ width: 'auto' }}
      />
    </div>
  );
};

export default Logo; 