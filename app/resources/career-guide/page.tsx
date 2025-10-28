'use client';

import React from 'react';
import ClientLayout from '../../components/ClientLayout';

export default function CareerGuidePage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6">Career Advancement Guide</h1>
        <p className="text-gray-700 mb-4">Download our free guide to help you choose the right program for your career goals.</p>
        <a href="/public/OptimizedImage.png" className="text-accent underline">Download (PDF coming soon)</a>
      </div>
    </ClientLayout>
  );
}


