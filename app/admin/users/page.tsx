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
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [savingChanges, setSavingChanges] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<{[userId: string]: Partial<UserData>}>({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
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

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleRoleChange = (userId: string, newRole: 'admin' | 'student' | 'moderator') => {
    const user = users.find(u => u.uid === userId);
    if (!user || !canEditUser(user)) {
      console.warn('Attempted to edit protected admin account');
      return;
    }

    // Update pending changes instead of saving immediately
    setPendingChanges(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        role: newRole
      }
    }));
    
    // Update local state for immediate UI feedback
    setUsers(prev => prev.map(user => 
      user.uid === userId 
        ? { ...user, role: newRole }
        : user
    ));
  };

  const handlePermissionToggle = (userId: string, permission: keyof UserPermissions, value: boolean) => {
    const user = users.find(u => u.uid === userId);
    if (!user || !canEditUser(user)) {
      console.warn('Attempted to edit protected admin account');
      return;
    }

    const updatedPermissions = { ...user.permissions, [permission]: value };
    
    // Update pending changes instead of saving immediately
    setPendingChanges(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        permissions: updatedPermissions
      }
    }));
    
    // Update local state for immediate UI feedback
    setUsers(prev => prev.map(u => 
      u.uid === userId 
        ? { ...u, permissions: updatedPermissions }
        : u
    ));
  };

  const handleSaveChanges = async (userId: string) => {
    try {
      setSavingChanges(userId);
      const changes = pendingChanges[userId];
      if (!changes) return;

      // Save role if changed
      if (changes.role) {
        await userService.updateUserRole(userId, changes.role);
      }

      // Save permissions if changed
      if (changes.permissions) {
        await userService.updateUserPermissions(userId, changes.permissions);
      }

      // Clear pending changes for this user
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[userId];
        return newChanges;
      });

      setEditingUser(null);
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('Failed to save changes');
    } finally {
      setSavingChanges(null);
    }
  };

  const handleCancelChanges = (userId: string) => {
    // Revert local changes
    const originalUser = users.find(u => u.uid === userId);
    if (originalUser && pendingChanges[userId]) {
      // Reload user data to revert changes
      const loadData = async () => {
        try {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
          setFilteredUsers(usersData);
        } catch (err) {
          console.error('Error reloading users:', err);
        }
      };
      loadData();
    }

    // Clear pending changes for this user
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[userId];
      return newChanges;
    });

    setEditingUser(null);
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
            <p className="text-gray-600 mt-1">
              {userRole === 'admin' ? 'Manage user roles and permissions' : 'View user information (read-only)'}
            </p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Admin Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.adminUsers}</p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.newUsersThisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className={`hover:bg-gray-50 ${pendingChanges[user.uid] ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.uid && canEditUser(user) ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                        disabled={savingChanges === user.uid}
                      >
                        <option value="student">Student</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {isUserAdmin(user) && userRole !== 'admin' && (
                          <div title="Admin account - protected">
                            <Shield size={14} className="ml-2 text-red-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(user.uid, !user.isActive)}
                      disabled={savingChanges === user.uid || !canEditUser(user)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors disabled:opacity-50 ${
                        !canEditUser(user) ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      {user.isActive ? <UserCheck size={14} className="mr-1" /> : <UserX size={14} className="mr-1" />}
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.permissions).map(([permission, hasAccess]) => (
                        <button
                          key={permission}
                          onClick={() => handlePermissionToggle(user.uid, permission as keyof UserPermissions, !hasAccess)}
                          disabled={savingChanges === user.uid || !canEditUser(user)}
                          className={`px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 ${
                            hasAccess 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } ${
                            !canEditUser(user) ? 'cursor-not-allowed' : ''
                          }`}
                          title={canEditUser(user) ? `Toggle ${permission} access` : 'Admin account - protected'}
                        >
                          {permission}
                        </button>
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      {editingUser === user.uid ? (
                        <>
                          {pendingChanges[user.uid] && (
                            <>
                              <button
                                onClick={() => handleSaveChanges(user.uid)}
                                className="text-green-600 hover:text-green-800 flex items-center"
                                disabled={savingChanges === user.uid}
                                title="Save changes"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => handleCancelChanges(user.uid)}
                                className="text-red-600 hover:text-red-800 flex items-center"
                                disabled={savingChanges === user.uid}
                                title="Cancel changes"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          {!pendingChanges[user.uid] && (
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-gray-600 hover:text-gray-800"
                              disabled={savingChanges === user.uid}
                              title="Done editing"
                            >
                              <Check size={16} />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingUser(user.uid)}
                          className={`${canEditUser(user) ? 'text-primary hover:text-primary-dark' : 'text-gray-400 cursor-not-allowed'}`}
                          disabled={savingChanges === user.uid || !canEditUser(user)}
                          title={canEditUser(user) ? "Edit user" : "Admin account - protected"}
                        >
                          <Settings size={16} />
                        </button>
                      )}
                      
                      {savingChanges === user.uid && (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
} 