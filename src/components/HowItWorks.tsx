'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../../app/contexts/cms-context';

interface Step {
  number: number;
  titleKey: string;
  descriptionKey: string;
}

const HowItWorks: React.FC = () => {
  const { getContent, loading: cmsLoading } = useCMS();
  
  const steps: Step[] = [
    {
      number: 1,
      titleKey: "how_it_works_step1_title",
      descriptionKey: "how_it_works_step1_desc"
    },
    {
      number: 2,
      titleKey: "how_it_works_step2_title",
      descriptionKey: "how_it_works_step2_desc"
    },
    {
      number: 3,
      titleKey: "how_it_works_step3_title",
      descriptionKey: "how_it_works_step3_desc"
    },
    {
      number: 4,
      titleKey: "how_it_works_step4_title",
      descriptionKey: "how_it_works_step4_desc"
    }
  ];

  // Don't render if CMS is still loading
  if (cmsLoading) {
    return (
      <section id="process" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="process" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2B1F4F] mb-4">{getContent('how_it_works_title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getContent('how_it_works_subtitle')}
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Connection line */}
          <motion.div 
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
            className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gray-200 z-0"
          ></motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.3 * index + 0.2,
                      type: "spring",
                      stiffness: 200 
                    }}
                    className="bg-[#2B1F4F] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#2B1F4F] mb-2 text-center">{getContent(step.titleKey)}</h3>
                  <p className="text-gray-600 text-center">{getContent(step.descriptionKey)}</p>
                </div>
                
                {/* Arrow for mobile view */}
                {index < steps.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 * index + 0.5 }}
                    className="flex justify-center md:hidden mt-6 mb-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#2B1F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;