import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../../app/contexts/cms-context';
import Button from './Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

// LTR wrapper component that completely isolates content from RTL influence
const LtrTextContainer: React.FC<{children: React.ReactNode; className?: string}> = ({children, className = ""}) => {
  return (
    <div 
      className={className}
      style={{
        direction: 'ltr',
        textAlign: 'left',
        unicodeBidi: 'isolate',
        display: 'block'
      }}
    >
      {children}
    </div>
  );
};

const Hero: React.FC = () => {
  const { getContent, currentLanguage } = useCMS();
  const isArabic = currentLanguage === 'ar';

  // Animations for elements
  const sloganAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  const titleAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  };
  
  const subtitleAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.4 }
  };
  
  const buttonsAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.6 }
  };

  // English version of the hero
  const EnglishHero = () => (
    <div className="hero-content max-w-2xl ml-0 mr-auto text-left" style={{direction: 'ltr'}}>
      <motion.span 
        {...sloganAnimation}
        className="text-accent text-lg font-bold tracking-widest uppercase mb-2 block"
      >
        {getContent('hero_badge')}
      </motion.span>
      
      <motion.h1 
        {...titleAnimation}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-sans"
      >
        {getContent('hero_title')}
      </motion.h1>
      
      <motion.p 
        {...subtitleAnimation}
        className="text-white/90 text-xl md:text-2xl mb-6 font-sans"
      >
        {getContent('hero_subtitle')}
      </motion.p>
      
      <motion.div 
        {...buttonsAnimation}
        className="flex flex-wrap gap-4 mt-8"
      >
        <Link href="/programs">
          <button className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
            {getContent('hero_cta_explore')}
          </button>
        </Link>
        <a href="https://optimusksa.com/register" target="_blank" rel="noopener noreferrer">
          <button className="bg-white hover:bg-gray-100 text-primary font-medium py-3 px-6 rounded-md transition-colors duration-300">
            {getContent('hero_cta_register')}
          </button>
        </a>
      </motion.div>
    </div>
  );
  
  // Arabic version of the hero (note we use the same texts, just styled differently)
  const ArabicHero = () => (
    <div className="hero-content max-w-2xl mr-0 ml-auto text-right" style={{direction: 'rtl'}}>
      <motion.span 
        {...sloganAnimation}
        className="text-accent text-lg font-bold tracking-widest uppercase mb-2 block"
      >
        {getContent('hero_badge')}
      </motion.span>
      
      <motion.h1 
        {...titleAnimation}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-sans"
      >
        {getContent('hero_title')}
      </motion.h1>
      
      <motion.p 
        {...subtitleAnimation}
        className="text-white/90 text-xl md:text-2xl mb-6 font-sans"
      >
        {getContent('hero_subtitle')}
      </motion.p>
      
      <motion.div 
        {...buttonsAnimation}
        className="flex flex-wrap gap-4 mt-8 justify-start"
      >
        <Link href="/programs">
          <button className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
            {getContent('hero_cta_explore')}
          </button>
        </Link>
        <a href="https://optimusksa.com/register" target="_blank" rel="noopener noreferrer">
          <button className="bg-white hover:bg-gray-100 text-primary font-medium py-3 px-6 rounded-md transition-colors duration-300">
            {getContent('hero_cta_register')}
          </button>
        </a>
      </motion.div>
    </div>
  );

  return (
    <section 
      id="hero" 
      className="relative min-h-[80vh] flex items-center bg-primary bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/001HQ.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/75"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        {isArabic ? <ArabicHero /> : <EnglishHero />}
      </div>
    </section>
  );
};

export default Hero;