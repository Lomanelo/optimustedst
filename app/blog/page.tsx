'use client';

import React, { useState, useEffect, Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '../components/ClientLayout';
import { Calendar, Clock, Tag as TagIcon, ChevronLeft, ChevronRight, Filter, ChevronsUpDown, Search, X } from 'lucide-react';
import blogService, { BlogPost } from '../../src/services/blogService';
import { useCMS } from '../contexts/cms-context';

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLanguage, getContent } = useCMS();
  
  // State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams?.get('tag'));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all tags
        const allTags = await blogService.getAllTags();
        setTags(allTags);
        
        // Get featured posts
        const featured = await blogService.getFeaturedBlogPosts();
        setFeaturedPosts(featured);
        
        // Get all published posts or filtered by tag
        let blogPosts;
        if (selectedTag) {
          blogPosts = await blogService.getBlogPostsByTag(selectedTag);
        } else {
          blogPosts = await blogService.getPublishedBlogPosts();
        }
        
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedTag]);
  
  // Helper function to get content in current language
  const getLocalizedContent = (post: BlogPost, field: 'title' | 'excerpt' | 'content') => {
    if (currentLanguage === 'ar') {
      const arField = `${field}_ar` as keyof BlogPost;
      return (post[arField] as string) || post[field];
    }
    return post[field];
  };

  // Helper function to get tags in current language
  const getLocalizedTags = (post: BlogPost) => {
    if (currentLanguage === 'ar' && post.tags_ar) {
      return post.tags_ar;
    }
    return post.tags || [];
  };

  // Filter posts by search term
  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    const title = getLocalizedContent(post, 'title');
    const excerpt = getLocalizedContent(post, 'excerpt');
    const tags = getLocalizedTags(post);
    
    return (
      title.toLowerCase().includes(term) ||
      excerpt.toLowerCase().includes(term) ||
      tags.some(tag => tag.toLowerCase().includes(term))
    );
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  // Handle tag selection
  const handleTagClick = (tag: string) => {
    if (tag === selectedTag) {
      // Deselect the tag
      setSelectedTag(null);
      router.push('/blog');
    } else {
      setSelectedTag(tag);
      router.push(`/blog?tag=${tag}`);
    }
    setCurrentPage(1);
  };
  
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };
  
  return (
    <div className={`container mx-auto px-4 py-8 ${currentLanguage === 'ar' ? 'rtl-content' : ''}`}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {currentLanguage === 'ar' ? 'المدونة والرؤى' : 'Blog & Insights'}
        </h1>
      </div>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && !selectedTag && !searchTerm && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentLanguage === 'ar' ? 'المقالات المميزة' : 'Featured Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                {post.coverImage && (
                  <div className="h-48 w-full overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={getLocalizedContent(post, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{calculateReadingTime(getLocalizedContent(post, 'content'))}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {getLocalizedContent(post, 'title')}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getLocalizedContent(post, 'excerpt')}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-medium hover:text-primary-dark transition-colors"
                  >
                    {currentLanguage === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder={getContent('search_articles_placeholder') || 'Search articles...'}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  router.push('/blog');
                }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
              >
                <X className="h-3 w-3 mr-1" />
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Blog Posts */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8">
          {error}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">{getContent('blog_noBlogPosts')}</p>
          {(selectedTag || searchTerm) && (
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearchTerm('');
                router.push('/blog');
              }}
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                {post.coverImage && (
                  <div className="h-48 w-full overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={getLocalizedContent(post, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{calculateReadingTime(getLocalizedContent(post, 'content'))}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {getLocalizedContent(post, 'title')}
                  </h3>
                  {getLocalizedTags(post).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {getLocalizedTags(post).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          onClick={() => handleTagClick(tag)}
                          className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {getLocalizedTags(post).length > 3 && (
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{getLocalizedTags(post).length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getLocalizedContent(post, 'excerpt')}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-medium hover:text-primary-dark transition-colors"
                  >
                    {currentLanguage === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BlogPageFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Blog & Insights</h1>
        <p className="text-xl text-gray-600">
          Latest news, updates and educational insights
        </p>
      </div>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <ClientLayout>
      <Suspense fallback={<BlogPageFallback />}>
        <BlogContent />
      </Suspense>
    </ClientLayout>
  );
} 