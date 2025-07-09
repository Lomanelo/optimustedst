import React from 'react';
import { companyInfo, accreditations, partnerships } from '../data/optimus-data';
import { useCMS } from '../../app/contexts/cms-context';
import { Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ titleKey, descriptionKey, icon, index }) => {
  const { getContent, getFormattedContent, currentLanguage } = useCMS();
  
  const getCardTextAlign = () => {
    return currentLanguage === 'ar' ? 'text-right rtl-content' : 'text-left';
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${getCardTextAlign()}`}
    >
      <div className="text-[#058C42] mb-4">
        {icon}
      </div>
      <h3 className={`text-xl font-bold text-[#2B1F4F] mb-2 ${getCardTextAlign()}`}>{getContent(titleKey)}</h3>
      <p className={`text-gray-600 ${getCardTextAlign()}`}>{getFormattedContent(descriptionKey)}</p>
    </motion.div>
  );
};

const AboutUs: React.FC = () => {
  const { getContent, getFormattedContent, currentLanguage } = useCMS();
  
  // Helper function to get text alignment classes based on language
  const getTextAlignClass = () => {
    return currentLanguage === 'ar' 
      ? 'text-right rtl-content' 
      : 'text-left';
  };
  
  // Helper function to get direction class
  const getDirectionClass = () => {
    return currentLanguage === 'ar' ? 'dir-rtl' : 'dir-ltr';
  };

  return (
    <section id="about" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row min-h-0 md:min-h-[380px]">
            {/* Image on the left */}
            <div className="md:w-1/2 w-full h-64 md:h-auto md:min-h-[380px]">
              <img 
                src="/classimage.jpg" 
                alt="Classroom" 
                className="w-full h-full object-cover rounded-none md:rounded-xl md:rounded-r-none"
                style={{ minHeight: '100%', minWidth: '100%' }}
              />
            </div>
            {/* Mission text and stats on the right */}
            <div className={`md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center ${getTextAlignClass()}`}>
              <h3 className={`text-2xl font-bold text-primary mb-4 ${getTextAlignClass()}`}>{getContent('about_mission_title')}</h3>
              <div className="space-y-3">
                <p className={`text-gray-600 ${getTextAlignClass()}`}>
                  {getFormattedContent('about_mission_description')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why Choose Optimus Section */}
        <div className="mb-16 md:mb-20 relative overflow-hidden">
          {/* Background decorative shapes */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-0 right-0 w-80 h-80 bg-[#2B1F4F]/5 rounded-full -translate-y-1/2 translate-x-1/4"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-[#058C42]/5 rounded-full translate-y-1/2 -translate-x-1/4"
          ></motion.div>
          
          <div className={`relative z-10 ${getTextAlignClass()}`}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className={`mb-8 md:mb-10 text-center`}
            >
              <h3 className={`text-3xl md:text-4xl font-bold text-[#2B1F4F] mb-3 text-center`}>{getContent('about_why_choose_title')}</h3>
              <p className={`text-gray-600 max-w-2xl mx-auto text-center`}>
                {getContent('about_why_choose_subtitle')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <FeatureCard 
                titleKey="about_accredited_title"
                descriptionKey="about_accredited_desc"
                icon={<Award size={32} />}
                index={0}
              />
              <FeatureCard 
                titleKey="about_flexible_title"
                descriptionKey="about_flexible_desc"
                icon={<Clock size={32} />}
                index={1}
              />
              <FeatureCard 
                titleKey="about_career_title"
                descriptionKey="about_career_desc"
                icon={<Users size={32} />}
                index={2}
              />
            </div>
            
            {/* Stats Section */}
            <div className="mt-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">1000+</div>
                  <div className="text-xs md:text-sm text-gray-600">{currentLanguage === 'ar' ? 'طالب حول العالم' : 'Students Worldwide'}</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">25+</div>
                  <div className="text-xs md:text-sm text-gray-600">{currentLanguage === 'ar' ? 'برنامج متاح' : 'Available Programs'}</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">98%</div>
                  <div className="text-xs md:text-sm text-gray-600">{currentLanguage === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate'}</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">24/7</div>
                  <div className="text-xs md:text-sm text-gray-600">{currentLanguage === 'ar' ? 'دعم على مدار الساعة' : 'Round-the-clock Support'}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Accreditations Section */}
        <div className={`mb-16 md:mb-20 ${getTextAlignClass()}`}>
          <h3 className={`text-2xl font-bold text-primary mb-8 md:mb-10 ${currentLanguage === 'ar' ? 'text-center' : 'text-center'}`}>{getContent('about_accreditations_title')}</h3>
          <div className={`text-gray-600 mb-10 md:mb-12 ${getTextAlignClass()}`}>{getFormattedContent('about_accreditations_subtitle')}</div>
          
          {/* Accreditations - PRIORITY */}
          <div className="mb-12 md:mb-16">
            <h4 className="text-3xl font-bold text-primary mb-4 md:mb-6 text-center">{getContent('accreditations_main_title')}</h4>
            <div className="text-center text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto text-lg">
              {getFormattedContent('accreditations_main_subtitle')}
            </div>
            <div className="flex justify-center items-center gap-8 md:gap-10 max-w-3xl mx-auto">
            {accreditations.map((accreditation) => {
              // Map accreditation IDs to CMS keys
              const getAccreditationName = (id: string) => {
                const cmsKey = `accreditation_${id}`;
                return getContent(cmsKey) || accreditation.name;
              };
              
              return (
                <div key={accreditation.id} className="group bg-white p-4 md:p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/10 hover:border-primary/30">
                <img 
                  src={accreditation.logo} 
                  alt={getAccreditationName(accreditation.id)} 
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                    title={getAccreditationName(accreditation.id)}
                />
                </div>
              );
            })}
            </div>
          </div>

          {/* Academic Partnerships */}
          <div>
            <h4 className="text-2xl font-bold text-primary mb-3 md:mb-4 text-center">{getContent('accreditations_partnerships_title')}</h4>
            <div className="text-center text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto">
              {getFormattedContent('accreditations_partnerships_subtitle')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 max-w-6xl mx-auto">
              {partnerships.map((partnership) => (
                <div key={partnership.id} className="group bg-white p-4 md:p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center h-28 md:h-32 lg:h-36 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
                  <img 
                    src={partnership.logo} 
                    alt={partnership.name} 
                    className="max-h-12 md:max-h-16 lg:max-h-20 max-w-full transition-transform duration-300 group-hover:scale-105"
                    title={partnership.name}
                  />
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;