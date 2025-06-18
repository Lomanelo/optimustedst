'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../src/firebase/firebase';
import { uploadImageAsDataUrl } from '../../../../src/services/storageService';
import { Calendar, DollarSign, Clock, Award, ImagePlus, Plus, Edit, Trash2, BookOpen, Play, FileText, HelpCircle, Clipboard, Save, ArrowLeft, AlertCircle, Check } from 'lucide-react';

export default function CreateProgramPage() {
  const { currentUser, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    status: 'draft'
  });
  
  // Module management state
  const [modules, setModules] = useState<Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      description: string;
      duration: number; // in minutes
      type: 'video' | 'text' | 'quiz' | 'assignment';
      content: string;
      order: number;
    }>;
  }>>([]);
  
  const [currentModule, setCurrentModule] = useState({
    title: '',
    description: ''
  });
  
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    duration: 0,
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content: ''
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
    setCurrentModule({ title: '', description: '' });
    setShowModuleForm(false);
  };

  const updateModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, title: currentModule.title, description: currentModule.description }
        : module
    ));
    setCurrentModule({ title: '', description: '' });
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
    
    setCurrentLesson({ title: '', description: '', duration: 0, type: 'video', content: '' });
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
    setCurrentLesson({ title: '', description: '', duration: 0, type: 'video', content: '' });
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Enforce a strict file size limit - 100KB max
      const maxSize = 100 * 1024; // 100KB
      if (file.size > maxSize) {
        setError(`Image too large (${(file.size / 1024).toFixed(1)}KB). Maximum size is 100KB.`);
        // Still set the file so the user can see the size warning
        setThumbnailFile(file);
        
        // Create preview anyway to show what they selected
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            setThumbnailPreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
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

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile || !currentUser) {
      return '';
    }
    
    try {
      // Use the uploadImageAsDataUrl function from our storage service
      return await uploadImageAsDataUrl(thumbnailFile);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
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
      // Convert price to number if it's a string
      const numericPrice = typeof formData.price === 'string' 
        ? parseFloat(formData.price.replace(/[^0-9.]/g, '')) 
        : formData.price;

      // Basic program data - without the large image data
      let programData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        programType: formData.programType,
        speciality: formData.speciality,
        studyTime: formData.studyTime,
        price: isNaN(numericPrice) ? 0 : numericPrice,
        accreditations: formData.accreditations,
        requirements: formData.requirements,
        benefits: formData.benefits,
        status: formData.status,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        modules: modules,
        enrollments: 0,
        // Use a placeholder image initially
        thumbnail: 'https://via.placeholder.com/300x200?text=Program+Image'
      };

      // Add the program to Firestore first with placeholder image
      const docRef = await addDoc(collection(db, 'programs'), programData);
      console.log('Program created with ID:', docRef.id);
      
      // Attempt to upload thumbnail if provided - this is a separate step to avoid permission issues
      if (thumbnailFile) {
        try {
          // For small files, we can use data URLs
          if (thumbnailFile.size <= 100 * 1024) { // 100KB limit to be safe
            const dataUrl = await uploadImageAsDataUrl(thumbnailFile);
            
            // Update the document with the thumbnail data URL
            // This is a separate operation to avoid document size issues
            await updateDoc(doc(db, 'programs', docRef.id), {
              thumbnail: dataUrl
            });
          } else {
            // Inform the user that the image is too large
            console.warn('Image too large to store directly. Using placeholder image.');
            setError('Note: Image was too large. Program created with placeholder image.');
          }
        } catch (uploadError) {
          console.error('Error uploading thumbnail:', uploadError);
          // Don't fail the whole operation, just note the issue
          setError('Program created, but failed to upload image. You can edit the program to add an image later.');
        }
      }
      
      setSuccess(`Program "${formData.title}" created successfully!`);
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        router.push('/admin/programs');
      }, 2000);
    } catch (err) {
      console.error('Error creating program:', err);
      
      // Provide more helpful error messages
      if (err instanceof Error) {
        if (err.message.includes('permission')) {
          setError('Permission denied. You might not have admin privileges or need to log in again.');
        } else {
          setError(`Failed to create program: ${err.message}`);
        }
      } else {
        setError('Failed to create program. Please try again.');
      }
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

      {/* Form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Program Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g. Master of Business Administration"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="Business">Business</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Arts">Arts & Humanities</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
              Short Description *
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              required
              value={formData.shortDescription}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="A brief summary of the program (displayed in listings)"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Full Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Provide a detailed description of the program"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="programType" className="block text-sm font-medium text-gray-700">
                Program Type *
              </label>
              <select
                id="programType"
                name="programType"
                required
                value={formData.programType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select program type</option>
                <option value="MBA">MBA</option>
                <option value="PHD">PHD</option>
              </select>
            </div>

            <div>
              <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">
                Speciality *
              </label>
              <select
                id="speciality"
                name="speciality"
                required
                value={formData.speciality}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select speciality</option>
                <option value="Digital Transformation">Digital Transformation</option>
                <option value="Strategic Management">Strategic Management</option>
                <option value="Healthcare Management">Healthcare Management</option>
                <option value="Project Management">Project Management</option>
                <option value="Accounting & Finance Management">Accounting & Finance Management</option>
                <option value="Marketing Management">Marketing Management</option>
                <option value="Logistics & Supply Chain Management">Logistics & Supply Chain Management</option>
                <option value="Human Resources Management">Human Resources Management</option>
                <option value="Quality Management">Quality Management</option>
                <option value="Accounting & Finance">Accounting & Finance</option>
                <option value="Entrepreneurship & Innovation">Entrepreneurship & Innovation</option>
                <option value="International Business Management">International Business Management</option>
                <option value="Sports Management">Sports Management</option>
                <option value="Hospitality & Events Management">Hospitality & Events Management</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="studyTime" className="block text-sm font-medium text-gray-700 flex items-center">
                <Clock size={16} className="mr-1 text-primary" />
                Study Time *
              </label>
              <select
                id="studyTime"
                name="studyTime"
                required
                value={formData.studyTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select study time</option>
                <option value="30 hours">30 hours</option>
                <option value="50 hours">50 hours</option>
                <option value="60 hours">60 hours</option>
                <option value="80 hours">80 hours</option>
                <option value="100 hours">100 hours</option>
                <option value="120 hours">120 hours</option>
                <option value="150 hours">150 hours</option>
                <option value="200 hours">200 hours</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="9 months">9 months</option>
                <option value="12 months">12 months</option>
                <option value="18 months">18 months</option>
                <option value="24 months">24 months</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 flex items-center">
                <DollarSign size={16} className="mr-1 text-primary" />
                Price *
              </label>
              <input
                type="text"
                name="price"
                id="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g. 5000 SAR"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center mb-3">
              <Award size={16} className="mr-1 text-primary" />
              Accreditations
            </label>
            <div className="space-y-2">
              {['QUALIFI', 'ATHE', 'ACBSP', 'Bedfordshire', 'Plymouth'].map((accreditation) => (
                <label key={accreditation} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.accreditations.includes(accreditation)}
                    onChange={() => handleAccreditationToggle(accreditation)}
                    className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-700">{accreditation}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Prerequisites or requirements for enrollment"
            />
          </div>

          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
              Benefits
            </label>
            <textarea
              id="benefits"
              name="benefits"
              rows={3}
              value={formData.benefits}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="What students will gain from this program"
            />
          </div>

          {/* Modules Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BookOpen size={20} className="mr-2 text-primary" />
                Program Modules & Lessons
              </h3>
              <button
                type="button"
                onClick={() => setShowModuleForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus size={16} className="mr-1" />
                Add Module
              </button>
            </div>

            {/* Add Module Form */}
            {showModuleForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-3">Add New Module</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Module Title *</label>
                    <input
                      type="text"
                      value={currentModule.title}
                      onChange={(e) => setCurrentModule({...currentModule, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="e.g. Introduction to Project Management"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Module Description</label>
                    <textarea
                      value={currentModule.description}
                      onChange={(e) => setCurrentModule({...currentModule, description: e.target.value})}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Brief description of what this module covers"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={addModule}
                      className="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                    >
                      Add Module
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModuleForm(false);
                        setCurrentModule({ title: '', description: '' });
                      }}
                      className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Module Form */}
            {editingModuleId && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <h4 className="text-md font-medium text-gray-800 mb-3">Edit Module</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Module Title *</label>
                    <input
                      type="text"
                      value={currentModule.title}
                      onChange={(e) => setCurrentModule({...currentModule, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Module Description</label>
                    <textarea
                      value={currentModule.description}
                      onChange={(e) => setCurrentModule({...currentModule, description: e.target.value})}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => updateModule(editingModuleId)}
                      className="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                    >
                      Update Module
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingModuleId(null);
                        setCurrentModule({ title: '', description: '' });
                      }}
                      className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-md font-semibold text-gray-800">
                        Module {moduleIndex + 1}: {module.title}
                      </h4>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowLessonForm(module.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                        title="Add Lesson"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditingModule(module)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Edit Module"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteModule(module.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete Module"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Add Lesson Form */}
                  {showLessonForm === module.id && (
                    <div className="bg-green-50 p-3 rounded-md mb-3 border border-green-200">
                      <h5 className="text-sm font-medium text-gray-800 mb-2">Add New Lesson</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Lesson Title *</label>
                          <input
                            type="text"
                            value={currentLesson.title}
                            onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="e.g. Project Planning Basics"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Type *</label>
                          <select
                            value={currentLesson.type}
                            onChange={(e) => setCurrentLesson({...currentLesson, type: e.target.value as any})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                          >
                            <option value="video">Video</option>
                            <option value="text">Text/Reading</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Duration (minutes)</label>
                          <input
                            type="number"
                            value={currentLesson.duration}
                            onChange={(e) => setCurrentLesson({...currentLesson, duration: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="30"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700">Description</label>
                          <textarea
                            value={currentLesson.description}
                            onChange={(e) => setCurrentLesson({...currentLesson, description: e.target.value})}
                            rows={2}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Brief description of the lesson content"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700">Content/URL</label>
                          <input
                            type="text"
                            value={currentLesson.content}
                            onChange={(e) => setCurrentLesson({...currentLesson, content: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Video URL, document link, or content description"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          type="button"
                          onClick={() => addLesson(module.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                        >
                          Add Lesson
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowLessonForm(null);
                            setCurrentLesson({ title: '', description: '', duration: 0, type: 'video', content: '' });
                          }}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Edit Lesson Form */}
                  {editingLessonId && (
                    <div className="bg-blue-50 p-3 rounded-md mb-3 border border-blue-200">
                      <h5 className="text-sm font-medium text-gray-800 mb-2">Edit Lesson</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Lesson Title *</label>
                          <input
                            type="text"
                            value={currentLesson.title}
                            onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Type *</label>
                          <select
                            value={currentLesson.type}
                            onChange={(e) => setCurrentLesson({...currentLesson, type: e.target.value as any})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                          >
                            <option value="video">Video</option>
                            <option value="text">Text/Reading</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Duration (minutes)</label>
                          <input
                            type="number"
                            value={currentLesson.duration}
                            onChange={(e) => setCurrentLesson({...currentLesson, duration: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700">Description</label>
                          <textarea
                            value={currentLesson.description}
                            onChange={(e) => setCurrentLesson({...currentLesson, description: e.target.value})}
                            rows={2}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700">Content/URL</label>
                          <input
                            type="text"
                            value={currentLesson.content}
                            onChange={(e) => setCurrentLesson({...currentLesson, content: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          type="button"
                          onClick={() => updateLesson(module.id, editingLessonId)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Update Lesson
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLessonId(null);
                            setCurrentLesson({ title: '', description: '', duration: 0, type: 'video', content: '' });
                          }}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons List */}
                  {module.lessons.length > 0 && (
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getLessonIcon(lesson.type)}
                              <div>
                                <h6 className="text-sm font-medium text-gray-800">
                                  Lesson {lessonIndex + 1}: {lesson.title}
                                </h6>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="capitalize">{lesson.type}</span>
                                  {lesson.duration > 0 && <span>{lesson.duration} min</span>}
                                </div>
                                {lesson.description && (
                                  <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => startEditingLesson(lesson)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit Lesson"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLesson(module.id, lesson.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete Lesson"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {module.lessons.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No lessons added yet. Click the + button to add your first lesson.
                    </div>
                  )}
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No modules added yet</p>
                  <p className="text-sm">Start building your program by adding modules and lessons</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <ImagePlus size={16} className="mr-1 text-primary" />
              Program Thumbnail
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <label
                htmlFor="thumbnail"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Choose Image
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {thumbnailFile ? thumbnailFile.name : 'No file chosen'}
              </span>
            </div>
            
            {thumbnailFile && (
              <p className="mt-1 text-xs text-gray-500">
                File size: {(thumbnailFile.size / 1024).toFixed(2)} KB 
                {thumbnailFile.size > 100 * 1024 && (
                  <span className="text-red-600 ml-2 font-medium">
                    (Image too large - maximum size is 100KB)
                  </span>
                )}
              </p>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            {thumbnailPreview && (
              <div className="mt-2">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="h-40 w-auto object-cover rounded-md" 
                />
              </div>
            )}
            
            <p className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Size requirements:</span> Images must be under 100KB.
              <br />
              <span className="italic">Tip: Use a tool like TinyPNG.com to reduce image size before uploading.</span>
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="draft">Draft (not visible to users)</option>
              <option value="published">Published (visible to all users)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin/programs"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 