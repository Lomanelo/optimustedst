'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useContact } from '../../contexts/contact-context';
import { ContactInfo } from '../../../src/services/contactService';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  AlertCircle, 
  CheckCircle,
  User,
  Users,
  HelpCircle,
  Briefcase,
  MessageSquare,
  Clock
} from 'lucide-react';

export default function AdminContactsPage() {
  const { currentUser } = useAuth();
  const { contactInfo, updateContactInfo, loading } = useContact();
  const [formData, setFormData] = useState<ContactInfo>({
    phoneNumber: '',
    ceoEmail: '',
    marketingEmail: '',
    supportEmail: '',
    admissionsEmail: '',
    generalInquiriesEmail: '',
    address: '',
    operatingHours: {
      mondayToFriday: '',
      saturday: '',
      sunday: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested operating hours fields
    if (name.startsWith('operatingHours.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateContactInfo(formData, currentUser?.displayName || currentUser?.email || 'admin');
      setSuccess('Contact information updated successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error updating contact info:', err);
      setError('Failed to update contact information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const contactFields = [
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+966 11 123 4567',
      icon: Phone,
      description: 'Used in footer, WhatsApp button, and contact page'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Riyadh, Saudi Arabia',
      icon: MapPin,
      description: 'Displayed in footer and contact page'
    },
    {
      name: 'generalInquiriesEmail',
      label: 'General Inquiries Email',
      type: 'email',
      placeholder: 'info@optimusksa.com',
      icon: HelpCircle,
      description: 'Main contact email displayed in footer and contact forms'
    },
    {
      name: 'ceoEmail',
      label: 'CEO Email',
      type: 'email',
      placeholder: 'ceo@optimusksa.com',
      icon: User,
      description: 'CEO contact for executive communications'
    },
    {
      name: 'admissionsEmail',
      label: 'Admissions Email',
      type: 'email',
      placeholder: 'admissions@optimusksa.com',
      icon: Users,
      description: 'For student enrollment and admission inquiries'
    },
    {
      name: 'marketingEmail',
      label: 'Marketing Email',
      type: 'email',
      placeholder: 'marketing@optimusksa.com',
      icon: MessageSquare,
      description: 'For marketing partnerships and promotional inquiries'
    },
    {
      name: 'supportEmail',
      label: 'Support Email',
      type: 'email',
      placeholder: 'support@optimusksa.com',
      icon: Briefcase,
      description: 'For technical support and customer service'
    }
  ];

  const operatingHoursFields = [
    {
      name: 'operatingHours.mondayToFriday',
      label: 'Monday - Friday',
      type: 'text',
      placeholder: '9:00 AM - 6:00 PM',
      description: 'Business hours for weekdays'
    },
    {
      name: 'operatingHours.saturday',
      label: 'Saturday',
      type: 'text',
      placeholder: '10:00 AM - 2:00 PM',
      description: 'Business hours for Saturday'
    },
    {
      name: 'operatingHours.sunday',
      label: 'Sunday',
      type: 'text',
      placeholder: 'Closed',
      description: 'Business hours for Sunday'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Contacts & Emails Management</h1>
        <p className="text-gray-600">
          Manage all contact information, email addresses, and operating hours used throughout the website. 
          Changes here will automatically update the footer, WhatsApp button, contact page, and other components.
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="text-red-500 mr-3" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="text-green-500 mr-3" size={20} />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contactFields.map((field) => {
            const IconComponent = field.icon;
            return (
              <div key={field.name} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg mr-3">
                    <IconComponent className="text-primary" size={20} />
                  </div>
                  <div>
                    <label htmlFor={field.name} className="block text-sm font-semibold text-gray-900">
                      {field.label}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                  </div>
                </div>
                
                {field.name === 'address' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof ContactInfo] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof ContactInfo] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Operating Hours Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
              <p className="text-sm text-gray-500">Business hours displayed on the contact page</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {operatingHoursFields.map((field) => {
              const fieldKey = field.name.split('.')[1] as keyof typeof formData.operatingHours;
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData.operatingHours[fieldKey] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="ml-2 text-gray-900">{contactInfo.phoneNumber}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">General Email:</span>
            <span className="ml-2 text-gray-900">{contactInfo.generalInquiriesEmail}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">CEO Email:</span>
            <span className="ml-2 text-gray-900">{contactInfo.ceoEmail}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Admissions Email:</span>
            <span className="ml-2 text-gray-900">{contactInfo.admissionsEmail}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Marketing Email:</span>
            <span className="ml-2 text-gray-900">{contactInfo.marketingEmail}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Support Email:</span>
            <span className="ml-2 text-gray-900">{contactInfo.supportEmail}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-gray-900">{contactInfo.address}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Operating Hours</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Monday - Friday:</span>
              <span className="ml-2 text-gray-900">{contactInfo.operatingHours?.mondayToFriday || 'Not set'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Saturday:</span>
              <span className="ml-2 text-gray-900">{contactInfo.operatingHours?.saturday || 'Not set'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Sunday:</span>
              <span className="ml-2 text-gray-900">{contactInfo.operatingHours?.sunday || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 