'use client';

import React, { useState } from 'react';
import ClientLayout from '../components/ClientLayout';
import { useCMS } from '../contexts/cms-context';
import { Quote, Star, Briefcase, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Script from 'next/script';
import { generateReviewSchema } from '../lib/schema-generators';

// Sample testimonials - should ideally come from Firestore
const testimonials = [
  {
    id: 1,
    name: 'Abdullah Al-Qahtani',
    name_ar: 'عبدالله القحطاني',
    position: 'Senior Manager, Saudi Aramco',
    position_ar: 'مدير أول، أرامكو السعودية',
    location: 'Dhahran, Saudi Arabia',
    location_ar: 'الظهران، المملكة العربية السعودية',
    program: 'MBA in Strategic Management',
    program_ar: 'ماجستير إدارة الأعمال في الإدارة الاستراتيجية',
    rating: 5,
    year: '2024',
    testimonial: 'OPTIMUS Education transformed my career trajectory. The MBA program was perfectly aligned with Saudi Vision 2030 objectives and provided practical insights I could immediately apply at work. The faculty\'s expertise and the flexible online format allowed me to balance work and studies effectively.',
    testimonial_ar: 'أوبتيموس التعليمية غيرت مسار حياتي المهنية. كان برنامج الماجستير متوافقاً تماماً مع أهداف رؤية السعودية 2030 وقدم رؤى عملية تمكنت من تطبيقها فوراً في العمل. خبرة أعضاء هيئة التدريس والصيغة المرنة عبر الإنترنت سمحت لي بالموازنة بين العمل والدراسة بفعالية.',
    image: '/grabbedPhotos/people/person1.jpg',
    achievement: 'Promoted to Senior Manager within 6 months of graduation',
    achievement_ar: 'تمت ترقيته إلى مدير أول خلال 6 أشهر من التخرج'
  },
  {
    id: 2,
    name: 'Noura Al-Saud',
    name_ar: 'نورة آل سعود',
    position: 'Healthcare Director, Ministry of Health',
    position_ar: 'مديرة الرعاية الصحية، وزارة الصحة',
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    program: 'MBA in Healthcare Management',
    program_ar: 'ماجستير إدارة الأعمال في إدارة الرعاية الصحية',
    rating: 5,
    year: '2024',
    testimonial: 'The Healthcare Management program gave me the tools and knowledge to drive meaningful change in our healthcare system. The international accreditation and quality of education exceeded my expectations. I highly recommend OPTIMUS to any professional seeking to advance their career.',
    testimonial_ar: 'أعطاني برنامج إدارة الرعاية الصحية الأدوات والمعرفة لقيادة تغيير ذي مغزى في نظامنا الصحي. الاعتماد الدولي وجودة التعليم تجاوزت توقعاتي. أوصي بشدة بأوبتيموس لأي محترف يسعى لتطوير حياته المهنية.',
    image: '/grabbedPhotos/people/person2.jpg',
    achievement: 'Led implementation of 3 major healthcare initiatives',
    achievement_ar: 'قادت تنفيذ 3 مبادرات رئيسية في الرعاية الصحية'
  },
  {
    id: 3,
    name: 'Khalid Al-Mutairi',
    name_ar: 'خالد المطيري',
    position: 'Digital Transformation Lead, STC',
    position_ar: 'قائد التحول الرقمي، STC',
    location: 'Jeddah, Saudi Arabia',
    location_ar: 'جدة، المملكة العربية السعودية',
    program: 'MBA in Digital Transformation',
    program_ar: 'ماجستير إدارة الأعمال في التحول الرقمي',
    rating: 5,
    year: '2023',
    testimonial: 'The Digital Transformation specialization was exactly what I needed to lead tech initiatives in my organization. The curriculum was cutting-edge, and the networking opportunities with fellow Saudi professionals were invaluable. OPTIMUS truly understands the needs of the Saudi market.',
    testimonial_ar: 'كان تخصص التحول الرقمي بالضبط ما احتجته لقيادة مبادرات التكنولوجيا في مؤسستي. كانت المناهج متطورة، وفرص التواصل مع المحترفين السعوديين زملاء الدراسة كانت لا تقدر بثمن. أوبتيموس تفهم حقاً احتياجات السوق السعودي.',
    image: '/grabbedPhotos/people/person3.jpg',
    achievement: 'Successfully led digital transformation of customer service division',
    achievement_ar: 'قاد بنجاح التحول الرقمي لقسم خدمة العملاء'
  },
  {
    id: 4,
    name: 'Maha Al-Rasheed',
    name_ar: 'مها الرشيد',
    position: 'CFO, AlRajhi Capital',
    position_ar: 'المدير المالي، الراجحي كابيتال',
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    program: 'DBA in Accounting & Finance',
    program_ar: 'دكتوراه إدارة الأعمال في المحاسبة والمالية',
    rating: 5,
    year: '2023',
    testimonial: 'The DBA program challenged me intellectually while remaining highly practical. The research component allowed me to address real business problems in the Saudi financial sector. The credentials and knowledge gained opened doors I never thought possible.',
    testimonial_ar: 'تحداني برنامج الدكتوراه فكرياً بينما ظل عملياً للغاية. سمح لي مكون البحث بمعالجة مشاكل العمل الحقيقية في القطاع المالي السعودي. المؤهلات والمعرفة المكتسبة فتحت أبواباً لم أكن أعتقد أنها ممكنة.',
    image: '/grabbedPhotos/people/person4.jpg',
    achievement: 'Appointed as CFO and published 2 research papers',
    achievement_ar: 'تم تعيينها كمدير مالي ونشرت ورقتين بحثيتين'
  },
  {
    id: 5,
    name: 'Mohammed Al-Otaibi',
    name_ar: 'محمد العتيبي',
    position: 'Operations Manager, SABIC',
    position_ar: 'مدير العمليات، سابك',
    location: 'Jubail, Saudi Arabia',
    location_ar: 'الجبيل، المملكة العربية السعودية',
    program: 'MBA in Supply Chain Management',
    program_ar: 'ماجستير إدارة الأعمال في إدارة سلسلة التوريد',
    rating: 5,
    year: '2024',
    testimonial: 'Excellent program with world-class faculty. The supply chain specialization equipped me with modern methodologies and best practices that I\'ve implemented to optimize our operations. The ROI on this education has been tremendous.',
    testimonial_ar: 'برنامج ممتاز مع هيئة تدريس عالمية المستوى. زودني تخصص سلسلة التوريد بمنهجيات حديثة وأفضل الممارسات التي نفذتها لتحسين عملياتنا. كان عائد الاستثمار على هذا التعليم هائلاً.',
    image: '/Logo.jpeg',
    achievement: 'Reduced operational costs by 25% through process optimization',
    achievement_ar: 'خفض التكاليف التشغيلية بنسبة 25٪ من خلال تحسين العمليات'
  },
  {
    id: 6,
    name: 'Sarah Al-Ghamdi',
    name_ar: 'سارة الغامدي',
    position: 'HR Director, NEOM',
    position_ar: 'مديرة الموارد البشرية، نيوم',
    location: 'NEOM, Saudi Arabia',
    location_ar: 'نيوم، المملكة العربية السعودية',
    program: 'MBA in Human Resources Management',
    program_ar: 'ماجستير إدارة الأعمال في إدارة الموارد البشرية',
    rating: 5,
    year: '2023',
    testimonial: 'OPTIMUS provided me with advanced HR strategies and leadership skills essential for building NEOM\'s workforce. The program\'s focus on innovation and change management aligned perfectly with my role in this transformative project.',
    testimonial_ar: 'زودتني أوبتيموس باستراتيجيات متقدمة للموارد البشرية ومهارات قيادية أساسية لبناء القوى العاملة في نيوم. تركيز البرنامج على الابتكار وإدارة التغيير يتماشى تماماً مع دوري في هذا المشروع التحويلي.',
    image: '/grabbedPhotos/people/person5.png',
    achievement: 'Built HR framework for one of Saudi\'s most ambitious mega-projects',
    achievement_ar: 'بنت إطار الموارد البشرية لأحد أكثر المشاريع الضخمة طموحاً في السعودية'
  }
];

export default function TestimonialsPage() {
  const { getContent, currentLanguage } = useCMS();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const getTextAlignClass = () => currentLanguage === 'ar' ? 'text-right' : 'text-left';
  const getFlexDirectionClass = () => currentLanguage === 'ar' ? 'flex-row-reverse' : 'flex-row';

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Prepare review data for schema
  const reviewsForSchema = testimonials.map(t => ({
    author: t.name,
    rating: t.rating,
    reviewBody: t.testimonial,
    datePublished: `${t.year}-01-01`
  }));

  return (
    <ClientLayout>
      {/* Schema markup for reviews */}
      <Script
        id="testimonials-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateReviewSchema(reviewsForSchema))
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {currentLanguage === 'ar' ? 'قصص نجاح طلابنا' : 'Student Success Stories'}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              {currentLanguage === 'ar'
                ? 'اكتشف كيف غيرت أوبتيموس التعليمية حياة المحترفين في جميع أنحاء المملكة العربية السعودية'
                : 'Discover how OPTIMUS Education has transformed the careers of professionals across Saudi Arabia'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                5.0 {currentLanguage === 'ar' ? 'من' : 'out of'} 5 ({testimonials.length} {currentLanguage === 'ar' ? 'مراجعة' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Featured Testimonial Carousel */}
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                {/* Decorative Quote */}
                <div className="absolute top-8 left-8 opacity-10">
                  <Quote className="w-32 h-32 text-primary" />
                </div>

                <div className="relative p-12 md:p-16">
                  <div className={`flex flex-col md:${getFlexDirectionClass()} gap-8 items-center`}>
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={currentLanguage === 'ar' ? testimonials[currentIndex].name_ar : testimonials[currentIndex].name}
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-accent shadow-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Logo.jpeg';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${getTextAlignClass()}`}>
                      {/* Rating */}
                      <div className={`flex gap-1 mb-4 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed font-light italic">
                        "{currentLanguage === 'ar' ? testimonials[currentIndex].testimonial_ar : testimonials[currentIndex].testimonial}"
                      </p>

                      {/* Author Info */}
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-primary">
                          {currentLanguage === 'ar' ? testimonials[currentIndex].name_ar : testimonials[currentIndex].name}
                        </h3>
                        <p className="text-lg text-accent font-medium">
                          {currentLanguage === 'ar' ? testimonials[currentIndex].position_ar : testimonials[currentIndex].position}
                        </p>
                        <p className="text-gray-600">
                          {currentLanguage === 'ar' ? testimonials[currentIndex].location_ar : testimonials[currentIndex].location}
                        </p>
                      </div>

                      {/* Program */}
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-700">
                          {currentLanguage === 'ar' ? testimonials[currentIndex].program_ar : testimonials[currentIndex].program}
                        </p>
                      </div>

                      {/* Achievement */}
                      <div className="bg-accent/10 rounded-lg p-4">
                        <p className="text-sm font-semibold text-accent">
                          {currentLanguage === 'ar' ? '🏆 ' : '🏆 '}
                          {currentLanguage === 'ar' ? testimonials[currentIndex].achievement_ar : testimonials[currentIndex].achievement}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className={`flex items-center justify-center gap-4 mt-8`}>
                    <button
                      onClick={prevTestimonial}
                      className="p-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg"
                      aria-label="Previous testimonial"
                    >
                      {currentLanguage === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    <div className="flex gap-2">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            idx === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
                          }`}
                          aria-label={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextTestimonial}
                      className="p-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg"
                      aria-label="Next testimonial"
                    >
                      {currentLanguage === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Testimonials Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-primary mb-10">
              {currentLanguage === 'ar' ? 'جميع الشهادات' : 'All Testimonials'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6"
                >
                  <div className={`flex ${getFlexDirectionClass()} items-center gap-4 mb-4`}>
                    <img
                      src={testimonial.image}
                      alt={currentLanguage === 'ar' ? testimonial.name_ar : testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/Logo.jpeg';
                      }}
                    />
                    <div className={getTextAlignClass()}>
                      <h3 className="font-bold text-primary">
                        {currentLanguage === 'ar' ? testimonial.name_ar : testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentLanguage === 'ar' ? testimonial.position_ar : testimonial.position}
                      </p>
                    </div>
                  </div>

                  <div className={`flex gap-1 mb-3 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className={`text-gray-700 text-sm mb-4 line-clamp-4 ${getTextAlignClass()}`}>
                    {currentLanguage === 'ar' ? testimonial.testimonial_ar : testimonial.testimonial}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">
                      {currentLanguage === 'ar' ? testimonial.program_ar : testimonial.program}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {currentLanguage === 'ar' ? 'كن قصة نجاحنا التالية' : 'Be Our Next Success Story'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {currentLanguage === 'ar'
                ? 'انضم إلى مئات المحترفين السعوديين الذين حولوا حياتهم المهنية مع أوبتيموس'
                : 'Join hundreds of Saudi professionals who have transformed their careers with OPTIMUS'}
            </p>
            <a
              href="/programs"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              {currentLanguage === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}
            </a>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

