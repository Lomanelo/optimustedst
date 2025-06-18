import React, { useState } from 'react';
import { allPrograms, professionalCertificates, qualifiDiplomas, atheDiplomas, specialPrograms } from '../data/optimus-data';

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Step 2: Academic Info
  education: string;
  programInterest: string;
  
  // Step 3: Additional Info
  howHeard: string;
  questions: string;
}

const educationLevels = [
  'High School',
  'Some College',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate',
  'Other'
];

const howHeardOptions = [
  'Google Search',
  'Social Media',
  'Friend/Family',
  'Advertisement',
  'Education Fair',
  'Other'
];

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    programInterest: '',
    howHeard: '',
    questions: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;
    
    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.education) {
        newErrors.education = 'Education level is required';
        isValid = false;
      }
      
      if (!formData.programInterest) {
        newErrors.programInterest = 'Please select a program of interest';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPolicyAccepted) {
      setPolicyError('You must accept the privacy policy to continue.');
      return;
    } else {
      setPolicyError(null);
    }
    
    if (validateStep(step)) {
      setIsSubmitting(true);
      
      try {
        // In a real application, we would send the form data to an API endpoint
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        console.log('Form submitted successfully:', formData);
        setSubmitSuccess(true);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your form. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto my-8">
        <div className="text-center">
          <div className="bg-accent/10 inline-flex rounded-full p-4 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for registering with Optimus. A confirmation has been sent to your email.</p>
          <p className="text-gray-600 mb-8">Our admissions team will contact you within 48 hours to discuss the next steps.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4 uppercase tracking-wide">Program Registration</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Complete the form below to register for your chosen program at Optimus.</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex mb-12">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex-1">
                <div 
                  className={`h-2 ${
                    stepNumber < step ? 'bg-accent' : stepNumber === step ? 'bg-primary' : 'bg-gray-300'
                  }`}
                ></div>
                <div className="flex flex-col items-center mt-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      stepNumber < step 
                        ? 'bg-accent text-white' 
                        : stepNumber === step 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber < step ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span 
                    className={`text-sm mt-1 ${
                      stepNumber <= step ? 'text-primary font-medium' : 'text-gray-500'
                    }`}
                  >
                    {stepNumber === 1 ? 'Personal Info' : stepNumber === 2 ? 'Academic Info' : 'Additional Info'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary-dark">Personal Information</h3>
                <p className="text-gray-500">Please enter your contact details below.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 2: Academic Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary-dark">Academic Information</h3>
                <p className="text-gray-500">Please tell us about your educational background and program interest.</p>
                
                <div>
                  <label htmlFor="education" className="block text-gray-700 font-medium mb-2">Highest Level of Education *</label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.education ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary bg-white`}
                  >
                    <option value="">Select your education level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.education && (
                    <p className="text-red-500 text-sm mt-1">{errors.education}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="programInterest" className="block text-gray-700 font-medium mb-2">Program of Interest *</label>
                  <select
                    id="programInterest"
                    name="programInterest"
                    value={formData.programInterest}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.programInterest ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary bg-white`}
                  >
                    <option value="">Select a program</option>
                    <optgroup label="Professional Certificates">
                      {professionalCertificates.map(program => (
                        <option key={program.id} value={program.id}>{program.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="QUALIFI Diplomas">
                      {qualifiDiplomas.map(program => (
                        <option key={program.id} value={program.id}>{program.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="ATHE Diplomas">
                      {atheDiplomas.map(program => (
                        <option key={program.id} value={program.id}>{program.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Special Programs">
                      {specialPrograms.map(program => (
                        <option key={program.id} value={program.id}>{program.title}</option>
                      ))}
                    </optgroup>
                  </select>
                  {errors.programInterest && (
                    <p className="text-red-500 text-sm mt-1">{errors.programInterest}</p>
                  )}
                </div>
                
                <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                  <h4 className="font-medium text-primary-dark mb-2">Benefits of this Program</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Internationally recognized qualification</li>
                    <li>Flexible learning options</li>
                    <li>Industry-relevant curriculum</li>
                    <li>Career guidance and placement assistance</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Step 3: Additional Information */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary-dark">Additional Information</h3>
                <p className="text-gray-500">Please provide a few more details to complete your registration.</p>
                
                <div>
                  <label htmlFor="howHeard" className="block text-gray-700 font-medium mb-2">How did you hear about us?</label>
                  <select
                    id="howHeard"
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    <option value="">Select an option</option>
                    {howHeardOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="questions" className="block text-gray-700 font-medium mb-2">Questions or Comments</label>
                  <textarea
                    id="questions"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Any questions or special requirements?"
                  ></textarea>
                </div>
                
                <div className="flex items-start mt-6">
                  <input
                    type="checkbox"
                    id="privacyPolicy"
                    checked={isPolicyAccepted}
                    onChange={() => {
                      setIsPolicyAccepted(!isPolicyAccepted);
                      if (policyError) setPolicyError(null);
                    }}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="privacyPolicy" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and consent to have my data processed as per the terms.
                  </label>
                </div>
                {policyError && (
                  <p className="text-red-500 text-sm mt-1 ml-6">{policyError}</p>
                )}
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-primary-dark mb-2">What happens next?</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>You'll receive a confirmation email with your registration details</li>
                    <li>Our admissions team will contact you within 48 hours</li>
                    <li>We'll guide you through document submission and payment process</li>
                    <li>Once completed, you'll get access to your learning materials</li>
                  </ol>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent flex items-center"
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
                    'Submit Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm; 