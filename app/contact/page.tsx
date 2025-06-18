'use client';

import React from 'react';
import ClientLayout from '../components/ClientLayout';
import ContactForm from '../../src/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <ClientLayout>
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
                      <p className="text-gray-600">Optimus Education Center, Business Bay, Dubai, UAE</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-accent shrink-0 mr-4 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+971 569852211</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-accent shrink-0 mr-4 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">optimusksa@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary rounded-lg shadow-md p-6 text-white">
                <div className="flex items-start mb-4">
                  <Clock className="text-accent shrink-0 mr-4 mt-1" size={20} />
                  <h2 className="text-xl font-bold text-white">Operating Hours</h2>
                </div>
                
                <div className="space-y-2 ml-8">
                  <p>Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="mt-4 text-white/80">Closed on Fridays and public holidays</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 h-64">
                {/* Map placeholder - would be replaced with actual map component */}
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-accent" size={32} />
                    <p className="font-medium">Google Maps Integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 