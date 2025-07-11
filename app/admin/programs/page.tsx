'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
import { Plus, Trash2, Eye, AlertCircle, Bookmark, BookmarkCheck, Filter, ChevronsUpDown, Copy, CheckCircle } from 'lucide-react';
import { doc, deleteDoc, Timestamp, addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';
import { allPrograms as staticPrograms } from '../../../src/data/optimus-data';
import programService, { Program as ServiceProgram } from '../../../src/services/programService';

// Define the Program type
interface Program {
  id: string;
  title: string;
  category?: string;
  speciality?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  studyTime?: string;
  price?: number | string;
  status: 'published' | 'draft';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  courses?: string[];
  enrollments?: number;
  isStatic?: boolean;
  level?: string;
  programType?: string;
  specialization?: string;
  type?: string;
}

export default function AdminProgramsPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [staticPrograms, setStaticPrograms] = useState<Program[]>([]);
  const [adminPrograms, setAdminPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'static'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [statusToggleLoading, setStatusToggleLoading] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch programs if the user is authenticated and has programs permission
    if (!isLoading && currentUser && (userRole === 'admin' || hasPermission('programs'))) {
      // Set up real-time listener for admin programs
      setLoading(true);
      
      // Transform static programs from the imported data
      const staticProgramsList: Program[] = staticPrograms.map(program => ({
        id: program.id,
        title: program.title,
        description: program.description || '',
        shortDescription: program.description ? program.description.substring(0, 150) + '...' : '',
        price: program.price,
        category: program.specialization || '',
        speciality: program.specialization || '',
        duration: program.duration || '',
        studyTime: program.duration || '',
        status: 'published' as const,
        programType: program.level === 'Level 7' ? 'MBA' : program.level === 'Level 8' ? 'PHD' : 'Certificate',
        type: program.type || 'Professional Certificate',
        isStatic: true,
        level: program.level,
        specialization: program.specialization
      }));
      
      setStaticPrograms(staticProgramsList);
      
      const unsubscribe = programService.listenToAdminProgramChanges((adminProgramsList: ServiceProgram[]) => {
        // Set the admin programs
        const transformedAdminPrograms = adminProgramsList.map((p: ServiceProgram) => ({
          ...p,
          isStatic: false
        }));
        
        setAdminPrograms(transformedAdminPrograms);
        
        // Combine both lists - the admin programs and the static templates
        setPrograms([...transformedAdminPrograms, ...staticProgramsList]);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  const handleDeleteClick = (programId: string) => {
    setDeleteConfirmation(programId);
  };

  const confirmDelete = async (programId: string) => {
    try {
      setDeleteLoading(true);
      // Check if this is a static program
      const programToDelete = programs.find(p => p.id === programId);
      
      if (programToDelete?.isStatic) {
        // For static programs, just remove from the UI temporarily
        // They will reappear on page refresh since they're templates
        setStaticPrograms(staticPrograms.filter(p => p.id !== programId));
        setPrograms(programs.filter(p => p.id !== programId));
      } else {
        // Delete from Firestore for admin-created programs
        await programService.deleteProgram(programId);
        // The real-time listener will update the UI automatically
      }
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting program:', err);
      setError('Failed to delete program. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleStatusToggle = async (programId: string, currentStatus: 'published' | 'draft') => {
    try {
      setStatusToggleLoading(programId);
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await programService.updateProgramStatus(programId, newStatus);
      // The real-time listener will update the UI automatically
      setStatusSuccess(`Program status updated to ${newStatus}`);
      setTimeout(() => {
        setStatusSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Error updating program status:', err);
      setError('Failed to update program status. Please try again.');
    } finally {
      setStatusToggleLoading(null);
    }
  };

  const importStaticProgram = async (staticProgram: Program) => {
    try {
      setIsImporting(true);
      setError('');
      
      // Prepare the program data for Firestore
      const programData = {
        title: staticProgram.title,
        description: staticProgram.description || '',
        shortDescription: staticProgram.shortDescription || '',
        category: staticProgram.speciality || staticProgram.specialization || '',
        speciality: staticProgram.speciality || staticProgram.specialization || '',
        level: staticProgram.level || 'Certificate',
        type: staticProgram.type || 'Professional Certificate',
        duration: staticProgram.studyTime || staticProgram.duration || '',
        durationWeeks: 12, // Default value
        price: typeof staticProgram.price === 'string' ? parseFloat(staticProgram.price) : (staticProgram.price || 0),
        status: 'published' as const,
        languages: ['en' as const], // Default language
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        enrollments: 0,
        imported: true,
        originalId: staticProgram.id
      };
      
      // Add to Firestore
      const docId = await programService.createProgram(programData);
      
      // Show success message
      setImportSuccess(`Program "${staticProgram.title}" was successfully imported with ID: ${docId}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setImportSuccess(null);
      }, 5000);
      
    } catch (err) {
      console.error('Error importing program:', err);
      setError('Failed to import program. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Filter and sort functions
  const filteredPrograms = programs
    .filter(program => {
      // Status filter
      if (filterStatus !== 'all' && program.status !== filterStatus) return false;
      
      // Type filter
      if (filterType === 'admin' && program.isStatic) return false;
      if (filterType === 'static' && !program.isStatic) return false;
      
      // Search filter
      if (searchTerm && !program.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Basic sorting by title
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage educational programs, courses, and offerings
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/programs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Link>
        </div>
      </div>

      {/* Success message */}
      {importSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{importSuccess}</span>
        </div>
      )}
      
      {statusSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <CheckCircle size={20} className="mr-2" />
            <span>{statusSuccess}</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter Programs:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Status filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              
              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'admin' | 'static')}
                className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Types</option>
                <option value="admin">Admin Created</option>
                <option value="static">Template Programs</option>
              </select>
              
              {/* Sort order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-1 border border-gray-300 rounded-md shadow-sm py-1 px-3 text-sm bg-white hover:bg-gray-50"
              >
                <span>Sort</span>
                <ChevronsUpDown className="h-4 w-4" />
              </button>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm py-1 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Programs list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {filteredPrograms.length === 0 ? (
            <li className="py-12">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new program or adjusting your filters.
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/programs/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create Program
                  </Link>
                </div>
              </div>
            </li>
          ) : (
            filteredPrograms.map((program) => (
              <li key={program.id} className={`px-4 py-5 ${program.isStatic ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 mr-2">{program.title}</h3>
                      {program.status === 'draft' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Bookmark className="w-3 h-3 mr-1" />
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <BookmarkCheck className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      )}
                      {program.isStatic && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                          Template
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-1">Type:</span> 
                        {program.programType || program.type || 'N/A'}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-1">Speciality:</span> 
                        {program.speciality || program.specialization || 'N/A'}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-1">Price:</span> 
                        {program.price && typeof program.price === 'number' 
                          ? `$${program.price.toLocaleString()}` 
                          : program.price || 'N/A'}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-1">Duration:</span> 
                        {program.studyTime || program.duration || 'N/A'}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {program.shortDescription || (program.description ? `${program.description.substring(0, 150)}...` : '')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {program.isStatic ? (
                      <>
                        <button
                          onClick={() => importStaticProgram(program)}
                          disabled={isImporting}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          title="Import as Admin Program"
                        >
                          <Copy className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/programs/${program.id}`}
                          target="_blank"
                          className="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          title="View Program"
                        >
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleStatusToggle(program.id, program.status)}
                          disabled={statusToggleLoading === program.id}
                          className={`inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                            program.status === 'published' 
                              ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                              : 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                          }`}
                          title={program.status === 'published' ? 'Mark as Draft' : 'Publish Program'}
                        >
                          {statusToggleLoading === program.id ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            program.status === 'published' ? (
                              <BookmarkCheck className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <Bookmark className="h-5 w-5" aria-hidden="true" />
                            )
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(program.id)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Delete Program"
                        >
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete confirmation */}
                {deleteConfirmation === program.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">Are you sure you want to delete this program? This action cannot be undone.</p>
                    <div className="mt-3 flex space-x-3">
                      <button
                        onClick={() => confirmDelete(program.id)}
                        disabled={deleteLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
} 