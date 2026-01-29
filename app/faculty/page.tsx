'use client';

import React from 'react';
import { Metadata } from 'next';
import ClientLayout from '../components/ClientLayout';
import { useCMS } from '../contexts/cms-context';
import { GraduationCap, Award, Book, Globe } from 'lucide-react';
import Script from 'next/script';
import { generatePersonSchema } from '../lib/schema-generators';

// Sample faculty data - this should ideally come from Firestore
const facultyMembers = [
  {
    id: 1,
    name: 'Dr. Ahmed Al-Mansour',
    name_ar: 'د. أحمد المنصور',
    title: 'Professor of Business Administration',
    title_ar: 'أستاذ إدارة الأعمال',
    qualifications: [
      'Ph.D. in Business Administration - Harvard Business School',
      'MBA - London Business School',
      'B.Sc. in Economics - King Saud University'
    ],
    qualifications_ar: [
      'دكتوراه في إدارة الأعمال - كلية هارفارد للأعمال',
      'ماجستير إدارة الأعمال - كلية لندن للأعمال',
      'بكالوريوس في الاقتصاد - جامعة الملك سعود'
    ],
    specialization: 'Strategic Management & Leadership',
    specialization_ar: 'الإدارة الاستراتيجية والقيادة',
    experience: '20+ years in business education and consulting',
    experience_ar: 'أكثر من 20 عاماً في التعليم التجاري والاستشارات',
    bio: 'Dr. Al-Mansour brings over two decades of experience in executive education and strategic management. He has consulted for numerous Fortune 500 companies and government entities across the Middle East.',
    bio_ar: 'يجلب الدكتور المنصور أكثر من عقدين من الخبرة في التعليم التنفيذي والإدارة الاستراتيجية. قدم استشارات للعديد من شركات Fortune 500 والجهات الحكومية في الشرق الأوسط.',
    image: '/Logo.jpeg'
  },
  {
    id: 2,
    name: 'Dr. Sarah Mitchell',
    name_ar: 'د. سارة ميتشل',
    title: 'Associate Professor of Finance',
    title_ar: 'أستاذ مشارك في المالية',
    qualifications: [
      'Ph.D. in Finance - MIT Sloan School of Management',
      'CFA Charterholder',
      'M.Sc. in Financial Engineering - Stanford University'
    ],
    qualifications_ar: [
      'دكتوراه في المالية - كلية MIT سلون للإدارة',
      'حامل شهادة CFA',
      'ماجستير في الهندسة المالية - جامعة ستانفورد'
    ],
    specialization: 'Corporate Finance & Investment Management',
    specialization_ar: 'التمويل المؤسسي وإدارة الاستثمار',
    experience: '15+ years in financial analysis and education',
    experience_ar: 'أكثر من 15 عاماً في التحليل المالي والتعليم',
    bio: 'Dr. Mitchell specializes in corporate finance and investment strategies. She has published extensively in top-tier academic journals and serves as a financial advisor to several multinational corporations.',
    bio_ar: 'تتخصص الدكتورة ميتشل في التمويل المؤسسي واستراتيجيات الاستثمار. نشرت على نطاق واسع في المجلات الأكاديمية الرائدة وتعمل كمستشارة مالية للعديد من الشركات متعددة الجنسيات.',
    image: '/Logo.jpeg'
  },
  {
    id: 3,
    name: 'Prof. Mohammed Al-Fahad',
    name_ar: 'أ.د. محمد الفهد',
    title: 'Professor of Digital Transformation',
    title_ar: 'أستاذ التحول الرقمي',
    qualifications: [
      'Ph.D. in Information Systems - Oxford University',
      'MBA - INSEAD',
      'B.Eng. in Computer Science - King Fahd University'
    ],
    qualifications_ar: [
      'دكتوراه في نظم المعلومات - جامعة أكسفورد',
      'ماجستير إدارة الأعمال - إنسياد',
      'بكالوريوس هندسة علوم الحاسب - جامعة الملك فهد'
    ],
    specialization: 'Digital Business Strategy & Innovation',
    specialization_ar: 'استراتيجية الأعمال الرقمية والابتكار',
    experience: '18+ years leading digital transformation initiatives',
    experience_ar: 'أكثر من 18 عاماً في قيادة مبادرات التحول الرقمي',
    bio: 'Prof. Al-Fahad is a leading expert in digital transformation and business innovation. He has led numerous digital transformation projects aligned with Saudi Vision 2030.',
    bio_ar: 'الأستاذ الدكتور الفهد خبير رائد في التحول الرقمي والابتكار في الأعمال. قاد العديد من مشاريع التحول الرقمي المتوافقة مع رؤية السعودية 2030.',
    image: '/Logo.jpeg'
  },
  {
    id: 4,
    name: 'Dr. Fatima Al-Zahrani',
    name_ar: 'د. فاطمة الزهراني',
    title: 'Associate Professor of Healthcare Management',
    title_ar: 'أستاذ مشارك في إدارة الرعاية الصحية',
    qualifications: [
      'Ph.D. in Healthcare Administration - Johns Hopkins University',
      'MHA - University of Michigan',
      'M.D. - King Saud University'
    ],
    qualifications_ar: [
      'دكتوراه في إدارة الرعاية الصحية - جامعة جونز هوبكنز',
      'ماجستير إدارة الرعاية الصحية - جامعة ميشيغان',
      'دكتور في الطب - جامعة الملك سعود'
    ],
    specialization: 'Healthcare Systems & Policy',
    specialization_ar: 'أنظمة وسياسات الرعاية الصحية',
    experience: '12+ years in healthcare management and policy',
    experience_ar: 'أكثر من 12 عاماً في إدارة وسياسات الرعاية الصحية',
    bio: 'Dr. Al-Zahrani combines medical expertise with management knowledge. She has advised on healthcare reform initiatives and hospital management across the Gulf region.',
    bio_ar: 'تجمع الدكتورة الزهراني بين الخبرة الطبية والمعرفة الإدارية. قدمت المشورة بشأن مبادرات إصلاح الرعاية الصحية وإدارة المستشفيات في منطقة الخليج.',
    image: '/Logo.jpeg'
  }
];

