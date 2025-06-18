'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  Clock,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, userRole, isLoading } = useAuth();
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalLessons: 0,
    upcomingDeadlines: 2,
    averageProgress: 0,
    certificates: 0,
    enrolledCourses: 0
  });

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !currentUser) {
      // Use window.location for a full page reload
      window.location.href = '/login';
    }
  }, [currentUser, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
            <Link
              href="/programs"
              className="inline-flex items-center px-4 py-2 bg-[#2B1F4F] text-white text-sm font-medium rounded-lg hover:bg-[#2B1F4F]/90 transition-colors"
            >
              <BookOpen size={16} className="mr-2" />
              Browse Programs
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Banner */}
          <div className="mb-8 bg-primary rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 md:px-10 md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome back, {currentUser?.displayName || 'Student'}!
                </h2>
                <p className="mt-1 text-white/80">
                  You are enrolled in {stats.enrolledCourses} courses.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link 
                  href="/programs" 
                  className="inline-flex items-center px-4 py-2 bg-white text-primary font-medium rounded-md shadow-sm hover:bg-gray-50"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Progress Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <BookOpen size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Progress</p>
                  <div className="flex items-baseline mt-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}/{stats.totalLessons}</p>
                    <p className="ml-2 text-sm text-gray-500">lessons</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${stats.totalLessons ? (stats.completedLessons / stats.totalLessons * 100) : 0}%` }}
                ></div>
              </div>
            </div>
            
          {/* Deadlines Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <Clock size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
                <div className="flex items-baseline mt-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
                  <p className="ml-2 text-sm text-gray-500">this week</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certificates Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <Award size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Certificates</p>
                <div className="flex items-baseline mt-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
                    <p className="ml-2 text-sm text-gray-500">earned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <GraduationCap size={24} />
                  </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
                  <p className="ml-2 text-sm text-gray-500">active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Courses</h3>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No courses enrolled yet</p>
                    <Link 
                      href="/programs" 
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                    >
                  Browse Programs
                    </Link>
                  </div>
                </div>
              </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
              </div>
            </div>
          </div>
            </div>

              {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      href="/programs"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
              <BookOpen size={20} className="text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Browse Programs</p>
                <p className="text-sm text-gray-500">Explore available courses</p>
              </div>
                    </Link>
            
                    <Link
                      href="/dashboard/schedule"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
              <Calendar size={20} className="text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Schedule</p>
                <p className="text-sm text-gray-500">Check your calendar</p>
              </div>
                    </Link>
            
                    <Link
                      href="/dashboard/certificates"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
              <Award size={20} className="text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Certificates</p>
                <p className="text-sm text-gray-500">View your achievements</p>
              </div>
            </Link>
            </div>
          </div>
        </main>
    </>
  );
} 