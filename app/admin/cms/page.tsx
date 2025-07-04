'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';
import { useCMS } from '../../contexts/cms-context';
import { CMS_SECTIONS, CMSSectionKey } from '../../../src/types/cms';
import { 
  Save,
  Search,
  Globe,
  FileText,
  Check,
  AlertCircle,
  Edit3,
  X,
  Languages,
  Download,
  Upload,
  Database
} from 'lucide-react';

interface EditingContent {
  key: string;
  content_en: string;
  content_ar: string;
}

export default function AdminCMSPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const { 
    getAllContent, 
    getContentBySection, 
    updateContent, 
    loading: cmsLoading,
    refreshContent,
    forceRepopulateContent 
  } = useCMS();
  
  const [selectedSection, setSelectedSection] = useState<CMSSectionKey>(CMS_SECTIONS.NAVBAR);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<EditingContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isLoading && (!currentUser || (userRole !== 'admin' && !hasPermission('cms')))) {
      router.push('/admin/dashboard');
      return;
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  const handleEdit = (key: string, content_en: string, content_ar: string) => {
    setEditingItem({ key, content_en, content_ar });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      setSaving(true);
      setSaveStatus('idle');
      
      await updateContent(editingItem.key, editingItem.content_en, editingItem.content_ar);
      
      setSaveStatus('success');
      setEditingItem(null);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const exportContent = () => {
    const allContent = getAllContent();
    const exportData = allContent.map(item => ({
      key: item.key,
      section: item.section,
      subsection: item.subsection,
      content_en: item.content_en,
      content_ar: item.content_ar,
      description: item.description
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSectionLabel = (section: CMSSectionKey): string => {
    const labels: Record<CMSSectionKey, string> = {
      [CMS_SECTIONS.NAVBAR]: 'Navigation Bar',
      [CMS_SECTIONS.HERO]: 'Hero Section',
      [CMS_SECTIONS.PROGRAMS_OVERVIEW]: 'Programs Overview',
      [CMS_SECTIONS.HOW_IT_WORKS]: 'How It Works',
      [CMS_SECTIONS.BLOG_PREVIEW]: 'Blog Preview',
      [CMS_SECTIONS.ACCREDITATIONS]: 'Accreditations',
      [CMS_SECTIONS.FOOTER]: 'Footer',
      [CMS_SECTIONS.ABOUT_PAGE]: 'About Page',
      [CMS_SECTIONS.CONTACT_PAGE]: 'Contact Page',
      [CMS_SECTIONS.PROGRAMS_PAGE]: 'Programs Page',
      [CMS_SECTIONS.PROGRAMS]: 'Programs',
      [CMS_SECTIONS.LOGIN_PAGE]: 'Login Page',
      [CMS_SECTIONS.REGISTER_PAGE]: 'Register Page',
      [CMS_SECTIONS.DASHBOARD]: 'Dashboard',
      [CMS_SECTIONS.ADMIN_DASHBOARD]: 'Admin Dashboard',
      [CMS_SECTIONS.BLOG_PAGE]: 'Blog Page',
      [CMS_SECTIONS.PROFILE_PAGE]: 'Profile Page',
      [CMS_SECTIONS.SOCIAL_MEDIA_SETTINGS]: 'Social Media Settings',
      [CMS_SECTIONS.COOKIE_CONSENT]: 'Cookie Consent',
      [CMS_SECTIONS.ERROR_MESSAGES]: 'Error Messages',
      [CMS_SECTIONS.SUCCESS_MESSAGES]: 'Success Messages',
      [CMS_SECTIONS.FORM_LABELS]: 'Form Labels',
      [CMS_SECTIONS.BUTTONS]: 'Buttons',
      [CMS_SECTIONS.METADATA]: 'Metadata & SEO',
      [CMS_SECTIONS.GENERAL]: 'General'
    };
    return labels[section] || section;
  };

  if (isLoading || cmsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser || (userRole !== 'admin' && !hasPermission('cms'))) {
    return null;
  }

  const sectionContent = getContentBySection(selectedSection).filter(item => 
    searchTerm === '' || 
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allContent = getAllContent();
  const hasContent = allContent.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Languages size={32} className="mr-3 text-[#2B1F4F]" />
                Content Management System
              </h1>
              <p className="mt-2 text-gray-600">Manage all website text content in English and Arabic</p>
            </div>
            <div className="flex space-x-4">
              {!hasContent && (
                <Link href="/admin/cms/populate">
                  <button className="inline-flex items-center px-4 py-2 bg-[#058C42] text-white text-sm font-medium rounded-lg hover:bg-[#058C42]/90 transition-colors">
                    <Database size={16} className="mr-2" />
                    Populate Database
                  </button>
                </Link>
              )}
              <button
                onClick={() => refreshContent()}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload size={16} className="mr-2" />
                Refresh
              </button>
              <button
                onClick={() => forceRepopulateContent()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Database size={16} className="mr-2" />
                Update Translations
              </button>
              <button
                onClick={exportContent}
                className="inline-flex items-center px-4 py-2 bg-[#2B1F4F] text-white text-sm font-medium rounded-lg hover:bg-[#2B1F4F]/90 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export All Content
              </button>
            </div>
          </div>

          {!hasContent && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle size={16} className="mr-2 text-blue-600" />
                <span className="text-sm text-blue-800">
                  No content found in the database. Click "Populate Database" to initialize with website content.
                </span>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent"
            />
          </div>

          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.values(CMS_SECTIONS).map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSection === section
                    ? 'bg-[#2B1F4F] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {getSectionLabel(section)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key / Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    English Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arabic Content
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sectionContent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No content found in this section
                    </td>
                  </tr>
                ) : (
                  sectionContent.map((item) => (
                    <tr key={item.key} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.key}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingItem?.key === item.key ? (
                          <textarea
                            value={editingItem.content_en}
                            onChange={(e) => setEditingItem({ ...editingItem, content_en: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{item.content_en}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingItem?.key === item.key ? (
                          <textarea
                            value={editingItem.content_ar}
                            onChange={(e) => setEditingItem({ ...editingItem, content_ar: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent text-right"
                            dir="rtl"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 whitespace-pre-wrap text-right" dir="rtl">
                            {item.content_ar}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingItem?.key === item.key ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {saving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                            <button
                              onClick={handleCancel}
                              className="inline-flex items-center px-3 py-1 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(item.key, item.content_en, item.content_ar)}
                            className="inline-flex items-center px-3 py-1 bg-[#2B1F4F] text-white text-sm font-medium rounded-lg hover:bg-[#2B1F4F]/90 transition-colors"
                          >
                            <Edit3 size={16} className="mr-1" />
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Status Message */}
        {saveStatus !== 'idle' && (
          <div className={`mt-4 p-4 rounded-lg ${
            saveStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {saveStatus === 'success' ? (
                <Check size={16} className="mr-2" />
              ) : (
                <AlertCircle size={16} className="mr-2" />
              )}
              <span className="text-sm font-medium">
                {saveStatus === 'success' 
                  ? 'Content updated successfully! Changes are now live on the website.' 
                  : 'Failed to update content. Please try again.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 