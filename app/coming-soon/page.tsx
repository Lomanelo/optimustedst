'use client';

import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, MessageCircle, Music, CheckCircle, Globe } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/firebase';
import Head from 'next/head';

interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  snapchat: string;
  linkedin: string;
  tiktok: string;
}

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

export default function ComingSoonPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>({
    facebook: '',
    instagram: '',
    twitter: '',
    snapchat: '',
    linkedin: '',
    tiktok: ''
  });

  useEffect(() => {
    loadSocialMediaLinks();
    captureUTMParameters();
  }, []);

  const captureUTMParameters = () => {
    // Check if we're in the browser
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
      
      // Log UTM parameters for debugging
      console.log('UTM Parameters captured:', utmData);
      
      // Store UTM parameters in sessionStorage to persist across page reloads
      sessionStorage.setItem('optimus_utm_params', JSON.stringify(utmData));
    }
  };

  const loadSocialMediaLinks = async () => {
    try {
      const settingsRef = doc(db, 'websiteSettings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
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
      console.error('Error loading social media links:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.gender || !formData.certificate) {
      const alertMessage = language === 'ar' 
        ? 'يرجى ملء جميع الحقول' 
        : 'Please fill in all fields';
      alert(alertMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', formData);
      console.log('Including UTM parameters:', utmParams);
      
      // Get the current origin for the API call
      const apiUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/submit-form`
        : '/api/submit-form';
      
      console.log('API URL:', apiUrl);
      
      // Submit to Google Sheets with UTM parameters
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          countryCode: countryCode,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          certificate: formData.certificate,
          timestamp: new Date().toISOString(),
          // Include UTM parameters
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_term: utmParams.utm_term,
          utm_content: utmParams.utm_content,
          // Also include the full URL for reference
          page_url: typeof window !== 'undefined' ? window.location.href : ''
        }),
      });

      console.log('API Response status:', response.status);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);
      
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const responseText = await response.text();
        console.log('Non-JSON response:', responseText);
        throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
      }
      
      console.log('API Response data:', responseData);

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          gender: '',
          certificate: ''
        });
        setCountryCode('+966');
        console.log('Form submitted successfully to Google Sheets with UTM tracking');
      } else {
        // Handle server errors
        throw new Error(`Server error: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = language === 'ar'
        ? `حدث خطأ في إرسال النموذج: ${error instanceof Error ? error.message : 'خطأ غير معروف'}. يرجى المحاولة مرة أخرى`
        : `There was an error submitting your form: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (platform: keyof SocialMediaLinks) => {
    const iconProps = { size: 20, className: "transition-colors" };
    
    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} className="text-blue-600 hover:text-blue-700" />;
      case 'instagram':
        return <Instagram {...iconProps} className="text-pink-600 hover:text-pink-700" />;
      case 'twitter':
        return <Twitter {...iconProps} className="text-blue-400 hover:text-blue-500" />;
      case 'snapchat':
        return <MessageCircle {...iconProps} className="text-yellow-500 hover:text-yellow-600" />;
      case 'linkedin':
        return <Linkedin {...iconProps} className="text-blue-700 hover:text-blue-800" />;
      case 'tiktok':
        return <Music {...iconProps} className="text-black hover:text-gray-800" />;
      default:
        return null;
    }
  };

  const activeSocialLinks = Object.entries(socialMedia).filter(([_, url]) => url && url.trim() !== '');

  const content = {
    ar: {
      title: 'قريباً - أوبتيموس السعودية | بوابتك إلى المستقبل',
      description: 'اكتشف برامجنا في الماجستير وإدارة الأعمال والدكتوراه المصممة لقادة المستقبل في المملكة العربية السعودية. سجل اهتمامك لتلقي مزيد من التفاصيل.',
      comingSoon: 'قريباً',
      subtitle: 'برامج ماجستير ودكتوراه (MBA/DBA)\nعبر الإنترنت معتمدة دوليًّا',
      description_text: 'للحصول على مزيد من التفاصيل حول برامجنا، يُرجى إرسال بيانتك وسنقوم بتواصل معك.',
      first_name: 'الاسم الأول',
      last_name: 'اسم العائلة',
      phone: 'رقم الهاتف',
      email: 'عنوان البريد الإلكتروني',
      gender: 'نوع',
      male: 'ذكر',
      female: 'أنثى',
      certificate: 'الشهادة المهتم بها',
      certificate_mba: 'ماجيستير',
      certificate_phd: 'دكتوراة',
      certificate_diploma: 'دبلومة',
      certificate_course: 'دورة تدريبية',
      certificate_other: 'أخرى',
      submit_button: 'سجل اهتمامك',
      submitting: 'جارٍ الإرسال...',
      thank_you: 'شكراً لاهتمامكم!',
      contact_soon: 'سيتواصل معكم فريقنا قريباً بمزيد من المعلومات.',
      success_title: 'تم التسجيل بنجاح!',
      success_message: 'شكراً لاهتمامك. سنتواصل معك قريباً.',
      disclaimer: 'بإرسال هذا النموذج، أنت توافق على تلقي معلومات حول برامجنا.',
      stay_connected: 'تابعونا للحصول على التحديثات',
              copyright: '© جميع الحقوق محفوظة. أوبتيموس ٢٠٢٥ '
    },
    en: {
      title: 'Coming Soon - OPTIMUS KSA | Your Gateway to the Future',
      description: 'Discover our online MBA and DBA programs designed for future leaders in KSA. Register your interest to receive more details on our programs.',
      comingSoon: 'Coming Soon',
      subtitle: 'Online MBA/DBA with International Accreditation',
      description_text: "To receive more details on our programs, please fill the form.",
      first_name: 'First Name',
      last_name: 'Last Name',
      phone: 'Phone Number',
      email: 'Email Address',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      certificate: 'Interested in Certificate',
      certificate_mba: 'MBA',
      certificate_phd: 'PHD/BDA',
      certificate_diploma: 'Diploma',
      certificate_course: 'Course',
      certificate_other: 'Other',
      submit_button: 'Register Your Interest',
      submitting: 'Submitting...',
      thank_you: 'Thank you for your interest!',
      contact_soon: 'Our team will contact you soon with more information.',
      success_title: 'Registration Successful!',
      success_message: 'Thank you for your interest. We\'ll be in touch soon.',
      disclaimer: 'By submitting this form, you agree to receive information about our programs.',
      stay_connected: 'Stay Connected',
              copyright: '© 2025 Optimus. All rights reserved.'
    }
  };

  const currentContent = content[language];
  const isRTL = language === 'ar';

  return (
    <>
      <Head>
        <title>{currentContent.title}</title>
        <meta name="description" content={currentContent.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="py-3 border-b border-gray-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center relative">
              {/* Main Logo */}
              <div className="h-14 flex items-center justify-center">
                <img
                  src={language === 'ar' ? "/purplelogoArabic.png" : "/Logo.jpeg"}
                  alt={language === 'ar' ? "شعار أوبتيموس السعودية" : "Optimus KSA Logo"}
                  className="h-11 w-auto object-contain max-w-[220px]"
                  onError={(e) => {
                    console.error('Header logo failed to load:', e);
                    // Fallback to the other logo if one fails
                    const target = e.target as HTMLImageElement;
                    target.src = language === 'ar' ? "/Logo.jpeg" : "/purplelogoArabic.png";
                  }}
                />
              </div>
              
              {/* Language Switcher - Fixed position, always LTR */}
              <div className="fixed top-20 right-4 z-50" dir="ltr">
                <div className="flex items-center bg-white shadow-lg border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      language === 'ar'
                        ? 'bg-[#2B1F4F] text-white shadow-sm'
                        : 'text-gray-600 hover:text-[#2B1F4F] hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      language === 'en'
                        ? 'bg-[#2B1F4F] text-white shadow-sm'
                        : 'text-gray-600 hover:text-[#2B1F4F] hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main 
          className="py-12 lg:py-16 flex-grow relative min-h-[85vh] flex items-center"
          style={{
            backgroundImage: 'url(/guyworknew.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'left 20%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Hero overlay for better content visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-black/40 to-black/60"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* Text Content - Always on the left in grid */}
              <div className={`text-center lg:${isRTL ? 'text-right' : 'text-left'} ${isRTL ? 'lg:order-2' : 'lg:order-1'} py-8 lg:py-12`}>
                <h1 
                  className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl" 
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                >
                  {currentContent.comingSoon}
                </h1>
                
                <h2 
                  className="text-2xl lg:text-3xl text-white font-semibold mb-8 leading-relaxed drop-shadow-xl" 
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                >
                  {currentContent.subtitle.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < currentContent.subtitle.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>

                <div className={`w-16 h-1 bg-[#058C42] mb-8 ${isRTL ? 'lg:mr-0 mx-auto' : 'lg:ml-0 mx-auto'} shadow-2xl`}></div>

                <p 
                  className={`text-lg text-white/95 mb-10 leading-relaxed drop-shadow-lg ${isRTL ? 'lg:text-right text-center' : 'lg:text-left text-center'}`} 
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                >
                  {currentContent.description_text}
                </p>
              </div>

              {/* Form - Always on the right in grid */}
              <div className={`${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-2xl border border-white/20">
                  {!isSubmitted ? (
                    <>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="firstName"
                              placeholder={currentContent.first_name}
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              name="lastName"
                              placeholder={currentContent.last_name}
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex gap-2" dir="ltr">
                            <select
                              value={countryCode}
                              onChange={handleCountryCodeChange}
                              className="px-3 py-3 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors bg-white font-normal appearance-none text-gray-500 flex-shrink-0"
                              style={{ 
                                fontWeight: 'normal',
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.25em 1.25em'
                              }}
                            >
                              <option value="+966" style={{ color: '#6b7280' }}>🇸🇦 +966</option>
                              <option value="+971" style={{ color: '#6b7280' }}>🇦🇪 +971</option>
                              <option value="+973" style={{ color: '#6b7280' }}>🇧🇭 +973</option>
                              <option value="+965" style={{ color: '#6b7280' }}>🇰🇼 +965</option>
                              <option value="+974" style={{ color: '#6b7280' }}>🇶🇦 +974</option>
                              <option value="+968" style={{ color: '#6b7280' }}>🇴🇲 +968</option>
                              <option value="+962" style={{ color: '#6b7280' }}>🇯🇴 +962</option>
                              <option value="+961" style={{ color: '#6b7280' }}>🇱🇧 +961</option>
                              <option value="+20" style={{ color: '#6b7280' }}>🇪🇬 +20</option>
                              <option value="+1" style={{ color: '#6b7280' }}>🇺🇸 +1</option>
                              <option value="+44" style={{ color: '#6b7280' }}>🇬🇧 +44</option>
                              <option value="+33" style={{ color: '#6b7280' }}>🇫🇷 +33</option>
                              <option value="+49" style={{ color: '#6b7280' }}>🇩🇪 +49</option>
                              <option value="+39" style={{ color: '#6b7280' }}>🇮🇹 +39</option>
                              <option value="+34" style={{ color: '#6b7280' }}>🇪🇸 +34</option>
                              <option value="+31" style={{ color: '#6b7280' }}>🇳🇱 +31</option>
                              <option value="+32" style={{ color: '#6b7280' }}>🇧🇪 +32</option>
                              <option value="+41" style={{ color: '#6b7280' }}>🇨🇭 +41</option>
                              <option value="+43" style={{ color: '#6b7280' }}>🇦🇹 +43</option>
                              <option value="+45" style={{ color: '#6b7280' }}>🇩🇰 +45</option>
                              <option value="+46" style={{ color: '#6b7280' }}>🇸🇪 +46</option>
                              <option value="+47" style={{ color: '#6b7280' }}>🇳🇴 +47</option>
                              <option value="+358" style={{ color: '#6b7280' }}>🇫🇮 +358</option>
                              <option value="+91" style={{ color: '#6b7280' }}>🇮🇳 +91</option>
                              <option value="+86" style={{ color: '#6b7280' }}>🇨🇳 +86</option>
                              <option value="+81" style={{ color: '#6b7280' }}>🇯🇵 +81</option>
                              <option value="+82" style={{ color: '#6b7280' }}>🇰🇷 +82</option>
                              <option value="+60" style={{ color: '#6b7280' }}>🇲🇾 +60</option>
                              <option value="+65" style={{ color: '#6b7280' }}>🇸🇬 +65</option>
                              <option value="+66" style={{ color: '#6b7280' }}>🇹🇭 +66</option>
                              <option value="+84" style={{ color: '#6b7280' }}>🇻🇳 +84</option>
                              <option value="+63" style={{ color: '#6b7280' }}>🇵🇭 +63</option>
                              <option value="+62" style={{ color: '#6b7280' }}>🇮🇩 +62</option>
                              <option value="+61" style={{ color: '#6b7280' }}>🇦🇺 +61</option>
                              <option value="+64" style={{ color: '#6b7280' }}>🇳🇿 +64</option>
                              <option value="+27" style={{ color: '#6b7280' }}>🇿🇦 +27</option>
                              <option value="+55" style={{ color: '#6b7280' }}>🇧🇷 +55</option>
                              <option value="+52" style={{ color: '#6b7280' }}>🇲🇽 +52</option>
                              <option value="+54" style={{ color: '#6b7280' }}>🇦🇷 +54</option>
                              <option value="+56" style={{ color: '#6b7280' }}>🇨🇱 +56</option>
                              <option value="+57" style={{ color: '#6b7280' }}>🇨🇴 +57</option>
                              <option value="+51" style={{ color: '#6b7280' }}>🇵🇪 +51</option>
                              <option value="+58" style={{ color: '#6b7280' }}>🇻🇪 +58</option>
                              <option value="+90" style={{ color: '#6b7280' }}>🇹🇷 +90</option>
                              <option value="+98" style={{ color: '#6b7280' }}>🇮🇷 +98</option>
                              <option value="+92" style={{ color: '#6b7280' }}>🇵🇰 +92</option>
                              <option value="+880" style={{ color: '#6b7280' }}>🇧🇩 +880</option>
                              <option value="+94" style={{ color: '#6b7280' }}>🇱🇰 +94</option>
                              <option value="+977" style={{ color: '#6b7280' }}>🇳🇵 +977</option>
                              <option value="+93" style={{ color: '#6b7280' }}>🇦🇫 +93</option>
                              <option value="+964" style={{ color: '#6b7280' }}>🇮🇶 +964</option>
                              <option value="+963" style={{ color: '#6b7280' }}>🇸🇾 +963</option>
                              <option value="+212" style={{ color: '#6b7280' }}>🇲🇦 +212</option>
                              <option value="+213" style={{ color: '#6b7280' }}>🇩🇿 +213</option>
                              <option value="+216" style={{ color: '#6b7280' }}>🇹🇳 +216</option>
                              <option value="+218" style={{ color: '#6b7280' }}>🇱🇾 +218</option>
                              <option value="+249" style={{ color: '#6b7280' }}>🇸🇩 +249</option>
                            </select>
                            <input
                              type="tel"
                              name="phone"
                              placeholder={language === 'ar' ? "5xxxxxxx" : "5xxxxxxx"}
                              value={formData.phone}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
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
                              className="flex-1 min-w-0 px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors text-left"
                              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                              dir="ltr"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <input
                            type="email"
                            name="email"
                            placeholder={currentContent.email}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                        </div>

                        <div>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors bg-white font-normal ${isRTL ? 'text-right pl-10 pr-4' : 'text-left'} appearance-none ${formData.gender ? 'text-gray-900' : 'text-gray-500'}`}
                            style={{ 
                              fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                              fontWeight: 'normal',
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: isRTL ? 'left 0.75rem center' : 'right 0.75rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em'
                            }}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          >
                            <option value="" style={{ fontWeight: 'normal', color: '#6b7280' }}>
                              {language === 'ar' ? 'اختر النوع' : 'Select Gender'}
                            </option>
                            <option value="male" style={{ color: '#374151' }}>{currentContent.male}</option>
                            <option value="female" style={{ color: '#374151' }}>{currentContent.female}</option>
                          </select>
                        </div>

                        <div>
                          <select
                            name="certificate"
                            value={formData.certificate}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2B1F4F] focus:border-transparent outline-none transition-colors bg-white font-normal ${isRTL ? 'text-right pl-10 pr-4' : 'text-left'} appearance-none ${formData.certificate ? 'text-gray-900' : 'text-gray-500'}`}
                            style={{ 
                              fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                              fontWeight: 'normal',
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: isRTL ? 'left 0.75rem center' : 'right 0.75rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em'
                            }}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          >
                            <option value="" style={{ fontWeight: 'normal', color: '#6b7280' }}>
                              {language === 'ar' ? 'الشهادة المهتم بها' : 'Select Certificate'}
                            </option>
                            <option value="MBA" style={{ color: '#374151' }}>{currentContent.certificate_mba}</option>
                            <option value="PHD/BDA" style={{ color: '#374151' }}>{currentContent.certificate_phd}</option>
                            <option value="Diploma" style={{ color: '#374151' }}>{currentContent.certificate_diploma}</option>
                            <option value="Course" style={{ color: '#374151' }}>{currentContent.certificate_course}</option>
                            <option value="Other" style={{ color: '#374151' }}>{currentContent.certificate_other}</option>
                          </select>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#058C42] hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className={`animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                              {currentContent.submitting}
                            </div>
                          ) : (
                            currentContent.submit_button
                          )}
                        </button>
                      </form>
                      
                      <p 
                        className="text-xs text-gray-500 text-center mt-4" 
                        style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                      >
                        {currentContent.disclaimer}
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-green-100 text-green-800 rounded-lg p-6 mb-6">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
                        <h3 
                          className="text-xl font-bold mb-2" 
                          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                        >
                          {currentContent.success_title}
                        </h3>
                        <p style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                          {currentContent.success_message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#2B1F4F] text-white py-6 mt-auto relative overflow-hidden">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 bg-no-repeat bg-left-top"
            style={{
              backgroundImage: 'url(/patternGreen.png)',
              backgroundSize: 'auto calc(100% - 0.5rem)',
              opacity: 1,
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.01) 40%, rgba(0,0,0,0) 50%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.01) 40%, rgba(0,0,0,0) 50%)'
            }}
          ></div>
          
          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="h-16 flex items-center justify-center">
                <img
                  src={language === 'ar' ? "/whitelogoArabic.png" : "/OptimusLogoOnPurple.png"}
                  alt={language === 'ar' ? "شعار أوبتيموس السعودية" : "Optimus KSA Logo"}
                  className="h-12 w-auto object-contain max-w-[200px]"
                  onError={(e) => {
                    console.error('Footer logo failed to load:', e);
                    // Fallback to the other logo if one fails
                    const target = e.target as HTMLImageElement;
                    target.src = language === 'ar' ? "/Logo.jpeg" : "/whitelogoArabic.png";
                  }}
                />
              </div>
              
              {activeSocialLinks.length > 0 && (
                <>
                  <p 
                    className="text-base font-medium mb-4 opacity-90" 
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                  >
                    {currentContent.stay_connected}
                  </p>
                  <div className="flex justify-center space-x-4 mb-6">
                    {activeSocialLinks.map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/10 rounded-full hover:bg-[#058C42] transition-colors"
                      >
                        {getSocialIcon(platform as keyof SocialMediaLinks)}
                      </a>
                    ))}
                  </div>
                </>
              )}
              
              <div>
                <p 
                  className="text-sm opacity-70" 
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                >
                  {currentContent.copyright}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 