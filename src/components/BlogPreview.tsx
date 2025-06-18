'use client';

import React, { useState, useEffect } from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import blogService, { BlogPost } from '../services/blogService';

const BlogPreview: React.FC = () => {
  const { getContent, loading: cmsLoading } = useCMS();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        // Get the latest 3 published blog posts
        const posts = await blogService.getPublishedBlogPosts(3);
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Don't render if CMS is still loading
  if (cmsLoading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Create placeholder blog posts if no real posts exist
  const fallbackPosts = [
    {
      id: 'fallback-1',
      title: getContent('blog_post1_title'),
      excerpt: getContent('blog_post1_excerpt'),
      slug: 'future-of-business-education',
      coverImage: '/grabbedPhotos/blog/blog1.jpg'
    },
    {
      id: 'fallback-2',
      title: getContent('blog_post2_title'),
      excerpt: getContent('blog_post2_excerpt'),
      slug: 'leadership-digital-age',
      coverImage: '/grabbedPhotos/blog/blog2.jpg'
    },
    {
      id: 'fallback-3',
      title: getContent('blog_post3_title'),
      excerpt: getContent('blog_post3_excerpt'),
      slug: 'building-tomorrows-workforce',
      coverImage: '/grabbedPhotos/blog/blog3.jpg'
    }
  ];

  // Use real blog posts if available, otherwise use fallback
  const postsToDisplay = loading 
    ? [] 
    : blogPosts.length > 0 
      ? blogPosts 
      : fallbackPosts;

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {getContent('blog_preview_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getContent('blog_preview_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {getContent('blog_preview_title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getContent('blog_preview_subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {postsToDisplay.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={post.coverImage || '/grabbedPhotos/blog/blog1.jpg'} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <a 
                  href={`/blog/${post.slug}`} 
                  className="text-accent font-medium hover:underline"
                >
                  {getContent('blog_read_more')}
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/blog" 
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {getContent('blog_view_all')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview; 