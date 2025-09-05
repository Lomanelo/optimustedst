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
  Timestamp,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  QueryLimitConstraint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

export interface BlogPost {
  id: string;
  title: string;
  title_ar?: string;
  slug: string;
  content: string;
  content_ar?: string;
  excerpt: string;
  excerpt_ar?: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  tags: string[];
  tags_ar?: string[];
  status: 'published' | 'draft';
  featured: boolean;
  views: number;
  languages: ('en' | 'ar')[];
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
  };
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

export interface CreateBlogPostData {
  title: string;
  title_ar?: string;
  content: string;
  content_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  coverImage?: File | string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  tags?: string[];
  tags_ar?: string[];
  status: 'published' | 'draft';
  featured?: boolean;
  languages: ('en' | 'ar')[];
  // Optional SEO fields
  seoTitle?: string;
  seoDescription?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
  };
  // Optional custom slug (sanitized and de-duplicated)
  customSlug?: string;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

export interface BlogPostFilters {
  status?: 'published' | 'draft' | 'all';
  tag?: string;
  featured?: boolean;
  search?: string;
  authorId?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

class BlogService {
  private blogPostsRef = collection(db, 'blogPosts');

  /**
   * Generate a slug from a title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      + '-' + Date.now().toString().slice(-6);
  }

  /**
   * Sanitize a user-provided slug
   */
  public sanitizeSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Check if a slug is available (optionally excluding a specific post id)
   */
  public async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const qSlug = query(this.blogPostsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(qSlug);
    if (snapshot.empty) return true;
    const docSnap = snapshot.docs[0];
    if (excludeId && docSnap.id === excludeId) return true;
    return false;
  }

  /**
   * Get all blog posts with optional filters
   */
  async getAllBlogPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
    try {
      // Create separate arrays for different types of constraints
      const whereConstraints: QueryFieldFilterConstraint[] = [];
      const orderByConstraints: QueryOrderByConstraint[] = [];
      const limitConstraints: QueryLimitConstraint[] = [];

      // Apply filters to where constraints
      if (filters?.status && filters.status !== 'all') {
        whereConstraints.push(where('status', '==', filters.status));
      }

      if (filters?.tag) {
        whereConstraints.push(where('tags', 'array-contains', filters.tag));
      }

      if (filters?.featured !== undefined) {
        whereConstraints.push(where('featured', '==', filters.featured));
      }

      if (filters?.authorId) {
        whereConstraints.push(where('author.id', '==', filters.authorId));
      }

      // Add sorting to orderBy constraints
      if (filters?.sortBy) {
        orderByConstraints.push(orderBy(filters.sortBy, filters.sortDirection || 'desc'));
      } else {
        orderByConstraints.push(orderBy('createdAt', 'desc'));
      }

      // Add limit constraint if specified
      if (filters?.limit) {
        limitConstraints.push(limit(filters.limit));
      }

      // Combine all constraints
      const q = query(
        this.blogPostsRef,
        ...whereConstraints,
        ...orderByConstraints,
        ...limitConstraints
      );

      const snapshot = await getDocs(q);

      const blogPosts: BlogPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        blogPosts.push({
          id: doc.id,
          ...data
        } as BlogPost);
      });

      // Apply text search filter (client-side for now)
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        return blogPosts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt?.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      return blogPosts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get published blog posts
   */
  async getPublishedBlogPosts(limitCount?: number): Promise<BlogPost[]> {
    try {
      // Create separate arrays for different types of constraints
      const whereConstraints = [where('status', '==', 'published')];
      const orderByConstraints = [orderBy('publishedAt', 'desc')];
      const limitConstraints = limitCount ? [limit(limitCount)] : [];

      // Combine all constraints
      const q = query(
        this.blogPostsRef, 
        ...whereConstraints, 
        ...orderByConstraints, 
        ...limitConstraints
      );
      
      const snapshot = await getDocs(q);
      
      const blogPosts: BlogPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        blogPosts.push({
          id: doc.id,
          ...data
        } as BlogPost);
      });
      
