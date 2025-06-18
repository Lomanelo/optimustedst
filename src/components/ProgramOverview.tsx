import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { allPrograms } from '../data/optimus-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProgramOverview: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visiblePrograms, setVisiblePrograms] = useState<any[]>([]);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const programs = allPrograms;
  const totalPrograms = programs.length;
  const animationDuration = 100;
  const isArabic = i18n.language === 'ar';

  // Update visible programs whenever activeIndex changes
  useEffect(() => {
    const getVisiblePrograms = () => {
      const result = [];
      
      // Get program at active index and one on each side
      for (let i = -1; i <= 1; i++) {
        const index = (activeIndex + i + totalPrograms) % totalPrograms;
        result.push({
          ...programs[index],
          position: i // -1 = left, 0 = center, 1 = right
        });
      }
      
      return result;
    };

    setVisiblePrograms(getVisiblePrograms());
  }, [activeIndex, totalPrograms, programs]);

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTransitionDirection('left');
    
    // Add the next program to the right
    const nextIndex = (activeIndex + 2) % totalPrograms;
    const updatedPrograms = [...visiblePrograms];
    updatedPrograms.push({
      ...programs[nextIndex],
      position: 2 // Position 2 = entering from right
    });
    setVisiblePrograms(updatedPrograms);
    
    // Allow animation to play out before changing active index
    setTimeout(() => {
      setActiveIndex((prev) => (prev === totalPrograms - 1 ? 0 : prev + 1));
      setTransitionDirection(null);
      setIsAnimating(false);
    }, animationDuration);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTransitionDirection('right');
    
    // Add the previous program to the left
    const prevIndex = (activeIndex - 2 + totalPrograms) % totalPrograms;
    const updatedPrograms = [...visiblePrograms];
    updatedPrograms.push({
      ...programs[prevIndex],
      position: -2 // Position -2 = entering from left
    });
    setVisiblePrograms(updatedPrograms);
    
    // Allow animation to play out before changing active index
    setTimeout(() => {
      setActiveIndex((prev) => (prev === 0 ? totalPrograms - 1 : prev - 1));
      setTransitionDirection(null);
      setIsAnimating(false);
    }, animationDuration);
  };

  // Auto-scroll every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getCardStyle = (position: number) => {
    let translateX, opacity, scale, zIndex;

    if (transitionDirection === 'left') {
      // Moving left (next)
      switch (position) {
        case -1: // Left card moving off-screen
          translateX = '-180%';
          opacity = 0;
          scale = 0.75;
          zIndex = 1;
          break;
        case 0: // Center card moving to left
          translateX = '-90%';
          opacity = 0.7;
          scale = 0.85;
          zIndex = 5;
          break;
        case 1: // Right card moving to center
          translateX = '0%';
          opacity = 1;
          scale = 1;
          zIndex = 10;
          break;
        case 2: // New card entering from right
          translateX = '90%';
          opacity = 0.7;
          scale = 0.85;
          zIndex = 5;
          break;
        default:
          translateX = '0%';
          opacity = 1;
          scale = 1;
          zIndex = 10;
      }
    } else if (transitionDirection === 'right') {
      // Moving right (prev)
      switch (position) {
        case -2: // New card entering from left
          translateX = '-90%';
          opacity = 0.7;
          scale = 0.85;
          zIndex = 5;
          break;
        case -1: // Left card moving to center
          translateX = '0%';
          opacity = 1;
          scale = 1;
          zIndex = 10;
          break;
        case 0: // Center card moving to right
          translateX = '90%';
          opacity = 0.7;
          scale = 0.85;
          zIndex = 5;
          break;
        case 1: // Right card moving off-screen
          translateX = '180%';
          opacity = 0;
          scale = 0.75;
          zIndex = 1;
          break;
        default:
          translateX = '0%';
          opacity = 1;
          scale = 1;
          zIndex = 10;
      }
    } else {
      // No animation (default positions)
      switch (position) {
        case -1:
          translateX = '-90%';
          opacity = 0.7;
          scale = 0.85;
          zIndex = 5;
          break;
        case 0:
          translateX = '0%';
          opacity = 1;
          scale = 1;
          zIndex = 10;
          break;
        case 1:
          translateX = '90%';
          opacity = 0.7;
          scale = 0.85;
          zIndex = 5;
          break;
        default:
          translateX = position < 0 ? '-150%' : '150%';
          opacity = 0;
          scale = 0.75;
          zIndex = 1;
      }
    }

    return {
      opacity,
      transform: `translateX(${translateX}) scale(${scale})`,
      zIndex
    };
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4 uppercase tracking-wide">{t('programsOverview.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('programsOverview.subtitle')}
          </p>
        </div>
        
        <div className="relative">
          {/* Programs display */}
          <div className="relative h-[550px] mx-auto overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {visiblePrograms.map((program, idx) => {
                const isCenter = !transitionDirection && program.position === 0;
                const willBeCenter = 
                  (transitionDirection === 'left' && program.position === 1) || 
                  (transitionDirection === 'right' && program.position === -1);
                
                return (
                  <div 
                    key={`${program.id}-${idx}`}
                    style={getCardStyle(program.position)}
                    className="absolute w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden transition-all duration-800 ease-in-out cursor-pointer"
                    onClick={() => {
                      if (isAnimating) return;
                      if (program.position === -1) handlePrev();
                      if (program.position === 1) handleNext();
                    }}
                  >
                    <div className="h-48 bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {program.icon === 'shield-check' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                        {program.icon === 'academic-cap' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />}
                        {program.icon === 'briefcase' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                      </svg>
                    </div>
                    <div className="p-6 rtl-component">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          {t('programsOverview.type')}: {program.type}
                        </span>
                        {program.level && (
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                            {t('programsOverview.level')}: {program.level}
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {t('programsOverview.duration')}: {program.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-primary-dark mb-2">
                        {isArabic && program.titleAr ? program.titleAr : program.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {isArabic && program.descriptionAr ? program.descriptionAr : program.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">
                          <span className="block">{t('programsOverview.tuitionFees')}</span>
                          <span className="text-accent font-bold">{program.price} SAR</span>
                        </div>
                        <Link to={`/programs/${program.id}`} className="text-white bg-primary px-3 py-1.5 rounded text-sm font-medium hover:bg-primary-dark transition-colors">
                          {t('programsOverview.learnMore')}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={handlePrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg z-20 focus:outline-none"
            aria-label="Previous program"
          >
            <ChevronLeft className="text-primary" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg z-20 focus:outline-none"
            aria-label="Next program"
          >
            <ChevronRight className="text-primary" />
          </button>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/programs">
            <button className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-8 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              {t('programsOverview.viewAllPrograms')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramOverview; 