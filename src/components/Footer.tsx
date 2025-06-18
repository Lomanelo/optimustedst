'use client';

import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import { useContact } from '../../app/contexts/contact-context';
import FlowingShape from './FlowingShape';
import SocialMediaLinks from './SocialMediaLinks';

const Footer: React.FC = () => {
  const { getContent, loading: cmsLoading, currentLanguage } = useCMS();
  const { contactInfo } = useContact();
  const isArabic = currentLanguage === 'ar';
  const logoSrc = isArabic ? "/whitelogoArabic.png" : "/OptimusLogoOnPurple.png";
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4 inline-block rounded">
              <img src={logoSrc} alt="Optimus Logo" className="h-14" style={{ width: 'auto' }} />
            </div>
            {/* Social Media Links */}
            <div className="mt-6">
              <SocialMediaLinks 
                variant="footer" 
                iconSize={24}
                className="justify-start"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{getContent('footer_quick_links_title')}</h3>
            <ul className="space-y-2">
              <li><a href="/programs" className="text-white/80 hover:text-accent transition-colors">{getContent('footer_link_programs')}</a></li>
              <li><a href="/about" className="text-white/80 hover:text-accent transition-colors">{getContent('footer_link_about')}</a></li>
              <li><a href="/blog" className="text-white/80 hover:text-accent transition-colors">{getContent('footer_link_blog')}</a></li>
              <li><a href="/contact" className="text-white/80 hover:text-accent transition-colors">{getContent('footer_link_contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{getContent('footer_contact_info_title')}</h3>
            <ul className="space-y-2">
              <li className="text-white/80">{contactInfo.address}</li>
              <li className="text-white/80">{contactInfo.phoneNumber}</li>
              <li className="text-white/80">{contactInfo.generalInquiriesEmail}</li>
              <li><a href="/contact" className="text-accent hover:underline">{getContent('footer_get_in_touch')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{getContent('footer_newsletter_title')}</h3>
            <p className="text-white/80 text-sm mb-4">
              {getContent('footer_newsletter_description')}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder={getContent('footer_newsletter_placeholder')}
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 text-sm focus:outline-none"
              />
              <button className="bg-accent hover:bg-accent-dark px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                {getContent('footer_newsletter_subscribe')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center no-rtl-flip">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © {currentYear} {getContent('footer_copyright')}
          </p>
          <div className="flex space-x-6 no-rtl-flip">
            <a href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">{getContent('footer_privacy_policy')}</a>
            <a href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">{getContent('footer_terms_of_service')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;