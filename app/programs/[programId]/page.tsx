'use client';

import React, { useState, useEffect, use } from 'react';
import ClientLayout from '../../components/ClientLayout';
import programService, { Program } from '../../../src/services/programService';
import { Award, Clock, DollarSign, BookOpen, CheckCircle, Download, FileText } from 'lucide-react';
import { useCMS } from '../../contexts/cms-context';

interface PageProps {
  params: Promise<{
    programId: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;
  const { currentLanguage } = useCMS();
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

  // Helper function to get localized content
  const getLocalizedContent = (contentEn: string | undefined, contentAr: string | undefined): string => {
    if (currentLanguage === 'ar' && contentAr) {
      return contentAr;
    }
    return contentEn || '';
  };

  // Define interfaces
  interface KeyFeature {
    title: string;
    description?: string;
  }
  
  // Helper function to get localized array content
  const getLocalizedArray = (arrayEn: any[] | undefined, arrayAr: any[] | undefined): any[] => {
    if (currentLanguage === 'ar' && arrayAr && arrayAr.length > 0) {
      return arrayAr;
    }
    return arrayEn || [];
  };

  const requirementsList = currentLanguage === 'ar' && program.requirements_ar ? 
    parseTextToArray(program.requirements_ar) : 
    parseTextToArray(program.requirements);
    
  const benefitsList = currentLanguage === 'ar' && (program as any).benefits_ar ? 
    parseTextToArray((program as any).benefits_ar) : 
    parseTextToArray((program as any).benefits);
    
  const careerOpportunities = currentLanguage === 'ar' && (program as any).careerOpportunities_ar ? 
    parseTextToArray((program as any).careerOpportunities_ar) : 
    parseTextToArray((program as any).careerOpportunities);
    
  const keyFeatures: KeyFeature[] = currentLanguage === 'ar' && (program as any).keyFeatures_ar ? 
    (program as any).keyFeatures_ar : 
    (Array.isArray((program as any).keyFeatures) ? (program as any).keyFeatures : []);
    
  const modules = currentLanguage === 'ar' && Array.isArray((program as any).modules_ar) ? 
    (program as any).modules_ar : 
    (Array.isArray(program.modules) ? program.modules : []);

  // Safe access to program properties
  const getModules = () => {
    if (Array.isArray(program.modules) && program.modules.length > 0) {
      return program.modules;
    }
    return [];
  };

  return (
    <ClientLayout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              {program.thumbnail && (
                <div className="md:w-1/3">
                  <img 
                    src={program.thumbnail} 
                    alt={getLocalizedContent(program.title, (program as any).title_ar)} 
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
              
              {/* Program Info */}
              <div className={program.thumbnail ? "md:w-2/3" : "w-full"}>
                <h1 className="text-4xl font-bold text-primary mb-3">
                  {getLocalizedContent(program.title, (program as any).title_ar)}
                </h1>
                
                {/* Program Badges */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {/* Program Type (PhD, MBA, etc.) */}
                  {((program as any).programType || (program as any).type || program.level) && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium">
                      {getLocalizedContent(
                        (program as any).programType || (program as any).type || program.level,
                        (program as any).programType_ar || (program as any).type_ar || (program as any).level_ar
                      )}
                  </span>
                  )}
                  
                  {/* Study Duration */}
                  {((program as any).studyTime || program.duration) && (
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium flex items-center">
                    <Clock size={14} className={currentLanguage === 'ar' ? 'ml-1' : 'mr-1'} />
                    {getLocalizedContent(
                      (program as any).studyTime || program.duration,
                      (program as any).studyTime_ar || (program as any).duration_ar
                    )}
                  </span>
                  )}
                  
                  {/* Category */}
                  {((program as any).category || program.category) && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                      {getLocalizedContent(
                        (program as any).category || program.category,
                        (program as any).category_ar
                      )}
                  </span>
                  )}
                  
                  {/* Specialization */}
                  {((program as any).speciality || program.specialization) && (
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded text-sm font-medium">
                      {getLocalizedContent(
                        (program as any).speciality || program.specialization,
                        (program as any).speciality_ar || (program as any).specialization_ar
                      )}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {((program as any).shortDescription || (program as any).shortDescription_ar) && (
                  <p className="text-gray-700 mb-4 text-lg">
                    {getLocalizedContent((program as any).shortDescription, (program as any).shortDescription_ar)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Full Description */}
              <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                  <BookOpen size={24} className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} />
                  {currentLanguage === 'ar' ? 'نظرة عامة على البرنامج' : 'Program Overview'}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {getLocalizedContent(program.description, (program as any).description_ar)}
                </p>
              </div>

              {/* Career Opportunities */}
              {careerOpportunities.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    {currentLanguage === 'ar' ? 'الفرص المهنية' : 'Career Opportunities'}
                  </h2>
                  <ul className="space-y-2">
                    {careerOpportunities.map((career, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`text-primary ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`}>•</span>
                        <span className="text-gray-600">{career}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Features */}
              {keyFeatures.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    {currentLanguage === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
                  </h2>
                  <ul className="space-y-3">
                    {keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 text-accent ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} mt-0.5`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <div>
                          <span className="font-medium">{feature.title}</span>
                          {feature.description && <p className="text-gray-600 text-sm mt-1">{feature.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements Section */}
              {requirementsList.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    {currentLanguage === 'ar' ? 'متطلبات البرنامج' : 'Program Requirements'}
                  </h2>
                  <ul className="space-y-2">
                    {requirementsList.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`text-primary ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`}>•</span>
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Program Benefits */}
              {benefitsList.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <CheckCircle size={24} className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} />
                    {currentLanguage === 'ar' ? 'فوائد البرنامج' : 'Program Benefits'}
                  </h2>
                  <ul className="space-y-3">
                    {benefitsList.map((benefit, index) => (
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
                    ))}
                  </ul>
                </div>
              )}

              {/* Accreditation */}
              {((program as any).accreditations && Array.isArray((program as any).accreditations) && (program as any).accreditations.length > 0) && (
                <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <Award size={24} className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} />
                    {currentLanguage === 'ar' ? 'الاعتماد والشراكات' : 'Accreditation & Partnerships'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(program as any).accreditations.map((accreditation: string, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <span className="text-gray-700 font-medium">{accreditation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Program Details Card */}
              <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <h3 className="text-lg font-bold text-primary mb-4">
                  {currentLanguage === 'ar' ? 'تفاصيل البرنامج' : 'Program Details'}
                </h3>
                <div className="space-y-3">
                  {/* Program Type */}
                  {((program as any).programType || (program as any).type || program.level) && (
                  <div className="flex justify-between">
                      <span className="text-gray-600">
                        {currentLanguage === 'ar' ? 'النوع:' : 'Type:'}
                      </span>
                      <span className="font-medium">
                        {getLocalizedContent(
                          (program as any).programType || (program as any).type || program.level,
                          (program as any).programType_ar || (program as any).type_ar || (program as any).level_ar
                        )}
                      </span>
                  </div>
                  )}
                  
                  {/* Duration */}
                  {((program as any).studyTime || program.duration) && (
                  <div className="flex justify-between">
                      <span className="text-gray-600">
                        {currentLanguage === 'ar' ? 'المدة:' : 'Duration:'}
                      </span>
                    <span className="font-medium">
                      {getLocalizedContent(
                        (program as any).studyTime || program.duration,
                        (program as any).studyTime_ar || (program as any).duration_ar
                      )}
                    </span>
                  </div>
                  )}
                  
                  {/* Category */}
                  {((program as any).category || program.category) && (
                  <div className="flex justify-between">
                      <span className="text-gray-600">
                        {currentLanguage === 'ar' ? 'الفئة:' : 'Category:'}
                      </span>
                      <span className="font-medium">
                        {getLocalizedContent(
                          (program as any).category || program.category,
                          (program as any).category_ar
                        )}
                      </span>
                  </div>
                  )}
                  
                  {/* Specialization */}
                  {((program as any).speciality || program.specialization) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {currentLanguage === 'ar' ? 'التخصص:' : 'Speciality:'}
                      </span>
                      <span className="font-medium">
                        {getLocalizedContent(
                          (program as any).speciality || program.specialization,
                          (program as any).speciality_ar || (program as any).specialization_ar
                        )}
                      </span>
                    </div>
                  )}
                  

                </div>
              </div>

              {/* Download Brochure */}
              {(program.brochure_en || program.brochure_ar) && (
                <div className="bg-white rounded-lg shadow-md p-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h3 className="text-lg font-bold text-primary mb-4">
                    {currentLanguage === 'ar' ? 'تحميل الكتيب' : 'Download Brochure'}
                  </h3>
                  <div className="space-y-3">
                    {program.brochure_en && (
                      <a 
                        href={program.brochure_en} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                      >
                        <FileText size={18} className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} />
                        {currentLanguage === 'ar' ? 'كتيب باللغة الإنجليزية' : 'English Brochure'}
                      </a>
                    )}
                    {program.brochure_ar && (
                      <a 
                        href={program.brochure_ar} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                      >
                        <FileText size={18} className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} />
                        {currentLanguage === 'ar' ? 'كتيب باللغة العربية' : 'Arabic Brochure'}
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 