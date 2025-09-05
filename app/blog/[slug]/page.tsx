'use client';

import React, { useState, useEffect, use } from 'react';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ClientLayout from '../../components/ClientLayout';
import { Calendar, Clock, Tag as TagIcon, ArrowLeft, Share2, User } from 'lucide-react';
import blogService, { BlogPost } from '../../../src/services/blogService';
import { useCMS } from '../../contexts/cms-context';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { currentLanguage } = useCMS();
  
  // State
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get blog post by slug
        const post = await blogService.getBlogPostBySlug(slug);
        
        if (!post) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }
        
        setBlogPost(post);
        
        // Increment view count
        await blogService.incrementViewCount(post.id);
        
        // Get related posts (posts with similar tags)
        if (post.tags.length > 0) {
          // Get posts with the first tag
          const tagPosts = await blogService.getBlogPostsByTag(post.tags[0], 4);
          // Filter out the current post and limit to 3
          const filtered = tagPosts
            .filter(p => p.id !== post.id)
            .slice(0, 3);
          setRelatedPosts(filtered);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);
  
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content?.trim().split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

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
  
  if (loading) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }
  
  if (error || !blogPost) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || 'Blog post not found'}</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/blog')}
                className="flex items-center text-primary hover:text-primary-dark"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </button>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout>
      <Head>
        <title>{blogPost.seoTitle || getLocalizedContent(blogPost, 'title')}</title>
        {blogPost.seoDescription && (
          <meta name="description" content={blogPost.seoDescription} />
        )}
        {blogPost.robots?.noindex && (
          <meta name="robots" content={`${blogPost.robots.noindex ? 'noindex' : 'index'}, ${blogPost.robots.nofollow ? 'nofollow' : 'follow'}`} />
        )}
        {/* Open Graph basics */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blogPost.seoTitle || getLocalizedContent(blogPost, 'title')} />
        <meta property="og:description" content={blogPost.seoDescription || getLocalizedContent(blogPost, 'excerpt')} />
        {blogPost.coverImage && <meta property="og:image" content={blogPost.coverImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={`bg-gray-50 min-h-screen ${currentLanguage === 'ar' ? 'rtl-content' : ''}`}>
        {/* Hero Section with Cover Image */}
        {blogPost.coverImage && (
          <div className="w-full h-80 md:h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10"></div>
            <img 
              src={blogPost.coverImage} 
              alt={getLocalizedContent(blogPost, 'title')} 
              className="w-full h-full object-cover"
            />
            <div className="container mx-auto px-4 absolute inset-0 z-20 flex items-center">
              <div className="max-w-3xl text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {getLocalizedContent(blogPost, 'title')}
                </h1>
                <div className="flex items-center space-x-4 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(blogPost.publishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{calculateReadingTime(getLocalizedContent(blogPost, 'content'))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8">
          {/* Content Layout */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Back Button (Mobile Only) */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => router.push('/blog')}
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </button>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Post Header (if no cover image) */}
                {!blogPost.coverImage && (
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {getLocalizedContent(blogPost, 'title')}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(blogPost.publishedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{calculateReadingTime(getLocalizedContent(blogPost, 'content'))}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Post Content */}
                <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
                  {/* JSON-LD Article Schema */}
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: blogPost.seoTitle || getLocalizedContent(blogPost, 'title'),
                        description: blogPost.seoDescription || getLocalizedContent(blogPost, 'excerpt'),
                        image: blogPost.coverImage ? [blogPost.coverImage] : undefined,
                        author: { '@type': 'Person', name: blogPost.author?.name },
                        datePublished: blogPost.publishedAt || blogPost.createdAt,
                        dateModified: blogPost.updatedAt,
                      })
                    }}
                  />
                  {/* Tags */}
                  {getLocalizedTags(blogPost).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {getLocalizedTags(blogPost).map((tag, index) => (
                        <Link
                          key={index}
                          href={`/blog?tag=${tag}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Content rendered via Markdown */}
                  <div className={`prose max-w-none ${currentLanguage === 'ar' ? 'rtl-content' : ''}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{getLocalizedContent(blogPost, 'content') || ''}</ReactMarkdown>
                  </div>
                  
                  {/* Share Links */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-4">Share this article:</span>
                      <div className="flex space-x-2">
                                              <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getLocalizedContent(blogPost, 'title'))}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        aria-label="Share on Twitter"
                      >
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                          aria-label="Share on Facebook"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(getLocalizedContent(blogPost, 'title'))}`, '_blank')}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                          aria-label="Share on LinkedIn"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Author Info */}
                <div className="bg-white shadow-sm rounded-lg p-6 mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {blogPost.author.avatarUrl ? (
                        <img 
                          src={blogPost.author.avatarUrl} 
                          alt={blogPost.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {blogPost.author.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Author
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-4">
                {/* Back Button (Desktop) */}
                <div className="hidden lg:block mb-8">
                  <button
                    onClick={() => router.push('/blog')}
                    className="flex items-center text-primary hover:text-primary-dark"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </button>
                </div>
                
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white shadow-sm rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((post) => (
                        <div key={post.id} className="flex items-start">
                          {post.coverImage && (
                            <div className="flex-shrink-0 w-16 h-16 mr-4">
                              <img
                                src={post.coverImage}
                                alt={getLocalizedContent(post, 'title')}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                              <Link 
                                href={`/blog/${post.slug}`}
                                className="hover:text-primary"
                              >
                                {getLocalizedContent(post, 'title')}
                              </Link>
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(post.publishedAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/blog"
                        className="text-primary font-medium hover:text-primary-dark"
                      >
                        View All Articles
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                {getLocalizedTags(blogPost).length > 0 && (
                  <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {getLocalizedTags(blogPost).map((tag, index) => (
                        <Link
                          key={index}
                          href={`/blog?tag=${tag}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 