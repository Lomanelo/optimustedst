'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/auth-context';
import { CMSProvider } from './contexts/cms-context';
import { ContactProvider } from './contexts/contact-context';
import WhatsAppButton from '../src/components/WhatsAppButton';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CMSProvider>
        <ContactProvider>
          {children}
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
          {/* Global WhatsApp floating button */}
          <WhatsAppButton />
        </ContactProvider>
      </CMSProvider>
    </AuthProvider>
  );
} 