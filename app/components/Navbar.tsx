'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/auth-context';
import { useCMS } from '../contexts/cms-context';
import Logo from '../../src/components/Logo';
import Button from '../../src/components/Button';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, userRole, logout } = useAuth();
  const { getContent, loading: cmsLoading } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path ? 'text-accent' : 'text-gray-800';
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await logout();
      
      // Ensure complete page reload for server-side rendering
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Don't render if CMS is still loading
  if (cmsLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md py-2">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href={currentUser ? (userRole === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}>
                <Logo />
              </Link>
            </div>
            <div className="hidden md:flex space-x-6">
              {/* Skeleton loaders */}
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
      }`}
      dir="ltr"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href={currentUser ? (userRole === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}>
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <Link href="/programs" className={`${isActive('/programs')} hover:text-accent font-medium transition-colors`}>{getContent('navbar_programs')}</Link>
            <Link href="/about" className={`${isActive('/about')} hover:text-accent font-medium transition-colors`}>{getContent('navbar_about')}</Link>
            <Link href="/blog" className={`${isActive('/blog')} hover:text-accent font-medium transition-colors`}>{getContent('navbar_blog')}</Link>
            <Link href="/contact" className={`${isActive('/contact')} hover:text-accent font-medium transition-colors`}>{getContent('navbar_contact')}</Link>
            {currentUser && (
              <Link href="/dashboard" className={`${isActive('/dashboard')} hover:text-accent font-medium transition-colors`}>{getContent('navbar_dashboard')}</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-primary hover:text-primary-dark">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium hidden lg:inline-block">{currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                  title={getContent('navbar_sign_out')}
                >
                  <LogOut size={18} />
                  <span className="hidden lg:inline-block">{getContent('navbar_sign_out')}</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                  {getContent('navbar_login')}
                </Link>
                            <Link href="/coming-soon">
              <Button variant="accent" size="md">{getContent('navbar_register')}</Button>
            </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white`}>
        <div className="px-4 pt-2 pb-4 space-y-3">
          <Link href="/programs" className={`block ${isActive('/programs')} hover:text-accent font-medium py-2 transition-colors`}>{getContent('navbar_programs')}</Link>
          <Link href="/about" className={`block ${isActive('/about')} hover:text-accent font-medium py-2 transition-colors`}>{getContent('navbar_about')}</Link>
          <Link href="/blog" className={`block ${isActive('/blog')} hover:text-accent font-medium py-2 transition-colors`}>{getContent('navbar_blog')}</Link>
          <Link href="/contact" className={`block ${isActive('/contact')} hover:text-accent font-medium transition-colors py-2`}>{getContent('navbar_contact')}</Link>
          {currentUser && (
            <Link href="/dashboard" className={`block ${isActive('/dashboard')} hover:text-accent font-medium py-2 transition-colors`}>{getContent('navbar_dashboard')}</Link>
          )}
          <LanguageSwitcher />
          
          {currentUser ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </div>
                <span className="font-medium">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors py-2 w-full text-left"
              >
                <LogOut size={18} />
                <span>{isSigningOut ? getContent('navbar_signing_out') : getContent('navbar_sign_out')}</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block font-medium text-primary hover:text-primary-dark py-2">
                {getContent('navbar_login')}
              </Link>
              <Link href="/coming-soon" className="block w-full mt-2">
                <Button variant="accent" size="md" className="w-full">{getContent('navbar_register')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 