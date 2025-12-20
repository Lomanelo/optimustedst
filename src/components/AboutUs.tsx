import React from 'react';
import { companyInfo } from '../data/optimus-data';
import { useCMS } from '../../app/contexts/cms-context';
import { Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index }) => {
  const { currentLanguage } = useCMS();
  
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
      <h3 className={`text-xl font-bold text-[#2B1F4F] mb-2 ${getCardTextAlign()}`}>{title}</h3>
      <p className={`text-gray-600 ${getCardTextAlign()}`}>{description}</p>
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
                src="/ProgramPhotos/HeroImage.png" 
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
              <h3 className={`text-3xl md:text-4xl font-bold text-[#2B1F4F] mb-3 text-center`}>
                {currentLanguage === 'ar' ? 'لماذا تختار أوبتيموس سوليوشنز؟' : 'Why Choose Optimus Solutions?'}
              </h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <FeatureCard 
                title={currentLanguage === 'ar' ? 'برامج معتمدة' : 'Accredited Programs'}
                description={currentLanguage === 'ar' ? 'جميع برامجنا معتمدة دوليًا باعتماد مزدوج' : 'All our programs are internationally dual-accredited'}
                icon={<Award size={32} />}
                index={0}
              />
              <FeatureCard 
                title={currentLanguage === 'ar' ? 'تعلم مرن' : 'Flexible Learning'}
                description={currentLanguage === 'ar' ? 'ادرس بالسرعة التي تناسبك عبر منصتنا الإلكترونية المرنة' : 'Study at your own pace with our flexible online platform'}
                icon={<Clock size={32} />}
                index={1}
              />
              <FeatureCard 
                title={currentLanguage === 'ar' ? 'هيئة تدريس خبيرة' : 'Expert Faculty'}
                description={currentLanguage === 'ar' ? 'تعلّم على يد خبراء الصناعة وقادة أكاديميين' : 'Learn from industry experts and academic leaders'}
                icon={<Users size={32} />}
                index={2}
              />
            </div>
            

          </div>
        </div>
        
        {/* Accreditations section removed */}
      </div>
    </section>
  );
};

export default AboutUs;