      return blogPosts;
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      throw error;
    }
  }

  /**
   * Get featured blog posts
   */
  async getFeaturedBlogPosts(limitCount: number = 4): Promise<BlogPost[]> {
    try {
      // Create separate arrays for different types of constraints
      const whereConstraints = [
        where('status', '==', 'published'),
        where('featured', '==', true)
      ];
      const orderByConstraints = [orderBy('publishedAt', 'desc')];
      const limitConstraints = [limit(limitCount)];

      // Combine all constraints
      const q = query(
        this.blogPostsRef, 
        ...whereConstraints,
        ...orderByConstraints,
        ...limitConstraints
      );
      
      const snapshot = await getDocs(q);
      
      const blogPosts: BlogPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        blogPosts.push({
          id: doc.id,
          ...data
        } as BlogPost);
      });
      
      return blogPosts;
    } catch (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }
  }

  /**
   * Get blog posts by tag
   */
  async getBlogPostsByTag(tag: string, limitCount?: number): Promise<BlogPost[]> {
    try {
      // Create separate arrays for different types of constraints
      const whereConstraints = [
        where('status', '==', 'published'),
        where('tags', 'array-contains', tag)
      ];
      const orderByConstraints = [orderBy('publishedAt', 'desc')];
      const limitConstraints = limitCount ? [limit(limitCount)] : [];

      // Combine all constraints
      const q = query(
        this.blogPostsRef, 
        ...whereConstraints, 
        ...orderByConstraints, 
        ...limitConstraints
      );
      
      const snapshot = await getDocs(q);
      
      const blogPosts: BlogPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        blogPosts.push({
          id: doc.id,
          ...data
        } as BlogPost);
      });
      
      return blogPosts;
    } catch (error) {
      console.error('Error fetching blog posts by tag:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by ID
   */
  async getBlogPostById(id: string): Promise<BlogPost | null> {
    try {
      const docRef = doc(this.blogPostsRef, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as BlogPost;
      }

      return null;
    } catch (error) {
      console.error('Error fetching blog post by ID:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(this.blogPostsRef, where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as BlogPost;
      }

      return null;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }
  }

  /**
   * Create a new blog post
   */
  async createBlogPost(data: CreateBlogPostData): Promise<string> {
    try {
      // Resolve slug: use sanitized custom slug if provided and available; otherwise generate
      let slug = this.generateSlug(data.title);
      if (data.customSlug) {
        const desired = this.sanitizeSlug(data.customSlug);
        const available = await this.isSlugAvailable(desired);
        slug = available ? desired : this.generateSlug(desired);
      }
      
      // Process the excerpt if not provided
      const excerpt = data.excerpt || data.content.substring(0, 160).trim() + '...';
      const excerpt_ar = data.excerpt_ar || (data.content_ar ? data.content_ar.substring(0, 160).trim() + '...' : undefined);
      
      // Upload cover image if it's a File
      let coverImageUrl = '';
      if (data.coverImage instanceof File) {
        coverImageUrl = await this.uploadCoverImage(data.coverImage);
      } else if (typeof data.coverImage === 'string') {
        coverImageUrl = data.coverImage;
      }
      
      // Prepare the blog post data
      const blogPostData: any = {
        title: data.title,
        slug,
        content: data.content,
        excerpt,
        coverImage: coverImageUrl,
        author: {
          id: data.authorId,
          name: data.authorName,
          avatarUrl: data.authorAvatarUrl || ''
        },
        tags: data.tags || [],
        status: data.status,
        featured: data.featured || false,
        views: 0,
        languages: data.languages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(data.status === 'published' ? { publishedAt: serverTimestamp() } : {})
      };

      // Apply SEO fields if provided
      if (data.seoTitle) blogPostData.seoTitle = data.seoTitle;
      if (data.seoDescription) blogPostData.seoDescription = data.seoDescription;
      if (data.robots) blogPostData.robots = { ...data.robots };

      // Add Arabic content if provided
      if (data.title_ar) blogPostData.title_ar = data.title_ar;
      if (data.content_ar) blogPostData.content_ar = data.content_ar;
      if (excerpt_ar) blogPostData.excerpt_ar = excerpt_ar;
      if (data.tags_ar) blogPostData.tags_ar = data.tags_ar;
      
      // Add the blog post to Firestore
      const docRef = await addDoc(this.blogPostsRef, blogPostData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * Update an existing blog post
   */
  async updateBlogPost(data: UpdateBlogPostData): Promise<void> {
    try {
      const { id, ...updateData } = data;
      const docRef = doc(this.blogPostsRef, id);
      
      // Get current blog post data
      const blogPost = await this.getBlogPostById(id);
      if (!blogPost) {
        throw new Error('Blog post not found');
      }
      
      // Process cover image
      let coverImageUrl = blogPost.coverImage;
      if (data.coverImage instanceof File) {
        // Delete old cover image if it exists
        if (blogPost.coverImage) {
          await this.deleteCoverImage(blogPost.coverImage);
        }
        coverImageUrl = await this.uploadCoverImage(data.coverImage);
      } else if (typeof data.coverImage === 'string') {
        coverImageUrl = data.coverImage;
      }
      
      // Helper to strip undefined values from an object
      const removeUndefined = (obj: Record<string, any>) => {
        const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
        return entries.reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {} as Record<string, any>);
      };

      // Prepare update data without undefined fields
      const cleanedInput = removeUndefined(updateData as Record<string, any>);
      const blogPostUpdateData: any = {
        ...cleanedInput,
        coverImage: coverImageUrl,
        updatedAt: serverTimestamp()
      };
      
      // Update author info if provided
      if (data.authorId || data.authorName || data.authorAvatarUrl) {
        blogPostUpdateData.author = {
          id: data.authorId || blogPost.author.id,
          name: data.authorName || blogPost.author.name,
          avatarUrl: data.authorAvatarUrl || blogPost.author.avatarUrl
        };
      }
      
      // If changing status to published, set publishedAt timestamp
      if (data.status === 'published' && blogPost.status !== 'published') {
        blogPostUpdateData.publishedAt = serverTimestamp();
      }
      
      // If title is changed and no explicit customSlug, update the slug
      if (data.title && data.title !== blogPost.title && !(updateData as any).customSlug) {
        blogPostUpdateData.slug = this.generateSlug(data.title);
      }

      // If customSlug provided, sanitize and ensure availability
      const maybeCustom = (cleanedInput as any).customSlug as string | undefined;
      if (maybeCustom) {
        const desired = this.sanitizeSlug(maybeCustom);
        const available = await this.isSlugAvailable(desired, id);
        blogPostUpdateData.slug = available ? desired : this.generateSlug(desired);
        delete (blogPostUpdateData as any).customSlug;
      }
      
      // If content is changed but excerpt isn't provided, update the excerpt
      if (data.content && !data.excerpt) {
        blogPostUpdateData.excerpt = data.content.substring(0, 160).trim() + '...';
      }
      
      // Final clean to ensure no undefined values slip through
      const finalUpdate = removeUndefined(blogPostUpdateData);
      await updateDoc(docRef, finalUpdate);
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete a blog post
   */
  async deleteBlogPost(id: string): Promise<void> {
    try {
      // Get blog post data to delete cover image
      const blogPost = await this.getBlogPostById(id);
      
      // Delete cover image if exists
      if (blogPost?.coverImage) {
        await this.deleteCoverImage(blogPost.coverImage);
      }

      // Delete the document
      const docRef = doc(this.blogPostsRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Update blog post status
   */
  async updateBlogPostStatus(id: string, status: 'published' | 'draft'): Promise<void> {
    try {
      const docRef = doc(this.blogPostsRef, id);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      
      // If publishing, set publishedAt timestamp
      if (status === 'published') {
        updateData.publishedAt = serverTimestamp();
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating blog post status:', error);
      throw error;
    }
  }

  /**
   * Update blog post view count
   */
  async incrementViewCount(id: string): Promise<void> {
    try {
      const docRef = doc(this.blogPostsRef, id);
      await updateDoc(docRef, {
        views: Timestamp.now() // Using timestamp as a hack to use Firestore's increment() functionality
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Silent failure - don't interrupt user experience
    }
  }

  /**
   * Listen to blog post changes in real-time
   */
  listenToBlogPosts(callback: (blogPosts: BlogPost[]) => void, filters?: BlogPostFilters): () => void {
    try {
      // Create separate arrays for different types of constraints
      const whereConstraints: QueryFieldFilterConstraint[] = [];
      const orderByConstraints: QueryOrderByConstraint[] = [];
      const limitConstraints: QueryLimitConstraint[] = [];

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        whereConstraints.push(where('status', '==', filters.status));
      }

      // Add sorting
      if (filters?.sortBy) {
        orderByConstraints.push(orderBy(filters.sortBy, filters.sortDirection || 'desc'));
      } else {
        orderByConstraints.push(orderBy('createdAt', 'desc'));
      }

      // Add limit if specified
      if (filters?.limit) {
        limitConstraints.push(limit(filters.limit));
      }

      // Combine all constraints
      const q = query(
        this.blogPostsRef,
        ...whereConstraints,
        ...orderByConstraints,
        ...limitConstraints
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const blogPosts: BlogPost[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          blogPosts.push({
            id: doc.id,
            ...data
          } as BlogPost);
        });

        callback(blogPosts);
      }, (error) => {
        console.error('Error listening to blog posts:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up blog posts listener:', error);
      return () => {};
    }
  }

  /**
   * Upload cover image
   */
  private async uploadCoverImage(file: File): Promise<string> {
    // Always use base64 encoding for simplicity and to avoid CORS issues
    console.log('Using base64 encoding for image');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Base64 conversion successful');
        // Optimize the image before saving
        this.optimizeImage(reader.result as string, 1200, 0.8)
          .then(optimizedImage => {
            console.log('Image optimized successfully');
            resolve(optimizedImage);
          })
          .catch(err => {
            console.error('Image optimization failed, using original:', err);
            resolve(reader.result as string);
          });
      };
      reader.onerror = (e) => {
        console.error('Error converting to base64:', e);
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Optimize a base64 image by resizing it and adjusting quality
   */
  private optimizeImage(base64Image: string, maxWidth: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.warn('Could not get canvas context');
            resolve(base64Image);
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert back to base64 with quality setting
          const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedBase64);
        };
        
        img.onerror = () => {
          console.warn('Failed to load image for optimization');
          resolve(base64Image);
        };
        
        img.src = base64Image;
      } catch (err) {
        console.error('Error optimizing image:', err);
        resolve(base64Image);
      }
    });
  }

  /**
   * Delete cover image
   */
  private async deleteCoverImage(imageUrl: string): Promise<void> {
    // No need to delete base64 images
    console.log('Skipping deletion for base64 image');
    return;
  }

  /**
   * Get all unique tags from published blog posts
   */
  async getAllTags(): Promise<string[]> {
    try {
      const q = query(this.blogPostsRef, where('status', '==', 'published'));
      const snapshot = await getDocs(q);
      
      const tagsSet = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => tagsSet.add(tag));
        }
      });
      
      return Array.from(tagsSet).sort();
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }
}

// Export singleton instance
export const blogService = new BlogService();
export default blogService; 