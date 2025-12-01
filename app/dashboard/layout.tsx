'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth-context';
import { 
  BookOpen, 
  GraduationCap,
  LogOut,
  BarChart3,
  Users,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';
import { useCMS } from '../contexts/cms-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, userRole, hasPermission, isLoading, logout } = useAuth();
  const router = useRouter();
  const { currentLanguage } = useCMS();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !currentUser) {
      router.push('/login');
      return;
    }
  }, [currentUser, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Translations object
  const translations = {
    en: {
      student_section: 'STUDENT',
      admin_section: 'ADMIN',
      dashboard: 'Dashboard',
      admin_dashboard: 'Admin Dashboard',
      manage_programs: 'Manage Programs',
      manage_users: 'Manage Users',
      logout: 'Log out',
      view_profile: 'View Profile',
      student_user: 'Student'
    },
    ar: {
      student_section: 'الطالب',
      admin_section: 'الإدارة',
      dashboard: 'لوحة التحكم',
      admin_dashboard: 'لوحة الإدارة',
      manage_programs: 'إدارة البرامج',
      manage_users: 'إدارة المستخدمين',
      logout: 'تسجيل الخروج',
      view_profile: 'عرض الملف الشخصي',
      student_user: 'طالب'
    }
  };

  const t = (key: keyof typeof translations.en) => translations[currentLanguage][key];

  // Static menu items for students
  const studentMenuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: BarChart3 },
  ];

  // Admin menu items (shown based on permissions)
  const adminMenuItems = [
    { href: '/admin/dashboard', label: t('admin_dashboard'), icon: BarChart3, permission: 'dashboard' as const },
    { href: '/admin/programs', label: t('manage_programs'), icon: BookOpen, permission: 'programs' as const },
    { href: '/admin/blog', label: 'Manage Blog', icon: FileText, permission: 'blog' as const },
    { href: '/admin/users', label: t('manage_users'), icon: Users, permission: 'users' as const }
  ].filter(item => hasPermission(item.permission) || userRole === 'admin');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Static Student Sidebar */}
      <div className="w-64 bg-[#2B1F4F] text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <img
              src="/Final%20Logo01-03.jpg"
              alt="Optimus Solutions Logo"
              width={220}
              height={72}
              className="object-contain"
              style={{ width: '220px', height: '72px' }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = '/OptimusLogoOnPurple.png';
              }}
            />
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#058C42] rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser?.displayName || t('student_user')}</p>
              <p className="text-xs text-white/60">{t('view_profile')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Student Section */}
          <div className="p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">{t('student_section')}</p>
            <ul className="space-y-2">
              {studentMenuItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm bg-white/10 text-white transition-colors"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Admin Section - show if user has any admin permissions */}
          {adminMenuItems.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">{t('admin_section')}</p>
              <ul className="space-y-2">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Language & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-white/70 hover:text-white"
            >
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-50 ml-64">
        <main className={`flex-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
          {children}
        </main>
      </div>
    </div>
  );
} 