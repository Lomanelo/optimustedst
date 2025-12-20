'use client';

import React, { useState, useEffect, Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '../components/ClientLayout';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useCMS } from '../contexts/cms-context';

// Filter options - Bilingual program types
const programTypeOptions = [
  { en: 'BBA', ar: 'بكالوريوس إدارة الأعمال' },
  { en: 'MBA', ar: 'ماجستير إدارة الأعمال' },
  { en: 'DBA', ar: 'دكتوراه إدارة الأعمال' }
];
const specialityOptions = [
  { en: 'Digital Transformation', ar: 'التحول الرقمي' },
  { en: 'Strategic Management', ar: 'الإدارة الاستراتيجية' },
  { en: 'Healthcare Management', ar: 'إدارة الرعاية الصحية' },
  { en: 'Project Management', ar: 'إدارة المشاريع' },
  { en: 'Accounting & Finance Management', ar: 'إدارة المحاسبة والمالية' },
  { en: 'Marketing Management', ar: 'إدارة التسويق' },
  { en: 'Logistics & Supply Chain Management', ar: 'إدارة اللوجستيات وسلسلة التوريد' },
  { en: 'Human Resources Management', ar: 'إدارة الموارد البشرية' },
  { en: 'Quality Management', ar: 'إدارة الجودة' },
  { en: 'Accounting & Finance', ar: 'المحاسبة والمالية' },
  { en: 'Entrepreneurship & Innovation', ar: 'ريادة الأعمال والابتكار' },
  { en: 'International Business Management', ar: 'إدارة الأعمال الدولية' },
  { en: 'Sports Management', ar: 'إدارة الرياضة' },
  { en: 'Hospitality & Events Management', ar: 'إدارة الضيافة والفعاليات' }
];

// Helper function to get the correct specialty translation
const getSpecialtyTranslation = (currentLanguage: 'en' | 'ar', specialtyEn?: string, specialtyAr?: string): string => {
  // Check all possible values (both fields might contain either language)
  const allValues = [specialtyEn, specialtyAr].filter(Boolean);
  
  // Find the matching specialty pair by checking against both English and Arabic options
  for (const value of allValues) {
    const specialtyPair = specialityOptions.find(option => 
      option.en === value || option.ar === value
    );
    
    if (specialtyPair) {
      return currentLanguage === 'ar' ? specialtyPair.ar : specialtyPair.en;
    }
  }
  
  // Fallback to whatever we have
  if (currentLanguage === 'ar') {
    return specialtyAr || specialtyEn || 'غير محدد';
  } else {
    return specialtyEn || specialtyAr || 'Not specified';
  }
};

// Translation key mapping functions
const getFilterTranslationKey = (filterType: string, value: string): string => {
  // Handle specific mappings for complex names
  const specialMappings: Record<string, string> = {
    // Program types
    'MBA': 'filter_program_type_mba',
    'DBA': 'filter_program_type_dba',
    
    // Arabic Specialities
    'التحول الرقمي': 'filter_speciality_digital_transformation',
    'الإدارة الاستراتيجية': 'filter_speciality_strategic_management',
    'إدارة الرعاية الصحية': 'filter_speciality_healthcare_management',
    'إدارة المشاريع': 'filter_speciality_project_management',
    'إدارة المحاسبة والمالية': 'filter_speciality_accounting_finance_management',
    'إدارة التسويق': 'filter_speciality_marketing_management',
    'إدارة اللوجستيات وسلسلة التوريد': 'filter_speciality_logistics_supply_chain',
    'إدارة الموارد البشرية': 'filter_speciality_human_resources',
    'إدارة الجودة': 'filter_speciality_quality_management',
    'المحاسبة والمالية': 'filter_speciality_accounting_finance',
    'ريادة الأعمال والابتكار': 'filter_speciality_entrepreneurship_innovation',
    'إدارة الأعمال الدولية': 'filter_speciality_international_business',
    'إدارة الرياضة': 'filter_speciality_sports_management',
    'إدارة الضيافة والفعاليات': 'filter_speciality_hospitality_events'
  };
  
  // Check if we have a special mapping first
  if (specialMappings[value]) {
    return specialMappings[value];
  }
  
  // Otherwise, generate the key automatically
  const valueKey = value.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/&/g, '')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '');
  
  switch (filterType) {
    case 'programType':
      return `filter_program_type_${valueKey}`;
    case 'speciality':
      return `filter_speciality_${valueKey}`;
    default:
      return valueKey;
  }
};

// Function to get translated filter option text
const getFilterOptionText = (getContent: (key: string) => string, filterType: string, value: string): string => {
  const translationKey = getFilterTranslationKey(filterType, value);
  const translated = getContent(translationKey);
  // If translation is the same as key (not found), return original value
  return translated === translationKey ? value : translated;
};

interface Program {
  id: string;
  title: string;
  title_ar?: string;
  type: string;
  type_ar?: string;
  programType: string;
  speciality: string;
  speciality_ar?: string;
  studyTime: string;
  studyTime_ar?: string;
  price?: number;
  description?: string;
  description_ar?: string;
  accreditations?: string[];
  status?: 'published' | 'draft';
  exclusive?: boolean;
  createdAt?: any;
  thumbnail?: string;
  brochure_en?: string;
  brochure_ar?: string;
}

