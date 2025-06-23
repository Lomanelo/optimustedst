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
  const { getContent } = useCMS();

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
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ] as const;

  return (
    <ClientLayout>
      <ErrorBoundary>
      <div className="pt-20 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4 uppercase tracking-wide">Contact Us</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Get in touch with us to learn more about our programs or to schedule a consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-primary mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-accent shrink-0 mr-4 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Address</p>
                        <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-accent shrink-0 mr-4 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{contactInfo.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-accent shrink-0 mr-4 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{contactInfo.generalInquiriesEmail}</p>
                    </div>
                  </div>

                  {/* Additional Contact Emails */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Specific Inquiries</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Admissions:</span>
                        <span className="ml-2 text-gray-600">{contactInfo.admissionsEmail}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Support:</span>
                        <span className="ml-2 text-gray-600">{contactInfo.supportEmail}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Marketing:</span>
                        <span className="ml-2 text-gray-600">{contactInfo.marketingEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  Operating Hours
                </h3>
                <div className="space-y-2 text-sm">
                    {daysOfWeek.map(({ key, label }) => {
                      const dayHours = contactInfo.operatingHours?.[key];
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{label}:</span>
                          <span className="text-gray-600">
                            {dayHours?.isOpen 
                              ? `${formatTime(dayHours.openTime)} - ${formatTime(dayHours.closeTime)}`
                              : 'Closed'
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