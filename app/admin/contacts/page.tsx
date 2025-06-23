'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useContact } from '../../contexts/contact-context';
import { ContactInfo, DayHours } from '../../../src/services/contactService';
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
  Clock,
  ToggleLeft,
  ToggleRight
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
      monday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
      tuesday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
      wednesday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
      thursday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
      friday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
      saturday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
      sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' }
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
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOperatingHoursChange = (day: keyof ContactInfo['operatingHours'], field: keyof DayHours, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to update contact information.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateContactInfo(formData, currentUser.email || 'admin');
      setSuccess('Contact information updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating contact info:', error);
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
      placeholder: '+971569852211',
      icon: Phone,
      description: 'Primary contact number displayed on the website'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Riyadh, Saudi Arabia',
      icon: MapPin,
      description: 'Business address displayed on the contact page'
    },
    {
      name: 'ceoEmail',
      label: 'CEO Email',
      type: 'email',
      placeholder: 'ceo@optimusksa.com',
      icon: User,
      description: 'Email for executive communications'
    },
    {
      name: 'admissionsEmail',
      label: 'Admissions Email',
      type: 'email',
      placeholder: 'admissions@optimusksa.com',
      icon: Users,
      description: 'For student admissions and enrollment inquiries'
    },
    {
      name: 'generalInquiriesEmail',
      label: 'General Inquiries Email',
      type: 'email',
      placeholder: 'info@optimusksa.com',
      icon: HelpCircle,
      description: 'For general questions and information requests'
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

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ] as const;

  const quickPresets = [
    {
      name: 'Standard Business Hours',
      description: 'Mon-Fri 9AM-6PM, Sat 10AM-2PM, Sun Closed',
      hours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
        saturday: { isOpen: true, openTime: '10:00', closeTime: '14:00' },
        sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' }
      }
    },
    {
      name: 'Extended Hours',
      description: 'Mon-Fri 8AM-8PM, Sat-Sun 9AM-5PM',
      hours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        sunday: { isOpen: true, openTime: '09:00', closeTime: '17:00' }
      }
    },
    {
      name: '24/7 Support',
      description: 'Open every day, all hours',
      hours: {
        monday: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
        tuesday: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
        wednesday: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
        thursday: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
        friday: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
        saturday: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
        sunday: { isOpen: true, openTime: '00:00', closeTime: '23:59' }
      }
    }
  ];

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: preset.hours
    }));
  };

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h1>
        <p className="text-gray-600">Manage contact details displayed on the website</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="mr-2" size={20} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Contact Fields Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <Phone className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
              <p className="text-sm text-gray-500">Basic contact information for the website</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactFields.map((field) => {
              const IconComponent = field.icon;
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <IconComponent className="mr-2 text-primary" size={16} />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={(formData as any)[field.name] || ''}
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

        {/* Operating Hours Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
              <p className="text-sm text-gray-500">Set business hours for each day of the week</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickPresets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {daysOfWeek.map(({ key, label }) => {
              const dayHours = formData.operatingHours[key];
              return (
                <div key={key} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{label}</span>
                    <button
                      type="button"
                      onClick={() => handleOperatingHoursChange(key, 'isOpen', !dayHours.isOpen)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                        dayHours.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {dayHours.isOpen ? (
                        <>
                          <ToggleRight className="mr-1" size={16} />
                          Open
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="mr-1" size={16} />
                          Closed
                        </>
                      )}
                    </button>
                  </div>
                  
                  {dayHours.isOpen && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Opening Time
                        </label>
                        <input
                          type="time"
                          value={dayHours.openTime}
                          onChange={(e) => handleOperatingHoursChange(key, 'openTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Closing Time
                        </label>
                        <input
                          type="time"
                          value={dayHours.closeTime}
                          onChange={(e) => handleOperatingHoursChange(key, 'closeTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Current Settings Preview */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Settings Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-gray-700">Phone:</span> <span className="ml-2 text-gray-900">{contactInfo.phoneNumber}</span></div>
              <div><span className="font-medium text-gray-700">Address:</span> <span className="ml-2 text-gray-900">{contactInfo.address}</span></div>
              <div><span className="font-medium text-gray-700">CEO Email:</span> <span className="ml-2 text-gray-900">{contactInfo.ceoEmail}</span></div>
              <div><span className="font-medium text-gray-700">Admissions:</span> <span className="ml-2 text-gray-900">{contactInfo.admissionsEmail}</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Operating Hours</h4>
            <div className="space-y-1 text-sm">
              {daysOfWeek.map(({ key, label }) => {
                const dayHours = contactInfo.operatingHours[key];
                return (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-900">
                      {dayHours.isOpen 
                        ? `${dayHours.openTime} - ${dayHours.closeTime}`
                        : 'Closed'
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 