'use client';

import React, { useState, useEffect, use } from 'react';
import ClientLayout from '../../../components/ClientLayout';
import { CheckCircle, Download, Calendar, ArrowRight, Mail, BookOpen } from 'lucide-react';

interface PageProps {
  params: Promise<{
    enrollmentId: string;
  }>;
}

interface EnrollmentDetails {
  enrollmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  programTitle: string;
  totalAmount: number;
  enrollmentDate: string;
}

export default function EnrollmentSuccessPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { enrollmentId } = resolvedParams;
  
  const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demo - in production, fetch from API
  useEffect(() => {
    const mockEnrollmentDetails: EnrollmentDetails = {
      enrollmentId,
      firstName: 'Student',
      lastName: 'Name',
      email: 'student@example.com',
      programTitle: 'Sample Program',
      totalAmount: 5250,
      enrollmentDate: new Date().toISOString()
    };
    
    setEnrollmentDetails(mockEnrollmentDetails);
    setLoading(false);
  }, [enrollmentId]);

  const downloadReceipt = () => {
    // In a real app, generate and download PDF receipt
    alert('Receipt download will be implemented');
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading enrollment details...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!enrollmentDetails) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Enrollment Not Found</h1>
              <p className="text-gray-600">We could not find the enrollment details.</p>
              <a href="/programs" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
                Browse Programs
              </a>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-green-600 mb-2">Enrollment Successful!</h1>
              <p className="text-xl text-gray-600">Welcome to {enrollmentDetails.programTitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Enrollment Confirmation */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">Enrollment Confirmation</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment ID:</span>
                      <span className="font-mono font-medium">{enrollmentDetails.enrollmentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student Name:</span>
                      <span className="font-medium">{enrollmentDetails.firstName} {enrollmentDetails.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{enrollmentDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program:</span>
                      <span className="font-medium">{enrollmentDetails.programTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">{enrollmentDetails.totalAmount.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment Date:</span>
                      <span className="font-medium">{new Date(enrollmentDetails.enrollmentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* What's Next */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">What Happens Next?</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Welcome Email</h3>
                        <p className="text-gray-600 text-sm">You'll receive a welcome email within the next 24 hours with detailed course information and access instructions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Course Materials</h3>
                        <p className="text-gray-600 text-sm">Access to your course materials and learning platform will be provided via email.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Program Start</h3>
                        <p className="text-gray-600 text-sm">You'll be notified about your program start date and orientation schedule.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-3">Important Information</h3>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Please check your email (including spam folder) for important updates</li>
                    <li>• Save your enrollment ID for future reference</li>
                    <li>• Contact our support team if you have any questions</li>
                    <li>• Join our WhatsApp group for instant updates and support</li>
                  </ul>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                {/* Download Receipt */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Download Receipt</h3>
                  <p className="text-gray-600 text-sm mb-4">Get a copy of your payment receipt for your records.</p>
                  <button
                    onClick={downloadReceipt}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="/dashboard"
                      className="w-full bg-accent text-white font-medium py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors flex items-center justify-center"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </a>
                    <a
                      href="/programs"
                      className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      Browse More Programs
                    </a>
                    <a
                      href="/contact"
                      className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-3">Need Help?</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email:</strong> support@optimusksa.com</p>
                    <p><strong>Phone:</strong> +966 123 456 789</p>
                    <p><strong>WhatsApp:</strong> +966 123 456 789</p>
                    <p><strong>Hours:</strong> 9 AM - 6 PM (Sun-Thu)</p>
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