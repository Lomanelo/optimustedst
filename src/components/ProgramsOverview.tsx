'use client';

import React from 'react';
import { Briefcase, GraduationCap, BookOpen } from 'lucide-react';
import { useCMS } from '../../app/contexts/cms-context';
import FlowingShape from './FlowingShape';

interface ProgramCardProps {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  link?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ title, description, icon, link = "#" }) => {
  const { getContent, getFormattedContent, loading: cmsLoading } = useCMS();
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <div className="text-gray-600 mb-4">{description}</div>
      <a 
        href={link} 
        className="text-accent font-medium inline-flex items-center hover:underline"
      >
        {cmsLoading ? 'Learn More' : getContent('programs_learn_more')} <span className="ml-1">→</span>
      </a>
    </div>
  );
};

const ProgramsOverview: React.FC = () => {
  const { getContent, getFormattedContent, loading: cmsLoading } = useCMS();
  
  // Don't render if CMS is still loading
  if (cmsLoading) {
    return (
      <section id="programs" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <FlowingShape 
        position="top-left" 
        colors={['primary', 'accent']} 
        opacity={0.05} 
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{getContent('programs_overview_title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getFormattedContent('programs_overview_subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProgramCard 
            title={getContent('programs_bachelor_title')} 
            icon={<GraduationCap size={28} />}
            description={getFormattedContent('programs_bachelor_description')}
            link="/programs#bachelor"
          />
          <ProgramCard 
            title={getContent('programs_mba_title')} 
            icon={<Briefcase size={28} />}
            description={getFormattedContent('programs_mba_description')}
            link="/programs#mba"
          />
          <ProgramCard 
            title={getContent('programs_doctorate_title')} 
            icon={<BookOpen size={28} />}
            description={getFormattedContent('programs_doctorate_description')}
            link="/programs#doctorate"
          />
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors">
            {getContent('programs_view_all_button')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsOverview;