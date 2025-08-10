import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';
import { partnerships } from '../data/optimus-data';

const Accreditations: React.FC = () => {
    const { getContent, getFormattedContent, currentLanguage } = useCMS();

    // Helper function to get text alignment classes based on language
    const getTextAlignClass = () => {
        return currentLanguage === 'ar' ? 'text-right' : 'text-left';
    };

    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                {/* Accreditations Section - simplified */}
                <div className="mb-10">
                    <h3 className="text-4xl md:text-5xl font-bold text-center mb-8 text-primary">
                        {getContent('accreditations_main_title') || 'Accreditations'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 max-w-6xl mx-auto justify-items-center">
                        {partnerships.map((partner) => (
                            <div key={partner.id} className="group h-24 md:h-28 w-full rounded-xl bg-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                <img src={partner.logo} alt={partner.name} title={partner.name} className="max-h-10 md:max-h-14 lg:max-h-16 max-w-[80%] object-contain transition duration-300 group-hover:scale-[1.03]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Accreditations;