// Interface for search params
interface PageProps {
  params?: {};
  searchParams: Record<string, string | string[] | undefined>;
}

// Create a component that uses useSearchParams
function ProgramsContent({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { getContent, currentLanguage } = useCMS();
  
  // Helper function to get text alignment classes based on language
  const getTextAlignClass = () => {
    return currentLanguage === 'ar' ? 'text-right' : 'text-left';
  };
  const router = useRouter();
  const queryParams = useSearchParams();
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedProgramTypes, setSelectedProgramTypes] = useState<string[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [showExclusiveOnly, setShowExclusiveOnly] = useState<boolean>(false);
  
  // UI state
  const [openFilters, setOpenFilters] = useState({
    programType: false,
    speciality: false
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    if (queryParams) {
      const programType = queryParams.get('programType');
      if (programType) {
        // Check if the programType exists in either English or Arabic
        const exists = programTypeOptions.some(option => 
          option.en === programType || option.ar === programType
        );
        if (exists) {
        setSelectedProgramTypes([programType]);
        }
      }
    }
  }, [queryParams]);

  // Load programs from local JSON (no Firebase)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/programs/index.json', { cache: 'no-store' });
        const data = await res.json();
        const transformed: Program[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: p.id,
          title: p.title || '',
          title_ar: p.title_ar || '',
          type: p.type || 'Program',
          type_ar: p.type_ar || '',
          programType: p.programType || p.level || '',
          speciality: p.speciality || p.specialization || '',
          speciality_ar: p.speciality_ar || p.specialization_ar || '',
          studyTime: p.duration || p.studyTime || '',
          studyTime_ar: p.duration_ar || p.studyTime_ar || '',
          price: p.price || 0,
          description: p.description || '',
          description_ar: p.description_ar || '',
          status: p.status || 'published',
          exclusive: !!p.exclusive,
          createdAt: p.createdAt || null,
          thumbnail: p.thumbnail || '',
          brochure_en: p.brochure_en || '',
          brochure_ar: p.brochure_ar || ''
        }));
        setAllPrograms(transformed);
      } catch (e) {
        console.error('Failed to load local programs JSON', e);
        setAllPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleFilter = (filterType: keyof typeof openFilters) => {
    setOpenFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleProgramTypeChange = (programTypeValue: string) => {
    setSelectedProgramTypes(prev => 
      prev.includes(programTypeValue) 
        ? prev.filter(t => t !== programTypeValue) 
        : [...prev, programTypeValue]
    );
  };

  const handleSpecialityChange = (specialityValue: string) => {
    setSelectedSpecialities(prev => 
      prev.includes(specialityValue) 
        ? prev.filter(s => s !== specialityValue)
        : [...prev, specialityValue]
    );
  };

  const clearAllFilters = () => {
    setSelectedProgramTypes([]);
    setSelectedSpecialities([]);
    setShowExclusiveOnly(false);
  };

  // Filter programs based on selected criteria
  const filteredPrograms = allPrograms.filter(program => {
    // Program type filter - check both English and Arabic versions
    if (selectedProgramTypes.length > 0) {
      const isProgramTypeMatch = selectedProgramTypes.some(selectedType => {
        // Find the program type pair that matches the selected filter
        const selectedTypePair = programTypeOptions.find(option => 
          option.en === selectedType || option.ar === selectedType
        );
        
        if (selectedTypePair) {
          // Check if program matches either English or Arabic version
          return program.programType === selectedTypePair.en || 
                 program.programType === selectedTypePair.ar;
    }

        // Fallback to direct matching
        return selectedType === program.programType;
      });
      
      if (!isProgramTypeMatch) {
        return false;
      }
    }

    // Speciality filter - check both English and Arabic versions
    if (selectedSpecialities.length > 0) {
      const isSpecialityMatch = selectedSpecialities.some(selectedSpec => {
        // Find the specialty pair that matches the selected filter
        const selectedPair = specialityOptions.find(option => 
          option.en === selectedSpec || option.ar === selectedSpec
        );
        
        if (selectedPair) {
          // Check if program matches either English or Arabic version of the selected specialty
          return program.speciality === selectedPair.en || 
                 program.speciality === selectedPair.ar ||
                 program.speciality_ar === selectedPair.ar ||
                 program.speciality_ar === selectedPair.en;
        }
        
        // Fallback to direct matching
        return selectedSpec === program.speciality || selectedSpec === program.speciality_ar;
      });
      
      if (!isSpecialityMatch) {
        return false;
      }
    }

    // Exclusive filter
    if (showExclusiveOnly && !program.exclusive) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">{getContent('programs_page_loading')}</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">{getContent('programs_page_title')}</h1>
          <p className="text-xl text-gray-600 mb-2">
            {getContent('programs_page_subtitle')}
          </p>
          <p className="text-lg text-accent font-medium">
            {getContent('programs_page_certification')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold text-primary flex items-center ${getTextAlignClass()}`}>
                  <Filter className={`w-5 h-5 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {getContent('programs_page_filters_title')}
                </h2>
                {(selectedProgramTypes.length > 0 || selectedSpecialities.length > 0 || showExclusiveOnly) && (
                  <button
                    onClick={clearAllFilters}
                    className={`text-sm text-red-600 hover:text-red-800 flex items-center ${getTextAlignClass()}`}
                  >
                    <X className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                    {getContent('programs_page_clear_all')}
                  </button>
                )}
              </div>

              {/* Program Type Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('programType')}
                  className="w-full flex items-center justify-between p-2 text-left font-medium text-primary hover:bg-gray-50 rounded"
                >
                  {getContent('programs_page_program_type')}
                  {openFilters.programType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFilters.programType && (
                  <div className="mt-2 space-y-2">
                    {programTypeOptions.map((programType, index) => {
                      const typeValue = currentLanguage === 'ar' ? programType.ar : programType.en;
                      return (
                        <label key={index} className={`flex items-center ${getTextAlignClass()}`}>
                        <input
                          type="checkbox"
                            checked={selectedProgramTypes.includes(typeValue)}
                            onChange={() => handleProgramTypeChange(typeValue)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                          <span className={`text-sm text-gray-600 ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}>
                            {currentLanguage === 'ar' ? programType.ar : programType.en}
                          </span>
                      </label>
                      );
                    })}
                    {/* Exclusive Programs checkbox */}
                    <label className={`flex items-center ${getTextAlignClass()}`}>
                      <input
                        type="checkbox"
                        checked={showExclusiveOnly}
                        onChange={(e) => setShowExclusiveOnly(e.target.checked)}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <span className={`text-sm text-gray-600 ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}>
                        {currentLanguage === 'ar' ? 'البرامج الحصرية' : 'Exclusive Programs'}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Speciality Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('speciality')}
                  className="w-full flex items-center justify-between p-2 text-left font-medium text-primary hover:bg-gray-50 rounded"
                >
                  {getContent('programs_page_speciality')}
                  {openFilters.speciality ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFilters.speciality && (
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {specialityOptions.map((spec, index) => {
                      const specValue = currentLanguage === 'ar' ? spec.ar : spec.en;
                      return (
                        <label key={index} className={`flex items-center ${getTextAlignClass()}`}>
                        <input
                          type="checkbox"
                            checked={selectedSpecialities.includes(specValue)}
                            onChange={() => handleSpecialityChange(specValue)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                          <span className={`text-sm text-gray-600 ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}>
                            {currentLanguage === 'ar' ? spec.ar : spec.en}
                          </span>
                      </label>
                      );
                    })}
                  </div>
                )}
              </div>



            </div>
          </div>

          {/* Programs Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex items-center justify-between">
              <p className={`text-gray-600 ${getTextAlignClass()}`}>
                {getContent('programs_page_showing_count').replace('{count}', filteredPrograms.length.toString()).replace('{total}', allPrograms.length.toString())}
              </p>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className={`py-12 ${getTextAlignClass()}`}>
                <p className="text-gray-500 text-lg">{getContent('programs_page_no_results')}</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark transition-colors"
                >
                  {getContent('programs_page_clear_filters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                  <Link key={program.id} href={`/programs/${program.id}`} className="block">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105">
                      {/* Program Thumbnail */}
                      <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                        <img 
                          src={program.thumbnail || '/Logo.jpeg'} 
                          alt={currentLanguage === 'ar' ? (program.title_ar || program.title) : program.title}
                          loading="lazy"
                          decoding="async"
                          className={`${program.thumbnail ? 'w-full h-full object-cover' : 'w-32 h-32 object-contain'}`}
                        />
                      </div>
                      
                      <div className="p-6">
                      
                      <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
                          {currentLanguage === 'ar' ? (program.title_ar || program.title) : program.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{getContent('programs_page_program_type_label')}</span> {program.programType}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">{getContent('programs_page_speciality_label')}</span> {getSpecialtyTranslation(currentLanguage, program.speciality, program.speciality_ar)}
                        </p>
                      </div>

                      {program.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {currentLanguage === 'ar' ? (program.description_ar || program.description) : program.description}
                        </p>
                      )}

                      {/* Brochure downloads (local-only) */}
                      {(program.brochure_en || program.brochure_ar) && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {program.brochure_en && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(program.brochure_en, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              <span>{currentLanguage === 'ar' ? 'كتيب EN' : 'Brochure EN'}</span>
                            </button>
                          )}
                          {program.brochure_ar && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(program.brochure_ar, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              <span>{currentLanguage === 'ar' ? 'كتيب AR' : 'Brochure AR'}</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Accreditations removed */}

                        <div className="flex items-center justify-end">
                          <span className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium">
                            {getContent('programs_page_learn_more')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

// Loading fallback
function ProgramsLoading() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading programs...</p>
        </div>
      </div>
    </ClientLayout>
  );
}

// Main page component with Suspense boundary
export default function ProgramsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<ProgramsLoading />}>
      <ProgramsContent searchParams={searchParams} />
    </Suspense>
  );
} 