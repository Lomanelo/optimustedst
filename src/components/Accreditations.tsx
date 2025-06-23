import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import { accreditations, partnerships } from '../data/optimus-data';

const Accreditations: React.FC = () => {
    const { getContent } = useCMS();

    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 text-primary">
                    {getContent('accreditations.title')}
                </h2>
                <p className="text-center mb-20 text-gray-600 max-w-3xl mx-auto text-lg">
                    {getContent('accreditations.subtitle')}
                </p>
                
                {/* Accreditations Section - PRIORITY */}
                <div className="mb-24">
                    <h3 className="text-4xl md:text-5xl font-bold text-center mb-6 text-primary">
                        {getContent('accreditations.main_title')}
                    </h3>
                    <p className="text-center mb-16 text-gray-600 max-w-2xl mx-auto text-xl">
                        {getContent('accreditations.main_subtitle')}
                    </p>
                    <div className="flex justify-center items-center gap-8 md:gap-12 max-w-3xl mx-auto">
                        {accreditations.map((accreditation) => (
                            <div key={accreditation.name} className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/10 hover:border-primary/30 flex items-center justify-center">
                                <div className="text-center">
                                    <img
                                        src={accreditation.logo}
                                        alt={accreditation.name}
                                        className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
                                        title={accreditation.name}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Academic Partnerships Section */}
                <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
                        {getContent('accreditations.partnerships_title')}
                    </h3>
                    <p className="text-center mb-12 text-gray-600 max-w-2xl mx-auto text-lg">
                        {getContent('accreditations.partnerships_subtitle')}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center max-w-6xl mx-auto">
                        {partnerships.map((partnership) => (
                            <div key={partnership.name} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center group border border-gray-100 hover:border-gray-200">
                                <div className="text-center">
                                    <img
                                        src={partnership.logo}
                                        alt={partnership.name}
                                        className="w-16 h-16 object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                                        title={partnership.name}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Accreditations;