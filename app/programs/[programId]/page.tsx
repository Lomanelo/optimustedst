'use client';

import React, { useState, useEffect, use } from 'react';
import ClientLayout from '../../components/ClientLayout';
import programService, { Program } from '../../../src/services/programService';
import { Award, Clock, DollarSign, BookOpen, CheckCircle, Download, FileText } from 'lucide-react';

interface PageProps {
  params: Promise<{
    programId: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const programData = await programService.getProgramById(programId);
        if (programData) {
          setProgram(programData);
        } else {
          setError('Program not found');
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setError('Failed to load program details');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  if (loading) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading program details...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error || !program) {
    return (
      <ClientLayout>
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600">{error || 'Program not found'}</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // Helper function to parse requirements/benefits text into array
  const parseTextToArray = (text: string | string[] | undefined): string[] => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    // Split by line breaks or bullet points
    return text.split(/[\n\r]+/).map(item => item.trim()).filter(item => item.length > 0);
  };

  const requirementsList = parseTextToArray(program.requirements);
  const benefitsList = parseTextToArray((program as any).benefits);

  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h1 className="text-4xl font-bold text-primary mb-3">{program.title}</h1>
            
            {/* Program Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium">
                {(program as any).programType || program.level}
              </span>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium flex items-center">
                <Clock size={14} className="mr-1" />
                {(program as any).studyTime || program.duration}
              </span>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                {program.type}
              </span>
              {((program as any).speciality || program.specialization) && (
                <span className="bg-accent/10 text-accent px-3 py-1 rounded text-sm font-medium">
                  {(program as any).speciality || program.specialization}
                </span>
              )}
            </div>

            {/* Short Description */}
            {(program as any).shortDescription && (
              <p className="text-gray-700 mb-4 text-lg">{(program as any).shortDescription}</p>
            )}

            {/* Price */}
            <div className="flex items-center">
              <DollarSign size={20} className="text-accent mr-1" />
              <span className="text-2xl font-bold text-accent mr-2">{program.price.toLocaleString()} SAR</span>
              <span className="text-sm text-gray-500">Not including VAT 5%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Full Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                  <BookOpen size={24} className="mr-2" />
                  Program Overview
                </h2>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
              </div>

              {/* Program Curriculum */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Program Curriculum</h2>
                {program.modules && Array.isArray(program.modules) && program.modules.length > 0 ? (
                  <ul className="space-y-4">
                    {program.modules.map((module, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Program curriculum will be available soon.</p>
                )}
              </div>

              {/* Learning Outcomes/Benefits */}
              {(benefitsList.length > 0 || (program.whatYouWillLearn && Array.isArray(program.whatYouWillLearn) && program.whatYouWillLearn.length > 0)) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <CheckCircle size={24} className="mr-2" />
                    Program Benefits
                  </h2>
                  <ul className="space-y-3">
                    {benefitsList.length > 0 
                      ? benefitsList.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5 text-accent mr-2 mt-0.5" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))
                      : program.whatYouWillLearn && Array.isArray(program.whatYouWillLearn) && program.whatYouWillLearn.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5 text-accent mr-2 mt-0.5" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                            <span>{outcome}</span>
                          </li>
                        ))
                    }
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {requirementsList.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Program Requirements</h2>
                  <ul className="space-y-2">
                    {requirementsList.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Accreditation */}
              {(program as any).accreditation && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <Award size={24} className="mr-2" />
                    Accreditation
                  </h2>
                  <p className="text-gray-600">{(program as any).accreditation}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Program Details Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-primary mb-4">Program Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{(program as any).programType || program.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{(program as any).studyTime || program.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{program.category}</span>
                  </div>
                  {((program as any).speciality || program.specialization) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speciality:</span>
                      <span className="font-medium">{(program as any).speciality || program.specialization}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-accent">{program.price.toLocaleString()} SAR</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">*Not including VAT 5%</p>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Interested in this Program?</h2>
                <p className="text-gray-600 mb-4">Fill out the form below to get more information about this program.</p>
                
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your phone number"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Request Information
                  </button>
                </form>
              </div>

              {/* Download Brochure */}
              {(((program as any).brochure_en) || ((program as any).brochure_ar)) && (
                <div className="bg-primary/5 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                    <FileText size={24} className="mr-2" />
                    Download Program Brochure
                  </h2>
                  <p className="text-gray-600 mb-4">Get detailed information about this program in our comprehensive brochure.</p>
                  
                  <div className="space-y-3">
                    {(program as any).brochure_en && (
                      <a
                        href={(program as any).brochure_en}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                      >
                        <Download size={20} className="mr-2" />
                        📄 Download English Brochure
                      </a>
                    )}
                    
                    {(program as any).brochure_ar && (
                      <a
                        href={(program as any).brochure_ar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                      >
                        <Download size={20} className="mr-2" />
                        📄 تحميل الكتيب العربي
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Enroll Now */}
              <div className="bg-accent/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-accent mb-4">Ready to Enroll?</h2>
                <p className="text-gray-600 mb-4">Start your journey with this program today. Complete the enrollment process in just a few steps.</p>
                <button 
                  onClick={() => window.location.href = `/enrollment/register?programId=${programId}&price=${program.price}`}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
                    />
                  </svg>
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 