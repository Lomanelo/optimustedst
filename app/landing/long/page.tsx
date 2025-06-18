'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Users, Award, Clock, BookOpen, ChevronRight } from 'lucide-react';

// Form type definition
interface FormData {
  name: string;
  phone: string;
  jobTitle: string;
  yearsOfExperience: string;
  desiredProgram: string;
}

const LongLandingPage = () => {
  const { t } = useTranslation();
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
  
  // Form handlers
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
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with compelling headline */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Elevate Your Career to New Heights
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8">
                  Join the elite network of professionals with internationally recognized degrees from Optimus Education
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-accent" />
                    <span className="text-lg">Internationally Accredited Programs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-accent" />
                    <span className="text-lg">Flexible Learning Options</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-accent" />
                    <span className="text-lg">Expert Faculty & Industry Leaders</span>
                  </div>
                </div>
                <div className="mt-10">
                  <a 
                    href="#programs" 
                    className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg inline-flex items-center"
                  >
                    Explore Programs
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="relative h-96 hidden md:block">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                  <img 
                    src="/images/hero-image.jpg" 
                    alt="Students graduating"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Ready to Transform Your Career?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Complete the form and our admissions team will contact you with personalized program recommendations based on your goals and experience.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Expert Career Advisors</h3>
                      <p className="text-gray-600">Get personalized guidance from our experienced advisors who understand your industry.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Flexible Scheduling</h3>
                      <p className="text-gray-600">Programs designed to fit the busy lives of working professionals.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Global Recognition</h3>
                      <p className="text-gray-600">Degrees and certificates respected by employers worldwide.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-primary mb-6">Request Information</h3>
                
                {submitSuccess ? (
                  <div className="p-6 bg-green-50 rounded-lg border border-green-100 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-green-800 mb-2">Thank You!</h4>
                    <p className="text-green-700">
                      Your request has been submitted successfully. Our admissions team will contact you shortly to discuss program options.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full p-3 border rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full p-3 border rounded-lg ${formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full p-3 border rounded-lg ${formErrors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
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
                        className="w-full p-3 border border-gray-300 rounded-lg"
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
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Information'}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      By submitting this form, you agree to our <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> and consent to be contacted regarding our educational programs.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lead Magnet Section */}
      <section className="py-16 bg-accent/5 border-y border-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Download Our Free Career Advancement Guide
                </h2>
                <p className="text-gray-600 mb-6">
                  Get expert insights on choosing the right program for your career goals. Our comprehensive guide includes:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>How to select the right degree for your career path</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Salary potential across different programs and specializations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tips from successful alumni on maximizing your education investment</span>
                  </li>
                </ul>
                <Link 
                  href="/resources/career-guide" 
                  className="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Download Free Guide
                </Link>
              </div>
              <div className="hidden md:block relative bg-gray-200">
                {/* Placeholder for guide image */}
                <div className="absolute inset-0">
                  <img 
                    src="/images/guide-image.jpg" 
                    alt="Career advancement guide" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section id="programs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Elite Programs</h2>
            <p className="text-lg text-gray-600">
              Discover comprehensive, internationally recognized programs designed to accelerate your career and develop your leadership potential.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="mb-6"><BookOpen className="h-10 w-10 text-primary" /></div>
                <h3 className="text-2xl font-bold text-primary-dark mb-4">MBA Programs</h3>
                <p className="text-gray-600 mb-6">Accelerate your career with our flexible, internationally accredited MBA programs designed for working professionals.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Flexible scheduling options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>International accreditation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Expert faculty with industry experience</span>
                  </li>
                </ul>
                
                <Link 
                  href="/programs#mba"
                  className="inline-flex items-center font-medium text-accent hover:text-accent-dark"
                >
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="mb-6"><Award className="h-10 w-10 text-primary" /></div>
                <h3 className="text-2xl font-bold text-primary-dark mb-4">DBA Programs</h3>
                <p className="text-gray-600 mb-6">Advance to the pinnacle of business education with our Doctorate of Business Administration program.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Research-focused curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>One-on-one mentorship</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Global business perspective</span>
                  </li>
                </ul>
                
                <Link 
                  href="/programs#dba"
                  className="inline-flex items-center font-medium text-accent hover:text-accent-dark"
                >
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="mb-6"><Award className="h-10 w-10 text-primary" /></div>
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Professional Certificates</h3>
                <p className="text-gray-600 mb-6">Enhance specific skills with targeted professional certificate programs designed for immediate career impact.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Short duration, high impact</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Industry-specific skills development</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Practical, applied learning</span>
                  </li>
                </ul>
                
                <Link 
                  href="/programs#certificates"
                  className="inline-flex items-center font-medium text-accent hover:text-accent-dark"
                >
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Take the First Step Toward Career Advancement</h2>
          <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Join our global network of professionals and transform your career with internationally recognized education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="#programs" 
              className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Programs
            </a>
            <Link 
              href="/contact" 
              className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LongLandingPage; 