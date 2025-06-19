'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
import { 
  ArrowLeft,
  Save,
  Settings,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  Music,
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';

interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  snapchat: string;
  linkedin: string;
  tiktok: string;
}

interface WebsiteSettings {
  socialMedia: SocialMediaLinks;
  lastUpdated: string;
  updatedBy: string;
}

export default function AdminSettingsPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>({
    facebook: '',
    instagram: '',
    twitter: '',
    snapchat: '',
    linkedin: '',
    tiktok: ''
  });

  useEffect(() => {
    if (!isLoading && (!currentUser || (userRole !== 'admin' && !hasPermission('settings')))) {
      router.push('/admin/dashboard');
      return;
    }

    if (currentUser && (userRole === 'admin' || hasPermission('settings'))) {
      loadSettings();
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  const loadSettings = async () => {
    try {
      const settingsRef = doc(db, 'websiteSettings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data() as WebsiteSettings;
        setSocialMedia(data.socialMedia || {
          facebook: '',
          instagram: '',
          twitter: '',
          snapchat: '',
          linkedin: '',
          tiktok: ''
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSocialMediaChange = (platform: keyof SocialMediaLinks, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      setSaving(true);
      setSaveStatus('idle');

      const settingsData: WebsiteSettings = {
        socialMedia,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser.email || 'Unknown'
      };

      const settingsRef = doc(db, 'websiteSettings', 'general');
      await setDoc(settingsRef, settingsData, { merge: true });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getSocialIcon = (platform: keyof SocialMediaLinks) => {
    const iconProps = { size: 20, className: "text-gray-600" };
    
    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} className="text-blue-600" />;
      case 'instagram':
        return <Instagram {...iconProps} className="text-pink-600" />;
      case 'twitter':
        return <Twitter {...iconProps} className="text-blue-400" />;
      case 'snapchat':
        return <MessageCircle {...iconProps} className="text-yellow-500" />;
      case 'linkedin':
        return <Linkedin {...iconProps} className="text-blue-700" />;
      case 'tiktok':
        return <Music {...iconProps} className="text-black" />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  const getPlatformLabel = (platform: keyof SocialMediaLinks) => {
    const labels = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter (X)',
      snapchat: 'Snapchat',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok'
    };
    return labels[platform];
  };

  const getPlatformPlaceholder = (platform: keyof SocialMediaLinks) => {
    const placeholders = {
      facebook: 'https://facebook.com/yourpage',
      instagram: 'https://instagram.com/youraccount',
      twitter: 'https://twitter.com/youraccount',
      snapchat: 'https://snapchat.com/add/yourusername',
      linkedin: 'https://linkedin.com/company/yourcompany',
      tiktok: 'https://tiktok.com/@youraccount'
    };
    return placeholders[platform];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser || (userRole !== 'admin' && !hasPermission('settings'))) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings size={32} className="mr-3 text-[#2B1F4F]" />
                Website Settings
              </h1>
              <p className="mt-2 text-gray-600">Manage your website's social media links and other settings</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                saveStatus === 'success' 
                  ? 'bg-green-600 text-white' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#2B1F4F] text-white hover:bg-[#2B1F4F]/90'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <Check size={16} className="mr-2" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle size={16} className="mr-2" />
                  Error
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Media Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe size={20} className="mr-2 text-[#2B1F4F]" />
              Social Media Links
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add your social media links to display them on your website
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(socialMedia) as Array<keyof SocialMediaLinks>).map((platform) => (
                <div key={platform} className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    {getSocialIcon(platform)}
                    <span className="ml-2">{getPlatformLabel(platform)}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={socialMedia[platform]}
                      onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                      placeholder={getPlatformPlaceholder(platform)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent"
                    />
                    {socialMedia[platform] && (
                      <a
                        href={socialMedia[platform]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              This is how your social media links will appear on the website
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {(Object.keys(socialMedia) as Array<keyof SocialMediaLinks>).map((platform) => (
                socialMedia[platform] && (
                  <a
                    key={platform}
                    href={socialMedia[platform]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {getSocialIcon(platform)}
                    <span className="text-sm font-medium text-gray-700">
                      {getPlatformLabel(platform)}
                    </span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                )
              ))}
              {Object.values(socialMedia).every(link => !link) && (
                <p className="text-gray-500 text-sm italic">
                  No social media links added yet. Add some links above to see the preview.
                </p>
              )}
            </div>
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
                  ? 'Settings saved successfully! Changes are now live on your website.' 
                  : 'Failed to save settings. Please try again.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 