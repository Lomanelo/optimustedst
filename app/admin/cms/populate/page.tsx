'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../src/firebase/firebase';
import { extractedContent } from '../../../../scripts/extract-website-content';
import { Upload, Check, AlertCircle } from 'lucide-react';

export default function PopulateCMSPage() {
  const { currentUser, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [populating, setPopulating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [totalItems] = useState(extractedContent.length);
  const [existingCount, setExistingCount] = useState(0);

  useEffect(() => {
    if (!isLoading && (!currentUser || userRole !== 'admin')) {
      router.push('/admin/dashboard');
      return;
    }
    
    checkExistingContent();
  }, [currentUser, userRole, isLoading, router]);

  const checkExistingContent = async () => {
    try {
      const contentCollection = collection(db, 'cms_content');
      const snapshot = await getDocs(contentCollection);
      setExistingCount(snapshot.size);
    } catch (error) {
      console.error('Error checking existing content:', error);
    }
  };

  const handlePopulate = async () => {
    try {
      setPopulating(true);
      setStatus('idle');
      setProgress(0);

      const contentCollection = collection(db, 'cms_content');
      
      // Process items in batches
      for (let i = 0; i < extractedContent.length; i++) {
        const item = extractedContent[i];
        await setDoc(doc(contentCollection, item.id), item);
        setProgress(i + 1);
      }

      setStatus('success');
      setExistingCount(extractedContent.length);
    } catch (error) {
      console.error('Error populating CMS:', error);
      setStatus('error');
    } finally {
      setPopulating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Upload size={48} className="mx-auto mb-4 text-[#2B1F4F]" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Populate CMS Database</h1>
            <p className="text-gray-600 mb-6">
              Initialize the CMS database with extracted website content
            </p>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Content Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <div>
                  <p className="text-gray-500">Existing Items</p>
                  <p className="text-2xl font-bold text-gray-900">{existingCount}</p>
                </div>
              </div>
            </div>

            {populating && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-[#2B1F4F] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress / totalItems) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Processing {progress} of {totalItems} items...
                </p>
              </div>
            )}

            {existingCount > 0 && !populating && status === 'idle' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle size={16} className="inline mr-2" />
                  Database already contains {existingCount} items. Running this will overwrite existing content.
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <Check size={16} className="inline mr-2" />
                  Successfully populated {totalItems} content items!
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <AlertCircle size={16} className="inline mr-2" />
                  Failed to populate database. Please try again.
                </p>
              </div>
            )}

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push('/admin/cms')}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to CMS
              </button>
              <button
                onClick={handlePopulate}
                disabled={populating}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  populating 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-[#2B1F4F] text-white hover:bg-[#2B1F4F]/90'
                }`}
              >
                {populating ? 'Populating...' : 'Populate Database'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 