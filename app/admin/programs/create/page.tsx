'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../src/firebase/firebase';
import { uploadImageAsDataUrl, uploadFile } from '../../../../src/services/storageService';
import { Calendar, DollarSign, Clock, Award, ImagePlus, Plus, Edit, Trash2, BookOpen, Play, FileText, HelpCircle, Clipboard, Save, ArrowLeft, AlertCircle, Check, Globe, Languages, Upload, X } from 'lucide-react';
import { allAccreditationsAndPartnerships } from '../../../../src/data/optimus-data';

export default function CreateProgramPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  
  // Bilingual form data
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
    benefits_ar: '',
    brochure_en: '', // URL for English brochure
    brochure_ar: '', // URL for Arabic brochure
  });

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ar'>('en');
  
  // Module management state
  const [modules, setModules] = useState<Array<{
    id: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      title_ar?: string;
      description: string;
      description_ar?: string;
      duration: number; // in minutes
      type: 'video' | 'text' | 'quiz' | 'assignment';
      content: string;
      content_ar?: string;
      order: number;
    }>;
  }>>([]);
  
  const [currentModule, setCurrentModule] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: ''
  });
  
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    duration: 0,
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content: '',
    content_ar: ''
  });
  
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [brochureEnFile, setBrochureEnFile] = useState<File | null>(null);
  const [brochureArFile, setBrochureArFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // If not loading and no user, redirect to admin login
    if (!isLoading && !currentUser) {
      router.push('/admin/login');
      return;
    }

    // If user doesn't have programs permission, redirect to admin login
    if (!isLoading && currentUser && userRole !== 'admin' && !hasPermission('programs')) {
      router.push('/admin/login');
    }

    // Debug admin permissions
    const checkAdminRole = async () => {
      try {
        if (currentUser && userRole) {
          const roleStr = String(userRole);
          // For debugging purposes only
          setDebugInfo(`User ID: ${currentUser.uid}, Role: "${roleStr}" (${roleStr.length} chars)`);
          
          // Log the exact bytes for debugging
          const bytes = [];
          for (let i = 0; i < roleStr.length; i++) {
            bytes.push(roleStr.charCodeAt(i));
          }
          console.log('Role bytes:', bytes);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setDebugInfo('Error checking role: ' + (error instanceof Error ? error.message : String(error)));
      }
    };

    if (currentUser) {
      checkAdminRole();
    }
  }, [currentUser, userRole, isLoading, router]);

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

  // Module management functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addModule = () => {
    if (!currentModule.title.trim()) return;
    
    const newModule = {
      id: generateId(),
      title: currentModule.title,
      description: currentModule.description,
      order: modules.length + 1,
      lessons: []
    };
    
    setModules([...modules, newModule]);
    setCurrentModule({ title: '', title_ar: '', description: '', description_ar: '' });
    setShowModuleForm(false);
  };

  const updateModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, title: currentModule.title, description: currentModule.description }
        : module
    ));
    setCurrentModule({ title: '', title_ar: '', description: '', description_ar: '' });
    setEditingModuleId(null);
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const addLesson = (moduleId: string) => {
    if (!currentLesson.title.trim()) return;
    
    const newLesson = {
      id: generateId(),
      title: currentLesson.title,
      description: currentLesson.description,
      duration: currentLesson.duration,
      type: currentLesson.type,
      content: currentLesson.content,
      order: modules.find(m => m.id === moduleId)?.lessons.length || 0 + 1
    };
    
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
    
    setCurrentLesson({ title: '', title_ar: '', description: '', description_ar: '', duration: 0, type: 'video', content: '', content_ar: '' });
    setShowLessonForm(null);
  };

  const updateLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId
                ? { ...lesson, ...currentLesson }
                : lesson
            )
          }
        : module
    ));
    setCurrentLesson({ title: '', title_ar: '', description: '', description_ar: '', duration: 0, type: 'video', content: '', content_ar: '' });
    setEditingLessonId(null);
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const startEditingModule = (module: any) => {
    setCurrentModule({ 
      title: module.title || '', 
      title_ar: module.title_ar || '',
      description: module.description || '',
      description_ar: module.description_ar || ''
    });
    setEditingModuleId(module.id);
  };

  const startEditingLesson = (lesson: any) => {
    setCurrentLesson({
      title: lesson.title || '',
      title_ar: lesson.title_ar || '',
      description: lesson.description || '',
      description_ar: lesson.description_ar || '',
      duration: lesson.duration || 0,
      type: lesson.type || 'video',
      content: lesson.content || '',
      content_ar: lesson.content_ar || ''
    });
    setEditingLessonId(lesson.id);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={16} className="text-blue-500" />;
      case 'text': return <FileText size={16} className="text-green-500" />;
      case 'quiz': return <HelpCircle size={16} className="text-purple-500" />;
      case 'assignment': return <Clipboard size={16} className="text-orange-500" />;
      default: return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

        setThumbnailFile(file);
        
      // Create preview
        const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      setError('');
    }
  };

  // Add file handlers for brochures
  const handleBrochureEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setBrochureEnFile(file);
      setError('');
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleBrochureArChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setBrochureArFile(file);
      setError('');
    } else {
      alert('Please select a PDF file');
    }
  };

  // Function to save file locally and return public URL
  const saveFileLocally = async (file: File, programId: string, language: 'en' | 'ar'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('programId', programId);
    formData.append('language', language);

    const response = await fetch('/api/upload-brochure', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload brochure');
    }

    const result = await response.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a program');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setIsUploading(true);
    setUploadProgress({});

    try {
      const numericPrice = typeof formData.price === 'string' 
        ? parseFloat(formData.price.replace(/[^0-9.]/g, '')) 
        : formData.price;

      let programData = {
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
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        enrollments: 0,
        thumbnail: 'https://via.placeholder.com/300x200?text=Program+Image'
      };

      const docRef = await addDoc(collection(db, 'programs'), programData);
      
      // Upload files
      const updateData: any = {};
      
      // Upload thumbnail
      if (thumbnailFile) {
        try {
          setUploadProgress(prev => ({...prev, thumbnail: 0}));
          if (thumbnailFile.size <= 100 * 1024) {
            const dataUrl = await uploadImageAsDataUrl(thumbnailFile);
            updateData.thumbnail = dataUrl;
            setUploadProgress(prev => ({...prev, thumbnail: 100}));
          } else {
            setError('Note: Image was too large. Program created with placeholder image.');
          }
        } catch (uploadError) {
          console.error('Error uploading thumbnail:', uploadError);
          setError('Program created, but failed to upload image. You can edit the program to add an image later.');
        }
      }

          // Upload brochures locally and get download URLs
    if (brochureEnFile) {
      try {
        setUploadProgress(prev => ({...prev, brochure_en: 0}));
        const brochureEnUrl = await saveFileLocally(brochureEnFile, docRef.id, 'en');
        updateData.brochure_en = brochureEnUrl;
        setUploadProgress(prev => ({...prev, brochure_en: 100}));
        console.log('English brochure uploaded successfully:', brochureEnUrl);
      } catch (uploadError: any) {
        console.error('Error uploading English brochure:', uploadError);
        setError(`Program created, but failed to upload English brochure: ${uploadError.message}`);
      }
    }

    if (brochureArFile) {
      try {
        setUploadProgress(prev => ({...prev, brochure_ar: 0}));
        const brochureArUrl = await saveFileLocally(brochureArFile, docRef.id, 'ar');
        updateData.brochure_ar = brochureArUrl;
        setUploadProgress(prev => ({...prev, brochure_ar: 100}));
        console.log('Arabic brochure uploaded successfully:', brochureArUrl);
      } catch (uploadError: any) {
        console.error('Error uploading Arabic brochure:', uploadError);
        setError(`Program created, but failed to upload Arabic brochure: ${uploadError.message}`);
      }
    }

    // Update document with uploaded files
    if (Object.keys(updateData).length > 0) {
      await updateDoc(doc(db, 'programs', docRef.id), updateData);
      console.log('Program updated with uploaded files');
    }
      
      setSuccess(`Program "${formData.title}" created successfully!`);
      
      // Reset form
      setFormData({
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
        benefits_ar: '',
        brochure_en: '',
        brochure_ar: ''
      });
      setThumbnailFile(null);
      setThumbnailPreview('');
      setBrochureEnFile(null);
      setBrochureArFile(null);
      setUploadProgress({});
      
      setTimeout(() => {
        router.push('/admin/programs');
      }, 2000);
    } catch (err) {
      console.error('Error creating program:', err);
      setError(err instanceof Error ? `Failed to create program: ${err.message}` : 'Failed to create program. Please try again.');
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // This will be redirected by the useEffect
  }

  const getCurrentFields = () => {
    return activeLanguage === 'en' ? {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: formData.category,
      programType: formData.programType,
      speciality: formData.speciality,
      studyTime: formData.studyTime,
      requirements: formData.requirements,
      benefits: formData.benefits,
    } : {
      title: formData.title_ar,
      description: formData.description_ar,
      shortDescription: formData.shortDescription_ar,
      category: formData.category_ar,
      programType: formData.programType_ar,
      speciality: formData.speciality_ar,  
      studyTime: formData.studyTime_ar,
      requirements: formData.requirements_ar,
      benefits: formData.benefits_ar,
    };
  };

  const getFieldName = (field: string) => {
    return activeLanguage === 'ar' ? `${field}_ar` : field;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Program
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/programs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Programs
          </Link>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <Check size={20} className="mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
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
                <option value={activeLanguage === 'en' ? 'Accounting & Finance Management' : 'إدارة المحاسبة والمالية'}>
                  {activeLanguage === 'en' ? 'Accounting & Finance Management' : 'إدارة المحاسبة والمالية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Marketing Management' : 'إدارة التسويق'}>
                  {activeLanguage === 'en' ? 'Marketing Management' : 'إدارة التسويق'}
                </option>
                <option value={activeLanguage === 'en' ? 'Logistics & Supply Chain Management' : 'إدارة اللوجستيات وسلسلة التوريد'}>
                  {activeLanguage === 'en' ? 'Logistics & Supply Chain Management' : 'إدارة اللوجستيات وسلسلة التوريد'}
                </option>
                <option value={activeLanguage === 'en' ? 'Human Resources Management' : 'إدارة الموارد البشرية'}>
                  {activeLanguage === 'en' ? 'Human Resources Management' : 'إدارة الموارد البشرية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Quality Management' : 'إدارة الجودة'}>
                  {activeLanguage === 'en' ? 'Quality Management' : 'إدارة الجودة'}
                </option>
                <option value={activeLanguage === 'en' ? 'Accounting & Finance' : 'المحاسبة والمالية'}>
                  {activeLanguage === 'en' ? 'Accounting & Finance' : 'المحاسبة والمالية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Entrepreneurship & Innovation' : 'ريادة الأعمال والابتكار'}>
                  {activeLanguage === 'en' ? 'Entrepreneurship & Innovation' : 'ريادة الأعمال والابتكار'}
                </option>
                <option value={activeLanguage === 'en' ? 'International Business Management' : 'إدارة الأعمال الدولية'}>
                  {activeLanguage === 'en' ? 'International Business Management' : 'إدارة الأعمال الدولية'}
                </option>
                <option value={activeLanguage === 'en' ? 'Sports Management' : 'إدارة الرياضة'}>
                  {activeLanguage === 'en' ? 'Sports Management' : 'إدارة الرياضة'}
                </option>
                <option value={activeLanguage === 'en' ? 'Hospitality & Events Management' : 'إدارة الضيافة والفعاليات'}>
                  {activeLanguage === 'en' ? 'Hospitality & Events Management' : 'إدارة الضيافة والفعاليات'}
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
              rows={3}
              value={getCurrentFields().requirements}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? 'Prerequisites or requirements for enrollment' : 'المتطلبات المسبقة أو شروط التسجيل'}
            />
          </div>

          <div>
            <label htmlFor={getFieldName('benefits')} className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Benefits' : 'الفوائد'}
            </label>
            <textarea
              id={getFieldName('benefits')}
              name={getFieldName('benefits')}
              rows={3}
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
            
            {/* Accreditations First - PRIORITY */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-primary mb-4">
                {activeLanguage === 'en' ? '🏆 Accreditations (PRIORITY)' : '🏆 الاعتمادات (أولوية)'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-primary/10 rounded-xl border-2 border-primary/30">
                {allAccreditationsAndPartnerships.filter(item => item.type === 'accreditation').map((item) => (
                  <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md border-2 border-primary/20">
                    <input
                      id={`accreditation-${item.id}`}
                      name="accreditations"
                      type="checkbox"
                      checked={formData.accreditations.includes(item.name)}
                      onChange={() => handleAccreditationToggle(item.name)}
                      className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`accreditation-${item.id}`} className="ml-4 block text-sm text-gray-700 flex items-center font-bold">
                      <img 
                        src={item.logo} 
                        alt={item.name}
                        className="w-8 h-8 object-contain mr-4"
                      />
                      {item.name}
                    </label>
                  </div>
                ))}
                  </div>
                </div>

            {/* Academic Partnerships */}
                  <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">
                {activeLanguage === 'en' ? '🏛️ Academic Partnerships' : '🏛️ الشراكات الأكاديمية'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allAccreditationsAndPartnerships.filter(item => item.type === 'partnership').map((item) => (
                  <div key={item.id} className="flex items-center p-3 rounded bg-gray-50">
                    <input
                      id={`partnership-${item.id}`}
                      name="accreditations"
                      type="checkbox"
                      checked={formData.accreditations.includes(item.name)}
                      onChange={() => handleAccreditationToggle(item.name)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`partnership-${item.id}`} className="ml-2 block text-sm text-gray-700 flex items-center">
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

          {/* Thumbnail Upload */}
                    <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Program Thumbnail' : 'صورة البرنامج'}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-md"
                    />
                      <button
                        type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                      }}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                      </button>
                    </div>
                ) : (
                  <>
                    <ImagePlus size={48} className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="thumbnail"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>{activeLanguage === 'en' ? 'Upload a file' : 'ارفع ملف'}</span>
                          <input
                          id="thumbnail"
                          name="thumbnail"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                      <p className={activeLanguage === 'ar' ? 'mr-1' : 'ml-1'}>
                        {activeLanguage === 'en' ? 'or drag and drop' : 'أو اسحب وأفلت'}
                      </p>
                        </div>
                    <p className="text-xs text-gray-500">
                      {activeLanguage === 'en' ? 'PNG, JPG, GIF up to 10MB' : 'PNG, JPG, GIF حتى 10 ميجابايت'}
                    </p>
                  </>
                )}
                        </div>
                        </div>
                      </div>

          {/* Brochure Upload */}
                        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {activeLanguage === 'en' ? 'Program Brochures (Optional)' : 'كتيبات البرنامج (اختياري)'}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* English Brochure Upload */}
              <div>
                <label htmlFor="brochure_en" className="block text-sm font-medium text-gray-600 mb-2">
                  {activeLanguage === 'en' ? '📄 English Brochure' : '📄 الكتيب الإنجليزي'}
                </label>
                <input
                  id="brochure_en"
                  name="brochure_en"
                  type="file"
                  accept="application/pdf"
                  onChange={handleBrochureEnChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeLanguage === 'en' ? 'Upload a PDF file' : 'ارفع ملف PDF'}
                </p>
              </div>

              {/* Arabic Brochure Upload */}
              <div>
                <label htmlFor="brochure_ar" className="block text-sm font-medium text-gray-600 mb-2">
                  {activeLanguage === 'en' ? '📄 Arabic Brochure' : '📄 الكتيب العربي'}
                </label>
                <input
                  id="brochure_ar"
                  name="brochure_ar"
                  type="file"
                  accept="application/pdf"
                  onChange={handleBrochureArChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeLanguage === 'en' ? 'Upload a PDF file' : 'ارفع ملف PDF'}
                </p>
              </div>
                          </div>
          </div>

          {/* Program Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {activeLanguage === 'en' ? 'Program Status' : 'حالة البرنامج'}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-draft"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleChange}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                />
                <label htmlFor="status-draft" className="ml-2 block text-sm text-gray-900">
                  <span className="font-medium">{activeLanguage === 'en' ? 'Draft' : 'مسودة'}</span>
                  <div className="text-xs text-gray-500">
                    {activeLanguage === 'en' ? 'Hidden from website' : 'مخفي من الموقع'}
                  </div>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-published"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={handleChange}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                />
                <label htmlFor="status-published" className="ml-2 block text-sm text-gray-900">
                  <span className="font-medium">{activeLanguage === 'en' ? 'Published' : 'منشور'}</span>
                  <div className="text-xs text-gray-500">
                    {activeLanguage === 'en' ? 'Visible on website' : 'مرئي على الموقع'}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Upload Progress Display */}
          {isUploading && Object.keys(uploadProgress).length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-800 mb-3">Upload Progress:</h4>
              {Object.entries(uploadProgress).map(([key, progress]) => (
                <div key={key} className="mb-2">
                  <div className="flex justify-between text-sm text-blue-700">
                    <span>{key === 'thumbnail' ? 'Thumbnail' : 'English Brochure'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/programs"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {activeLanguage === 'en' ? 'Cancel' : 'إلغاء'}
            </Link>
            <button
              type="button"
              onClick={(e) => {
                setFormData(prev => ({ ...prev, status: 'draft' }));
                const form = e.currentTarget.closest('form') as HTMLFormElement;
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
              disabled={loading || isUploading}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(loading || isUploading) && formData.status === 'draft' ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700">
                    <div className="border-2 border-gray-300 border-t-transparent rounded-full h-5 w-5"></div>
                  </div>
                  {activeLanguage === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {activeLanguage === 'en' ? 'Save as Draft' : 'حفظ كمسودة'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                setFormData(prev => ({ ...prev, status: 'published' }));
                const form = e.currentTarget.closest('form') as HTMLFormElement;
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
              disabled={loading || isUploading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(loading || isUploading) && formData.status === 'published' ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                    <div className="border-2 border-white border-t-transparent rounded-full h-5 w-5"></div>
                  </div>
                  {activeLanguage === 'en' ? 'Publishing...' : 'جاري النشر...'}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {activeLanguage === 'en' ? 'Publish Program' : 'نشر البرنامج'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 