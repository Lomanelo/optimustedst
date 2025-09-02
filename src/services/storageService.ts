import { storage, auth } from '../firebase/firebase';
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

    // Check if this is a thumbnail or program photo upload
    const isThumbnail = path.includes('thumbnail') || path.includes('thumbnails');
    const isProgramPhoto = path.includes('program_photos');
    
    // For program photos and thumbnails, ALWAYS preserve maximum quality (no compression)
    let fileToUpload: File | Blob = file;
    if (isProgramPhoto || isThumbnail) {
      console.log('Program photo or thumbnail detected - preserving MAXIMUM QUALITY (no compression)');
      console.log(`Original file size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      fileToUpload = file; // Use original file without any compression
    } else if (file.type.startsWith('image/') && file.size > 500000) {
      // Only compress other images that are not program photos or thumbnails
      try {
        console.log('Compressing large image before upload...');
        fileToUpload = await compressImage(file, 800, 0.8);
        console.log(`Image compressed: ${file.size} -> ${fileToUpload.size} bytes`);
      } catch (compressionError) {
        console.warn('Image compression failed, using original file:', compressionError);
        fileToUpload = file;
      }
    }

    // Upload to Firebase Storage
    const storageRef = ref(storage, path);
    console.log('Uploading to Firebase Storage...');
    console.log('Storage bucket:', storage.app.options.storageBucket);
    
    const snapshot = await uploadBytes(storageRef, fileToUpload);
    console.log('Upload completed, getting download URL...');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File uploaded successfully:', downloadURL);
    
    return downloadURL;
    
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Check for CORS errors early (before processing other errors)
    if (error.message?.includes('CORS') || 
        error.message?.includes('cross-origin') ||
        error.message?.includes('blocked by CORS') ||
        error.code === 'storage/unknown') {
      console.log('CORS error detected in storage service');
      const corsError = new Error('CORS configuration issue detected');
      (corsError as any).code = 'storage/cors';
      (corsError as any).isCorsError = true;
      (corsError as any).originalError = error;
      throw corsError;
    }
    
    // Provide user-friendly error messages
    if (error.code === 'storage/unauthorized') {
      console.error('Storage permission error. Path:', path);
      console.error('User auth state:', !!auth?.currentUser);
      console.error('Error details:', error);
      throw new Error('Storage permission denied. Please ensure you have admin or programs permission and try refreshing the page.');
    } else if (error.code === 'storage/invalid-url') {
      throw new Error('Invalid file path. Please try again.');
    } else if (error.code === 'storage/retry-limit-exceeded') {
      throw new Error('Upload failed after multiple attempts. Please check your internet connection.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload was canceled. Please try again.');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Upload timeout. Please check your internet connection and try again.');
    } else {
      console.error('Unexpected upload error:', error);
      throw new Error(`Upload failed: ${error.message || 'Please try again'}`);
    }
  }
};

/**
 * Upload an image as a data URL (base64)
 * This is a simplified approach that doesn't require Firebase Storage
 * For production, consider using proper cloud storage
 */
export const uploadImageAsDataUrl = async (file: File | Blob): Promise<string> => {
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
        
        // For PNG files, try to keep transparency
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          mimeType,
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