import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useCMS } from '../../app/contexts/cms-context';

interface FormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { getContent } = useCMS();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would normally send the form data to a server
    alert(getContent('contact_form_alert'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      program: '',
      message: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h3 className="text-xl font-bold text-primary mb-6">{getContent('contact_form_title')}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">{getContent('contact_form_name_label')}*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">{getContent('contact_form_email_label')}*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">{getContent('contact_form_phone_label')}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="program" className="block text-gray-700 font-medium mb-2">{getContent('contact_select_program')}*</label>
            <select
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">{getContent('contact_select_program')}</option>
              <option value="bachelor">{getContent('programs_bachelor_title')}</option>
              <option value="mba">{getContent('programs_mba_title')}</option>
              <option value="dba">{getContent('programs_doctorate_title')}</option>
              <option value="other">{getContent('contact_program_other')}</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">{getContent('contact_form_message_label')}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {getContent('contact_form_submit_button')}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;