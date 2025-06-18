'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, ArrowRight, Users, Award, Clock } from 'lucide-react';

const ProgramOverview: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Choose Your Path</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Select your preferred program type to explore our comprehensive educational offerings
          </p>
          <p className="text-lg text-accent font-medium">
            Get certified in a year – fully online
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* MBA Section */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative p-8 lg:p-12 text-white min-h-[400px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mr-4">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">MBA Programs</h3>
                  </div>
                  
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    Master of Business Administration programs designed for aspiring leaders and executives. 
                    Develop strategic thinking, leadership skills, and business acumen.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-accent" />
                      <span className="text-white/90">Executive Leadership Focus</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-3 text-accent" />
                      <span className="text-white/90">Internationally Recognized</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-accent" />
                      <span className="text-white/90">Flexible Online Learning</span>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/programs?programType=MBA"
                  className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg"
                >
                  Explore MBA Programs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            {/* PHD Section */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-accent-dark shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative p-8 lg:p-12 text-white min-h-[400px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mr-4">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">PHD Programs</h3>
                  </div>
                  
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    Doctor of Philosophy programs for advanced research and academic excellence. 
                    Contribute to knowledge creation and become an expert in your field.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-primary" />
                      <span className="text-white/90">Research Excellence</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-3 text-primary" />
                      <span className="text-white/90">Academic Recognition</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-primary" />
                      <span className="text-white/90">Expert Supervision</span>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/programs?programType=PHD"
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg"
                >
                  Explore PHD Programs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-4">Why Choose Optimus Education?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Accredited Programs</h4>
                  <p className="text-gray-600 text-sm">Internationally recognized qualifications</p>
                </div>
                <div className="text-center">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Flexible Learning</h4>
                  <p className="text-gray-600 text-sm">Study at your own pace, anywhere</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Expert Faculty</h4>
                  <p className="text-gray-600 text-sm">Learn from industry professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramOverview; 