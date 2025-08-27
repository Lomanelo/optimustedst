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
  AlertTriangle,
  Plus,
  Trash2
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
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{updated: number; errors: number} | null>(null);
  
  // Create user modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'student' as 'admin' | 'student',
    adminPassword: '' // Admin's password for re-authentication
  });

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

    // Role filter - use normalized roles for consistent filtering
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => normalizeRole(user.role) === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'student') => {
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

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (!user || !canEditUser(user)) {
      console.warn('Attempted to delete protected admin account');
      return;
    }

    try {
      setDeleting(userId);
      await userService.deleteUser(userId, userRole || '');
      
      // Remove user from local state
      setUsers(prev => prev.filter(u => u.uid !== userId));
      setFilteredUsers(prev => prev.filter(u => u.uid !== userId));
      
      // Update stats
      const statsData = await userService.getUserStats();
      setStats(statsData);
      
      setDeleteConfirmation(null);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
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
    const normalizedRole = normalizeRole(role);
    switch (normalizedRole) {
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Helper function to normalize role strings consistently
  const normalizeRole = (role: string | undefined | null): string => {
    if (!role) return 'student';
    
    // Trim whitespace AND remove any newline characters
    const normalizedRole = role.trim().replace(/\n/g, '').toLowerCase();
    
    // Map different admin variations to 'admin'
    if (normalizedRole === 'admin' || role.includes('admin')) {
      return 'admin';
    }
    

    
    return 'student'; // Default fallback
  };

  // Helper function to check if a user is an admin
  const isUserAdmin = (user: UserData) => {
    return normalizeRole(user.role) === 'admin';
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.email || !createFormData.password || !createFormData.displayName || !createFormData.adminPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (!currentUser?.email) {
      setError('Admin email not found');
      return;
    }

    try {
      setCreating(true);
      await userService.createUserWithPassword({
        email: createFormData.email,
        password: createFormData.password,
        displayName: createFormData.displayName,
        role: createFormData.role
      }, {
        email: currentUser.email,
        password: createFormData.adminPassword
      });
      
      // Reset form and close modal
      setCreateFormData({
        email: '',
        password: '',
        displayName: '',
        role: 'student',
        adminPassword: ''
      });
      setShowCreateModal(false);
      
      // Reload users to show the new user
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
      
      // Update stats
      const statsData = await userService.getUserStats();
      setStats(statsData);
      
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
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
          {userRole === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="mr-2" size={20} />
              Create User
            </button>
          )}
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
                          {normalizeRole(user.role).charAt(0).toUpperCase() + normalizeRole(user.role).slice(1)}
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

                    {/* Action Buttons */}
                    {canEditUser(user) && userRole === 'admin' && normalizeRole(user.role) !== 'admin' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setDeleteConfirmation(user.uid)}
                            disabled={deleting === user.uid}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors disabled:opacity-50"
                          >
                            {deleting === user.uid ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Trash2 className="mr-1" size={16} />
                            )}
                            {deleting === user.uid ? 'Deleting...' : 'Delete User'}
                          </button>
                        </div>
                      </div>
                    )}

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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Create New User</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  // Clear sensitive data when closing
                  setCreateFormData(prev => ({ ...prev, password: '', adminPassword: '' }));
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.displayName}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter user password"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'student' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Admin Password * (for security verification)
                  </label>
                  <input
                    type="password"
                    required
                    value={createFormData.adminPassword}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your admin password"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> This creates a complete user account with login credentials. The user can immediately log in with the email and password you set.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    // Clear sensitive data when canceling
                    setCreateFormData(prev => ({ ...prev, password: '', adminPassword: '' }));
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
                >
                  {creating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  )}
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete User</h3>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <span className="text-gray-700">Are you sure you want to delete this user?</span>
              </div>
              
              {(() => {
                const user = users.find(u => u.uid === deleteConfirmation);
                return user ? (
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Role: {normalizeRole(user.role).charAt(0).toUpperCase() + normalizeRole(user.role).slice(1)}
                    </p>
                  </div>
                ) : null;
              })()}
              
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This action will permanently delete the user's account from the system. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={deleting === deleteConfirmation}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmation && handleDeleteUser(deleteConfirmation)}
                disabled={deleting === deleteConfirmation}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
              >
                {deleting === deleteConfirmation && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                )}
                {deleting === deleteConfirmation ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 