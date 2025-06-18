'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/auth-context';
import { 
  Users, 
  ExternalLink, 
  Layers,
  BarChart3,
  GraduationCap,
  LogOut,
  BookOpen,
  FileText,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, userRole, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !currentUser) {
      router.push('/login');
      return;
    }

    // If user is not an admin, redirect to dashboard
    if (!isLoading && currentUser && userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [currentUser, userRole, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Static menu items that never change
  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/programs', label: 'Programs', icon: Layers },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/cms', label: 'CMS (Text Content)', icon: FileText },
    { href: '/admin/contacts', label: 'Contacts & Emails', icon: Mail },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Social Media Links', icon: ExternalLink },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser || !userRole || userRole.trim().toLowerCase() !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Static Admin Sidebar */}
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
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser?.displayName || 'Admin'}</p>
              <p className="text-xs text-white/60">View Profile</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Admin Section */}
          <div className="p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">ADMIN</p>
            <ul className="space-y-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
              </li>
                );
              })}
            </ul>
          </div>

          {/* Student Section */}
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">STUDENT AREA</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <BarChart3 size={20} />
                  <span>Student Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
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