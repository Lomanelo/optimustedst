'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from '../../src/components/Footer';
import { SettingsProvider } from '../contexts/settings-context';

interface ClientLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export default function ClientLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: ClientLayoutProps) {
  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col">
        {showNavbar && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </SettingsProvider>
  );
} 