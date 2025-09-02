import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

export interface Program {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  shortDescription?: string;
  shortDescription_ar?: string;
  category: string;
  category_ar?: string;
  specialization?: string;
  specialization_ar?: string;
  level: string;
  type: string;
  type_ar?: string;
  duration: string;
  duration_ar?: string;
  durationWeeks: number;
  durationHours?: number;
  price: number;
  thumbnail?: string;
  photos?: ProgramPhoto[];
  brochure_en?: string;
  brochure_ar?: string;
  requirements?: string[];
  requirements_ar?: string[];
  whatYouWillLearn?: string[];
  whatYouWillLearn_ar?: string[];
  modules?: ProgramModule[];
  modules_ar?: ProgramModule[];
  coreLearnings?: string[];
  coreLearnings_ar?: string[];
  instructorId?: string;
  status: 'published' | 'draft';
  enrollments?: number;
  languages: ('en' | 'ar')[];
  exclusive?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface ProgramPhoto {
  id: string;
  url: string;
  fileName: string;
  description?: string;
  description_ar?: string;
  altText?: string;
  altText_ar?: string;
  isPrimary?: boolean;
  displayOrder: number;
  uploadedAt: any;
}

export interface ProgramModule {
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  lessons: ProgramLesson[];
}

export interface ProgramLesson {
  title: string;
  title_ar?: string;
  type: string;
  type_ar?: string;
  description: string;
  description_ar?: string;
  duration?: number;
  videoUrl?: string;
  materials?: string[];
  materials_ar?: string[];
}

export interface CreateProgramData {
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  shortDescription?: string;
  shortDescription_ar?: string;
  category: string;
  category_ar?: string;
  level: string;
  type: string;
  type_ar?: string;
  duration: string;
  duration_ar?: string;
  durationWeeks: number;
  durationHours?: number;
  price: number;
  thumbnail?: File | string;
  brochure_en?: File | string;
  brochure_ar?: File | string;
  requirements?: string[];
  requirements_ar?: string[];
  whatYouWillLearn?: string[];
  whatYouWillLearn_ar?: string[];
  modules?: ProgramModule[];
  modules_ar?: ProgramModule[];
  coreLearnings?: string[];
  coreLearnings_ar?: string[];
  instructorId?: string;
  status: 'published' | 'draft';
  languages: ('en' | 'ar')[];
  exclusive?: boolean;
}

export interface UpdateProgramData extends Partial<CreateProgramData> {
  id: string;
}

export interface ProgramFilters {
  status?: 'published' | 'draft' | 'all';
  category?: string;
  level?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

class ProgramService {
  private programsRef = collection(db, 'programs');

  /**
   * Get all programs (admin-created only)
   */
  async getAllPrograms(): Promise<Program[]> {
    try {
      // Get admin-created programs
      return await this.getAdminPrograms();
    } catch (error) {
      console.error('Error fetching all programs:', error);
      throw error;
    }
  }

  /**
   * Get only admin-created programs from Firestore
   */
  async getAdminPrograms(filters?: ProgramFilters): Promise<Program[]> {
    try {
      let programQuery = this.programsRef;
      const constraints = [];

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }

      if (filters?.level) {
        constraints.push(where('level', '==', filters.level));
      }

      if (filters?.type) {
        constraints.push(where('type', '==', filters.type));
      }

      // Add sorting
      if (filters?.sortBy) {
        constraints.push(orderBy(filters.sortBy, filters.sortDirection || 'desc'));
      } else {
        constraints.push(orderBy('createdAt', 'desc'));
      }

      // Add limit
      if (filters?.limit) {
        constraints.push(limit(filters.limit));
      }

      const q = query(programQuery, ...constraints);
      const snapshot = await getDocs(q);

      const programs: Program[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        programs.push({
          id: doc.id,
          ...data
        } as Program);
      });

      // Apply text search filter (client-side for now)
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        return programs.filter(program => 
          program.title.toLowerCase().includes(searchTerm) ||
          program.description.toLowerCase().includes(searchTerm) ||
          program.category.toLowerCase().includes(searchTerm)
        );
      }

