'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
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

  if (cmsLoading || contactLoading) {
    return (
      <button className={`fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg opacity-50 ${className}`}>
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors z-50 ${className}`}
      title={getContent('whatsapp_button_text')}
    >
      <MessageCircle size={24} />
      <span className="sr-only">{getContent('whatsapp_button_text')}</span>
    </button>
  );
};

export default WhatsAppButton; 