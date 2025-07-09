import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import { accreditations, partnerships } from '../data/optimus-data';

const Accreditations: React.FC = () => {
    const { getContent, getFormattedContent, currentLanguage } = useCMS();

    // Helper function to get text alignment classes based on language
    const getTextAlignClass = () => {
        return currentLanguage === 'ar' ? 'text-right' : 'text-left';
    };

    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                {/* Accreditations Section - PRIORITY */}
                <div className="mb-24">
                    <h3 className="text-4xl md:text-5xl font-bold text-center mb-6 text-primary">
                        {getContent('accreditations_main_title') || 'Accreditations'}
                    </h3>
                    <div className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-xl">
                        {getFormattedContent('accreditations_main_subtitle')}
                    </div>
                    <div className="flex justify-center items-center gap-8 md:gap-12 max-w-3xl mx-auto">
                    {accreditations.map((accreditation) => {
                        // Map accreditation IDs to CMS keys
                        const getAccreditationName = (id: string) => {
                            const cmsKey = `accreditation_${id}`;
                            return getContent(cmsKey) || accreditation.name;
                        };
                        
                        return (
                            <div key={accreditation.name} className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/10 hover:border-primary/30 flex items-center justify-center">
                                <div className="text-center">
                                <img
                                    src={accreditation.logo}
                                    alt={getAccreditationName(accreditation.id)}
                                        className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
                                        title={getAccreditationName(accreditation.id)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>

                {/* Academic Partnerships Section */}
                <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
                        {getContent('accreditations_partnerships_title') || 'Academic Partnerships'}
                    </h3>
                    <div className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
                        {getFormattedContent('accreditations_partnerships_subtitle')}
                    </div>
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