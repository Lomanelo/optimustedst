'use client';

import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import { useContact } from '../../app/contexts/contact-context';
import FlowingShape from './FlowingShape';
import SocialMediaLinks from './SocialMediaLinks';

const Footer: React.FC = () => {
  const { getContent, getFormattedContent, loading: cmsLoading, currentLanguage } = useCMS();
  const { contactInfo } = useContact();
  const isArabic = currentLanguage === 'ar';
  const logoSrc = isArabic ? "/OptimusSolutionsWhiteAR.png" : "/OptimusSolutionsWhiteEN.png";
  
  // Helper function to format phone number for RTL
  const formatPhoneNumber = (phoneNumber: string) => {
    if (isArabic) {
      // For Arabic, ensure the plus sign appears on the left
      return phoneNumber.replace(/^\+/, '') + '+';
    }
    return phoneNumber;
  };
  
  // Don't render if CMS is still loading
  if (cmsLoading) {
    return (
      <footer className="bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Skeleton loaders */}
            <div className="space-y-4">
              <div className="h-14 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-20 bg-white/20 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-20 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      <FlowingShape 
        position="top-right" 
        colors={['primary-light', 'primary']} 
        opacity={0.3} 
      />
      
      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-start">
            <div className="mb-4 inline-block rounded">
              <img 
                src={logoSrc} 
                alt="Optimus Solutions Logo" 
                className="h-16 md:h-20" 
                style={{ width: 'auto', height: isArabic ? '64px' : undefined }} 
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = isArabic ? '/OptimusSolutionsWhiteAR.png' : '/OptimusSolutionsWhiteEN.png';
                }}
              />
            </div>
            {/* Social Media Links */}
            <div className="mt-6">
              <SocialMediaLinks 
                variant="footer" 
                iconSize={24}
                className={isArabic ? "justify-start" : "justify-start"}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{getContent('footer_quick_links_title')}</h3>
            <ul className="space-y-2">
              <li><a href="/programs" className="text-white/80 hover:text-accent transition-colors">{getContent('footer_link_programs')}</a></li>
              <li><a href="/about" className="text-white/80 hover:text-accent transition-colors">{getContent('footer_link_about')}</a></li>
              <li><a href="/faculty" className="text-white/80 hover:text-accent transition-colors">{isArabic ? 'هيئة التدريس' : 'Faculty'}</a></li>
              <li><a href="/book-a-call" className="text-white/80 hover:text-accent transition-colors">{isArabic ? 'احجز مكالمة' : 'Book a Call'}</a></li>
              <li>
                <a href="/contact" className="text-white/80 hover:text-accent transition-colors">
                  {isArabic ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{getContent('footer_contact_info_title')}</h3>
            <ul className="space-y-2">
              <li className="text-white/80">{getContent('footer_address')}</li>
              <li className="text-white/80">{formatPhoneNumber(contactInfo.phoneNumber)}</li>
              <li className="text-white/80">{contactInfo.generalInquiriesEmail}</li>
            </ul>
          </div>
        </div>
        
          <div className="pt-8 border-t border-white/20 flex flex-row justify-between items-center no-rtl-flip">
          <div className="flex flex-nowrap gap-6 no-rtl-flip">
            <a href="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors whitespace-nowrap">{getContent('footer_privacy_policy')}</a>
            <a href="/terms" className="text-white/60 hover:text-white text-sm transition-colors whitespace-nowrap">{getContent('footer_terms_of_service')}</a>
          </div>
          <p className="text-white/60 text-sm">
            © {currentYear} {isArabic ? 'Optimus Solutions • جميع الحقوق محفوظة' : 'Optimus Solutions • All rights reserved'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;