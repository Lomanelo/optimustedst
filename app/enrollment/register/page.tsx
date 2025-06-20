'use client';

import React, { useState, useEffect, Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import ClientLayout from '../../components/ClientLayout';
import programService, { Program } from '../../../src/services/programService';
import { User, Calendar, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';

interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female' | '';
  email: string;
  phone: string;
  countryCode: string;
}

// Loading component
function RegisterLoading() {
  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enrollment form...</p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

// Component that uses useSearchParams
function RegisterContent() {
  const searchParams = useSearchParams();
  const programId = searchParams.get('programId');
  const price = searchParams.get('price');
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EnrollmentFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    email: '',
    phone: '',
    countryCode: '+966'
  });
  const [errors, setErrors] = useState<Partial<EnrollmentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!programId) {
        setLoading(false);
        return;
      }

      try {
        const programData = await programService.getProgramById(programId);
        setProgram(programData);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof EnrollmentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<EnrollmentFormData> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    } else {
      // Check if user is at least 16 years old
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      
      if (actualAge < 16) {
        newErrors.dateOfBirth = 'You must be at least 16 years old to enroll';
        isValid = false;
      }
    }

    if (!formData.sex) {
      newErrors.sex = 'Please select your gender';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<EnrollmentFormData> = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (formData.phone.length < 9) {
      newErrors.phone = 'Phone number must be at least 9 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create enrollment record
      const enrollmentData = {
        ...formData,
        programId,
        programTitle: program?.title,
        price: parseFloat(price || '0'),
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/enrollment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });

      if (response.ok) {
        const { enrollmentId } = await response.json();
        
        // Redirect to payment page
        window.location.href = `/enrollment/payment?enrollmentId=${enrollmentId}`;
      } else {
        throw new Error('Failed to create enrollment');
      }
    } catch (error) {
      console.error('Error creating enrollment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading enrollment form...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!programId || !program) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Program Not Found</h1>
              <p className="text-gray-600">The program you're trying to enroll in could not be found.</p>
              <a href="/programs" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
                Browse Programs
              </a>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const totalPrice = parseFloat(price || '0');
  const vatAmount = totalPrice * 0.05;
  const finalPrice = totalPrice + vatAmount;

  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Enroll in Program</h1>
              <p className="text-gray-600">{program.title}</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className="w-16 h-1 bg-gray-200 mx-2">
                  <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-primary w-full' : 'bg-primary w-0'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className="w-16 h-1 bg-gray-200 mx-2">
                  <div className={`h-full transition-all duration-300 ${step >= 3 ? 'bg-primary w-full' : 'bg-primary w-0'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <User className="mr-2" />
                    Personal Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-gray-700 font-medium mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    <div>
                      <label htmlFor="sex" className="block text-gray-700 font-medium mb-2">
                        Gender *
                      </label>
                      <select
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.sex ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary bg-white`}
                      >
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <Calendar className="mr-2" />
                    Contact Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number *
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                          <option value="+966">🇸🇦 +966</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+973">🇧🇭 +973</option>
                          <option value="+965">🇰🇼 +965</option>
                          <option value="+974">🇶🇦 +974</option>
                          <option value="+968">🇴🇲 +968</option>
                        </select>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              handleInputChange({
                                target: { name: 'phone', value }
                              } as React.ChangeEvent<HTMLInputElement>);
                            }
                          }}
                          className={`flex-1 px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="5xxxxxxxx"
                          maxLength={10}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Program Fee:</span>
                        <span>{totalPrice.toLocaleString()} SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (5%):</span>
                        <span>{vatAmount.toLocaleString()} SAR</span>
                      </div>
                      <div className="border-t pt-2 font-bold flex justify-between">
                        <span>Total:</span>
                        <span>{finalPrice.toLocaleString()} SAR</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${step === 1 ? 'ml-auto' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : step === 2 ? (
                    <>
                      Proceed to Payment
                      <CreditCard className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

// Main page component with Suspense boundary
export default function EnrollmentRegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterContent />
    </Suspense>
  );
} 