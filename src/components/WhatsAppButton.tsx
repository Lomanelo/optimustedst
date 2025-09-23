'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useCMS } from '../../app/contexts/cms-context';
import { useContact } from '../../app/contexts/contact-context';

interface WhatsAppButtonProps {
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ className = '' }) => {
  const { getContent, loading: cmsLoading } = useCMS();
  const { getWhatsAppUrl, loading: contactLoading } = useContact();

  const handleWhatsAppClick = () => {
    const whatsappUrl = getWhatsAppUrl('Hello! I would like to know more about your programs.');
    window.open(whatsappUrl, '_blank');
  };

  const baseClasses = `fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-[#25D366]/40 flex items-center justify-center transition-all z-50 ${className}`;
  const brandClasses = 'bg-[#25D366] hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 active:scale-95';
  const icon = <FaWhatsapp size={28} className="text-white" />;

  if (cmsLoading || contactLoading) {
    return (
      <button className={`${baseClasses} ${brandClasses} opacity-60`} aria-label="WhatsApp" title="WhatsApp">
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`${baseClasses} ${brandClasses}`}
      aria-label={getContent('whatsapp_button_text')}
      title={getContent('whatsapp_button_text')}
    >
      {icon}
      <span className="sr-only">{getContent('whatsapp_button_text')}</span>
    </button>
  );
};

export default WhatsAppButton; 