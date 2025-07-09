'use client';

import React from 'react';
import ClientLayout from '../components/ClientLayout';
import AboutUs from '../../src/components/AboutUs';
import { useCMS } from '../contexts/cms-context';

export default function AboutPage() {
  const { getContent } = useCMS();
  
  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-6 uppercase tracking-wide text-center">{getContent('about_title')}</h1>
          <AboutUs />
        </div>
      </div>
    </ClientLayout>
  );
} 