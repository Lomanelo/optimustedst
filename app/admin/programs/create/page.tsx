'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../src/firebase/firebase';
import { uploadImageAsDataUrl } from '../../../../src/services/storageService';
import { Calendar, DollarSign, Clock, Award, ImagePlus, Plus, Edit, Trash2, BookOpen, Play, FileText, HelpCircle, Clipboard, Save, ArrowLeft, AlertCircle, Check, Globe, Languages } from 'lucide-react';
import { allAccreditationsAndPartnerships } from '../../../../src/data/optimus-data';

export default function CreateProgramPage() {
  const { currentUser, userRole, isLoading } = useAuth();
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
    benefits_ar: ''
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
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // If not loading and no user, redirect to admin login
    if (!isLoading && !currentUser) {
      router.push('/admin/login');
      return;
    }

    // If user is not an admin, redirect to admin login
    if (!isLoading && currentUser && userRole !== 'admin') {
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
    setCurrentModule({ title: module.title, description: module.description });
    setEditingModuleId(module.id);
  };

  const startEditingLesson = (lesson: any) => {
    setCurrentLesson({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      type: lesson.type,
      content: lesson.content
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a program');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

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
      
      if (thumbnailFile) {
        try {
          if (thumbnailFile.size <= 100 * 1024) {
            const dataUrl = await uploadImageAsDataUrl(thumbnailFile);
            await updateDoc(doc(db, 'programs', docRef.id), {
              thumbnail: dataUrl
            });
          } else {
            setError('Note: Image was too large. Program created with placeholder image.');
          }
        } catch (uploadError) {
          console.error('Error uploading thumbnail:', uploadError);
          setError('Program created, but failed to upload image. You can edit the program to add an image later.');
        }
      }
      
      setSuccess(`Program "${formData.title}" created successfully!`);
      
      setTimeout(() => {
        router.push('/admin/programs');
      }, 2000);
    } catch (err) {
      console.error('Error creating program:', err);
      setError(err instanceof Error ? `Failed to create program: ${err.message}` : 'Failed to create program. Please try again.');
    } finally {
      setLoading(false);
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
                  {activeLanguage === 'en' ? 'Creating...' : 'جاري الإنشاء...'}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {activeLanguage === 'en' ? 'Create Program' : 'إنشاء البرنامج'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 