'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

export default function SchedulePage() {
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
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="mt-2 text-gray-600">View your upcoming classes, deadlines, and events</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No scheduled events</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Your schedule will appear here once you enroll in courses and have upcoming classes or deadlines.
          </p>
          <Link
            href="/programs"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Calendar size={20} className="mr-2" />
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  );
} 