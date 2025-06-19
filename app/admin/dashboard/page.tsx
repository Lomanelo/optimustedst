'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
import { 
  Users, 
  Layers, 
  BarChart3, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Calendar,
  ArrowRight,
  TrendingUp,
  UserPlus,
  Award,
  DollarSign,
  Server
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';

interface Stats {
  totalPrograms: number;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
}

export default function AdminDashboardPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalPrograms: 0,
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if the user is authenticated and has dashboard permission
    if (!isLoading && currentUser && (userRole === 'admin' || hasPermission('dashboard'))) {
      fetchStats();
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get program count
      const programsSnapshot = await getCountFromServer(collection(db, 'programs'));
      const totalPrograms = programsSnapshot.data().count;
      
      // Get user count
      const usersSnapshot = await getCountFromServer(collection(db, 'users'));
      const totalUsers = usersSnapshot.data().count;
      
      // Get course count (if you have a courses collection)
      const coursesSnapshot = await getCountFromServer(collection(db, 'courses'));
      const totalCourses = coursesSnapshot.data().count;
      
      // Get enrollment count (if you have an enrollments collection)
      const enrollmentsSnapshot = await getCountFromServer(collection(db, 'enrollments'));
      const totalEnrollments = enrollmentsSnapshot.data().count;
      
      setStats({
        totalPrograms,
        totalUsers,
        totalCourses,
        totalEnrollments
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set some default values in case of error
      setStats({
        totalPrograms: 0,
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Optimus Education admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Programs */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Programs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPrograms}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Layers className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/programs" className="text-sm font-medium text-primary flex items-center">
              View all programs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/users" className="text-sm font-medium text-blue-500 flex items-center">
              View all users <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCourses}</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-full">
              <BookOpen className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/courses" className="text-sm font-medium text-amber-500 flex items-center">
              View all courses <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEnrollments}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <UserPlus className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/enrollments" className="text-sm font-medium text-green-500 flex items-center">
              View all enrollments <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/programs/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-full mr-3">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Create Program</span>
          </Link>

          <Link
            href="/admin/users/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-500/10 rounded-full mr-3">
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium">Add User</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 