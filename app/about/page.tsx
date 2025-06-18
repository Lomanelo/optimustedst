'use client';

import React from 'react';
import ClientLayout from '../components/ClientLayout';
import AboutUs from '../../src/components/AboutUs';

export default function AboutPage() {
  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-primary mb-6 uppercase tracking-wide">About Us</h1>
          <p className="text-gray-600 max-w-3xl mb-10">
            Learn more about Optimus Education and our mission to shape tomorrow's leaders.
          </p>
          <AboutUs />
        </div>
      </div>
    </ClientLayout>
  );
} 