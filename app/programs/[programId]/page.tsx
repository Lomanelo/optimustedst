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
      <div className="bg-gray-50">
        {/* Hero Banner with Enhanced Design */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-20 pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className={`text-white ${currentLanguage === 'ar' ? 'text-right lg:order-2' : 'text-left lg:order-1'}`}>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    {getLocalizedContent(
                      (program as any).programType || (program as any).type || program.level,
                      (program as any).programType_ar || (program as any).type_ar || (program as any).level_ar
                    )}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 bg-accent/90 backdrop-blur-sm rounded-full text-sm font-semibold">
                    <Clock size={16} className="mr-2" />
                    {getLocalizedContent(
                      (program as any).studyTime || program.duration,
                      (program as any).studyTime_ar || (program as any).duration_ar
                    )}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {getLocalizedContent(program.title, (program as any).title_ar)}
                </h1>
                
                {((program as any).shortDescription || (program as any).shortDescription_ar) && (
                  <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                    {getLocalizedContent((program as any).shortDescription, (program as any).shortDescription_ar)}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  </a>
                  {(program.brochure_en || program.brochure_ar) && (
                    <a 
                      href={currentLanguage === 'ar' ? program.brochure_ar : program.brochure_en} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-xl transition-all duration-300 border border-white/30 hover:border-white/50"
                    >
                      <Download size={20} className="mr-2" />
                      {currentLanguage === 'ar' ? 'تحميل الكتيب' : 'Download Brochure'}
                    </a>
                  )}
                </div>
              </div>
              
              {/* Right Column - Visual Element */}
              <div className={`${currentLanguage === 'ar' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-white/20 rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    {program.thumbnail && (
                      <img 
                        src={program.thumbnail} 
                        alt={getLocalizedContent(program.title, (program as any).title_ar)} 
                        className="w-full h-64 object-cover rounded-2xl mb-6"
                      />
                    )}
                    <div className="space-y-4">
                      <div className="flex items-center text-white/90">
                        <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
                        <span className="text-lg font-semibold">
                          {getLocalizedContent(
                            (program as any).studyTime || program.duration,
                            (program as any).studyTime_ar || (program as any).duration_ar
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-white/90">
                        <div className="w-3 h-3 bg-white/60 rounded-full mr-3"></div>
                        <span className="text-lg font-semibold">{currentLanguage === 'ar' ? 'اتصل للحصول على السعر' : 'Contact for pricing'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Design */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Full Description */}
              <section className="group">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                      <BookOpen size={24} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-primary">
                      {currentLanguage === 'ar' ? 'نظرة عامة على البرنامج' : 'Program Overview'}
                    </h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {getLocalizedContent(program.description, (program as any).description_ar)}
                  </p>
                </div>
              </section>

              {/* Career Opportunities */}
              {careerOpportunities.length > 0 && (
                <section className="group">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-primary">
                        {currentLanguage === 'ar' ? 'الفرص المهنية' : 'Career Opportunities'}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {careerOpportunities.map((career, index) => (
                        <div key={index} className="group/item flex items-center p-4 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl hover:from-accent/10 hover:to-accent/20 transition-all duration-300 border border-accent/20">
                          <div className="w-3 h-3 bg-accent rounded-full mr-4 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="text-gray-700 font-semibold">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Key Features */}
              {keyFeatures.length > 0 && (
                <section className="group">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-primary">
                        {currentLanguage === 'ar' ? 'الميزات الرئيسية' : 'Key Features'}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className="group/feature bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 mt-1 group-hover/feature:bg-primary/20 transition-colors duration-300">
                              <CheckCircle size={16} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-primary mb-3 text-lg">{feature.title}</h3>
                              {feature.description && <p className="text-gray-600 text-sm mt-1">{feature.description}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
            
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Program Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {currentLanguage === 'ar' ? 'تفاصيل البرنامج' : 'Program Details'}
                  </h3>
                  <p className="text-gray-600 text-sm">{currentLanguage === 'ar' ? 'كل ما تحتاج لمعرفته' : 'Everything you need to know'}</p>
                </div>
                
                <div className="space-y-4">
                  {/* Program Type */}
                  {((program as any).programType || (program as any).type || program.level) && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <Award size={16} className="text-primary" />
                        </div>
                        <span className="text-gray-600 font-medium">
                          {currentLanguage === 'ar' ? 'النوع:' : 'Type:'}
                        </span>
                      </div>
                      <span className="font-bold text-primary">
                        {getLocalizedContent(
                          (program as any).programType || (program as any).type || program.level,
                          (program as any).programType_ar || (program as any).type_ar || (program as any).level_ar
                        )}
                      </span>
                    </div>
                  )}
                  
                  {/* Duration */}
                  {((program as any).studyTime || program.duration) && (
                    <div className="flex items-center justify-between p-4 bg-accent/5 rounded-xl border border-accent/20">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                          <Clock size={16} className="text-accent" />
                        </div>
                        <span className="text-gray-600 font-medium">
                          {currentLanguage === 'ar' ? 'المدة:' : 'Duration:'}
                        </span>
                      </div>
                      <span className="font-bold text-accent text-lg">
                        {getLocalizedContent(
                          (program as any).studyTime || program.duration,
                          (program as any).studyTime_ar || (program as any).duration_ar
                        )}
                      </span>
                    </div>
                  )}
                  
                  {/* Category */}
                  {((program as any).category || program.category) && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-600 font-medium">
                          {currentLanguage === 'ar' ? 'الفئة:' : 'Category:'}
                        </span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {getLocalizedContent(
                          (program as any).category || program.category,
                          (program as any).category_ar
                        )}
                      </span>
                    </div>
                  )}
                  
                  {/* Specialization */}
                  {((program as any).speciality || program.specialization) && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-600 font-medium">
                          {currentLanguage === 'ar' ? 'التخصص:' : 'Specialization:'}
                        </span>
                      </div>
                      <span className="font-bold text-green-600">
                        {getLocalizedContent(
                          (program as any).speciality || program.specialization,
                          (program as any).speciality_ar || (program as any).specialization_ar
                        )}
                      </span>
                    </div>
                  )}
                </div>
                
                <div id="contact" className="mt-6">
                  <a 
                    href="/contact"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {currentLanguage === 'ar' ? 'اتصل بنا للتسجيل' : 'Contact Us to Enroll'}
                  </a>
                </div>
              </div>

              {/* Download Brochure Card */}
              {(program.brochure_en || program.brochure_ar) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Download size={32} className="text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {currentLanguage === 'ar' ? 'تحميل الكتيب' : 'Download Brochure'}
                    </h3>
                    <p className="text-gray-600 text-sm">{currentLanguage === 'ar' ? 'احصل على معلومات مفصلة' : 'Get detailed information'}</p>
                  </div>
                  <div className="space-y-3">
                    {program.brochure_en && (
                      <a 
                        href={program.brochure_en} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
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
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-all duration-300 font-semibold"
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