'use client';

import React from 'react';
import ClientLayout from './components/ClientLayout';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <ClientLayout>
      <div className="min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
          <p className="text-lg text-gray-700 mb-8">Page not found. Try one of these links:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md">Home</Link>
            <Link href="/programs" className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md">Programs</Link>
            <Link href="/about" className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md">About</Link>
            <Link href="/contact" className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md">Contact</Link>
            <Link href="/blog" className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md">Blog</Link>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}


