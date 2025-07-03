'use client';

import React, { useState, useEffect, Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '../components/ClientLayout';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { allAccreditationsAndPartnerships } from '../../src/data/optimus-data';
import programService, { Program as ServiceProgram } from '../../src/services/programService';
import { useCMS } from '../contexts/cms-context';

// Filter options
const programTypeOptions = ['MBA', 'PHD'];
const specialityOptions = [
  'Digital Transformation',
  'Strategic Management',
  'Healthcare Management',
  'Project Management',
  'Accounting & Finance Management',
  'Marketing Management',
  'Logistics & Supply Chain Management',
  'Human Resources Management',
  'Quality Management',
  'Accounting & Finance',
  'Entrepreneurship & Innovation',
  'International Business Management',
  'Sports Management',
  'Hospitality & Events Management'
];
const studyTimeOptions = ['< 50 hours', '50-100 hours', '100-200 hours', '> 200 hours'];
const categoryOptions = ['Business', 'Technology', 'Healthcare', 'Education', 'Arts'];
const accreditationOptions = [
  'ACBSP',
  'ATHE', 
  'QUALIFI',
  'IACBE',
  'IBAS',
  'EDUQUA',
  'QS',
  'VERN'
];
const academicPartnershipOptions = [
  'University of Bedfordshire',
  'University of Plymouth'
];

// Translation key mapping functions
const getFilterTranslationKey = (filterType: string, value: string): string => {
  // Handle specific mappings for complex names
  const specialMappings: Record<string, string> = {
    // Program types
    'MBA': 'filter_program_type_mba',
    'PHD': 'filter_program_type_phd',
    
    // Study time ranges
    '< 50 hours': 'filter_study_time_under_50',
    '50-100 hours': 'filter_study_time_50_100', 
    '100-200 hours': 'filter_study_time_100_200',
    '> 200 hours': 'filter_study_time_over_200',
    
    // Partnerships
    'University of Bedfordshire': 'filter_partnership_bedfordshire',
    'University of Plymouth': 'filter_partnership_plymouth',
    
    // Specialities - handle special cases
    'Accounting & Finance Management': 'filter_speciality_accounting_finance_management',
    'Logistics & Supply Chain Management': 'filter_speciality_logistics_supply_chain',
    'Human Resources Management': 'filter_speciality_human_resources',
    'Entrepreneurship & Innovation': 'filter_speciality_entrepreneurship_innovation',
    'International Business Management': 'filter_speciality_international_business',
    'Hospitality & Events Management': 'filter_speciality_hospitality_events',
    'Accounting & Finance': 'filter_speciality_accounting_finance'
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
    case 'studyTime':
      return `filter_study_time_${valueKey}`;
    case 'category':
      return `filter_category_${valueKey}`;
    case 'accreditation':
      return `filter_accreditation_${valueKey}`;
    case 'partnership':
      return `filter_partnership_${valueKey}`;
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
  type: string;
  programType: string;
  speciality: string;
  studyTime: string;
  price: number;
  description?: string;
  accreditations?: string[];
  status?: 'published' | 'draft';
  createdAt?: any;
}

// Interface for search params
interface PageProps {
  params?: {};
  searchParams: Record<string, string | string[] | undefined>;
}

// Create a component that uses useSearchParams
function ProgramsContent({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const { getContent } = useCMS();
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedProgramTypes, setSelectedProgramTypes] = useState<string[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [selectedStudyTimes, setSelectedStudyTimes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAccreditations, setSelectedAccreditations] = useState<string[]>([]);
  const [selectedAcademicPartnerships, setSelectedAcademicPartnerships] = useState<string[]>([]);
  
  // UI state
  const [openFilters, setOpenFilters] = useState({
    programType: false,
    speciality: false,
    studyTime: false,
    category: false,
    accreditation: false,
    academicPartnership: false
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    if (queryParams) {
      const programType = queryParams.get('programType');
      if (programType && programTypeOptions.includes(programType)) {
        setSelectedProgramTypes([programType]);
      }
    }
  }, [queryParams]);

  // Set up real-time listener for programs
  useEffect(() => {
    setLoading(true);
    
    // Use the ProgramService's listener to get real-time updates of published programs
    const unsubscribe = programService.listenToPublishedProgramChanges((programs: ServiceProgram[]) => {
      // Transform the programs to match our component's format using the correct field names
      const transformedPrograms = programs.map((program: ServiceProgram) => ({
        id: program.id,
        title: program.title,
        type: (program as any).category || program.type || 'Professional Certificate',
        programType: (program as any).programType || program.level || 'MBA',
        speciality: (program as any).speciality || program.specialization || 'General',
        studyTime: (program as any).studyTime || program.duration || '',
        price: program.price,
        description: program.description,
        accreditations: (program as any).accreditations || [],
        status: program.status,
        createdAt: program.createdAt,
      } as Program));
      
      setAllPrograms(transformedPrograms);
      setLoading(false);
    });
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const getHoursFromDuration = (duration: string): number => {
    const match = duration.match(/(\d+)\s*hours?/i);
    return match ? parseInt(match[1]) : 0;
  };

  const toggleFilter = (filterType: keyof typeof openFilters) => {
    setOpenFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleProgramTypeChange = (programType: string) => {
    setSelectedProgramTypes(prev => 
      prev.includes(programType) 
        ? prev.filter(t => t !== programType) 
        : [...prev, programType]
    );
  };

  const handleSpecialityChange = (speciality: string) => {
    setSelectedSpecialities(prev => 
      prev.includes(speciality) 
        ? prev.filter(s => s !== speciality)
        : [...prev, speciality]
    );
  };

  const handleStudyTimeChange = (studyTime: string) => {
    setSelectedStudyTimes(prev => 
      prev.includes(studyTime) 
        ? prev.filter(d => d !== studyTime)
        : [...prev, studyTime]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAccreditationChange = (accreditation: string) => {
    setSelectedAccreditations(prev => 
      prev.includes(accreditation) 
        ? prev.filter(a => a !== accreditation)
        : [...prev, accreditation]
    );
  };

  const handleAcademicPartnershipChange = (partnership: string) => {
    setSelectedAcademicPartnerships(prev => 
      prev.includes(partnership) 
        ? prev.filter(p => p !== partnership)
        : [...prev, partnership]
    );
  };

  const clearAllFilters = () => {
    setSelectedProgramTypes([]);
    setSelectedSpecialities([]);
    setSelectedStudyTimes([]);
    setSelectedCategories([]);
    setSelectedAccreditations([]);
    setSelectedAcademicPartnerships([]);
  };

  // Filter programs based on selected criteria
  const filteredPrograms = allPrograms.filter(program => {
    // Program type filter
    if (selectedProgramTypes.length > 0 && !selectedProgramTypes.includes(program.programType)) {
      return false;
    }

    // Speciality filter
    if (selectedSpecialities.length > 0 && !selectedSpecialities.includes(program.speciality)) {
      return false;
    }

    // Study time filter
    if (selectedStudyTimes.length > 0) {
      const hours = getHoursFromDuration(program.studyTime);
      const matchesStudyTime = selectedStudyTimes.some(studyTime => {
        switch (studyTime) {
          case '< 50 hours':
            return hours < 50;
          case '50-100 hours':
            return hours >= 50 && hours <= 100;
          case '100-200 hours':
            return hours > 100 && hours <= 200;
          case '> 200 hours':
            return hours > 200;
          default:
            return false;
        }
      });
      if (!matchesStudyTime) return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const programCategory = (program as any)?.category || program.type || '';
      if (!selectedCategories.some(cat => programCategory.toLowerCase().includes(cat.toLowerCase()))) {
        return false;
      }
    }

    // Accreditation filter
    if (selectedAccreditations.length > 0) {
      const programAccreditations = program.accreditations || [];
      if (!selectedAccreditations.some(acc => 
        programAccreditations.some(progAcc => 
          progAcc.toLowerCase().includes(acc.toLowerCase())
        )
      )) {
        return false;
      }
    }

    // Academic Partnership filter
    if (selectedAcademicPartnerships.length > 0) {
      const programAccreditations = program.accreditations || [];
      if (!selectedAcademicPartnerships.some(partnership => 
        programAccreditations.some(progAcc => 
          progAcc.toLowerCase().includes(partnership.toLowerCase())
        )
      )) {
        return false;
      }
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
                <h2 className="text-lg font-semibold text-primary flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  {getContent('programs_page_filters_title')}
                </h2>
                {(selectedProgramTypes.length > 0 || selectedSpecialities.length > 0 || 
                  selectedStudyTimes.length > 0 || selectedCategories.length > 0 || 
                  selectedAccreditations.length > 0 || selectedAcademicPartnerships.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
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
                    {programTypeOptions.map(programType => (
                      <label key={programType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProgramTypes.includes(programType)}
                          onChange={() => handleProgramTypeChange(programType)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="ml-2 text-sm text-gray-600">{getFilterOptionText(getContent, 'programType', programType)}</span>
                      </label>
                    ))}
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
                    {specialityOptions.map(spec => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSpecialities.includes(spec)}
                          onChange={() => handleSpecialityChange(spec)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="ml-2 text-sm text-gray-600">{getFilterOptionText(getContent, 'speciality', spec)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Study Time Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('studyTime')}
                  className="w-full flex items-center justify-between p-2 text-left font-medium text-primary hover:bg-gray-50 rounded"
                >
                  {getContent('programs_page_study_time')}
                  {openFilters.studyTime ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFilters.studyTime && (
                  <div className="mt-2 space-y-2">
                    {studyTimeOptions.map(studyTime => (
                      <label key={studyTime} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStudyTimes.includes(studyTime)}
                          onChange={() => handleStudyTimeChange(studyTime)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="ml-2 text-sm text-gray-600">{getFilterOptionText(getContent, 'studyTime', studyTime)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('category')}
                  className="w-full flex items-center justify-between p-2 text-left font-medium text-primary hover:bg-gray-50 rounded"
                >
                  {getContent('programs_page_category')}
                  {openFilters.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFilters.category && (
                  <div className="mt-2 space-y-2">
                    {categoryOptions.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="ml-2 text-sm text-gray-600">{getFilterOptionText(getContent, 'category', category)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Accreditation Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('accreditation')}
                  className="w-full flex items-center justify-between p-2 text-left font-medium text-primary hover:bg-gray-50 rounded"
                >
                  {getContent('programs_page_accreditation')}
                  {openFilters.accreditation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFilters.accreditation && (
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {accreditationOptions.map(accreditation => (
                      <label key={accreditation} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAccreditations.includes(accreditation)}
                          onChange={() => handleAccreditationChange(accreditation)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="ml-2 text-sm text-gray-600">{getFilterOptionText(getContent, 'accreditation', accreditation)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Academic Partnership Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('academicPartnership')}
                  className="w-full flex items-center justify-between p-2 text-left font-medium text-primary hover:bg-gray-50 rounded"
                >
                  {getContent('programs_page_academic_partnerships')}
                  {openFilters.academicPartnership ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFilters.academicPartnership && (
                  <div className="mt-2 space-y-2">
                    {academicPartnershipOptions.map(partnership => (
                      <label key={partnership} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAcademicPartnerships.includes(partnership)}
                          onChange={() => handleAcademicPartnershipChange(partnership)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="ml-2 text-sm text-gray-600">{getFilterOptionText(getContent, 'partnership', partnership)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>


            </div>
          </div>

          {/* Programs Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {getContent('programs_page_showing_count').replace('{count}', filteredPrograms.length.toString()).replace('{total}', allPrograms.length.toString())}
              </p>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="text-center py-12">
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
                  <div key={program.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                          {program.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
                        {program.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{getContent('programs_page_program_type_label')}</span> {program.programType}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{getContent('programs_page_speciality_label')}</span> {program.speciality}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{getContent('programs_page_study_time_label')}</span> {program.studyTime}
                        </p>
                      </div>

                      {program.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {program.description}
                        </p>
                      )}

                      {program.accreditations && Array.isArray(program.accreditations) && program.accreditations.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">{getContent('programs_page_accredited_by')}</p>
                          <div className="flex flex-wrap gap-1">
                            {program.accreditations.slice(0, 2).map((acc, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {acc}
                              </span>
                            ))}
                            {program.accreditations.length > 2 && (
                              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                +{program.accreditations.length - 2} {getContent('programs_page_more')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-accent">
                            {program.price.toLocaleString()} SAR
                          </p>
                        </div>
                        <Link
                          href={`/programs/${program.id}`}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
                        >
                          {getContent('programs_page_learn_more')}
                        </Link>
                      </div>
                    </div>
                  </div>
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