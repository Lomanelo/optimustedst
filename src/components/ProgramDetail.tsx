import React, { useState } from 'react';

interface ProgramDetailProps {
  id: string;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ id }) => {
  // This would normally be fetched from an API based on the ID
  // For demo purposes, we're using a static program object
  const program = {
    id: 'project-manager',
    title: 'Project Manager Program',
    titleAr: 'برنامج إدارة المشاريع الاحترافية',
    description: 'The Project Manager Program is designed to equip professionals with the essential skills and knowledge required to successfully lead projects from initiation to completion. This comprehensive program covers project planning, execution, monitoring, and closing, while incorporating best practices from industry standards.',
    descriptionAr: 'تم تصميم برنامج مدير المشروع لتزويد المهنيين بالمهارات والمعرفة الأساسية المطلوبة لقيادة المشاريع بنجاح من البداية إلى الاكتمال. يغطي هذا البرنامج الشامل تخطيط المشروع وتنفيذه ومراقبته وإغلاقه، مع دمج أفضل الممارسات من معايير الصناعة.',
    category: 'professional',
    specialization: 'Project Management',
    duration: 96,
    price: 2000,
    vatPrice: 2000 * 1.05,
    accreditation: ['Optimus Institute'],
    language: 'both',
    startDates: ['October 15, 2023', 'January 10, 2024', 'April 5, 2024'],
    format: 'Hybrid (Online & In-person)',
    location: 'Al Bustan, Ajman, UAE',
    image: '/grabbedPhotos/programs/project-management.jpg',
    curriculum: [
      {
        title: 'Module 1: Project Management Fundamentals',
        topics: [
          'Introduction to Project Management',
          'Project Life Cycle',
          'Role of a Project Manager',
          'Project Stakeholders'
        ]
      },
      {
        title: 'Module 2: Project Planning',
        topics: [
          'Project Scope Management',
          'Schedule Development',
          'Resource Planning',
          'Cost Estimation and Budgeting'
        ]
      },
      {
        title: 'Module 3: Project Execution and Control',
        topics: [
          'Team Leadership',
          'Communication Management',
          'Risk Management',
          'Quality Control'
        ]
      },
      {
        title: 'Module 4: Project Closing',
        topics: [
          'Project Evaluation',
          'Lessons Learned',
          'Final Documentation',
          'Client Handover'
        ]
      }
    ],
    learningOutcomes: [
      'Develop comprehensive project plans',
      'Apply effective leadership skills to manage project teams',
      'Implement risk management strategies',
      'Monitor and control project execution',
      'Successfully close projects and capture lessons learned'
    ],
    certification: 'Upon successful completion of the program, participants will receive the Optimus Institute Professional Certificate in Project Management, recognized by industry professionals across the UAE and GCC region.'
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
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
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
    // In a real app, this would trigger a file download
    alert('Downloading program brochure...');
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
          <img 
            src={program.image} 
            alt={program.title} 
            className="w-full h-full object-cover mix-blend-overlay"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/1200x400?text=Optimus+Program';
            }}
          />
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                Professional Certificate
              </span>
              <span className="bg-accent/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {program.duration} Hours
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{program.title}</h1>
            {program.titleAr && (
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right" dir="rtl">{program.titleAr}</h2>
            )}
            <p className="text-lg text-white/90 mb-8">
              Transform your career with our comprehensive project management program. 
              Learn industry-standard methodologies and practical skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#register" className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-lg transition-colors duration-300">
                Register Now
              </a>
              <button 
                onClick={handleDownloadBrochure}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-primary font-bold rounded-lg transition-colors duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Program Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Program Overview</h2>
              <p className="text-gray-700 mb-6">{program.description}</p>
              {program.descriptionAr && (
                <p className="text-gray-700 mb-6 text-right" dir="rtl">{program.descriptionAr}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Duration</h3>
                    <p className="text-gray-600">{program.duration} Hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Price</h3>
                    <p className="text-gray-600">
                      <span className="text-lg font-semibold text-accent">{program.price.toLocaleString()} SAR</span>
                      <span className="text-xs ml-1">(+5% VAT)</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Format</h3>
                    <p className="text-gray-600">{program.format}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Location</h3>
                    <p className="text-gray-600">{program.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Language</h3>
                    <p className="text-gray-600">
                      {program.language === 'english' ? 'English' : 
                       program.language === 'arabic' ? 'Arabic' : 
                       'English & Arabic'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Accreditation</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {program.accreditation.map((item, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-800 mb-4">Upcoming Start Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {program.startDates.map((date, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-primary font-medium">{date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Curriculum</h2>
              <div className="space-y-6">
                {program.curriculum.map((module, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">{module.title}</h3>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Learning Outcomes */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Learning Outcomes</h2>
              <p className="text-gray-700 mb-4">Upon completion of this program, you will be able to:</p>
              <ul className="space-y-3">
                {program.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-accent/10 p-1 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Certification */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Certification</h2>
              <div className="flex items-start mb-6">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700">{program.certification}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {program.accreditation.map((accr, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary font-bold">{accr.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Accredited by</h4>
                      <p className="text-primary font-bold">{accr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Lead Form */}
            <div id="register" className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-8">
              <h3 className="text-xl font-bold text-primary mb-4 text-center">Request Information</h3>
              {submitSuccess ? (
                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Thank You!</h4>
                  <p className="text-gray-600 mb-4">Your information has been submitted successfully. Our team will contact you shortly.</p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Any specific questions or requirements?"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-600">
                      I agree to the <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and consent to being contacted about this program.
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-md transition-colors duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              )}
            </div>
            
            {/* Download Brochure */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <h3 className="text-xl font-medium text-primary mb-3">Download Program Brochure</h3>
              <p className="text-gray-600 mb-4">Get detailed information about this program, including curriculum, fees, and admission requirements.</p>
              <button 
                onClick={handleDownloadBrochure}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail; 