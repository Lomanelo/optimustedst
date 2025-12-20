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
  
  // Select the appropriate logo for light backgrounds (purple label)
  // Note: Arabic purple logo filename in `public/` is currently `OptimusSolutionsPupleAR.png` (legacy typo).
  let logoSrc = isArabic ? '/OptimusSolutionsPupleAR.png' : '/OptimusSolutionsPurpleEN.png';
  
  return (
    <div className={`logo-container flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Optimus Solutions Logo" 
        className="h-16 md:h-20" 
        style={{ width: 'auto', height: isArabic ? '60px' : undefined }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.onerror = null;
          // Try common fallbacks in case filenames differ between environments
          target.src = isArabic ? '/OptimusSolutionsPupleAR.png' : '/OptimusSolutionsPurpleEN.png';
        }}
      />
    </div>
  );
};

export default Logo; 