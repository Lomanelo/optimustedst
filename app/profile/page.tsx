'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { db } from '../../src/firebase/firebase';
import { useAuth } from '../contexts/auth-context';
import ClientLayout from '../components/ClientLayout';

export default function ProfilePage() {
  const { currentUser, isLoading, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Add the sign-out handler
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await logout();
      
      // Ensure complete page reload for server-side rendering
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Error signing out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  // If loading or no user, show appropriate UI
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!currentUser) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Not Authenticated</h1>
            <p className="text-center mb-6">Please log in to view your profile</p>
            <Link 
              href="/login" 
              className="block w-full py-2 px-4 bg-primary text-white text-center rounded-md hover:bg-primary-dark transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: displayName
      });
      
      // Update Firestore document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName
      });
      
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Profile
        </h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your personal details and account settings.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentUser?.displayName || 'Not provided'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentUser?.email}
                </dd>
              </div>

            </dl>
          </div>
        </div>
        

        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="space-y-4">
          {isEditing ? (
            <form onSubmit={handleSaveProfile}>
              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1" htmlFor="displayName">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={isSaving}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark flex-1"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(currentUser.displayName || '');
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">Display Name</p>
                <p className="font-medium">{currentUser.displayName || 'No name set'}</p>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </ClientLayout>
  );
} 