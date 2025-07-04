'use client';

import React from 'react';
import ClientLayout from '../components/ClientLayout';
import ContactForm from '../../src/components/ContactForm';
import ErrorBoundary from '../../src/components/ErrorBoundary';
import { useContact } from '../contexts/contact-context';
import { useCMS } from '../contexts/cms-context';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const { contactInfo } = useContact();
  const { getContent, currentLanguage } = useCMS();

  // Helper function to get text alignment classes based on language
  const getTextAlignClass = () => {
    return currentLanguage === 'ar' ? 'text-right' : 'text-left';
  };

  // Debug logging to catch potential issues
  React.useEffect(() => {
    console.log('Contact Info:', contactInfo);
    console.log('Operating Hours:', contactInfo.operatingHours);
  }, [contactInfo]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const daysOfWeek = [
    { key: 'monday', label: getContent('contact_monday') || 'Monday' },
    { key: 'tuesday', label: getContent('contact_tuesday') || 'Tuesday' },
    { key: 'wednesday', label: getContent('contact_wednesday') || 'Wednesday' },
    { key: 'thursday', label: getContent('contact_thursday') || 'Thursday' },
    { key: 'friday', label: getContent('contact_friday') || 'Friday' },
    { key: 'saturday', label: getContent('contact_saturday') || 'Saturday' },
    { key: 'sunday', label: getContent('contact_sunday') || 'Sunday' }
  ] as const;

  return (
    <ClientLayout>
      <ErrorBoundary>
      <div className="pt-20 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4 uppercase tracking-wide text-center">
              {getContent('contact_title') || 'Contact Us'}
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-center">
              {getContent('contact_subtitle') || 'Get in touch with us to learn more about our programs or to schedule a consultation.'}
            </p>
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
                  <div className={`flex items-start ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <MapPin className={`text-accent shrink-0 mt-1 ${currentLanguage === 'ar' ? 'ml-4' : 'mr-4'}`} size={20} />
                    <div>
                      <p className={`font-medium ${getTextAlignClass()}`}>{getContent('contact_address_label') || 'Address'}</p>
                      <p className={`text-gray-600 ${getTextAlignClass()}`}>{getContent('footer_address')}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-start ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Phone className={`text-accent shrink-0 mt-1 ${currentLanguage === 'ar' ? 'ml-4' : 'mr-4'}`} size={20} />
                    <div>
                      <p className={`font-medium ${getTextAlignClass()}`}>{getContent('contact_phone_label') || 'Phone'}</p>
                      <p className={`text-gray-600 ${getTextAlignClass()}`}>{contactInfo.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-start ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Mail className={`text-accent shrink-0 mt-1 ${currentLanguage === 'ar' ? 'ml-4' : 'mr-4'}`} size={20} />
                    <div>
                      <p className={`font-medium ${getTextAlignClass()}`}>{getContent('contact_email_label') || 'Email'}</p>
                      <p className={`text-gray-600 ${getTextAlignClass()}`}>{contactInfo.generalInquiriesEmail}</p>
                    </div>
                  </div>

                  {/* Additional Contact Emails */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className={`font-medium text-gray-900 mb-3 ${getTextAlignClass()}`}>
                      {getContent('contact_specific_inquiries') || 'Specific Inquiries'}
                    </h3>
                    <div className={`space-y-2 text-sm ${getTextAlignClass()}`}>
                      <div className={`${currentLanguage === 'ar' ? 'flex justify-between' : ''}`}>
                        {currentLanguage === 'ar' ? (
                          <>
                            <span className="text-gray-600">{contactInfo.admissionsEmail}</span>
                            <span className="font-medium text-gray-700">
                              :{getContent('contact_admissions_label') || 'Admissions'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-gray-700">
                              {getContent('contact_admissions_label') || 'Admissions'}:
                            </span>
                            <span className="ml-2 text-gray-600">{contactInfo.admissionsEmail}</span>
                          </>
                        )}
                      </div>
                      <div className={`${currentLanguage === 'ar' ? 'flex justify-between' : ''}`}>
                        {currentLanguage === 'ar' ? (
                          <>
                            <span className="text-gray-600">{contactInfo.supportEmail}</span>
                            <span className="font-medium text-gray-700">
                              :{getContent('contact_support_label') || 'Support'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-gray-700">
                              {getContent('contact_support_label') || 'Support'}:
                            </span>
                            <span className="ml-2 text-gray-600">{contactInfo.supportEmail}</span>
                          </>
                        )}
                      </div>
                      <div className={`${currentLanguage === 'ar' ? 'flex justify-between' : ''}`}>
                        {currentLanguage === 'ar' ? (
                          <>
                            <span className="text-gray-600">{contactInfo.marketingEmail}</span>
                            <span className="font-medium text-gray-700">
                              :{getContent('contact_marketing_label') || 'Marketing'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-gray-700">
                              {getContent('contact_marketing_label') || 'Marketing'}:
                            </span>
                            <span className="ml-2 text-gray-600">{contactInfo.marketingEmail}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className={`text-xl font-bold text-primary mb-4 flex items-center ${getTextAlignClass()}`}>
                  <Clock className="mr-2" size={20} />
                  {getContent('contact_operating_hours') || 'Operating Hours'}
                </h3>
                <div className={`space-y-2 text-sm ${getTextAlignClass()}`}>
                    {daysOfWeek.map(({ key, label }) => {
                      const dayHours = contactInfo.operatingHours?.[key];
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{label}:</span>
                          <span className="text-gray-600">
                            {dayHours?.isOpen 
                              ? `${formatTime(dayHours.openTime)} - ${formatTime(dayHours.closeTime)}`
                              : getContent('contact_closed') || 'Closed'
                            }
                          </span>
                  </div>
                      );
                    })}
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