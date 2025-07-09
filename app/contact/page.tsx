'use client';

import React from 'react';
import ClientLayout from '../components/ClientLayout';
import ContactForm from '../../src/components/ContactForm';
import ErrorBoundary from '../../src/components/ErrorBoundary';
import { useContact } from '../contexts/contact-context';
import { useCMS } from '../contexts/cms-context';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  const { contactInfo } = useContact();
  const { getContent, currentLanguage } = useCMS();

  // Helper function to get text alignment classes based on language
  const getTextAlignClass = () => {
    return currentLanguage === 'ar' ? 'text-right' : 'text-left';
  };

  // Helper function to format phone number for RTL
  const formatPhoneNumber = (phoneNumber: string) => {
    if (currentLanguage === 'ar') {
      // For Arabic, ensure the plus sign appears on the left
      return phoneNumber.replace(/^\+/, '') + '+';
    }
    return phoneNumber;
  };

  // Debug logging to catch potential issues
  React.useEffect(() => {
    console.log('Contact Info:', contactInfo);
  }, [contactInfo]);

  return (
    <ClientLayout>
      <ErrorBoundary>
        <div className="pt-20 pb-16 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary mb-4 uppercase tracking-wide text-center">
                {getContent('contact_title') || 'Contact Us'}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className={`text-2xl font-bold text-primary mb-6 ${getTextAlignClass()}`}>
                    {getContent('contact_get_in_touch') || 'Get in Touch'}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className={`${currentLanguage === 'ar' ? 'order-2' : 'order-2'}`}>
                        <p className={`font-medium ${getTextAlignClass()}`}>{getContent('contact_address_label') || 'Address'}</p>
                        <p className={`text-gray-600 ${getTextAlignClass()}`}>{getContent('footer_address')}</p>
                      </div>
                      <MapPin className={`text-accent shrink-0 mt-1 ${currentLanguage === 'ar' ? 'order-1 mr-4' : 'order-1 mr-4'}`} size={20} />
                    </div>
                    
                    <div className="flex items-start">
                      <div className={`${currentLanguage === 'ar' ? 'order-2' : 'order-2'}`}>
                        <p className={`font-medium ${getTextAlignClass()}`}>{getContent('contact_phone_label') || 'Phone'}</p>
                        <p className={`text-gray-600 ${getTextAlignClass()}`}>{formatPhoneNumber(contactInfo.phoneNumber)}</p>
                      </div>
                      <Phone className={`text-accent shrink-0 mt-1 ${currentLanguage === 'ar' ? 'order-1 mr-4' : 'order-1 mr-4'}`} size={20} />
                    </div>
                    
                    <div className="flex items-start">
                      <div className={`${currentLanguage === 'ar' ? 'order-2' : 'order-2'}`}>
                        <p className={`font-medium ${getTextAlignClass()}`}>{getContent('contact_email_label') || 'Email'}</p>
                        <p className={`text-gray-600 ${getTextAlignClass()}`}>{contactInfo.generalInquiriesEmail}</p>
                      </div>
                      <Mail className={`text-accent shrink-0 mt-1 ${currentLanguage === 'ar' ? 'order-1 mr-4' : 'order-1 mr-4'}`} size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ClientLayout>
  );
} 