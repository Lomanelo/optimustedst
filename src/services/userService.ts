import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  getDocs,
  where,
  serverTimestamp,
  limit,
  writeBatch
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';

export interface UserPermissions {
  dashboard: boolean;
  programs: boolean;
  blog: boolean;
  cms: boolean;
  contacts: boolean;
  users: boolean;
  settings: boolean;
  seo: boolean;
  terms: boolean;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'student';
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
  lastLogin?: any;
}

export const DEFAULT_PERMISSIONS: UserPermissions = {
  dashboard: false,
  programs: false,
  blog: false,
  cms: false,
  contacts: false,
  users: false,
  settings: false,
  seo: false,
  terms: false,
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  dashboard: true,
  programs: true,
  blog: true,
  cms: true,
  contacts: true,
  users: true,
  settings: true,
  seo: true,
  terms: true,
};

class UserService {
  /**
   * Merge user permissions with default permissions to ensure all fields exist
   */
  private mergePermissions(userPermissions: any): UserPermissions {
    return {
      ...DEFAULT_PERMISSIONS,
      ...userPermissions
    };
  }

  /**
   * Get all users for admin management
   */
  async getAllUsers(): Promise<UserData[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const users: UserData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          uid: doc.id,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || 'student',
          permissions: this.mergePermissions(data.permissions),
          isActive: data.isActive !== false, // Default to true if not set
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lastLogin: data.lastLogin
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(uid: string): Promise<UserData | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: userDoc.id,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || 'student',
          permissions: this.mergePermissions(data.permissions),
          isActive: data.isActive !== false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lastLogin: data.lastLogin
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Update user permissions
   */
  async updateUserPermissions(uid: string, permissions: UserPermissions): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        permissions,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(uid: string, role: 'admin' | 'student'): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      
      // Get current user to preserve existing permissions if they have any
      const currentUser = await this.getUserById(uid);
      let permissions = currentUser?.permissions || DEFAULT_PERMISSIONS;
      
      // Only set all permissions if changing TO admin and they don't have any permissions yet
      if (role === 'admin' && currentUser && 
          Object.values(currentUser.permissions).every(p => p === false)) {
        permissions = ADMIN_PERMISSIONS;
      }
      
      await updateDoc(userDocRef, {
        role,
        permissions,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(uid: string, isActive: boolean): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Update user's last login time
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw error for this non-critical operation
    }
  }

  /**
   * Create a new user with Firebase Auth account and Firestore record (for admin use)
   */
  async createUserWithPassword(userData: {
    email: string;
    password: string;
    displayName: string;
    role: 'admin' | 'student';
    permissions?: UserPermissions;
  }, adminCredentials: { email: string; password: string }): Promise<string> {
    try {
      // Check if user with this email already exists in Firestore
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('email', '==', userData.email));
      const existingUsers = await getDocs(emailQuery);
      
      if (!existingUsers.empty) {
        throw new Error('A user with this email already exists');
      }

      // Create the Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const newUserId = userCredential.user.uid;

      // Set permissions based on role
      let permissions = userData.permissions || DEFAULT_PERMISSIONS;
      if (userData.role === 'admin') {
        permissions = ADMIN_PERMISSIONS;
      }

      // Create Firestore record with the Auth UID
      const newUser = {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        permissions,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', newUserId), newUser);

      // Sign out the newly created user and re-authenticate as admin
      await signOut(auth);
      await signInWithEmailAndPassword(auth, adminCredentials.email, adminCredentials.password);

      return newUserId;
    } catch (error) {
      console.error('Error creating user with password:', error);
      
      // Try to re-authenticate as admin if something went wrong
      try {
        await signInWithEmailAndPassword(auth, adminCredentials.email, adminCredentials.password);
      } catch (reAuthError) {
        console.error('Error re-authenticating admin:', reAuthError);
      }
      
      throw error;
    }
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(uid: string, permission: keyof UserPermissions): Promise<boolean> {
    try {
      const user = await this.getUserById(uid);
      if (!user || !user.isActive) return false;
      
      return user.permissions[permission] || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Migrate all users to ensure they have complete permission structure
   * This is useful when new permissions are added
   */
  async migrateUserPermissions(): Promise<{ updated: number; errors: number }> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      let updated = 0;
      let errors = 0;
      
      const batch = writeBatch(db);
      
      querySnapshot.forEach((userDoc) => {
        try {
          const data = userDoc.data();
          const currentPermissions = data.permissions || {};
          const mergedPermissions = this.mergePermissions(currentPermissions);
          
          // Check if permissions need updating
          const needsUpdate = Object.keys(DEFAULT_PERMISSIONS).some(
            key => !(key in currentPermissions)
          );
          
          if (needsUpdate) {
            const userDocRef = doc(db, 'users', userDoc.id);
            batch.update(userDocRef, {
              permissions: mergedPermissions,
              updatedAt: serverTimestamp()
            });
            updated++;
          }
        } catch (error) {
          console.error(`Error processing user ${userDoc.id}:`, error);
          errors++;
        }
      });
      
      if (updated > 0) {
        await batch.commit();
        console.log(`Successfully migrated ${updated} users with updated permissions`);
      }
      
      return { updated, errors };
    } catch (error) {
      console.error('Error migrating user permissions:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    adminUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
  }> {
    try {
      const usersRef = collection(db, 'users');
      
      // Get all users
      const allUsersQuery = query(usersRef);
      const allUsersSnapshot = await getDocs(allUsersQuery);
      
      // Get admin users
      const adminUsersQuery = query(usersRef, where('role', '==', 'admin'));
      const adminUsersSnapshot = await getDocs(adminUsersQuery);
      
      // Get active users
      const activeUsersQuery = query(usersRef, where('isActive', '==', true));
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      
      // Get users created this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const newUsersQuery = query(
        usersRef, 
        where('createdAt', '>=', thisMonth),
        orderBy('createdAt', 'desc')
      );
      const newUsersSnapshot = await getDocs(newUsersQuery);
      
      return {
        totalUsers: allUsersSnapshot.size,
        adminUsers: adminUsersSnapshot.size,
        activeUsers: activeUsersSnapshot.size,
        newUsersThisMonth: newUsersSnapshot.size
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalUsers: 0,
        adminUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0
      };
    }
  }

  /**
   * Delete a user (Firestore record only - Firebase Auth account will remain)
   * Only admins can delete users, and admins cannot delete other admins
   */
  async deleteUser(uid: string, currentUserRole: string): Promise<void> {
    try {
      // Only admins can delete users
      if (currentUserRole !== 'admin') {
        throw new Error('Only administrators can delete users');
      }

      // Get the target user data first
      const targetUser = await this.getUserById(uid);
      if (!targetUser) {
        throw new Error('User not found');
      }

      // Prevent admins from deleting other admins (safety measure)
      if (targetUser.role === 'admin') {
        throw new Error('Cannot delete administrator accounts');
      }

      // Actually delete the user document from Firestore
      const userDocRef = doc(db, 'users', uid);
      await deleteDoc(userDocRef);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Search users by email or name
   */
  async searchUsers(searchTerm: string): Promise<UserData[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('email'));
      const querySnapshot = await getDocs(q);
      
      const users: UserData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user = {
          uid: doc.id,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || 'student',
          permissions: data.permissions || DEFAULT_PERMISSIONS,
          isActive: data.isActive !== false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lastLogin: data.lastLogin
        };
        
        // Filter by search term
        const searchLower = searchTerm.toLowerCase();
        if (
          user.email.toLowerCase().includes(searchLower) ||
          user.displayName.toLowerCase().includes(searchLower)
        ) {
          users.push(user);
        }
      });
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

class UserServiceWithConstants extends UserService {
  public static readonly DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS;
  public static readonly ADMIN_PERMISSIONS = ADMIN_PERMISSIONS;
}

const userService = new UserServiceWithConstants();
export default userService; 