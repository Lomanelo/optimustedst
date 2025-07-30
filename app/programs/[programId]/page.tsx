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
          console.log('Fetched program data:', {
            id: programData.id,
            title: programData.title,
            modules: programData.modules,
            modules_ar: (programData as any).modules_ar,
            coreLearnings: (programData as any).coreLearnings,
            coreLearnings_ar: (programData as any).coreLearnings_ar,
            careerOpportunities: (programData as any).careerOpportunities,
            careerOpportunities_ar: (programData as any).careerOpportunities_ar,
            keyFeatures: (programData as any).keyFeatures,
            keyFeatures_ar: (programData as any).keyFeatures_ar
          });
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
    
  const coreLearnings = currentLanguage === 'ar' && Array.isArray((program as any).coreLearnings_ar) ? 
    (program as any).coreLearnings_ar : 
    (Array.isArray((program as any).coreLearnings) ? (program as any).coreLearnings : []);

  console.log('Processed modules and coreLearnings:', {
    currentLanguage,
    modules,
    modulesLength: modules.length,
    coreLearnings,
    coreLearningsLength: coreLearnings.length,
    programModules: program.modules,
    programModulesAr: (program as any).modules_ar,
    programCoreLearnings: (program as any).coreLearnings,
    programCoreLearningsAr: (program as any).coreLearnings_ar
  });

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


                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {getLocalizedContent(program.title, (program as any).title_ar)}
            </h1>
            
            {((program as any).shortDescription || (program as any).shortDescription_ar) && (
                  <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                {getLocalizedContent((program as any).shortDescription, (program as any).shortDescription_ar)}
              </p>
            )}

                {/* Accreditation Logos */}
                <div className="mb-8">
                  <p className="text-white/80 text-sm font-medium mb-4 uppercase tracking-wider">
                    {currentLanguage === 'ar' ? 'معتمد من قبل' : 'Accredited By'}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="bg-white rounded-xl p-3 hover:bg-gray-100 transition-all duration-300 shadow-lg">
                      <img 
                        src="/VERN.jpg" 
                        alt="VERN University" 
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <div className="bg-white rounded-xl p-3 hover:bg-gray-100 transition-all duration-300 shadow-lg">
                      <img 
                        src="/IBAS.jpg" 
                        alt="IBAS Business School" 
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  </a>

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
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    )}
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

              {/* Program Modules */}
              {modules.length > 0 && (
                <section className="group">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-primary">
                        {currentLanguage === 'ar' ? 'وحدات البرنامج' : 'Program Modules'}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {modules.map((module: string, index: number) => (
                        <div key={index} className="group/item flex items-center p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl hover:from-primary/10 hover:to-primary/20 transition-all duration-300 border border-primary/20">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-4 group-hover/item:bg-primary/30 transition-colors duration-300">
                            <span className="text-primary font-bold text-sm">{index + 1}</span>
                        </div>
                          <span className="text-gray-700 font-medium">{module}</span>
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

          {/* Career Opportunities - Smaller version at the bottom */}
          {careerOpportunities.length > 0 && (
            <div className="container mx-auto px-4 pb-8" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {currentLanguage === 'ar' ? 'هذه الدراسة تمكنك من متابعة الفرص المستقبلية وتسريع مسيرتك المهنية في أدوار مثل:' : 'This study enables you to pursue future opportunities and accelerate your career in roles such as:'}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {careerOpportunities.map((career, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
} 