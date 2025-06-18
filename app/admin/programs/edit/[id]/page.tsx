'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/auth-context';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../src/firebase/firebase';
import { uploadImageAsDataUrl } from '../../../../../src/services/storageService';
import { Save, ArrowLeft, AlertCircle, ImagePlus, Check } from 'lucide-react';

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
  const { currentUser, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
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
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch program data if user is authenticated and an admin
    if (!isLoading && currentUser && userRole === 'admin' && programId) {
      fetchProgram(programId);
    }
  }, [currentUser, userRole, isLoading, router, programId]);

  const fetchProgram = async (programId: string) => {
    try {
      setPageLoading(true);
      const programDoc = await getDoc(doc(db, 'programs', programId));
      
      if (programDoc.exists()) {
        const programData = { id: programDoc.id, ...programDoc.data() } as Program;
        setProgram(programData);
        
        // Initialize form data
        setFormData({
          title: programData.title || '',
          description: programData.description || '',
          shortDescription: programData.shortDescription || '',
          category: programData.category || programData.speciality || '',
          programType: programData.programType || '',
          speciality: programData.speciality || programData.category || '',
          studyTime: programData.studyTime || '',
          price: typeof programData.price === 'number' ? programData.price.toString() : programData.price || '',
          accreditations: programData.accreditations || (programData.accreditation ? [programData.accreditation] : []),
          requirements: programData.requirements || '',
          benefits: programData.benefits || '',
          status: programData.status || 'draft'
        });
        
        // Set thumbnail preview if available
        if (programData.thumbnail) {
          setThumbnailPreview(programData.thumbnail);
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
      
      // Upload thumbnail if changed
      let thumbnailUrl = program.thumbnail || '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }
      
      // Prepare program data
      const programData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        speciality: formData.speciality,
        programType: formData.programType,
        studyTime: formData.studyTime,
        price: parseFloat(formData.price),
        accreditations: formData.accreditations,
        requirements: formData.requirements,
        benefits: formData.benefits,
        thumbnail: thumbnailUrl,
        status: formData.status,
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

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <Check size={16} className="mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {program && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
          {/* Program Details */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Program Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g. MBA in Business Administration"
                />
              </div>
              
              {/* Program Type */}
              <div>
                <label htmlFor="programType" className="block text-sm font-medium text-gray-700 mb-1">
                  Program Type
                </label>
                <select
                  id="programType"
                  name="programType"
                  value={formData.programType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Type</option>
                  <option value="MBA">MBA</option>
                  <option value="PHD">PHD</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
              
              {/* Category/Speciality */}
              <div>
                <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">
                  Speciality
                </label>
                <select
                  id="speciality"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
              
              {/* Study Time */}
              <div>
                <label htmlFor="studyTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Study Time/Duration
                </label>
                <select
                  id="studyTime"
                  name="studyTime"
                  value={formData.studyTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (SAR)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g. 10000"
                />
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              {/* Thumbnail */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image
                </label>
                <div className="flex items-center space-x-4">
                  {thumbnailPreview && (
                    <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="flex items-center">
                      <ImagePlus size={16} className="mr-2" />
                      {thumbnailPreview ? 'Change Image' : 'Upload Image'}
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Maximum file size: 100KB. Recommended dimensions: 300x200px.
                </p>
              </div>
              
              {/* Short Description */}
              <div className="col-span-2">
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Brief summary of the program (appears in listings)"
                />
              </div>
              
              {/* Full Description */}
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Detailed description of the program"
                />
              </div>
              
              {/* Accreditations */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
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
              
              {/* Requirements */}
              <div className="col-span-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Prerequisites and requirements for the program"
                />
              </div>
              
              {/* Benefits */}
              <div className="col-span-2">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                  Benefits
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Key benefits and outcomes of the program"
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Program
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 