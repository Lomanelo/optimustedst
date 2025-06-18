'use client';

import React, { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/auth-context';
import { AlertCircle, Loader2, Image as ImageIcon, Tag as TagIcon, X, ArrowLeft, CheckCircle, Globe } from 'lucide-react';
import blogService, { BlogPost } from '../../../../../src/services/blogService';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBlogPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { currentUser, userRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Language toggles
  const [enableEnglish, setEnableEnglish] = useState(true);
  const [enableArabic, setEnableArabic] = useState(false);

  // Form state - English
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Form state - Arabic
  const [titleAr, setTitleAr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [tagsAr, setTagsAr] = useState<string[]>([]);
  const [tagInputAr, setTagInputAr] = useState('');

  // Shared form state
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featured, setFeatured] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  // Fetch blog post data
  useEffect(() => {
    if (!authLoading && currentUser && userRole === 'admin') {
      fetchBlogPost();
    }
  }, [id, authLoading, currentUser, userRole]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      const post = await blogService.getBlogPostById(id);
      
      if (post) {
        setBlogPost(post);
        
        // Set language toggles based on available content
        const hasEnglish = !!(post.title || post.content);
        const hasArabic = !!(post.title_ar || post.content_ar);
        setEnableEnglish(hasEnglish);
        setEnableArabic(hasArabic);
        
        // Set English content
        setTitle(post.title || '');
        setContent(post.content || '');
        setExcerpt(post.excerpt || '');
        setTags(post.tags || []);
        
        // Set Arabic content
        setTitleAr(post.title_ar || '');
        setContentAr(post.content_ar || '');
        setExcerptAr(post.excerpt_ar || '');
        setTagsAr(post.tags_ar || []);
        
        // Set shared content
        if (post.coverImage) {
          setCoverImage(post.coverImage);
          setImagePreview(post.coverImage);
        }
        setStatus(post.status);
        setFeatured(post.featured || false);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle tag addition - English
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Convert to lowercase and remove special chars
    const formattedTag = tagInput.trim().toLowerCase().replace(/[^\w\s]/g, '');
    
    if (formattedTag && !tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
      setTagInput('');
    }
  };

  // Handle tag addition - Arabic
  const handleAddTagAr = () => {
    if (!tagInputAr.trim()) return;
    
    const formattedTag = tagInputAr.trim();
    
    if (formattedTag && !tagsAr.includes(formattedTag)) {
      setTagsAr([...tagsAr, formattedTag]);
      setTagInputAr('');
    }
  };

  // Handle tag keydown (add on Enter) - English
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle tag keydown (add on Enter) - Arabic
  const handleTagKeyDownAr = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTagAr();
    }
  };

  // Handle tag removal - English
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag removal - Arabic
  const handleRemoveTagAr = (tagToRemove: string) => {
    setTagsAr(tagsAr.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Validate languages
      const languages: ('en' | 'ar')[] = [];
      if (enableEnglish) languages.push('en');
      if (enableArabic) languages.push('ar');
      
      if (languages.length === 0) {
        setError('Please enable at least one language');
        setIsSubmitting(false);
        return;
      }
      
      // Validate form based on enabled languages
      if (enableEnglish && !title.trim()) {
        setError('English title is required');
        setIsSubmitting(false);
        return;
      }
      
      if (enableEnglish && !content.trim()) {
        setError('English content is required');
        setIsSubmitting(false);
        return;
      }

      if (enableArabic && !titleAr.trim()) {
        setError('Arabic title is required');
        setIsSubmitting(false);
        return;
      }
      
      if (enableArabic && !contentAr.trim()) {
        setError('Arabic content is required');
        setIsSubmitting(false);
        return;
      }
      
      // Update blog post
      const postData = {
        id,
        title: title || titleAr, // Use Arabic title as fallback if English not enabled
        title_ar: enableArabic ? titleAr : undefined,
        content: content || contentAr, // Use Arabic content as fallback if English not enabled
        content_ar: enableArabic ? contentAr : undefined,
        excerpt: enableEnglish ? (excerpt || content.substring(0, 160).trim() + '...') : undefined,
        excerpt_ar: enableArabic ? (excerptAr || contentAr.substring(0, 160).trim() + '...') : undefined,
        coverImage: coverImage || undefined,
        tags: enableEnglish ? tags : [],
        tags_ar: enableArabic ? tagsAr : undefined,
        status,
        featured,
        languages
      };
      
      await blogService.updateBlogPost(postData);
      
      // Show success message
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if not admin
  if (!authLoading && (!currentUser || userRole !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blogPost && !isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Blog post not found or you don't have permission to edit it.
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/admin/blog')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          <button
            onClick={() => router.push('/admin/blog')}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Posts
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Edit your blog post with multilingual support
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Blog post updated successfully!</p>
            <p className="text-sm">Redirecting to blog management page...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">There was an error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Blog post form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        {/* Language Settings */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Globe className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Language Settings</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Choose which languages to enable for this blog post</p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                id="enable-english"
                type="checkbox"
                checked={enableEnglish}
                onChange={(e) => setEnableEnglish(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="enable-english" className="ml-2 text-sm font-medium text-gray-700">
                English
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enable-arabic"
                type="checkbox"
                checked={enableArabic}
                onChange={(e) => setEnableArabic(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="enable-arabic" className="ml-2 text-sm font-medium text-gray-700">
                العربية (Arabic)
              </label>
            </div>
          </div>
        </div>

        {/* English Content */}
        {enableEnglish && (
          <div className="mb-8">
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">English Content</h3>
              
              {/* English Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog post title in English"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required={enableEnglish}
                />
              </div>

              {/* English Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content in English"
                  rows={12}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required={enableEnglish}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {content.length} characters
                </p>
              </div>

              {/* English Excerpt */}
              <div className="mb-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Enter a short excerpt in English (if left blank, one will be generated from content)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {excerpt.length}/160 characters
                </p>
              </div>

              {/* English Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-400">(Optional)</span>
                </label>
                
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Enter a tag in English and press Enter"
                    className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="ml-2 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <TagIcon className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary-50 text-primary"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Arabic Content */}
        {enableArabic && (
          <div className="mb-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">المحتوى العربي (Arabic Content)</h3>
              
              {/* Arabic Title */}
              <div className="mb-6">
                <label htmlFor="title-ar" className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان (Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title-ar"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="أدخل عنوان المقال باللغة العربية"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-right"
                  dir="rtl"
                  required={enableArabic}
                />
              </div>

              {/* Arabic Content */}
              <div className="mb-6">
                <label htmlFor="content-ar" className="block text-sm font-medium text-gray-700 mb-1">
                  المحتوى (Content) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content-ar"
                  value={contentAr}
                  onChange={(e) => setContentAr(e.target.value)}
                  placeholder="اكتب محتوى المقال باللغة العربية"
                  rows={12}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-right"
                  dir="rtl"
                  required={enableArabic}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {contentAr.length} حرف
                </p>
              </div>

              {/* Arabic Excerpt */}
              <div className="mb-6">
                <label htmlFor="excerpt-ar" className="block text-sm font-medium text-gray-700 mb-1">
                  المقتطف (Excerpt) <span className="text-gray-400">(اختياري)</span>
                </label>
                <textarea
                  id="excerpt-ar"
                  value={excerptAr}
                  onChange={(e) => setExcerptAr(e.target.value)}
                  placeholder="أدخل مقتطفاً قصيراً باللغة العربية (إذا تُرك فارغاً، سيتم إنشاؤه من المحتوى)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-right"
                  dir="rtl"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {excerptAr.length}/160 حرف
                </p>
              </div>

              {/* Arabic Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العلامات (Tags) <span className="text-gray-400">(اختياري)</span>
                </label>
                
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={tagInputAr}
                    onChange={(e) => setTagInputAr(e.target.value)}
                    onKeyDown={handleTagKeyDownAr}
                    placeholder="أدخل علامة باللغة العربية واضغط Enter"
                    className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-right"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={handleAddTagAr}
                    className="ml-2 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <TagIcon className="h-4 w-4 mr-1" />
                    إضافة
                  </button>
                </div>
                
                {tagsAr.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagsAr.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                        dir="rtl"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTagAr(tag)}
                          className="mr-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-700 hover:bg-blue-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cover Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image <span className="text-gray-400">(Optional)</span>
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Cover preview" 
                className="mt-2 w-full max-h-60 object-cover rounded-md" 
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-2 text-center cursor-pointer hover:border-primary"
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Click to upload a cover image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <p className="mt-2 text-xs text-amber-600">
            Note: Images are stored as base64 data directly in the database. Please keep images small for better performance.
          </p>
        </div>

        {/* Publication Settings */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="mt-1 space-y-4">
              <div className="flex items-center">
                <input
                  id="draft"
                  name="status"
                  type="radio"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="draft" className="ml-3 block text-sm font-medium text-gray-700">
                  Save as Draft
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="published"
                  name="status"
                  type="radio"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="published" className="ml-3 block text-sm font-medium text-gray-700">
                  Publish Immediately
                </label>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Post
            </label>
            <div className="mt-1 space-y-4">
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-3 block text-sm font-medium text-gray-700">
                  Mark as Featured
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Featured posts will be highlighted on the blog page
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              'Update Blog Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 