'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Communicate with instructors and fellow students</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No messages yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Your messages with instructors and classmates will appear here once you start communicating.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Send size={20} className="mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
} 