'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCMS } from '../../contexts/cms-context';

// Form type definition
interface FormData {
  name: string;
  phone: string;
  jobTitle: string;
  yearsOfExperience: string;
  desiredProgram: string;
}

const ShortLandingPage = () => {
  const { getContent } = useCMS();
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    jobTitle: '',
    yearsOfExperience: '',
    desiredProgram: 'mba',
  });
  
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formData.yearsOfExperience.trim()) errors.yearsOfExperience = 'Years of experience is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Here you would send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        jobTitle: '',
        yearsOfExperience: '',
        desiredProgram: 'mba',
      });
      
      // Redirect to thank you page or show success message
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero section with compelling headline */}
      <section className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Transform Your Career with an Internationally Recognized Degree
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Join thousands of successful professionals who have advanced their careers with Optimus Education
            </p>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left column: Program highlights */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Elite Programs for Future Leaders</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">MBA Programs</h3>
                  <p className="text-gray-600">Flexible, internationally accredited programs designed for working professionals.</p>
                  <Link href="/programs" className="text-accent font-medium inline-block mt-2">Learn more →</Link>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">DBA Programs</h3>
                  <p className="text-gray-600">Advanced research-oriented doctorate for executives and strategic leaders.</p>
                  <Link href="/programs" className="text-accent font-medium inline-block mt-2">Learn more →</Link>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">Professional Certificates</h3>
                  <p className="text-gray-600">Targeted skills development for specific career advancement needs.</p>
                  <Link href="/programs" className="text-accent font-medium inline-block mt-2">Learn more →</Link>
                </div>
              </div>
              
              {/* Lead magnet */}
              <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/30">
                <h3 className="text-xl font-bold text-accent mb-3">Free Career Advancement Guide</h3>
                <p className="text-gray-700 mb-4">Download our comprehensive guide to choosing the right program for your career goals.</p>
                <Link 
                  href="/resources/career-guide" 
                  className="inline-block bg-accent text-white font-medium py-2 px-4 rounded hover:bg-accent-dark transition-colors"
                >
                  Download Free Guide
                </Link>
              </div>
            </div>
            
            {/* Right column: Form */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-primary mb-6">Request Program Information</h2>
              
              {submitSuccess ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-md mb-4">
                  <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                  <p>Your request has been submitted successfully. Our admissions team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your phone number"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your job title"
                      />
                      {formErrors.jobTitle && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.jobTitle}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                      <input
                        type="text"
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${formErrors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="How many years of experience do you have?"
                      />
                      {formErrors.yearsOfExperience && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.yearsOfExperience}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="desiredProgram" className="block text-sm font-medium text-gray-700 mb-1">Desired Program *</label>
                      <select
                        id="desiredProgram"
                        name="desiredProgram"
                        value={formData.desiredProgram}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="mba">MBA Programs</option>
                        <option value="dba">DBA Programs</option>
                        <option value="certificate">Professional Certificate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-400"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Information'}
                    </button>
                  </div>
                </form>
              )}
              
              <p className="text-xs text-gray-500 mt-4">
                By submitting this form, you agree to our <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> and consent to be contacted regarding our educational programs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="bg-primary-dark text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="mb-6 max-w-2xl mx-auto">Our admissions team is ready to help you choose the right program for your career goals.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact" className="bg-white text-primary font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
            <Link href="/programs" className="bg-accent text-white font-bold py-2 px-6 rounded-md hover:bg-accent-dark transition-colors">
              Browse Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShortLandingPage; 