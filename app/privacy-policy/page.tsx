'use client';

import React from 'react';
import ClientLayout from '../components/ClientLayout';

export default function PrivacyPolicyPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">This page describes how we handle your personal data in accordance with applicable laws in the Kingdom of Saudi Arabia.</p>
        <p className="text-gray-700">If you have any questions, please contact us at info@optimusksa.com.</p>
      </div>
    </ClientLayout>
  );
}


