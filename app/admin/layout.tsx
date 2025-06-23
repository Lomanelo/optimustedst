'use client';

import React, { useEffect, useMemo, useRef } from 'react';
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
  const { currentUser, userRole, userPermissions, hasPermission, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  // Memoize the permission check to prevent unnecessary re-renders
  const hasAnyAdminPermission = useMemo(() => {
    return ['dashboard', 'programs', 'blog', 'cms', 'contacts', 'users', 'settings', 'terms']
      .some(permission => userPermissions[permission as keyof typeof userPermissions] || false);
  }, [userPermissions]);

  useEffect(() => {
    // Reset redirect flag when loading state changes
    if (isLoading) {
      hasRedirectedRef.current = false;
      return;
    }

    // If not loading and no user, redirect to login (once)
    if (!currentUser && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace('/login');
      return;
    }

    // If user has no admin permissions, redirect to dashboard (except for admin role during migration)
    if (currentUser && userRole !== 'admin' && !hasRedirectedRef.current) {
      // Only log if there's an issue (for debugging)
      if (!hasAnyAdminPermission) {
        console.log('Admin access denied for user:', { userRole, hasAnyAdminPermission });
      }
      
      if (!hasAnyAdminPermission) {
        hasRedirectedRef.current = true;
        router.replace('/dashboard');
        return;
      }
    }
  }, [currentUser, userRole, hasAnyAdminPermission, isLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Dynamic menu items based on permissions
  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3, permission: 'dashboard' as const },
    { href: '/admin/programs', label: 'Programs', icon: Layers, permission: 'programs' as const },
    { href: '/admin/blog', label: 'Blog', icon: FileText, permission: 'blog' as const },
    { href: '/admin/cms', label: 'CMS (Text Content)', icon: FileText, permission: 'cms' as const },
    { href: '/admin/contacts', label: 'Contacts & Emails', icon: Mail, permission: 'contacts' as const },
    { href: '/admin/terms', label: 'Terms & Privacy', icon: BookOpen, permission: 'terms' as const },
    { href: '/admin/users', label: 'Users', icon: Users, permission: 'users' as const },
    { href: '/admin/settings', label: 'Social Media Links', icon: ExternalLink, permission: 'settings' as const },
  ].filter(item => hasPermission(item.permission) || userRole === 'admin');

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Check access permissions
  const hasAccess = currentUser && userRole && 
    (userRole.trim().toLowerCase() === 'admin' || hasAnyAdminPermission);

  if (!hasAccess) {
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