'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Trash2, 
  Star, 
  StarOff, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon,
  Move,
  Eye,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ProgramPhoto } from '../../src/services/programService';
import programService from '../../src/services/programService';

interface ProgramPhotoManagerProps {
  programId: string;
  photos: ProgramPhoto[];
  onPhotosUpdate: (photos: ProgramPhoto[]) => void;
  language?: 'en' | 'ar';
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const ProgramPhotoManager: React.FC<ProgramPhotoManagerProps> = ({
  programId,
  photos = [],
  onPhotosUpdate,
  language = 'en'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    description: string;
    description_ar: string;
    altText: string;
    altText_ar: string;
  }>({
    description: '',
    description_ar: '',
    altText: '',
    altText_ar: ''
  });
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRtl = language === 'ar';

  // Sort photos by display order
  const sortedPhotos = [...photos].sort((a, b) => a.displayOrder - b.displayOrder);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  // Handle file selection and upload
  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!files.length) return;

    clearMessages();
    setUploading(true);
    
    const uploadPromises: Promise<void>[] = [];
    const newUploadProgress: UploadProgress[] = [];

    // Initialize progress tracking
    Array.from(files).forEach(file => {
      newUploadProgress.push({
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      });
    });
    setUploadProgress(newUploadProgress);

    Array.from(files).forEach((file, index) => {
      const uploadPromise = async () => {
        try {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            throw new Error('Only image files are allowed');
          }

          // Validate file size (50MB max for high quality)
          if (file.size > 50 * 1024 * 1024) {
            throw new Error('File size must be less than 50MB');
          }

          // Update progress
          setUploadProgress(prev => prev.map((item, i) => 
            i === index ? { ...item, progress: 50 } : item
          ));

          // Upload the photo
          const newPhoto = await programService.uploadProgramPhoto(
            programId,
            file,
            '', // description
            '', // description_ar
            '', // altText
            '', // altText_ar
            photos.length === 0 // Make first photo primary
          );

          // Update progress to completed
          setUploadProgress(prev => prev.map((item, i) => 
            i === index ? { ...item, progress: 100, status: 'completed' } : item
          ));

          console.log('Photo uploaded:', newPhoto);
        } catch (err) {
          console.error('Upload error:', err);
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          
          setUploadProgress(prev => prev.map((item, i) => 
            i === index ? { ...item, status: 'error', error: errorMessage } : item
          ));
        }
      };

      uploadPromises.push(uploadPromise());
    });

    try {
      await Promise.all(uploadPromises);
      
      // Refresh photos list
      const updatedPhotos = await programService.getProgramPhotos(programId);
      onPhotosUpdate(updatedPhotos);
      
      showSuccess(`Successfully uploaded ${files.length} photo(s) at maximum quality`);
    } catch (err) {
      console.error('Batch upload error:', err);
      showError('Some uploads failed. Check individual file status.');
    } finally {
      setUploading(false);
      // Clear progress after delay
      setTimeout(() => setUploadProgress([]), 3000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [programId, photos.length, onPhotosUpdate]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Delete photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      clearMessages();
      await programService.deleteProgramPhoto(programId, photoId);
      
      // Refresh photos list
      const updatedPhotos = await programService.getProgramPhotos(programId);
      onPhotosUpdate(updatedPhotos);
      
      showSuccess(isRtl ? 'تم حذف الصورة بنجاح' : 'Photo deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      showError(isRtl ? 'فشل في حذف الصورة' : 'Failed to delete photo');
    }
  };

  // Set primary photo
  const handleSetPrimary = async (photoId: string) => {
    try {
      clearMessages();
      await programService.setPrimaryProgramPhoto(programId, photoId);
      
      // Refresh photos list
      const updatedPhotos = await programService.getProgramPhotos(programId);
      onPhotosUpdate(updatedPhotos);
      
      showSuccess(isRtl ? 'تم تعيين الصورة كصورة رئيسية' : 'Photo set as primary');
    } catch (err) {
      console.error('Set primary error:', err);
      showError(isRtl ? 'فشل في تعيين الصورة الرئيسية' : 'Failed to set primary photo');
    }
  };

  // Start editing photo
  const startEditingPhoto = (photo: ProgramPhoto) => {
    setEditingPhoto(photo.id);
    setEditData({
      description: photo.description || '',
      description_ar: photo.description_ar || '',
      altText: photo.altText || '',
      altText_ar: photo.altText_ar || ''
    });
  };

  // Save photo edits
  const savePhotoEdits = async () => {
    if (!editingPhoto) return;

    try {
      clearMessages();
      await programService.updateProgramPhoto(programId, editingPhoto, editData);
      
      // Refresh photos list
      const updatedPhotos = await programService.getProgramPhotos(programId);
      onPhotosUpdate(updatedPhotos);
      
      setEditingPhoto(null);
      showSuccess(isRtl ? 'تم تحديث الصورة بنجاح' : 'Photo updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      showError(isRtl ? 'فشل في تحديث الصورة' : 'Failed to update photo');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPhoto(null);
    setEditData({
      description: '',
      description_ar: '',
      altText: '',
      altText_ar: ''
    });
  };

  // Handle photo reordering
  const handleDragStart = (e: React.DragEvent, photoId: string) => {
    setDraggedPhoto(photoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReorder = async (e: React.DragEvent, targetPhotoId: string) => {
    e.preventDefault();
    
    if (!draggedPhoto || draggedPhoto === targetPhotoId) {
      setDraggedPhoto(null);
      return;
    }

    try {
      clearMessages();
      
      // Create new order
      const reorderedPhotos = [...sortedPhotos];
      const draggedIndex = reorderedPhotos.findIndex(p => p.id === draggedPhoto);
      const targetIndex = reorderedPhotos.findIndex(p => p.id === targetPhotoId);
      
      // Move the dragged photo
      const [movedPhoto] = reorderedPhotos.splice(draggedIndex, 1);
      reorderedPhotos.splice(targetIndex, 0, movedPhoto);
      
      // Update display orders
      const photoIds = reorderedPhotos.map(p => p.id);
      
      await programService.reorderProgramPhotos(programId, photoIds);
      
      // Refresh photos list
      const updatedPhotos = await programService.getProgramPhotos(programId);
      onPhotosUpdate(updatedPhotos);
      
      showSuccess(isRtl ? 'تم إعادة ترتيب الصور بنجاح' : 'Photos reordered successfully');
    } catch (err) {
      console.error('Reorder error:', err);
      showError(isRtl ? 'فشل في إعادة ترتيب الصور' : 'Failed to reorder photos');
    } finally {
      setDraggedPhoto(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {isRtl ? 'إدارة صور البرنامج' : 'Program Photo Management'}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Upload className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
            {isRtl ? 'رفع صور' : 'Upload Photos'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <div className="flex">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {isRtl ? 'تقدم الرفع' : 'Upload Progress'}
          </h4>
          <div className="space-y-2">
            {uploadProgress.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.fileName}</span>
                  <span className="text-sm text-gray-500">
                    {item.status === 'completed' ? '100%' : 
                     item.status === 'error' ? 'Error' : `${item.progress}%`}
                  </span>
                </div>
                {item.status !== 'error' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.error && (
                  <p className="text-sm text-red-600 mt-1">{item.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag and Drop Area */}
      {photos.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isRtl ? 'لا توجد صور للبرنامج' : 'No program photos'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isRtl ? 'اسحب وأفلت الصور هنا أو انقر على رفع صور' : 'Drag and drop photos here or click upload'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {isRtl ? 'جودة عالية - يتم الحفاظ على الجودة الأصلية' : 'High Quality - Original quality preserved'}
          </p>
        </div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPhotos.map((photo) => (
            <div
              key={photo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, photo.id)}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDropReorder(e, photo.id)}
              onDragOver={(e) => e.preventDefault()}
              className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg cursor-move ${
                photo.isPrimary ? 'border-yellow-400 ring-2 ring-yellow-400 ring-opacity-50' : 'border-gray-200'
              } ${draggedPhoto === photo.id ? 'opacity-50' : ''}`}
            >
              {/* Photo */}
              <div className="aspect-video relative">
                <img
                  src={photo.url}
                  alt={photo.altText || photo.fileName}
                  className="w-full h-full object-cover"
                />
                
                {/* Primary badge */}
                {photo.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 inline mr-1" />
                    {isRtl ? 'رئيسية' : 'Primary'}
                  </div>
                )}

                {/* Drag handle */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                  <Move className="h-4 w-4" />
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-3">
                {editingPhoto === photo.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={isRtl ? 'وصف الصورة' : 'Photo description'}
                      value={language === 'ar' ? editData.description_ar : editData.description}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        [language === 'ar' ? 'description_ar' : 'description']: e.target.value
                      }))}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder={isRtl ? 'النص البديل' : 'Alt text'}
                      value={language === 'ar' ? editData.altText_ar : editData.altText}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        [language === 'ar' ? 'altText_ar' : 'altText']: e.target.value
                      }))}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="flex space-x-1">
                      <button
                        onClick={savePhotoEdits}
                        className="flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700"
                      >
                        <Save className="h-3 w-3 inline mr-1" />
                        {isRtl ? 'حفظ' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 bg-gray-600 text-white text-xs py-1 px-2 rounded hover:bg-gray-700"
                      >
                        <X className="h-3 w-3 inline mr-1" />
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-600 mb-2 truncate" title={photo.fileName}>
                      {photo.fileName}
                    </p>
                    {(photo.description || photo.description_ar) && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {language === 'ar' ? photo.description_ar : photo.description}
                      </p>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleSetPrimary(photo.id)}
                        disabled={photo.isPrimary}
                        className={`flex-1 text-xs py-1 px-2 rounded transition-colors ${
                          photo.isPrimary 
                            ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed' 
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                        title={isRtl ? 'تعيين كصورة رئيسية' : 'Set as primary'}
                      >
                        {photo.isPrimary ? <Star className="h-3 w-3 inline" /> : <StarOff className="h-3 w-3 inline" />}
                      </button>
                      
                      <button
                        onClick={() => startEditingPhoto(photo)}
                        className="flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700"
                        title={isRtl ? 'تعديل' : 'Edit'}
                      >
                        <Edit3 className="h-3 w-3 inline" />
                      </button>
                      
                      <button
                        onClick={() => window.open(photo.url, '_blank')}
                        className="flex-1 bg-gray-600 text-white text-xs py-1 px-2 rounded hover:bg-gray-700"
                        title={isRtl ? 'عرض' : 'View'}
                      >
                        <Eye className="h-3 w-3 inline" />
                      </button>
                      
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="flex-1 bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700"
                        title={isRtl ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="h-3 w-3 inline" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Add More Photos Card */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors aspect-video"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isRtl ? 'إضافة المزيد من الصور' : 'Add More Photos'}
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              {isRtl ? 'جودة عالية' : 'Max Quality'}
            </p>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          {isRtl ? 'معلومات مهمة' : 'Important Information'}
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {isRtl ? 'يتم الحفاظ على الجودة الأصلية للصور (بدون ضغط)' : 'Original image quality is preserved (no compression)'}</li>
          <li>• {isRtl ? 'حد أقصى لحجم الملف: 50 ميجابايت' : 'Maximum file size: 50MB'}</li>
          <li>• {isRtl ? 'صيغ مدعومة: JPG, PNG, WebP, GIF' : 'Supported formats: JPG, PNG, WebP, GIF'}</li>
          <li>• {isRtl ? 'اسحب وأفلت الصور لإعادة ترتيبها' : 'Drag and drop photos to reorder them'}</li>
          <li>• {isRtl ? 'الصورة الرئيسية تظهر كصورة مميزة' : 'Primary photo appears as featured image'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgramPhotoManager;
