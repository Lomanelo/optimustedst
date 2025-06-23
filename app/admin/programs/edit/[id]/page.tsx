'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/auth-context';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../src/firebase/firebase';
import { uploadImageAsDataUrl } from '../../../../../src/services/storageService';
import { Save, ArrowLeft, AlertCircle, ImagePlus, Check, Globe, Languages, Upload, X, FileText } from 'lucide-react';
import { allAccreditationsAndPartnerships } from '../../../../../src/data/optimus-data';

interface Program {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  speciality?: string;
  programType?: string;
  studyTime?: string;
  price: number;
  thumbnail?: string;
  status: 'published' | 'draft';
  accreditation?: string;
  requirements?: string;
  benefits?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

export default function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id: programId } = resolvedParams;
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  // Bilingual form data (matching create page structure)
  const [formData, setFormData] = useState({
    // English fields
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    programType: '',
    speciality: '',
    studyTime: '',
    price: '',
    accreditations: [] as string[],
    requirements: '',
    benefits: '',
    status: 'draft',
    // Arabic fields
    title_ar: '',
    description_ar: '',
    shortDescription_ar: '',
    category_ar: '',
    programType_ar: '',
    speciality_ar: '',
    studyTime_ar: '',
    requirements_ar: '',
    benefits_ar: ''
  });

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ar'>('en');
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [brochureEnFile, setBrochureEnFile] = useState<File | null>(null);
  const [brochureArFile, setBrochureArFile] = useState<File | null>(null);
  const [existingBrochureEn, setExistingBrochureEn] = useState<string>('');
  const [existingBrochureAr, setExistingBrochureAr] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch program data if user is authenticated and has programs permission
    if (!isLoading && currentUser && (userRole === 'admin' || hasPermission('programs')) && programId) {
      fetchProgram(programId);
    }
  }, [currentUser, userRole, hasPermission, isLoading, router, programId]);

  const fetchProgram = async (programId: string) => {
    try {
      setPageLoading(true);
      const programDoc = await getDoc(doc(db, 'programs', programId));
      
      if (programDoc.exists()) {
        const programData = { id: programDoc.id, ...programDoc.data() } as Program;
        setProgram(programData);
        
        // Initialize form data (bilingual)
        setFormData({
          // English fields
          title: programData.title || '',
          description: programData.description || '',
          shortDescription: programData.shortDescription || '',
          category: programData.category || '',
          programType: programData.type || programData.level || '',
          speciality: programData.specialization || programData.speciality || '',
          studyTime: programData.duration || programData.studyTime || '',
          price: typeof programData.price === 'number' ? programData.price.toString() : programData.price || '',
          accreditations: programData.accreditations || [],
          requirements: Array.isArray(programData.requirements) ? programData.requirements.join('\n') : programData.requirements || '',
          benefits: Array.isArray(programData.whatYouWillLearn) ? programData.whatYouWillLearn.join('\n') : programData.benefits || '',
          status: programData.status || 'draft',
          // Arabic fields
          title_ar: programData.title_ar || '',
          description_ar: programData.description_ar || '',
          shortDescription_ar: programData.shortDescription_ar || '',
          category_ar: programData.category_ar || '',
          programType_ar: programData.type_ar || '',
          speciality_ar: programData.specialization_ar || '',
          studyTime_ar: programData.duration_ar || '',
          requirements_ar: Array.isArray(programData.requirements_ar) ? programData.requirements_ar.join('\n') : programData.requirements_ar || '',
          benefits_ar: Array.isArray(programData.whatYouWillLearn_ar) ? programData.whatYouWillLearn_ar.join('\n') : programData.benefits_ar || ''
        });
        
        // Set thumbnail preview if available
        if (programData.thumbnail) {
          setThumbnailPreview(programData.thumbnail);
        }
        if (programData.brochure_en) {
          setExistingBrochureEn(programData.brochure_en);
        }
        if (programData.brochure_ar) {
          setExistingBrochureAr(programData.brochure_ar);
        }
      } else {
        setError('Program not found');
        setTimeout(() => router.push('/admin/programs'), 2000);
      }
    } catch (err) {
      console.error('Error fetching program:', err);
      setError('Failed to load program data');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccreditationToggle = (accreditation: string) => {
    setFormData(prev => ({
      ...prev,
      accreditations: prev.accreditations.includes(accreditation)
        ? prev.accreditations.filter(a => a !== accreditation)
        : [...prev.accreditations, accreditation]
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Enforce a strict file size limit - 100KB max
      const maxSize = 100 * 1024; // 100KB
      if (file.size > maxSize) {
        setError(`Image too large (${(file.size / 1024).toFixed(1)}KB). Maximum size is 100KB.`);
        return;
      }
      
      setError(''); // Clear previous errors
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setThumbnailPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrochureEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Brochure file must be less than 20MB');
        return;
      }

      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file for the brochure');
        return;
      }

      setBrochureEnFile(file);
      setError('');
    }
  };

  const handleBrochureArChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Brochure file must be less than 20MB');
        return;
      }

      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file for the brochure');
        return;
      }

      setBrochureArFile(file);
      setError('');
    }
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return program?.thumbnail || '';
    try {
      // Use data URL method for simplicity
      return await uploadImageAsDataUrl(thumbnailFile);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  };

  // Helper functions for bilingual support (matching create page)
  const getCurrentFields = () => {
    if (activeLanguage === 'ar') {
      return {
        title: formData.title_ar,
        description: formData.description_ar,
        shortDescription: formData.shortDescription_ar,
        category: formData.category_ar,
        programType: formData.programType_ar,
        speciality: formData.speciality_ar,
        studyTime: formData.studyTime_ar,
        requirements: formData.requirements_ar,
        benefits: formData.benefits_ar
      };
    }
    return {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: formData.category,
      programType: formData.programType,
      speciality: formData.speciality,
      studyTime: formData.studyTime,
      requirements: formData.requirements,
      benefits: formData.benefits
    };
  };

  const getFieldName = (field: string) => {
    return activeLanguage === 'ar' ? `${field}_ar` : field;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!program) {
      setError('Program data not found');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Validate form
      if (!formData.title.trim()) {
        setError('Program title is required');
        return;
      }
      
      // Upload files if changed
      let thumbnailUrl = program.thumbnail || '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }

      let brochureEnUrl = existingBrochureEn;
      if (brochureEnFile) {
        brochureEnUrl = await uploadImageAsDataUrl(brochureEnFile);
      }

      let brochureArUrl = existingBrochureAr;
      if (brochureArFile) {
        brochureArUrl = await uploadImageAsDataUrl(brochureArFile);
      }
      
      // Prepare program data (matching create page structure)
      const numericPrice = typeof formData.price === 'string' 
        ? parseFloat(formData.price.replace(/[^0-9.]/g, '')) 
        : formData.price;

      const programData = {
        // English fields
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        level: formData.programType,
        type: formData.programType,
        specialization: formData.speciality,
        duration: formData.studyTime,
        price: isNaN(numericPrice) ? 0 : numericPrice,
        requirements: formData.requirements ? [formData.requirements] : [],
        whatYouWillLearn: formData.benefits ? [formData.benefits] : [],
        status: formData.status,
        // Arabic fields
        title_ar: formData.title_ar,
        description_ar: formData.description_ar,
        shortDescription_ar: formData.shortDescription_ar,
        category_ar: formData.category_ar,
        type_ar: formData.programType_ar,
        specialization_ar: formData.speciality_ar,
        duration_ar: formData.studyTime_ar,
        requirements_ar: formData.requirements_ar ? [formData.requirements_ar] : [],
        whatYouWillLearn_ar: formData.benefits_ar ? [formData.benefits_ar] : [],
        // Common fields
        languages: ['en', 'ar'] as ('en' | 'ar')[],
        durationWeeks: 12, // Default value
        thumbnail: thumbnailUrl,
        brochure_en: brochureEnUrl,
        brochure_ar: brochureArUrl,
        updatedAt: serverTimestamp()
      };
      
      // Update program in Firestore
      await updateDoc(doc(db, 'programs', program.id), programData);
      
      setSuccess('Program updated successfully');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/programs');
      }, 1500);
    } catch (err) {
      console.error('Error updating program:', err);
      setError('Failed to update program');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href="/admin/programs" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Programs
          </Link>
          <h1 className="text-2xl font-bold text-primary">Edit Program</h1>
        </div>
      </div>



      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <div className="flex">
              <Check size={20} className="mr-2" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Language Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveLanguage('en')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'en' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe size={16} className="mr-2" />
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLanguage('ar')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'ar' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Languages size={16} className="mr-2" />
            العربية
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={getFieldName('title')} className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Program Title *' : 'عنوان البرنامج *'}
              </label>
              <input
                type="text"
                name={getFieldName('title')}
                id={getFieldName('title')}
                required
                value={getCurrentFields().title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={activeLanguage === 'en' ? 'e.g. Master of Business Administration' : 'مثال: ماجستير إدارة الأعمال'}
              />
            </div>

            <div>
              <label htmlFor={getFieldName('category')} className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Category *' : 'الفئة *'}
              </label>
              <select
                id={getFieldName('category')}
                name={getFieldName('category')}
                required
                value={getCurrentFields().category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">{activeLanguage === 'en' ? 'Select a category' : 'اختر فئة'}</option>
                <option value={activeLanguage === 'en' ? 'Business' : 'الأعمال'}>
                  {activeLanguage === 'en' ? 'Business' : 'الأعمال'}
                </option>
                <option value={activeLanguage === 'en' ? 'Technology' : 'التكنولوجيا'}>
                  {activeLanguage === 'en' ? 'Technology' : 'التكنولوجيا'}
                </option>
                <option value={activeLanguage === 'en' ? 'Healthcare' : 'الرعاية الصحية'}>
                  {activeLanguage === 'en' ? 'Healthcare' : 'الرعاية الصحية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Education' : 'التعليم'}>
                  {activeLanguage === 'en' ? 'Education' : 'التعليم'}
                </option>
                <option value={activeLanguage === 'en' ? 'Arts' : 'الفنون'}>
                  {activeLanguage === 'en' ? 'Arts & Humanities' : 'الفنون والعلوم الإنسانية'}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={getFieldName('shortDescription')} className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Short Description *' : 'وصف مختصر *'}
            </label>
            <textarea
              id={getFieldName('shortDescription')}
              name={getFieldName('shortDescription')}
              rows={2}
              required
              value={getCurrentFields().shortDescription}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? 'A brief summary of the program (displayed in listings)' : 'ملخص مختصر للبرنامج (يظهر في القوائم)'}
            />
          </div>

          <div>
            <label htmlFor={getFieldName('description')} className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Full Description *' : 'الوصف الكامل *'}
            </label>
            <textarea
              id={getFieldName('description')}
              name={getFieldName('description')}
              rows={6}
              required
              value={getCurrentFields().description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? 'Provide a detailed description of the program' : 'قدم وصفاً مفصلاً للبرنامج'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={getFieldName('programType')} className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Program Type *' : 'نوع البرنامج *'}
              </label>
              <select
                id={getFieldName('programType')}
                name={getFieldName('programType')}
                required
                value={getCurrentFields().programType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">{activeLanguage === 'en' ? 'Select program type' : 'اختر نوع البرنامج'}</option>
                <option value={activeLanguage === 'en' ? 'MBA' : 'ماجستير إدارة أعمال'}>
                  {activeLanguage === 'en' ? 'MBA' : 'ماجستير إدارة أعمال'}
                </option>
                <option value={activeLanguage === 'en' ? 'PHD' : 'دكتوراه'}>
                  {activeLanguage === 'en' ? 'PHD' : 'دكتوراه'}
                </option>
              </select>
            </div>

            <div>
              <label htmlFor={getFieldName('speciality')} className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Speciality *' : 'التخصص *'}
              </label>
              <select
                id={getFieldName('speciality')}
                name={getFieldName('speciality')}
                required
                value={getCurrentFields().speciality}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">{activeLanguage === 'en' ? 'Select speciality' : 'اختر التخصص'}</option>
                <option value={activeLanguage === 'en' ? 'Digital Transformation' : 'التحول الرقمي'}>
                  {activeLanguage === 'en' ? 'Digital Transformation' : 'التحول الرقمي'}
                </option>
                <option value={activeLanguage === 'en' ? 'Strategic Management' : 'الإدارة الاستراتيجية'}>
                  {activeLanguage === 'en' ? 'Strategic Management' : 'الإدارة الاستراتيجية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Healthcare Management' : 'إدارة الرعاية الصحية'}>
                  {activeLanguage === 'en' ? 'Healthcare Management' : 'إدارة الرعاية الصحية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Project Management' : 'إدارة المشاريع'}>
                  {activeLanguage === 'en' ? 'Project Management' : 'إدارة المشاريع'}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={getFieldName('studyTime')} className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Duration *' : 'المدة *'}
              </label>
              <input
                type="text"
                name={getFieldName('studyTime')}
                id={getFieldName('studyTime')}
                required
                value={getCurrentFields().studyTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={activeLanguage === 'en' ? 'e.g. 12 months' : 'مثال: 12 شهر'}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Price (SAR) *' : 'السعر (ريال سعودي) *'}
              </label>
              <input
                type="text"
                name="price"
                id="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={activeLanguage === 'en' ? 'e.g. 25000' : 'مثال: 25000'}
              />
            </div>
          </div>

          <div>
            <label htmlFor={getFieldName('requirements')} className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Requirements' : 'المتطلبات'}
            </label>
            <textarea
              id={getFieldName('requirements')}
              name={getFieldName('requirements')}
              rows={4}
              value={getCurrentFields().requirements}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? 'Prerequisites or requirements for enrollment' : 'المتطلبات الأساسية أو متطلبات التسجيل'}
            />
          </div>

          <div>
            <label htmlFor={getFieldName('benefits')} className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Benefits' : 'الفوائد'}
            </label>
            <textarea
              id={getFieldName('benefits')}
              name={getFieldName('benefits')}
              rows={4}
              value={getCurrentFields().benefits}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? 'What students will gain from this program' : 'ما سيحصل عليه الطلاب من هذا البرنامج'}
            />
          </div>

          {/* Accreditations & Partnerships */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {activeLanguage === 'en' ? 'Accreditations & Partnerships' : 'الاعتمادات والشراكات'}
            </label>
            
            {/* Partnerships First - Priority */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-primary mb-3">
                {activeLanguage === 'en' ? '🏛️ Academic Partnerships (Priority)' : '🏛️ الشراكات الأكاديمية (أولوية)'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                {allAccreditationsAndPartnerships.filter(item => item.type === 'partnership').map((item) => (
                  <div key={item.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                    <input
                      id={`accreditation-${item.id}`}
                      name="accreditations"
                      type="checkbox"
                      checked={formData.accreditations.includes(item.name)}
                      onChange={() => handleAccreditationToggle(item.name)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`accreditation-${item.id}`} className="ml-3 block text-sm text-gray-700 flex items-center font-medium">
                      <img 
                        src={item.logo} 
                        alt={item.name}
                        className="w-6 h-6 object-contain mr-3"
                      />
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditations */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">
                {activeLanguage === 'en' ? '📜 Accreditations' : '📜 الاعتمادات'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allAccreditationsAndPartnerships.filter(item => item.type === 'accreditation').map((item) => (
                  <div key={item.id} className="flex items-center p-2 rounded">
                    <input
                      id={`accreditation-${item.id}`}
                      name="accreditations"
                      type="checkbox"
                      checked={formData.accreditations.includes(item.name)}
                      onChange={() => handleAccreditationToggle(item.name)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`accreditation-${item.id}`} className="ml-2 block text-sm text-gray-700 flex items-center">
                      <img 
                        src={item.logo} 
                        alt={item.name}
                        className="w-4 h-4 object-contain mr-2"
                      />
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Program Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeLanguage === 'en' ? 'Program Thumbnail' : 'صورة البرنامج'}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img src={thumbnailPreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview('');
                        setThumbnailFile(null);
                      }}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="thumbnail-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>{activeLanguage === 'en' ? 'Upload a file' : 'رفع ملف'}</span>
                    <input
                      id="thumbnail-upload"
                      name="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">{activeLanguage === 'en' ? 'or drag and drop' : 'أو اسحب وأفلت'}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {activeLanguage === 'en' ? 'PNG, JPG, GIF up to 10MB' : 'PNG, JPG, GIF حتى 10MB'}
                </p>
              </div>
            </div>
          </div>

          {/* Brochure Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {activeLanguage === 'en' ? 'Program Brochures (Optional)' : 'كتيبات البرنامج (اختياري)'}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* English Brochure */}
              <div>
                <label htmlFor="brochure-en" className="block text-sm font-medium text-gray-600 mb-2">
                  {activeLanguage === 'en' ? '📄 English Brochure' : '📄 الكتيب الإنجليزي'}
                </label>
                <div className="border-2 border-gray-300 border-dashed rounded-md p-4">
                  {brochureEnFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={20} className="text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">{brochureEnFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBrochureEnFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : existingBrochureEn ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={20} className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{activeLanguage === 'en' ? 'Current brochure uploaded' : 'الكتيب الحالي مرفوع'}</span>
                      </div>
                      <a 
                        href={existingBrochureEn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark text-sm"
                      >
                        {activeLanguage === 'en' ? 'View' : 'عرض'}
                      </a>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <label
                        htmlFor="brochure-en"
                        className="cursor-pointer text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        {activeLanguage === 'en' ? 'Upload English PDF' : 'ارفع ملف PDF إنجليزي'}
                        <input
                          id="brochure-en"
                          name="brochure-en"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleBrochureEnChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF up to 20MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Arabic Brochure */}
              <div>
                <label htmlFor="brochure-ar" className="block text-sm font-medium text-gray-600 mb-2">
                  {activeLanguage === 'en' ? '📄 Arabic Brochure' : '📄 الكتيب العربي'}
                </label>
                <div className="border-2 border-gray-300 border-dashed rounded-md p-4">
                  {brochureArFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={20} className="text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">{brochureArFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBrochureArFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : existingBrochureAr ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={20} className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{activeLanguage === 'en' ? 'Current brochure uploaded' : 'الكتيب الحالي مرفوع'}</span>
                      </div>
                      <a 
                        href={existingBrochureAr} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark text-sm"
                      >
                        {activeLanguage === 'en' ? 'View' : 'عرض'}
                      </a>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <label
                        htmlFor="brochure-ar"
                        className="cursor-pointer text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        {activeLanguage === 'en' ? 'Upload Arabic PDF' : 'ارفع ملف PDF عربي'}
                        <input
                          id="brochure-ar"
                          name="brochure-ar"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleBrochureArChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF up to 20MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/programs"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {activeLanguage === 'en' ? 'Cancel' : 'إلغاء'}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                    <div className="border-2 border-white border-t-transparent rounded-full h-5 w-5"></div>
                  </div>
                  {activeLanguage === 'en' ? 'Updating...' : 'جاري التحديث...'}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {activeLanguage === 'en' ? 'Update Program' : 'تحديث البرنامج'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 