'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth-context';
import { useCMS } from '../contexts/cms-context';
import ClientLayout from '../components/ClientLayout';
// Using Lucide React icons instead of Heroicons
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, currentUser, userRole, isLoading } = useAuth();
  const { getContent } = useCMS();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (!isLoading && currentUser) {
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [currentUser, userRole, isLoading, router]);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError(getContent('auth.passwordsDoNotMatch'));
    }
    
    if (password.length < 8 || password.length > 72) {
      return setError(getContent('auth.passwordLength'));
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password, displayName);
      // After successful registration, user will be redirected to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(getContent('auth.registrationFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {getContent('auth.createAccount')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {getContent('auth.alreadyHaveAccount')}{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                {getContent('auth.signIn')}
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleAccountSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Full Name Field */}
              <div>
              <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-2">
                {getContent('auth.fullName')} *
              </label>
                <input
                  id="display-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={getContent('auth.fullNamePlaceholder')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

            {/* Email Field */}
              <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                {getContent('auth.email')} *
              </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={getContent('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            {/* Password Field */}
              <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {getContent('auth.password')} *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder={getContent('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {getContent('auth.passwordRequirements')}
              </p>
            </div>

            {/* Confirm Password Field */}
              <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                {getContent('auth.confirmPassword')} *
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder={getContent('auth.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? getContent('auth.creatingAccount') : getContent('auth.createAccountButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
} 