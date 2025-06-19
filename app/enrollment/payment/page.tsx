'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientLayout from '../../components/ClientLayout';
import { CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

declare global {
  interface Window {
    Moyasar: any;
  }
}

interface EnrollmentDetails {
  enrollmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  programTitle: string;
  basePrice: number;
  vatAmount: number;
  totalAmount: number;
}

export default function EnrollmentPaymentPage() {
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get('enrollmentId');
  
  const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demo - in production, fetch from API
  useEffect(() => {
    const mockEnrollmentDetails: EnrollmentDetails = {
      enrollmentId: enrollmentId || '',
      firstName: 'Student',
      lastName: 'Name',
      email: 'student@example.com',
      programTitle: 'Sample Program',
      basePrice: 5000,
      vatAmount: 250,
      totalAmount: 5250
    };
    
    setEnrollmentDetails(mockEnrollmentDetails);
    setLoading(false);
  }, [enrollmentId]);

  useEffect(() => {
    // Load Moyasar script
    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!enrollmentDetails || !window.Moyasar) {
      alert('Payment system not ready. Please refresh the page.');
      return;
    }

    setPaymentLoading(true);

    try {
      window.Moyasar.init({
        element: '.mysr-form',
        amount: Math.round(enrollmentDetails.totalAmount * 100), // Amount in halalas (smallest unit)
        currency: 'SAR',
        description: `Enrollment for ${enrollmentDetails.programTitle}`,
        publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || 'pk_test_TGfufts7RggFUxzgFrkJ2TeWTsY6ciY5VuywCjtf',
        callback_url: `${window.location.origin}/enrollment/success/${enrollmentId}`,
        methods: ['creditcard', 'stcpay', 'applepay'],
        metadata: {
          enrollmentId: enrollmentDetails.enrollmentId,
          studentName: `${enrollmentDetails.firstName} ${enrollmentDetails.lastName}`,
          studentEmail: enrollmentDetails.email,
          programTitle: enrollmentDetails.programTitle
        },
        on_completed: function(payment: any) {
          // Payment completed successfully
          console.log('Payment completed:', payment);
          
          // Update enrollment status
          fetch('/api/enrollment/update-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              enrollmentId: enrollmentDetails.enrollmentId,
              status: 'paid',
              paymentId: payment.id,
              paymentDetails: payment
            }),
          }).then(() => {
            window.location.href = `/enrollment/success/${enrollmentId}`;
          });
        },
        on_failed: function(payment: any) {
          // Payment failed
          console.error('Payment failed:', payment);
          alert('Payment failed. Please try again.');
          setPaymentLoading(false);
        }
      });
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('Failed to initialize payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payment details...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!enrollmentId || !enrollmentDetails) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Enrollment</h1>
              <p className="text-gray-600">The enrollment details could not be found.</p>
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
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Enrollment</h1>
              <p className="text-gray-600">Secure payment powered by Moyasar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <CreditCard className="mr-2" />
                    Payment Information
                  </h2>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-green-800 font-medium">Secure Payment</p>
                        <p className="text-green-600 text-sm">Your payment is secured by Moyasar, regulated by the Saudi Central Bank</p>
                      </div>
                    </div>
                  </div>

                  {/* Moyasar Payment Form */}
                  <div className="mysr-form"></div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="w-full bg-accent text-white font-bold py-4 px-6 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {paymentLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ${enrollmentDetails.totalAmount.toLocaleString()} SAR`
                    )}
                  </button>

                  {/* Supported Payment Methods */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 text-center mb-4">Supported Payment Methods:</p>
                    <div className="flex justify-center items-center space-x-4">
                      <img src="/visa-logo.png" alt="Visa" className="h-8" />
                      <img src="/mastercard-logo.png" alt="Mastercard" className="h-8" />
                      <img src="/mada-logo.png" alt="Mada" className="h-8" />
                      <img src="/apple-pay-logo.png" alt="Apple Pay" className="h-8" />
                      <img src="/stc-pay-logo.png" alt="STC Pay" className="h-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-primary mb-6">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800">{enrollmentDetails.programTitle}</h4>
                      <p className="text-sm text-gray-600">Student: {enrollmentDetails.firstName} {enrollmentDetails.lastName}</p>
                      <p className="text-sm text-gray-600">Email: {enrollmentDetails.email}</p>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Program Fee:</span>
                        <span>{enrollmentDetails.basePrice.toLocaleString()} SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT (5%):</span>
                        <span>{enrollmentDetails.vatAmount.toLocaleString()} SAR</span>
                      </div>
                      <div className="border-t pt-2 font-bold flex justify-between">
                        <span>Total Amount:</span>
                        <span className="text-accent">{enrollmentDetails.totalAmount.toLocaleString()} SAR</span>
                      </div>
                    </div>
                  </div>

                  {/* What's Next */}
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-medium text-gray-800 mb-3">What happens next?</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Instant enrollment confirmation</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Welcome email with course details</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Access to student dashboard</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Course materials and schedule</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => window.history.back()}
                  className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 