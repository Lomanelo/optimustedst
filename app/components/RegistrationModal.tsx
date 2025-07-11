'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useCMS } from '../contexts/cms-context';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  certificate: string;
}

interface UTMParameters {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Google Apps Script URL - Same as coming-soon page
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzETSBs4FkIKwZWtBur-ADi1wpypZ9gdJy48MRWohiJhUWXMC4r-rFLtLfs6KFKXYfZ/exec';

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const { getContent, currentLanguage } = useCMS();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: '',
    certificate: ''
  });
  const [countryCode, setCountryCode] = useState('+966');
  const [utmParams, setUtmParams] = useState<UTMParameters>({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isRTL = currentLanguage === 'ar';

  // Capture UTM parameters on mount
  useEffect(() => {
    captureUTMParameters();
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        gender: '',
        certificate: ''
      });
    }
  }, [isOpen]);

  const captureUTMParameters = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      const utmData: UTMParameters = {
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || ''
      };

      setUtmParams(utmData);
      
      // Store UTM parameters in sessionStorage
      sessionStorage.setItem('optimus_utm_params', JSON.stringify(utmData));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.gender || !formData.certificate) {
      const alertMessage = isRTL 
        ? 'يرجى ملء جميع الحقول' 
        : 'Please fill in all fields';
      alert(alertMessage);
      return false;
    }
    return true;
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const dateOnly = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const timeOnly = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return { dateOnly, timeOnly };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = isRTL ? 'جاري الإرسال...' : 'Submitting...';

    try {
      const { dateOnly, timeOnly } = getCurrentTimestamp();
      
      // Prepare form data
      const formFields = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        countryCode: countryCode,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        certificate: formData.certificate,
        date: dateOnly,
        timestamp: timeOnly,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        source: 'hero_modal'
      };

      // Detect if we're in a restricted environment (in-app browser, incognito)
      const isRestrictedEnvironment = () => {
        try {
          // Test for incognito mode
          const testStorage = window.localStorage;
          testStorage.setItem('test', 'test');
          testStorage.removeItem('test');
          
          // Test for in-app browser restrictions
          const userAgent = navigator.userAgent.toLowerCase();
          const inAppBrowsers = ['instagram', 'fban', 'fbav', 'twitter', 'line', 'whatsapp', 'telegram'];
          const isInAppBrowser = inAppBrowsers.some(browser => userAgent.includes(browser));
          
          return isInAppBrowser;
        } catch (e) {
          // If localStorage is blocked, likely incognito or restricted
          return true;
        }
      };

      if (isRestrictedEnvironment()) {
        // Fallback method for restricted environments: direct window.open
        const queryString = Object.entries(formFields)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`)
          .join('&');
        
        const submitUrl = `${GOOGLE_APPS_SCRIPT_URL}?${queryString}`;
        
        // Open submission in new window/tab - works in most restricted environments
        const submitWindow = window.open(submitUrl, '_blank', 'width=1,height=1,toolbar=no,menubar=no,scrollbars=no,resizable=no');
        
        if (submitWindow) {
          // Close the window after a short delay
          setTimeout(() => {
            try {
              submitWindow.close();
            } catch (e) {
              // Window might be closed already or blocked
            }
          }, 2000);
        }
        
        // Show success immediately for restricted environments
        setTimeout(() => {
          setIsSubmitted(true);
        }, 1000);
        
      } else {
        // Standard iframe method for normal browsers
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'form-submission-frame';
        document.body.appendChild(iframe);
        
        const form = document.createElement('form');
        form.action = GOOGLE_APPS_SCRIPT_URL;
        form.method = 'POST';
        form.target = 'form-submission-frame';
        form.style.display = 'none';
        
        Object.entries(formFields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value || '';
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
        
        // Clean up and show success
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
          } catch (e) {
            // Elements might already be removed
          }
          setIsSubmitted(true);
        }, 1000);
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      // Final fallback: try direct navigation with GET parameters
      try {
        const { dateOnly, timeOnly } = getCurrentTimestamp();
        const fallbackFields = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          countryCode: countryCode,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          certificate: formData.certificate,
          date: dateOnly,
          timestamp: timeOnly,
          source: 'hero_modal_fallback'
        };
        
        const queryString = Object.entries(fallbackFields)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`)
          .join('&');
        
        // Navigate to submission URL as final fallback
        window.location.href = `${GOOGLE_APPS_SCRIPT_URL}?${queryString}`;
        
      } catch (fallbackError) {
        // Show error message if all methods fail
        const errorMessage = isRTL 
          ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' 
          : 'An error occurred during submission. Please try again.';
        
        alert(errorMessage);
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  };

  // Helper function to get modal content using CMS
  const getModalContent = (key: string): string => {
    return getContent(`registration_modal_${key}`) || key;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

      {/* Modal panel - Absolute center positioning */}
      <div 
        className="absolute w-full max-w-md p-6 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl sm:max-w-lg"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: isRTL ? 'right' : 'left'
        }}
      >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600`}
          >
            <X size={24} />
          </button>

          {!isSubmitted ? (
            <>
              {/* Modal Header */}
              <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">
                  {getModalContent('title')}
                </h3>
              <p className="text-gray-600">
                  {getModalContent('subtitle')}
                </p>
              </div>

              {/* DYNAMIC FORM SUBMISSION - BYPASSES CORS RESTRICTIONS */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder={getModalContent('first_name')}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder={getModalContent('last_name')}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                {/* Phone field */}
                <div>
                  <div className="flex gap-2" dir="ltr">
                    <select
                      name="countryCode"
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      className="px-3 py-3 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors bg-white font-normal appearance-none text-gray-500 flex-shrink-0"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em'
                      }}
                    >
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+973">🇧🇭 +973</option>
                      <option value="+965">🇰🇼 +965</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+968">🇴🇲 +968</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="5xxxxxxx"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          handleInputChange({
                            target: {
                              name: 'phone',
                              value: value
                            }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }
                      }}
                      required
                      maxLength={10}
                      className="flex-1 min-w-0 px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={getModalContent('email')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Gender field */}
                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors bg-white font-normal ${isRTL ? 'text-right pl-10 pr-4' : 'text-left'} appearance-none ${formData.gender ? 'text-gray-900' : 'text-gray-500'}`}
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: isRTL ? 'left 0.75rem center' : 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <option value="">{getModalContent('select_gender')}</option>
                    <option value="male">{getModalContent('male')}</option>
                    <option value="female">{getModalContent('female')}</option>
                  </select>
                </div>

                {/* Certificate field */}
                <div>
                  <select
                    name="certificate"
                    value={formData.certificate}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors bg-white font-normal ${isRTL ? 'text-right pl-10 pr-4' : 'text-left'} appearance-none ${formData.certificate ? 'text-gray-900' : 'text-gray-500'}`}
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: isRTL ? 'left 0.75rem center' : 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <option value="">{getModalContent('select_certificate')}</option>
                    <option value="MBA">{getModalContent('certificate_mba')}</option>
                    <option value="PHD/BDA">{getModalContent('certificate_phd')}</option>
                    <option value="Diploma">{getModalContent('certificate_diploma')}</option>
                    <option value="Course">{getModalContent('certificate_course')}</option>
                    <option value="Other">{getModalContent('certificate_other')}</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-4 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getModalContent('submit')}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
          <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="text-green-500" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                {getModalContent('success_title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {getModalContent('success_message')}
              </p>
              <button
                onClick={onClose}
                className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-md transition-colors"
              >
                {getModalContent('close')}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default RegistrationModal; 