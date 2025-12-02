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
  let logoSrc = isArabic ? '/OptimusSolutionsPupleAR.png?v=1' : '/OptimusSolutionsPurpleEN.png?v=1';
  
  return (
    <div className={`logo-container flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Optimus Solutions Logo" 
        className="h-16 md:h-20" 
        style={{ width: 'auto', height: '60px', maxWidth: '260px' }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.onerror = null;
          target.src = isArabic ? '/OptimusSolutionsPupleAR.png?v=1' : '/OptimusSolutionsPurpleEN.png?v=1';
        }}
      />
    </div>
  );
};

export default Logo; 