      return programs;
    } catch (error) {
      console.error('Error fetching admin programs:', error);
      throw error;
    }
  }

  /**
   * Get published programs for public display
   */
  async getPublishedPrograms(): Promise<Program[]> {
    try {
      const q = query(this.programsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const programs: Program[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        programs.push({
          id: doc.id,
          ...data
        } as Program);
      });
      
      return programs;
    } catch (error) {
      console.error('Error fetching published programs:', error);
      throw error;
    }
  }

  /**
   * Get a single program by ID
   */
  async getProgramById(id: string): Promise<Program | null> {
    try {
      const docRef = doc(this.programsRef, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Program;
      }

      return null;
    } catch (error) {
      console.error('Error fetching program by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new program
   */
  async createProgram(data: CreateProgramData): Promise<string> {
    try {
      console.log('Raw input data:', data);
      
      // First, try creating a minimal document to test basic Firestore write
      const minimalData = {
        title: data.title || 'Test Program',
        status: 'draft',
        createdAt: serverTimestamp()
      };
      
      console.log('Testing minimal document creation...');
      try {
        const testDocRef = await addDoc(this.programsRef, minimalData);
        console.log('Minimal document created successfully:', testDocRef.id);
        
        // If successful, delete the test document
        await deleteDoc(doc(this.programsRef, testDocRef.id));
        console.log('Test document deleted');
      } catch (testError) {
        console.error('Failed to create even minimal document:', testError);
        throw new Error('Basic Firestore write failed. Check your Firestore security rules and authentication.');
      }

      // Now try with fuller data, adding fields incrementally
      const basicData = {
        title: String(data.title || ''),
        description: String(data.description || ''),
        category: String(data.category || ''),
        level: String(data.level || ''),
        type: String(data.type || ''),
        duration: String(data.duration || ''),
        price: Number(data.price) || 0,
        status: String(data.status) || 'draft',
        enrollments: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Creating program with basic data:', basicData);
      const docRef = await addDoc(this.programsRef, basicData);
      console.log('Program created with ID:', docRef.id);
      
      // If basic creation works, try updating with additional fields
      if (data.requirements && data.requirements.length > 0) {
        try {
          await updateDoc(doc(this.programsRef, docRef.id), {
            requirements: data.requirements.filter(req => req && req.trim() !== '')
          });
          console.log('Requirements added successfully');
        } catch (error) {
          console.warn('Failed to add requirements:', error);
        }
      }

      if (data.whatYouWillLearn && data.whatYouWillLearn.length > 0) {
        try {
          await updateDoc(doc(this.programsRef, docRef.id), {
            whatYouWillLearn: data.whatYouWillLearn.filter(item => item && item.trim() !== '')
          });
          console.log('Learning outcomes added successfully');
        } catch (error) {
          console.warn('Failed to add learning outcomes:', error);
        }
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating program:', error);
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : {
        message: String(error),
        name: 'Unknown',
        stack: undefined
      };
      console.error('Error details:', errorDetails);
      throw error;
    }
  }

  /**
   * Update an existing program
   */
  async updateProgram(data: UpdateProgramData): Promise<void> {
    try {
      const { id, ...updateData } = data;
      const docRef = doc(this.programsRef, id);

      let thumbnailUrl = updateData.thumbnail;

      // Upload new thumbnail if it's a File
      if (updateData.thumbnail instanceof File) {
        // Delete old thumbnail if exists
        const existingProgram = await this.getProgramById(id);
        if (existingProgram?.thumbnail) {
          await this.deleteThumbnail(existingProgram.thumbnail);
        }
        thumbnailUrl = await this.uploadThumbnail(updateData.thumbnail);
      }

      const programData = {
        ...updateData,
        thumbnail: thumbnailUrl,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, programData);
      console.log('Program updated:', id);
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  }

  /**
   * Delete a program
   */
  async deleteProgram(id: string): Promise<void> {
    try {
      // Get program data to delete associated files
      const program = await this.getProgramById(id);
      
      // Delete thumbnail if exists
      if (program?.thumbnail) {
        await this.deleteThumbnail(program.thumbnail);
      }

      // Delete the document
      const docRef = doc(this.programsRef, id);
      await deleteDoc(docRef);
      console.log('Program deleted:', id);
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }

  /**
   * Update program status
   */
  async updateProgramStatus(id: string, status: 'published' | 'draft'): Promise<void> {
    try {
      const docRef = doc(this.programsRef, id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
      console.log('Program status updated:', id, status);
    } catch (error) {
      console.error('Error updating program status:', error);
      throw error;
    }
  }

  /**
   * Bulk update program status
   */
  async bulkUpdateStatus(ids: string[], status: 'published' | 'draft'): Promise<void> {
    try {
      const promises = ids.map(id => this.updateProgramStatus(id, status));
      await Promise.all(promises);
      console.log('Bulk status update completed for', ids.length, 'programs');
    } catch (error) {
      console.error('Error in bulk status update:', error);
      throw error;
    }
  }

  /**
   * Bulk delete programs
   */
  async bulkDeletePrograms(ids: string[]): Promise<void> {
    try {
      const promises = ids.map(id => this.deleteProgram(id));
      await Promise.all(promises);
      console.log('Bulk delete completed for', ids.length, 'programs');
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  /**
   * Listen to program changes in real-time
   */
  listenToPrograms(callback: (programs: Program[]) => void, filters?: ProgramFilters): () => void {
    try {
      let programQuery = this.programsRef;
      const constraints = [];

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        constraints.push(where('status', '==', filters.status));
      }

      // Add sorting
      if (filters?.sortBy) {
        constraints.push(orderBy(filters.sortBy, filters.sortDirection || 'desc'));
      } else {
        constraints.push(orderBy('createdAt', 'desc'));
      }

      const q = query(programQuery, ...constraints);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const programs: Program[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          programs.push({
            id: doc.id,
            ...data
          } as Program);
        });

        callback(programs);
      }, (error) => {
        console.error('Error listening to programs:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up programs listener:', error);
      return () => {};
    }
  }

  /**
   * Get program statistics
   */
  async getProgramStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    totalRevenue: number;
    totalEnrollments: number;
  }> {
    try {
      const allPrograms = await this.getAllPrograms();

      const published = allPrograms.filter(p => p.status === 'published').length;
      const draft = allPrograms.filter(p => p.status === 'draft').length;
      
      const totalEnrollments = allPrograms.reduce((sum, p) => sum + (p.enrollments || 0), 0);
      const totalRevenue = allPrograms.reduce((sum, p) => sum + (p.enrollments || 0) * p.price, 0);

      return {
        total: allPrograms.length,
        published,
        draft,
        totalRevenue,
        totalEnrollments
      };
    } catch (error) {
      console.error('Error getting program stats:', error);
      throw error;
    }
  }

  /**
   * Search programs
   */
  async searchPrograms(searchTerm: string): Promise<Program[]> {
    try {
      const allPrograms = await this.getAllPrograms();
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      
      return allPrograms.filter(program => 
        program.title.toLowerCase().includes(lowercaseSearchTerm) ||
        program.description.toLowerCase().includes(lowercaseSearchTerm) ||
        (program.category && program.category.toLowerCase().includes(lowercaseSearchTerm)) ||
        (program.specialization && program.specialization.toLowerCase().includes(lowercaseSearchTerm))
      );
    } catch (error) {
      console.error('Error searching programs:', error);
      throw error;
    }
  }

  /**
   * Upload thumbnail image
   */
  private async uploadThumbnail(file: File): Promise<string> {
    try {
      const fileName = `program_thumbnails/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, fileName);
      
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      
      // Check for various Firebase Storage error conditions
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code || '';
      
      // Common Firebase Storage errors that should trigger fallback
      const storageErrors = [
        'storage',
        'CORS', 
        'ERR_FAILED',
        'net::ERR_FAILED',
        'storage/unknown',
        'storage/unauthorized',
        'storage/unauthenticated',
        'storage/retry-limit-exceeded',
        'firebasestorage.googleapis.com',
        'preflight'
      ];
      
      const isStorageError = storageErrors.some(errorType => 
        errorMessage.toLowerCase().includes(errorType.toLowerCase()) ||
        errorCode.includes(errorType)
      );
      
      if (isStorageError) {
        console.warn('Firebase Storage error detected, using base64 fallback:', errorMessage);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      throw error;
    }
  }

  /**
   * Delete thumbnail image
   */
  private async deleteThumbnail(thumbnailUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const urlParts = thumbnailUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];
      
      if (fileName.includes('program_thumbnails')) {
        const fileRef = ref(storage, fileName);
        await deleteObject(fileRef);
      }
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      // Don't throw here, as the main operation should still succeed
    }
  }

  /**
   * Get featured programs (published with high enrollment)
   */
  async getFeaturedPrograms(limit: number = 6): Promise<Program[]> {
    try {
      const publishedPrograms = await this.getPublishedPrograms();
      
      // Sort by enrollments and take top programs
      return publishedPrograms
        .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured programs:', error);
      throw error;
    }
  }

  /**
   * Get programs by category
   */
  async getProgramsByCategory(category: string): Promise<Program[]> {
    try {
      const allPrograms = await this.getPublishedPrograms();
      return allPrograms.filter(program => 
        program.category.toLowerCase() === category.toLowerCase() ||
        (program.specialization && program.specialization.toLowerCase() === category.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching programs by category:', error);
      throw error;
    }
  }

  /**
   * Get programs by level
   */
  async getProgramsByLevel(level: string): Promise<Program[]> {
    try {
      const allPrograms = await this.getPublishedPrograms();
      return allPrograms.filter(program => program.level === level);
    } catch (error) {
      console.error('Error fetching programs by level:', error);
      throw error;
    }
  }

  /**
   * Set up a real-time listener for admin-created programs changes
   * This listener will fire whenever programs are added, updated or deleted
   */
  listenToAdminProgramChanges(callback: (programs: Program[]) => void): () => void {
    try {
      // Create a query for all admin programs
      const q = query(this.programsRef, orderBy('createdAt', 'desc'));
      
      // Set up the real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const programs: Program[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          programs.push({
            id: doc.id,
            ...data
          } as Program);
        });
        
        callback(programs);
      }, (error) => {
        console.error('Error listening to program changes:', error);
      });
      
      // Return the unsubscribe function to clean up the listener when needed
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up program listener:', error);
      // Return a no-op function in case of error
      return () => {};
    }
  }

  /**
   * Set up a real-time listener for published programs changes
   */
  listenToPublishedProgramChanges(callback: (programs: Program[]) => void): () => void {
    try {
      // Query for published admin programs
      const q = query(this.programsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
      
      // Set up the real-time listener
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const programs: Program[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          programs.push({
            id: doc.id,
            ...data
          } as Program);
        });
        
        callback(programs);
      }, (error) => {
        console.error('Error listening to published program changes:', error);
      });
      
      // Return the unsubscribe function
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up published program listener:', error);
      return () => {};
    }
  }

  /**
   * Upload a photo for a program with maximum quality preservation
   */
  async uploadProgramPhoto(
    programId: string, 
    file: File, 
    description?: string, 
    description_ar?: string,
    altText?: string,
    altText_ar?: string,
    isPrimary: boolean = false
  ): Promise<ProgramPhoto> {
    try {
      console.log('Uploading program photo:', { programId, fileName: file.name, size: file.size, isPrimary });

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `program_photos/${programId}/${timestamp}.${fileExtension}`;
      
      // Upload with maximum quality (no compression for program photos)
      console.log('Uploading program photo with max quality...');
      console.log('Storage configuration:', {
        bucket: storage.app.options.storageBucket,
        projectId: storage.app.options.projectId
      });
      
      // Use the exact same upload method as program creation page
      let downloadURL: string;
      try {
        // Try upload using the same method as program creation
        const { uploadFile } = await import('../services/storageService');
        downloadURL = await uploadFile(file, fileName);
        console.log('Program photo uploaded successfully via storage service');
      } catch (uploadError: any) {
        console.error('Storage service upload failed:', uploadError);
        
        // For CORS issues, try uploadImageAsDataUrl like in program creation
        if (uploadError.message?.includes('CORS') || 
            uploadError.code === 'storage/unknown' ||
            uploadError.message?.includes('cross-origin')) {
          console.log('CORS issue detected, falling back to data URL...');
          const { uploadImageAsDataUrl } = await import('../services/storageService');
          downloadURL = await uploadImageAsDataUrl(file);
          console.log('Photo uploaded as data URL successfully');
        } else {
          throw uploadError;
        }
      }
      
      // Create photo metadata
      const photoId = `photo_${timestamp}`;
      const photoData: ProgramPhoto = {
        id: photoId,
        url: downloadURL,
        fileName: file.name,
        description: description || '',
        description_ar: description_ar || '',
        altText: altText || '',
        altText_ar: altText_ar || '',
        isPrimary,
        displayOrder: 0, // Will be set properly when added to program
        uploadedAt: new Date() // Use regular Date instead of serverTimestamp in arrays
      };

      // Get current program to update photos array
      const program = await this.getProgramById(programId);
      if (!program) {
        throw new Error('Program not found');
      }

      const currentPhotos = program.photos || [];
      
      // If this is set as primary, make sure no other photo is primary
      if (isPrimary) {
        currentPhotos.forEach(photo => {
          photo.isPrimary = false;
        });
      }

      // Set display order
      photoData.displayOrder = currentPhotos.length;

      // Add the new photo
      const updatedPhotos = [...currentPhotos, photoData];

      // Update program with new photos array
      const programRef = doc(this.programsRef, programId);
      await updateDoc(programRef, {
        photos: updatedPhotos,
        updatedAt: serverTimestamp()
      });

      console.log('Program photo uploaded successfully:', photoData);
      return photoData;
    } catch (error) {
      console.error('Error uploading program photo:', error);
      throw error;
    }
  }

  /**
   * Delete a photo from a program
   */
  async deleteProgramPhoto(programId: string, photoId: string): Promise<void> {
    try {
      console.log('Deleting program photo:', { programId, photoId });

      // Get current program
      const program = await this.getProgramById(programId);
      if (!program || !program.photos) {
        throw new Error('Program or photos not found');
      }

      // Find the photo to delete
      const photoToDelete = program.photos.find(photo => photo.id === photoId);
      if (!photoToDelete) {
        throw new Error('Photo not found');
      }

      // Delete from Firebase Storage
      try {
        const fileName = `program_photos/${programId}/${photoToDelete.url.split('/').pop()?.split('?')[0]}`;
        const fileRef = ref(storage, fileName);
        await deleteObject(fileRef);
        console.log('Photo deleted from storage');
      } catch (storageError) {
        console.warn('Failed to delete photo from storage:', storageError);
        // Continue with database update even if storage delete fails
      }

      // Remove from photos array
      const updatedPhotos = program.photos.filter(photo => photo.id !== photoId);

      // Reorder remaining photos
      updatedPhotos.forEach((photo, index) => {
        photo.displayOrder = index;
      });

      // Update program
      const programRef = doc(this.programsRef, programId);
      await updateDoc(programRef, {
        photos: updatedPhotos,
        updatedAt: serverTimestamp()
      });

      console.log('Program photo deleted successfully');
    } catch (error) {
      console.error('Error deleting program photo:', error);
      throw error;
    }
  }

  /**
   * Update photo metadata (description, alt text, primary status)
   */
  async updateProgramPhoto(
    programId: string, 
    photoId: string, 
    updates: Partial<Pick<ProgramPhoto, 'description' | 'description_ar' | 'altText' | 'altText_ar' | 'isPrimary'>>
  ): Promise<void> {
    try {
      console.log('Updating program photo:', { programId, photoId, updates });

      // Get current program
      const program = await this.getProgramById(programId);
      if (!program || !program.photos) {
        throw new Error('Program or photos not found');
      }

      // Find and update the photo
      const updatedPhotos = program.photos.map(photo => {
        if (photo.id === photoId) {
          // If setting as primary, remove primary from others
          if (updates.isPrimary && !photo.isPrimary) {
            program.photos?.forEach(p => {
              if (p.id !== photoId) p.isPrimary = false;
            });
          }
          return { ...photo, ...updates };
        }
        // If another photo is being set as primary, remove primary from this one
        if (updates.isPrimary && photo.isPrimary && photo.id !== photoId) {
          return { ...photo, isPrimary: false };
        }
        return photo;
      });

      // Update program
      const programRef = doc(this.programsRef, programId);
      await updateDoc(programRef, {
        photos: updatedPhotos,
        updatedAt: serverTimestamp()
      });

      console.log('Program photo updated successfully');
    } catch (error) {
      console.error('Error updating program photo:', error);
      throw error;
    }
  }

  /**
   * Reorder program photos
   */
  async reorderProgramPhotos(programId: string, photoIds: string[]): Promise<void> {
    try {
      console.log('Reordering program photos:', { programId, photoIds });

      // Get current program
      const program = await this.getProgramById(programId);
      if (!program || !program.photos) {
        throw new Error('Program or photos not found');
      }

      // Create a map for quick lookup
      const photoMap = new Map(program.photos.map(photo => [photo.id, photo]));

      // Reorder photos based on the provided order
      const reorderedPhotos = photoIds
        .map(id => photoMap.get(id))
        .filter(photo => photo !== undefined)
        .map((photo, index) => ({
          ...photo!,
          displayOrder: index
        }));

      // Update program
      const programRef = doc(this.programsRef, programId);
      await updateDoc(programRef, {
        photos: reorderedPhotos,
        updatedAt: serverTimestamp()
      });

      console.log('Program photos reordered successfully');
    } catch (error) {
      console.error('Error reordering program photos:', error);
      throw error;
    }
  }

  /**
   * Set a photo as the primary photo for a program
   */
  async setPrimaryProgramPhoto(programId: string, photoId: string): Promise<void> {
    try {
      await this.updateProgramPhoto(programId, photoId, { isPrimary: true });
    } catch (error) {
      console.error('Error setting primary program photo:', error);
      throw error;
    }
  }

  /**
   * Get photos for a specific program
   */
  async getProgramPhotos(programId: string): Promise<ProgramPhoto[]> {
    try {
      const program = await this.getProgramById(programId);
      if (!program) {
        throw new Error('Program not found');
      }
      
      return program.photos || [];
    } catch (error) {
      console.error('Error getting program photos:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const programService = new ProgramService();
export default programService; 