import React, { useState } from 'react';
import { companyInfo, accreditations, partnerships, faculty } from '../data/optimus-data';
import { useCMS } from '../../app/contexts/cms-context';
import { Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderProps {
  name: string;
  title: string;
  image: string;
  bio?: string;
}

interface FeatureCardProps {
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ titleKey, descriptionKey, icon, index }) => {
  const { getContent } = useCMS();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="text-[#058C42] mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2B1F4F] mb-2">{getContent(titleKey)}</h3>
      <p className="text-gray-600">{getContent(descriptionKey)}</p>
    </motion.div>
  );
};

const Leader: React.FC<LeaderProps> = ({ name, title, image, bio }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className="flex flex-col items-center relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-32 h-32 md:w-36 md:h-36 mb-4 overflow-hidden rounded-full border-4 border-white shadow-md transition-all duration-300 group-hover:border-accent">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-bold text-primary">{name}</h3>
      <p className="text-gray-600 mb-2">{title}</p>
      
      {bio && isHovering && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
          <div className="bg-white/95 p-4 rounded-lg shadow-lg max-w-xs transform transition-all duration-300 opacity-100 scale-100">
            <h4 className="font-bold text-primary mb-2">{name}</h4>
            <p className="text-sm text-gray-700">{bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const AboutUs: React.FC = () => {
  const { getContent } = useCMS();
  
  // All 5 faculty members with consistent data structure
  const featuredFaculty = [
    {
      id: "ahmed-reda",
      name: "Dr. Ahmed Reda",
      title: "Learning & Development Expert",
      image: "/grabbedPhotos/people/Dr. Ahmed Reda.png",
      bio: faculty.find(f => f.id === "ahmed-reda")?.bio
    },
    {
      id: "aliaa-rohaim",
      name: "Dr. Aliaa Rohaim",
      title: "Marketing Expert",
      image: "/grabbedPhotos/people/Dr. Aliaa Rohaim.jpg",
      bio: faculty.find(f => f.id === "aliaa-rohaim")?.bio
    },
    {
      id: "dina-el-kayaly",
      name: "Dr. Dina El Kayaly",
      title: "Marketing Research Specialist",
      image: "/grabbedPhotos/people/Dr. Dina ElKayaly.jpg",
      bio: faculty.find(f => f.id === "dina-el-kayaly")?.bio
    },
    {
      id: "ashraf-mowafi",
      name: "Dr. Ashraf Mowafi",
      title: "Healthcare Management Expert",
      image: "/grabbedPhotos/people/Dr. Ashraf Mowafi.jpg",
      bio: faculty.find(f => f.id === "ashraf-mowafi")?.bio
    },
    {
      id: "islam-abdelbary",
      name: "Dr. Islam Abdelbary",
      title: "Economics Professor",
      image: "/grabbedPhotos/people/Dr. Islam AbdelBary.jpg",
      bio: faculty.find(f => f.id === "islam-abdelbary")?.bio
    }
  ];

  return (
    <section id="about" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-20">
          <div className="flex flex-col md:flex-row min-h-0 md:min-h-[420px]">
            {/* Image on the left */}
            <div className="md:w-1/2 w-full h-64 md:h-auto md:min-h-[420px]">
              <img 
                src="/classimage.jpg" 
                alt="Classroom" 
                className="w-full h-full object-cover rounded-none md:rounded-xl md:rounded-r-none"
                style={{ minHeight: '100%', minWidth: '100%' }}
              />
            </div>
            {/* Mission text and stats on the right */}
            <div className="md:w-1/2 w-full p-6 md:p-10 flex flex-col justify-center rtl-component">
              <h3 className="text-2xl font-bold text-primary mb-6">{getContent('about_mission_title')}</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {getContent('about_mission_description')}
                </p>
              </div>
              {/* Stats Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-primary">{companyInfo.stats.happyClients}</span>
                  <span className="text-sm text-gray-600">{getContent('about_stats_students')}</span>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-primary">{companyInfo.stats.onlineCourses}</span>
                  <span className="text-sm text-gray-600">{getContent('about_stats_programs')}</span>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-primary">{companyInfo.stats.satisfaction}</span>
                  <span className="text-sm text-gray-600">{getContent('about_stats_satisfaction')}</span>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-primary">{companyInfo.stats.onlineSupport}</span>
                  <span className="text-sm text-gray-600">{getContent('about_stats_support')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why Choose Optimus Section */}
        <div className="mb-24 relative overflow-hidden">
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
          
          <div className="relative z-10 rtl-component">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-[#2B1F4F] mb-4">{getContent('about_why_choose_title')}</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {getContent('about_why_choose_subtitle')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </div>
        
        {/* Accreditations Section */}
        <div className="mb-24 rtl-component">
          <h3 className="text-2xl font-bold text-primary mb-14 text-center">{getContent('about_accreditations_title')}</h3>
          <p className="text-center text-gray-600 mb-16">{getContent('about_accreditations_subtitle')}</p>
          
          {/* Accreditations - PRIORITY */}
          <div className="mb-20">
            <h4 className="text-3xl font-bold text-primary mb-6 text-center">{getContent('accreditations.main_title')}</h4>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
              {getContent('accreditations.main_subtitle')}
            </p>
            <div className="flex justify-center items-center gap-10 max-w-3xl mx-auto">
            {accreditations.map((accreditation) => (
                <div key={accreditation.id} className="group bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/10 hover:border-primary/30">
                <img 
                  src={accreditation.logo} 
                  alt={accreditation.name} 
                    className="w-20 h-20 md:w-24 md:h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                    title={accreditation.name}
                />
                </div>
              ))}
            </div>
          </div>

          {/* Academic Partnerships */}
          <div>
            <h4 className="text-2xl font-bold text-primary mb-4 text-center">{getContent('accreditations.partnerships_title')}</h4>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              {getContent('accreditations.partnerships_subtitle')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
              {partnerships.map((partnership) => (
                <div key={partnership.id} className="group bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center h-32 md:h-36 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
                  <img 
                    src={partnership.logo} 
                    alt={partnership.name} 
                    className="max-h-16 md:max-h-20 max-w-full transition-transform duration-300 group-hover:scale-105"
                    title={partnership.name}
                  />
              </div>
            ))}
            </div>
          </div>
        </div>
        
        {/* Faculty Section */}
        <div className="rtl-component">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">{getContent('about_faculty_title')}</h3>
          <p className="text-center text-gray-600 mb-10">{getContent('about_faculty_subtitle')}</p>
          
          {/* Top row: 3 faculty members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-12">
            {featuredFaculty.slice(0, 3).map((member) => (
            <Leader 
                key={member.id}
                name={member.name}
                title={member.title}
                image={member.image}
                bio={member.bio}
            />
          ))}
        </div>
        
          {/* Bottom row: 2 faculty members centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-3xl mx-auto">
            {featuredFaculty.slice(3, 5).map((member) => (
              <Leader 
                key={member.id}
                name={member.name}
                title={member.title}
                image={member.image}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;