'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, 
  UserCredential,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../src/firebase/firebase';
import userService, { UserPermissions, DEFAULT_PERMISSIONS, ADMIN_PERMISSIONS } from '../../src/services/userService';

interface AuthContextType {
  currentUser: User | null;
  userRole: string;
  userPermissions: UserPermissions;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserRole: () => Promise<string>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to normalize role strings
const normalizeRole = (role: string | undefined | null): string => {
  if (!role) return 'student';
  
  // Trim whitespace AND remove any newline characters
  const normalizedRole = role.trim().replace(/\n/g, '').toLowerCase();
  
  // Special case for admin role - extra logging
  if (normalizedRole === 'admin' || role.includes('admin')) {
    console.log('Admin role detected. Original:', JSON.stringify(role), 
                'Normalized:', JSON.stringify(normalizedRole));
    return 'admin';
  }
  
  return normalizedRole;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [userPermissions, setUserPermissions] = useState<UserPermissions>(DEFAULT_PERMISSIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to fetch user role from Firestore
  const fetchUserRole = async (userId: string): Promise<string> => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Normalize the role from Firestore
        return normalizeRole(userData.role);
      } else {
        return 'student';
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'student';
    }
  };

  useEffect(() => {
    // Track if component is mounted to avoid state updates after unmount
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user role from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data from Firestore:', JSON.stringify(userData));
            
            // Normalize the role before setting
            const role = normalizeRole(userData.role);
            setUserRole(role);
            
            // Set permissions - for existing admin users without permissions, give them all permissions
            let permissions = userData.permissions || DEFAULT_PERMISSIONS;
            
            // Migration: If user is admin but has no permissions set, give them all permissions
            if (role === 'admin' && !userData.permissions) {
              permissions = ADMIN_PERMISSIONS;
              
              // Update the user document to include permissions
              try {
                await setDoc(userDocRef, {
                  ...userData,
                  permissions: permissions,
                  isActive: userData.isActive !== false,
                  updatedAt: serverTimestamp(),
                }, { merge: true });
              } catch (error) {
                console.error('Error updating admin permissions:', error);
              }
            }
            
            // Only update permissions if they actually changed to prevent unnecessary re-renders
            setUserPermissions(prev => {
              const hasChanged = JSON.stringify(prev) !== JSON.stringify(permissions);
              return hasChanged ? permissions : prev;
            });
          } else {
            // Create a new user document if it doesn't exist
            await setDoc(userDocRef, {
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'Student',
              role: 'student',
              permissions: DEFAULT_PERMISSIONS,
              isActive: true,
              createdAt: serverTimestamp(),
            });
            setUserRole('student');
            setUserPermissions(prev => {
              const hasChanged = JSON.stringify(prev) !== JSON.stringify(DEFAULT_PERMISSIONS);
              return hasChanged ? DEFAULT_PERMISSIONS : prev;
            });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('student');
        }
      } else {
        setUserRole('student');
        setUserPermissions(prev => {
          const hasChanged = JSON.stringify(prev) !== JSON.stringify(DEFAULT_PERMISSIONS);
          return hasChanged ? DEFAULT_PERMISSIONS : prev;
        });
      }
      
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUserRole = async (): Promise<string> => {
    if (currentUser) {
      const role = await fetchUserRole(currentUser.uid);
      setUserRole(role);
      return role;
    }
    return 'student';
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Immediately fetch the user role and permissions after login
      if (userCredential.user) {
        try {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = normalizeRole(userData.role);
            setUserRole(role);
            
            // Set permissions
            const permissions = userData.permissions || DEFAULT_PERMISSIONS;
            setUserPermissions(prev => {
              const hasChanged = JSON.stringify(prev) !== JSON.stringify(permissions);
              return hasChanged ? permissions : prev;
            });
          }
        } catch (error) {
          console.error('Error fetching user data after login:', error);
        }
        
        // Update last login time
        try {
          await userService.updateLastLogin(userCredential.user.uid);
        } catch (error) {
          console.error('Error updating last login:', error);
          // Don't fail login for this
        }
      }
      
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        displayName,
        role: 'student',
        permissions: DEFAULT_PERMISSIONS,
        isActive: true,
        createdAt: serverTimestamp(),
      });

      setUserRole('student');
      setUserPermissions(prev => {
        const hasChanged = JSON.stringify(prev) !== JSON.stringify(DEFAULT_PERMISSIONS);
        return hasChanged ? DEFAULT_PERMISSIONS : prev;
      });
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole('student');
      setUserPermissions(prev => {
        const hasChanged = JSON.stringify(prev) !== JSON.stringify(DEFAULT_PERMISSIONS);
        return hasChanged ? DEFAULT_PERMISSIONS : prev;
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return userPermissions[permission] || false;
  };

  const value = {
    currentUser,
    userRole,
    userPermissions,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    refreshUserRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 