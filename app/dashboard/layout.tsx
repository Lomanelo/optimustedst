'use client';

import React, { useEffect } from 'react';
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, userRole, isLoading, logout } = useAuth();
  const router = useRouter();

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

  // Static menu items for students
  const studentMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  // Admin menu items (shown only to admins)
  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: BarChart3 },
    { href: '/admin/programs', label: 'Manage Programs', icon: BookOpen },
    { href: '/admin/users', label: 'Manage Users', icon: Users }
  ];

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
    <div className="flex h-screen bg-gray-50">
      {/* Static Student Sidebar */}
      <div className="w-64 bg-[#2B1F4F] text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <Image
              src="/OptimusLogoOnPurple.png"
              alt="OPTIMUS Education Logo"
              width={180}
              height={60}
              className="object-contain"
              priority
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
              <p className="text-sm font-medium">{currentUser?.displayName || 'Student'}</p>
              <p className="text-xs text-white/60">View Profile</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Student Section */}
          <div className="p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">STUDENT</p>
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

          {/* Admin Section - only show if user is admin */}
          {userRole === 'admin' && (
            <div className="p-4 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">ADMIN</p>
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
            <button className="text-sm text-white/70 hover:text-white">العربية</button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-white/70 hover:text-white"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-50 ml-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 