'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth-context';
import { useCMS } from '../contexts/cms-context';
import RegistrationModal from './RegistrationModal';

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
  const { currentUser } = useAuth();
  const { getContent, getFormattedContent, currentLanguage } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="hero-content max-w-2xl">
          <span className="text-accent text-lg font-bold tracking-widest uppercase mb-2 block">
            {getContent('hero_badge')}
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-sans">
            {getContent('hero_title')}
          </h1>
          
          <p className="text-white/90 text-xl md:text-2xl mb-6 font-sans">
            {getFormattedContent('hero_subtitle')}
          </p>
          
          <div className="flex gap-4 mt-8">
            {currentLanguage === 'ar' ? (
              <>
                {/* Only show register button for non-logged-in users */}
                {!currentUser && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white hover:bg-gray-100 text-primary font-medium py-3 px-6 rounded-md transition-colors duration-300"
                  >
                    {getContent('hero_cta_register')}
                  </button>
                )}
                <Link href="/programs">
                  <button className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
                    {getContent('hero_cta_explore')}
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/programs">
                  <button className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
                    {getContent('hero_cta_explore')}
                  </button>
                </Link>
                {/* Only show register button for non-logged-in users */}
                {!currentUser && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white hover:bg-gray-100 text-primary font-medium py-3 px-6 rounded-md transition-colors duration-300"
                  >
                    {getContent('hero_cta_register')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Hero; 