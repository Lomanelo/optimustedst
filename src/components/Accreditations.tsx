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
                <p className="text-center mb-20 text-gray-600 max-w-3xl mx-auto text-lg">
                    {getContent('accreditations_subtitle')}
                </p>
                
                {/* Partnerships Section - Priority */}
                <div className="mb-20">
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
                        Academic Partnerships
                    </h3>
                    <p className="text-center mb-12 text-gray-600 max-w-2xl mx-auto text-lg">
                        Collaborating with world-renowned universities to deliver exceptional education
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center max-w-6xl mx-auto">
                        {partnerships.map((partnership) => (
                            <div key={partnership.name} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center group border border-gray-100 hover:border-primary/20">
                                <div className="text-center">
                                    <img
                                        src={partnership.logo}
                                        alt={partnership.name}
                                        className="w-24 h-24 object-contain mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <h4 className="font-semibold text-gray-800 text-sm group-hover:text-primary transition-colors duration-300">
                                        {partnership.name}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accreditations Section */}
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">
                        Accreditations
                    </h3>
                    <p className="text-center mb-10 text-gray-600 max-w-xl mx-auto">
                        Recognized by leading accreditation bodies worldwide
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center max-w-5xl mx-auto">
                        {accreditations.map((accreditation) => (
                            <div key={accreditation.name} className="aspect-square p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center group">
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
            </div>
        </section>
    );
};

export default Accreditations;