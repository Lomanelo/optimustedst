'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useRouter } from 'next/navigation';
import userService, { UserData, UserPermissions, DEFAULT_PERMISSIONS, ADMIN_PERMISSIONS } from '../../../src/services/userService';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings,
  MoreVertical,
  Calendar,
  Mail,
  User,
  Save,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function AdminUsersPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [savingChanges, setSavingChanges] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{updated: number; errors: number} | null>(null);

  // Redirect if no access to users management
  useEffect(() => {
    if (!isLoading && (!currentUser || !canViewUsers())) {
      router.push('/admin/dashboard');
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  // Load users and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, statsData] = await Promise.all([
          userService.getAllUsers(),
          userService.getUserStats()
        ]);
        
        setUsers(usersData);
        setFilteredUsers(usersData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && canViewUsers()) {
      loadData();
    }
  }, [currentUser, userRole, hasPermission]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.displayName.toLowerCase().includes(search)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'student' | 'moderator') => {
    const user = users.find(u => u.uid === userId);
    if (!user || !canEditUser(user)) {
      console.warn('Attempted to edit protected admin account');
      return;
    }

    try {
      setSavingChanges(userId);
      await userService.updateUserRole(userId, newRole);
    
    // Update local state for immediate UI feedback
    setUsers(prev => prev.map(user => 
      user.uid === userId 
        ? { ...user, role: newRole }
        : user
    ));
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role');
    } finally {
      setSavingChanges(null);
    }
  };

  const handlePermissionToggle = async (userId: string, permission: keyof UserPermissions, value: boolean) => {
    const user = users.find(u => u.uid === userId);
    if (!user || !canEditUser(user)) {
      console.warn('Attempted to edit protected admin account');
      return;
    }

    try {
      setSavingChanges(userId);
    const updatedPermissions = { ...user.permissions, [permission]: value };
      await userService.updateUserPermissions(userId, updatedPermissions);
    
    // Update local state for immediate UI feedback
    setUsers(prev => prev.map(u => 
      u.uid === userId 
        ? { ...u, permissions: updatedPermissions }
        : u
    ));
    } catch (err) {
      console.error('Error updating permission:', err);
      setError('Failed to update user permission');
    } finally {
      setSavingChanges(null);
    }
  };

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    const user = users.find(u => u.uid === userId);
    if (!user || !canEditUser(user)) {
      console.warn('Attempted to edit protected admin account');
      return;
    }

    try {
      setSavingChanges(userId);
      await userService.toggleUserStatus(userId, isActive);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.uid === userId 
          ? { ...user, isActive }
          : user
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update user status');
    } finally {
      setSavingChanges(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to check if a user is an admin
  const isUserAdmin = (user: UserData) => {
    return user.role && user.role.trim().toLowerCase() === 'admin';
  };

  // Helper function to check if current user can edit target user
  const canEditUser = (targetUser: UserData) => {
    // Only admin users can edit anyone
    if (userRole === 'admin') return true;
    
    // Non-admin users cannot edit any accounts
    return false;
  };

  // Helper function to check if current user can view users (but not edit)
  const canViewUsers = () => {
    return userRole === 'admin' || hasPermission('users');
  };

  const handleMigratePermissions = async () => {
    try {
      setMigrating(true);
      setMigrationResult(null);
      const result = await userService.migrateUserPermissions();
      setMigrationResult(result);
      
      // Reload users to see the changes
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error('Error migrating permissions:', err);
      setError('Failed to migrate user permissions');
    } finally {
      setMigrating(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !canViewUsers()) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <Users className="mr-3" size={28} />
              User Management
            </h1>
          </div>
        </div>
      </div>

      {/* Non-admin notice */}
      {userRole !== 'admin' && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <span>You have read-only access to user information. Only administrators can modify user roles and permissions.</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-auto"
          >
            <X size={16} />
          </button>
        </div>
      )}







      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
              <div key={user.uid} className="p-6">
                {/* User Header - Clickable */}
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-6 p-6"
                  onClick={() => setExpandedUser(expandedUser === user.uid ? null : user.uid)}
                >
                    <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={24} className="text-primary" />
                      </div>
                      <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">
                          {user.displayName || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {isUserAdmin(user) && userRole !== 'admin' && (
                          <div title="Admin account - protected" className="ml-2">
                            <Shield size={14} className="text-red-500" />
                          </div>
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                          Last login: {formatDate(user.lastLogin)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                      {savingChanges === user.uid && (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-3"></div>
                      )}
                    <div className={`transform transition-transform ${expandedUser === user.uid ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
        </div>
        
                {/* Expanded Content - Permissions */}
                {expandedUser === user.uid && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {/* Permissions Grid */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Permissions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(user.permissions).map(([permission, hasAccess]) => {
                          const permissionLabels: Record<string, string> = {
                            dashboard: 'Dashboard',
                            programs: 'Programs',
                            blog: 'Blog',
                            cms: 'CMS Content',
                            contacts: 'Contacts',
                            users: 'User Management',
                            settings: 'Settings',
                            terms: 'Terms & Privacy'
                          };
                          
                          const permissionLabel = permissionLabels[permission] || permission;
                          
                          return (
                            <label key={permission} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={hasAccess}
                                onChange={(e) => handlePermissionToggle(user.uid, permission as keyof UserPermissions, e.target.checked)}
                                disabled={savingChanges === user.uid || !canEditUser(user)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="ml-2 text-sm text-gray-700">{permissionLabel}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {!canEditUser(user) && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center">
                        <Shield className="mr-2" size={16} />
                        Admin account - protected from changes
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 