export default function FacultyPage() {
  const { getContent, currentLanguage } = useCMS();
  
  const getTextAlignClass = () => currentLanguage === 'ar' ? 'text-right' : 'text-left';
  const getFlexDirectionClass = () => currentLanguage === 'ar' ? 'flex-row-reverse' : 'flex-row';

  return (
    <ClientLayout>
      {/* Schema markup for faculty members */}
      {facultyMembers.map((faculty) => (
        <Script
          key={`schema-${faculty.id}`}
          id={`faculty-schema-${faculty.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePersonSchema({
              name: currentLanguage === 'ar' ? faculty.name_ar : faculty.name,
              jobTitle: currentLanguage === 'ar' ? faculty.title_ar : faculty.title,
              description: currentLanguage === 'ar' ? faculty.bio_ar : faculty.bio,
              image: faculty.image,
              qualifications: currentLanguage === 'ar' ? faculty.qualifications_ar : faculty.qualifications
            }))
          }}
        />
      ))}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {currentLanguage === 'ar' ? 'هيئة التدريس المتميزة' : 'Our Distinguished Faculty'}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              {currentLanguage === 'ar' 
                ? 'تعرف على أعضاء هيئة التدريس ذوي الخبرة العالمية الذين يقودون التميز الأكاديمي في أوبتيموس التعليمية'
                : 'Meet our world-class faculty members who bring decades of academic excellence and industry expertise to OPTIMUS Education'}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {currentLanguage === 'ar'
                ? 'خبراء دوليون ملتزمون بتطوير قادة المستقبل في المملكة العربية السعودية'
                : 'International experts committed to developing Saudi Arabia\'s future business leaders'}
            </p>
          </div>

          {/* Faculty Grid */}
          <div className="space-y-12">
            {facultyMembers.map((faculty, index) => (
              <div
                key={faculty.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`flex flex-col lg:${getFlexDirectionClass()} ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Image Section */}
                  <div className="lg:w-1/3">
                    <div className="h-64 lg:h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center p-8">
                      <img
                        src={faculty.image}
                        alt={currentLanguage === 'ar' ? faculty.name_ar : faculty.name}
                        className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-2xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Logo.jpeg';
                        }}
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`lg:w-2/3 p-8 ${getTextAlignClass()}`}>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      {currentLanguage === 'ar' ? faculty.name_ar : faculty.name}
                    </h2>
                    <p className="text-xl text-accent mb-4">
                      {currentLanguage === 'ar' ? faculty.title_ar : faculty.title}
                    </p>

                    {/* Specialization */}
                    <div className={`flex items-center gap-2 mb-4 ${getFlexDirectionClass()}`}>
                      <Book className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {currentLanguage === 'ar' ? faculty.specialization_ar : faculty.specialization}
                      </span>
                    </div>

                    {/* Experience */}
                    <div className={`flex items-center gap-2 mb-6 ${getFlexDirectionClass()}`}>
                      <Award className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-gray-600">
                        {currentLanguage === 'ar' ? faculty.experience_ar : faculty.experience}
                      </span>
                    </div>

                    {/* Biography */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {currentLanguage === 'ar' ? faculty.bio_ar : faculty.bio}
                    </p>

                    {/* Qualifications */}
                    <div>
                      <div className={`flex items-center gap-2 mb-3 ${getFlexDirectionClass()}`}>
                        <GraduationCap className="w-6 h-6 text-primary flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {currentLanguage === 'ar' ? 'المؤهلات الأكاديمية' : 'Academic Qualifications'}
                        </h3>
                      </div>
                      <ul className={`space-y-2 ${currentLanguage === 'ar' ? 'pr-8' : 'pl-8'}`}>
                        {(currentLanguage === 'ar' ? faculty.qualifications_ar : faculty.qualifications).map((qual, idx) => (
                          <li key={idx} className={`text-gray-600 flex items-start gap-2 ${getFlexDirectionClass()}`}>
                            <span className="text-accent flex-shrink-0">•</span>
                            <span>{qual}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {currentLanguage === 'ar' ? 'تعلم من الأفضل' : 'Learn from the Best'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {currentLanguage === 'ar'
                ? 'انضم إلى برامجنا واستفد من خبرة هيئة تدريس عالمية المستوى'
                : 'Join our programs and benefit from world-class faculty expertise'}
            </p>
            <a
              href="/programs"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              {currentLanguage === 'ar' ? 'استكشف برامجنا' : 'Explore Our Programs'}
            </a>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

