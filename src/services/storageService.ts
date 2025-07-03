import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage with progress tracking
 * @param file The file to upload
 * @param path The storage path
 * @param onProgress Optional callback for progress updates
 * @returns A promise that resolves to the download URL
 */
export const uploadFile = async (
  file: File, 
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    console.log('Starting file upload:', { fileName: file.name, path, size: file.size });
    
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file: File is empty or not provided');
    }

    // Set timeout for upload
    const uploadTimeout = 60000; // 60 seconds
    
    const storageRef = ref(storage, path);
    
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - please try again')), uploadTimeout);
    });
    
    // Upload with timeout
    const uploadPromise = uploadBytes(storageRef, file);
    
    const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
    
    console.log('Upload completed, getting download URL...');
    
    // Get download URL with timeout
    const urlPromise = getDownloadURL(snapshot.ref);
    const urlTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Download URL timeout - please try again')), 10000);
    });
    
    const downloadURL = await Promise.race([urlPromise, urlTimeoutPromise]) as string;
    
    console.log('File uploaded successfully:', downloadURL);
    return downloadURL;
    
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('You do not have permission to upload files. Please ensure you are logged in.');
    } else if (error.code === 'storage/invalid-url') {
      throw new Error('Invalid file path. Please try again.');
    } else if (error.code === 'storage/retry-limit-exceeded') {
      throw new Error('Upload failed after multiple attempts. Please check your internet connection.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload was canceled. Please try again.');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Upload timeout. Please check your internet connection and try again.');
    } else {
      throw new Error(`Upload failed: ${error.message || 'Please try again'}`);
    }
  }
};

/**
 * Upload an image as a data URL (base64)
 * This is a simplified approach that doesn't require Firebase Storage
 * For production, consider using proper cloud storage
 */
export const uploadImageAsDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Compress an image before upload
 * This can be used to reduce file size
 */
export const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const img = new Image();
      img.src = event.target.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

export default {
  uploadFile,
  uploadImageAsDataUrl,
  compressImage
}; 