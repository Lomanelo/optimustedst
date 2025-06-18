'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  AlertCircle, 
  Calendar, 
  Filter,
  ChevronsUpDown,
  Tag,
  Star,
  StarOff
} from 'lucide-react';
import blogService, { BlogPost } from '../../../src/services/blogService';

export default function AdminBlogPage() {
  const { currentUser, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredUpdating, setFeaturedUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch blog posts if the user is authenticated and an admin
    if (!isLoading && currentUser && userRole === 'admin') {
      const unsubscribe = blogService.listenToBlogPosts((posts) => {
        setBlogPosts(posts);
        setLoading(false);
      }, { 
        sortBy: 'createdAt', 
        sortDirection: sortOrder 
      });
      
      return () => unsubscribe();
    }
  }, [currentUser, userRole, isLoading, sortOrder]);

  const handleDeleteClick = (postId: string) => {
    setDeleteConfirmation(postId);
  };

  const confirmDelete = async (postId: string) => {
    try {
      setDeleteLoading(true);
      await blogService.deleteBlogPost(postId);
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('Failed to delete blog post. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      setFeaturedUpdating(post.id);
      await blogService.updateBlogPost({
        id: post.id,
        featured: !post.featured
      });
    } catch (err) {
      console.error('Error updating featured status:', err);
      setError('Failed to update featured status. Please try again.');
    } finally {
      setFeaturedUpdating(null);
    }
  };

  // Filter and sort functions
  const filteredBlogPosts = blogPosts
    .filter(post => {
      // Status filter
      if (filterStatus !== 'all' && post.status !== filterStatus) return false;
      
      // Search filter
      if (searchTerm && 
        !post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ) return false;
      
      return true;
    });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    // Convert Firebase timestamp to JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage blog posts for your website
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter Posts:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Status filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              
              {/* Sort order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-1 border border-gray-300 rounded-md shadow-sm py-1 px-3 text-sm bg-white hover:bg-gray-50"
              >
                <span>Sort</span>
                <ChevronsUpDown className="h-4 w-4" />
              </button>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm py-1 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blog posts list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        {filteredBlogPosts.length === 0 ? (
          <div className="py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new blog post or adjusting your filters.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/blog/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Blog Post
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {post.coverImage && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img className="h-10 w-10 rounded-md object-cover" src={post.coverImage} alt={post.title} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {post.tags.length > 0 ? (
                          post.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No tags</span>
                        )}
                        {post.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{post.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {post.status === 'published' 
                          ? formatDate(post.publishedAt) 
                          : formatDate(post.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatured(post)}
                        disabled={featuredUpdating === post.id}
                        className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                          featuredUpdating === post.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={post.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {post.featured ? (
                          <Star className="h-5 w-5 text-amber-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {post.status === 'published' && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900"
                            title="View Post"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Post"
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Post"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Delete confirmation */}
                      {deleteConfirmation === post.id && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md absolute right-20 z-10 w-72">
                          <p className="text-sm text-red-700">Are you sure you want to delete this post? This action cannot be undone.</p>
                          <div className="mt-3 flex space-x-3">
                            <button
                              onClick={() => confirmDelete(post.id)}
                              disabled={deleteLoading}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 