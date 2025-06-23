import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import { accreditations, partnerships } from '../data/optimus-data';

const Accreditations: React.FC = () => {
    const { getContent } = useCMS();

    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 text-primary">
                    {getContent('accreditations_title')}
                </h2>
                <p className="text-center mb-16 text-gray-600 max-w-3xl mx-auto text-lg">
                    {getContent('accreditations_subtitle')}
                </p>
                
                {/* Accreditations Section */}
                <div className="mb-16">
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
                        Accreditations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
                        {accreditations.map((accreditation) => (
                            <div key={accreditation.name} className="aspect-square p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center group">
                                <img
                                    src={accreditation.logo}
                                    alt={accreditation.name}
                                    className="w-full h-full object-contain max-w-full max-h-full"
                                />
                                <div className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white p-2 rounded text-xs transition-all duration-300 -bottom-1 left-0 right-0 transform translate-y-full group-hover:translate-y-0 z-10">
                                    {accreditation.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partnerships Section */}
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
                        Academic Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                        {partnerships.map((partnership) => (
                            <div key={partnership.name} className="aspect-square p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center group">
                                <img
                                    src={partnership.logo}
                                    alt={partnership.name}
                                    className="w-full h-full object-contain max-w-full max-h-full"
                                />
                                <div className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white p-2 rounded text-xs transition-all duration-300 -bottom-1 left-0 right-0 transform translate-y-full group-hover:translate-y-0 z-10">
                                    {partnership.name}
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