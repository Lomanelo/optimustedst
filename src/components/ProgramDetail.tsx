import React, { useState } from 'react';
import { useCMS } from '../../app/contexts/cms-context';

interface ProgramDetailProps {
  id: string;
  program?: any; // Will be fetched from API in real implementation
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ id, program: propProgram }) => {
  const { currentLanguage } = useCMS();

  // Translations
  const translations = {
    en: {
      professional_certificate: 'Professional Certificate',
      academic_year: 'Academic Year',
      register_now: 'Register Now',
      download_brochure: 'Download Brochure',
      about_program: 'About This Program',
      program_overview: 'Program Overview',
      career_opportunities: 'Career Opportunities',
      key_features: 'Key Features',
      duration: 'Duration',
      price: 'Price',
      registration_form: 'Registration Form',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      message: 'Message',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      success_message: 'Thank you! We will contact you soon.',
      name_required: 'Name is required',
      email_required: 'Email is required',
      phone_required: 'Phone number is required',
      invalid_email: 'Invalid email address',
      brochure_not_available: 'Brochure currently not available',
      sar: 'SAR'
    },
    ar: {
      professional_certificate: 'شهادة مهنية',
      academic_year: 'سنة أكاديمية',
      register_now: 'سجل الآن',
      download_brochure: 'تحميل الكتيب',
      about_program: 'حول هذا البرنامج',
      program_overview: 'نظرة عامة على البرنامج',
      career_opportunities: 'الفرص المهنية',
      key_features: 'الميزات الرئيسية',
      duration: 'المدة',
      price: 'السعر',
      registration_form: 'نموذج التسجيل',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      message: 'الرسالة',
      submit: 'إرسال الطلب',
      submitting: 'جاري الإرسال...',
      success_message: 'شكراً لك! سنتواصل معك قريباً.',
      name_required: 'الاسم مطلوب',
      email_required: 'البريد الإلكتروني مطلوب',
      phone_required: 'رقم الهاتف مطلوب',
      invalid_email: 'عنوان بريد إلكتروني غير صالح',
      brochure_not_available: 'الكتيب غير متوفر حالياً',
      sar: 'ريال'
    }
  };

  const t = (key: keyof typeof translations.en) => translations[currentLanguage][key];

  // Demo program data with new brochure format
  const program = propProgram || {
    id: 'mba-accounting-finance',
    title: 'DUAL MBA IN ACCOUNTING AND FINANCE',
    title_ar: 'ماجستير إدارة الأعمال المزدوج في المحاسبة والمالية',
    tagline: 'Empower Your Future with Internationally Accredited MBA and DBA Programs. Be Part of the vision',
    tagline_ar: 'عزز مستقبلك ببرامج ماجستير إدارة الأعمال ودكتوراه إدارة الأعمال المعتمدة دولياً. كن جزءاً من الرؤية',
    description: 'The MBA in Accounting and Finance at IBAS in Switzerland prepares professionals to lead financial operations and strategic decisions in global organizations. The program focuses on advanced topics like financial reporting, investment analysis, risk management, and international finance. Students gain hands-on expertise to solve complex financial challenges. The flexible learning model supports working professionals. Graduates are ready to lead in finance, consulting, or corporate management.',
    description_ar: 'ماجستير إدارة الأعمال في المحاسبة والمالية في IBAS في سويسرا يعد المهنيين لقيادة العمليات المالية والقرارات الاستراتيجية في المنظمات العالمية. يركز البرنامج على مواضيع متقدمة مثل التقارير المالية وتحليل الاستثمار وإدارة المخاطر والمالية الدولية.',
    duration: '1 Academic Year',
    duration_ar: 'سنة أكاديمية واحدة',
    price: '25000',
    modules: [
      'Finance for Strategic Managers',
      'Personal Development for Leadership and Strategic Management',
      'Strategic Planning',
      'Research for Strategic Development',
      'Advanced Audit and Compliance',
      'Strategic Human Resource Management',
      'Advanced Accounting and Finance',
      'Strategic Marketing',
      'Organizational Behavior'
    ],
    modules_ar: [
      'المالية للمديرين الاستراتيجيين',
      'التطوير الشخصي للقيادة والإدارة الاستراتيجية',
      'التخطيط الاستراتيجي',
      'البحث للتطوير الاستراتيجي',
      'التدقيق المتقدم والامتثال',
      'إدارة الموارد البشرية الاستراتيجية',
      'المحاسبة والمالية المتقدمة',
      'التسويق الاستراتيجي',
      'السلوك التنظيمي'
    ],
    careerOpportunities: [
      'Financial Analyst',
      'Accountant',
      'Finance Manager',
      'Investment Analyst',
      'Financial Controller',
      'CFO'
    ],
    careerOpportunities_ar: [
      'محلل مالي',
      'محاسب',
      'مدير مالي',
      'محلل استثمار',
      'مراقب مالي',
      'مدير مالي تنفيذي'
    ],
    keyFeatures: [
      { title: 'Career Advancement', description: 'Unlock more opportunities for promotions and career growth.' },
      { title: 'Global Perspective', description: 'Study in a program with strong international focus and relevance.' },
      { title: 'Practical Skills Development', description: 'Enhance your skills to meet the demands of today\'s job market.' },
      { title: 'Flexible Study Mode', description: 'Study online without leaving your job or relocating.' },
      { title: 'British-Aligned Education Standards', description: 'Curriculum follows British standards, ranked among the top globally.' },
      { title: 'Fast-Track Career Acceleration', description: 'Maximum Flexibility 24/7 Access' },
      { title: 'AI-Driven Personalization', description: 'Student Academic Support' },
      { title: 'Graduation Ceremony in Switzerland', description: 'Graduation Ceremony in Switzerland' }
    ],
    keyFeatures_ar: [
      { title: 'التقدم المهني', description: 'افتح المزيد من الفرص للترقيات والنمو المهني.' },
      { title: 'منظور عالمي', description: 'ادرس في برنامج له تركيز وصلة دولية قوية.' },
      { title: 'تطوير المهارات العملية', description: 'عزز مهاراتك لتلبية متطلبات سوق العمل اليوم.' },
      { title: 'نمط دراسة مرن', description: 'ادرس عبر الإنترنت دون ترك وظيفتك أو الانتقال.' },
      { title: 'معايير التعليم البريطانية المتوافقة', description: 'المنهج يتبع المعايير البريطانية المصنفة من بين الأفضل عالمياً.' },
      { title: 'تسريع مهني سريع المسار', description: 'مرونة قصوى وصول على مدار الساعة' },
      { title: 'التخصيص المدفوع بالذكاء الاصطناعي', description: 'دعم أكاديمي للطلاب' },
      { title: 'حفل التخرج في سويسرا', description: 'حفل التخرج في سويسرا' }
    ],
    brochure_en: '/brochures/mba-accounting-finance-en.pdf',
    brochure_ar: '/brochures/mba-accounting-finance-ar.pdf'
  };

  // State for the lead form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.name.trim()) errors.name = t('name_required');
    if (!formData.email.trim()) {
      errors.email = t('email_required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      errors.email = t('invalid_email');
    }
    if (!formData.phone.trim()) errors.phone = t('phone_required');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadBrochure = () => {
    const brochureUrl = currentLanguage === 'ar' ? program.brochure_ar : program.brochure_en;
    if (brochureUrl) {
      const link = document.createElement('a');
      link.href = brochureUrl;
      link.download = `${program.title}-${currentLanguage === 'ar' ? 'Arabic' : 'English'}-Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(t('brochure_not_available'));
    }
  };

  const getCurrentData = (field: string) => {
    if (currentLanguage === 'ar' && program[`${field}_ar`]) {
      return program[`${field}_ar`];
    }
    return program[field];
  };

  return (
    <div className="bg-gray-50" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div className="relative h-96 bg-gradient-to-r from-primary/90 to-primary/70">
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className={`max-w-4xl text-white ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-accent/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {getCurrentData('duration')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{getCurrentData('title')}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {getCurrentData('tagline')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#register" className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-lg transition-colors duration-300">
                {t('register_now')}
              </a>
              <button 
                onClick={handleDownloadBrochure}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-lg transition-colors duration-300"
              >
                {t('download_brochure')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Program */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{t('about_program')}</h2>
              <p className="text-gray-700 leading-relaxed">
                {getCurrentData('description')}
              </p>
            </section>

            {/* Program Overview (Modules) */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{t('program_overview')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentData('modules').map((module: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">{module}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Opportunities */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{t('career_opportunities')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentData('careerOpportunities').map((career: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-accent/10 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">{career}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Features */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">{t('key_features')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getCurrentData('keyFeatures').map((feature: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-primary mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-primary mb-4">Program Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('duration')}:</span>
                  <span className="font-medium">{getCurrentData('duration')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('price')}:</span>
                  <span className="font-medium text-accent">{program.price} {t('sar')}</span>
                </div>
              </div>
              <button 
                onClick={handleDownloadBrochure}
                className="w-full mt-4 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                {t('download_brochure')}
              </button>
            </div>

            {/* Registration Form */}
            <div id="register" className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-primary mb-4">{t('registration_form')}</h3>
              
              {submitSuccess ? (
                <div className="text-center py-4">
                  <div className="text-green-600 text-2xl mb-2">✓</div>
                  <p className="text-green-600 font-medium">{t('success_message')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('submitting') : t('submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail; 