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

    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Check if this is a thumbnail upload
    const isThumbnail = path.includes('thumbnail') || path.includes('thumbnails');
    
    // In development mode, always use base64 for all files to avoid CORS issues
    if (isDevelopment) {
      console.log('Development environment detected, using base64 encoding for file');
      
      // For thumbnails, preserve original quality
      if (isThumbnail) {
        console.log('Thumbnail detected in development, preserving original quality with base64');
        const base64Url = await uploadImageAsDataUrl(file);
        console.log('Thumbnail converted to base64 successfully with original quality');
        return base64Url;
      }
      
      // For images, compress them before converting to base64
      if (file.type.startsWith('image/')) {
        try {
          console.log('Compressing image before converting to base64...');
          const compressedFile = await compressImage(file, 400, 0.6); // Smaller size, medium quality
          const base64Url = await uploadImageAsDataUrl(compressedFile);
          console.log('Image compressed and converted to base64 successfully');
          return base64Url;
        } catch (compressionError) {
          console.warn('Image compression failed, using original file for base64:', compressionError);
          const base64Url = await uploadImageAsDataUrl(file);
          console.log('Original file converted to base64 successfully');
          return base64Url;
        }
      } else {
        // For non-image files
        const base64Url = await uploadImageAsDataUrl(file);
        console.log('File converted to base64 successfully');
        return base64Url;
      }
    }
    
    // For production environment
    let fileToUpload: File | Blob = file;
    if (!isThumbnail && file.type.startsWith('image/') && file.size > 500000) { // Only compress large non-thumbnail images
      try {
        console.log('Compressing image before upload...');
        fileToUpload = await compressImage(file, 800, 0.7);
        console.log(`Image compressed: ${file.size} -> ${fileToUpload.size} bytes`);
      } catch (compressionError) {
        console.warn('Image compression failed, using original file:', compressionError);
        fileToUpload = file; // Use original file if compression fails
      }
    } else if (isThumbnail) {
      console.log('Thumbnail detected, preserving original quality');
      fileToUpload = file; // Always use original file for thumbnails
    }

    // Set timeout for upload
    const uploadTimeout = 60000; // 60 seconds
    
    const storageRef = ref(storage, path);
    
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - please try again')), uploadTimeout);
    });
    
    // Upload with timeout
    const uploadPromise = uploadBytes(storageRef, fileToUpload);
    
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
    
    // Check if this is a CORS error or network error
    if (error.message?.includes('CORS') || 
        error.message?.includes('cross-origin') ||
        error.code === 'storage/unknown' ||
        error.code === 'storage/network-error' ||
        error.name === 'AbortError') {
      
      console.log('CORS or network error detected, falling back to base64 storage...');
      
      // Check if this is a thumbnail upload
      const isThumbnail = path.includes('thumbnail') || path.includes('thumbnails');
      
      // Fall back to base64 encoding
      try {
        // For thumbnails, preserve original quality
        if (isThumbnail) {
          console.log('Thumbnail detected in fallback, preserving original quality with base64');
          const base64Url = await uploadImageAsDataUrl(file);
          console.log('Thumbnail converted to base64 successfully with original quality');
          return base64Url;
        }
        
        // For non-thumbnail images, compress them before converting to base64
        if (file.type.startsWith('image/') && !isThumbnail) {
          const compressedFile = await compressImage(file, 300, 0.5); // Smaller size, lower quality
          const base64Url = await uploadImageAsDataUrl(compressedFile);
          console.log('Image compressed and converted to base64 successfully');
          return base64Url;
        } else {
          // For non-image files, use original quality
          const base64Url = await uploadImageAsDataUrl(file);
          console.log('File converted to base64 with original quality');
          return base64Url;
        }
      } catch (base64Error) {
        console.error('Base64 fallback also failed:', base64Error);
        throw new Error('Both Firebase Storage and base64 fallback failed. Please check your internet connection.');
      }
    }
    
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
              // Create a new File object with the same name but compressed content
              const compressedFile = new Blob([blob], { type: mimeType });
              resolve(compressedFile);
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