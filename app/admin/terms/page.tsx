'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useRouter } from 'next/navigation';
import termsService, { TermsDocument } from '../../../src/services/termsService';
import { 
  BookOpen, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Globe, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  X,
  Languages
} from 'lucide-react';

export default function AdminTermsPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  
  const [documents, setDocuments] = useState<TermsDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<TermsDocument | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeDocuments: 0,
    draftDocuments: 0,
    termsDocuments: 0,
    privacyDocuments: 0,
  });

  // Redirect if no access to terms management
  useEffect(() => {
    if (!isLoading && (!currentUser || !canManageTerms())) {
      router.push('/admin/dashboard');
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  // Load documents and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [documentsData, statsData] = await Promise.all([
          termsService.getAllDocuments(),
          termsService.getDocumentStats()
        ]);
        
        setDocuments(documentsData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading terms documents:', err);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && canManageTerms()) {
      loadData();
    }
  }, [currentUser, userRole, hasPermission]);

  const canManageTerms = () => {
    return userRole === 'admin' || hasPermission('terms');
  };

  const handleCreateDocument = () => {
    setEditingDocument(null);
    setShowCreateModal(true);
  };

  const handleEditDocument = (document: TermsDocument) => {
    setEditingDocument(document);
    setShowCreateModal(true);
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await termsService.deleteDocument(id, currentUser?.uid || '');
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      // Refresh stats
      const statsData = await termsService.getDocumentStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    }
  };

  const handlePublishDocument = async (id: string) => {
    try {
      await termsService.publishDocument(id, currentUser?.uid || '');
      // Refresh documents
      const documentsData = await termsService.getAllDocuments();
      setDocuments(documentsData);
      // Refresh stats
      const statsData = await termsService.getDocumentStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error publishing document:', err);
      setError('Failed to publish document');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    try {
      return timestamp.toDate ? timestamp.toDate().toLocaleDateString() : new Date(timestamp).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (document: TermsDocument) => {
    if (document.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Published
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <XCircle className="w-3 h-3 mr-1" />
          Draft
        </span>
      );
    }
  };

  const getTypeBadge = (type: 'terms' | 'privacy') => {
    const colors = {
      terms: 'bg-blue-100 text-blue-800',
      privacy: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type]}`}>
        <BookOpen className="w-3 h-3 mr-1" />
        {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
      </span>
    );
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!canManageTerms()) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
              <p className="mt-2 text-sm text-red-700">
                You don't have permission to manage terms and privacy documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms & Privacy Management</h1>
            <p className="text-gray-600 mt-1">Manage legal documents in both English and Arabic</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Languages className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'ar')}
                className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <button
              onClick={handleCreateDocument}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeDocuments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draftDocuments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.termsDocuments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Privacy</p>
              <p className="text-2xl font-bold text-gray-900">{stats.privacyDocuments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Legal Documents</h3>
        </div>
        
        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first legal document.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateDocument}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
              >
                Create Document
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedLanguage === 'en' ? document.title : (document.title_ar || document.title)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedLanguage === 'en' ? 'English' : 'Arabic'} version
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(document.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(document)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      v{document.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(document.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditDocument(document)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {!document.isActive && (
                          <button
                            onClick={() => handlePublishDocument(document.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Publish"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <DocumentEditModal
          document={editingDocument}
          onClose={() => {
            setShowCreateModal(false);
            setEditingDocument(null);
          }}
          onSave={async () => {
            // Refresh documents
            const documentsData = await termsService.getAllDocuments();
            setDocuments(documentsData);
            // Refresh stats
            const statsData = await termsService.getDocumentStats();
            setStats(statsData);
            setShowCreateModal(false);
            setEditingDocument(null);
          }}
          currentUserId={currentUser?.uid || ''}
        />
      )}
    </div>
  );
}

// Document Edit Modal Component
interface DocumentEditModalProps {
  document: TermsDocument | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  currentUserId: string;
}

function DocumentEditModal({ document, onClose, onSave, currentUserId }: DocumentEditModalProps) {
  const [formData, setFormData] = useState({
    type: document?.type || 'terms' as 'terms' | 'privacy',
    title: document?.title || '',
    title_ar: document?.title_ar || '',
    content: document?.content || '',
    content_ar: document?.content_ar || '',
    version: document?.version || '1.0',
    isActive: document?.isActive || false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required for English version');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      await termsService.saveDocument(
        {
          ...formData,
          id: document?.id
        },
        currentUserId,
        !!document
      );
      
      await onSave();
    } catch (err) {
      console.error('Error saving document:', err);
      setError('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {document ? 'Edit Document' : 'Create New Document'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Document Type and Version */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'terms' | 'privacy' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="terms">Terms of Service</option>
                <option value="privacy">Privacy Policy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="1.0"
                required
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Publish immediately</span>
              </label>
            </div>
          </div>

          {/* Language Tabs */}
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'en'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ar')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'ar'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  العربية
                </button>
              </nav>
            </div>
          </div>

          {/* English Content */}
          {activeTab === 'en' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter document title in English"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (English) *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter document content in English"
                  required
                />
              </div>
            </div>
          )}

          {/* Arabic Content */}
          {activeTab === 'ar' && (
            <div className="space-y-4" dir="rtl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان (العربية)
                </label>
                <input
                  type="text"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="أدخل عنوان الوثيقة باللغة العربية"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المحتوى (العربية)
                </label>
                <textarea
                  value={formData.content_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="أدخل محتوى الوثيقة باللغة العربية"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {document ? 'Update' : 'Create'} Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 