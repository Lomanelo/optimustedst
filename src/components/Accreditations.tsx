import React from 'react';
import { useCMS } from '../../app/contexts/cms-context';

interface AccreditationInfo {
    name: string;
    logo: string;
}

const accreditations: AccreditationInfo[] = [
    {
        name: 'QUALIFI',
        logo: '/grabbedPhotos/partners/QUALIFI.png',
    },
    {
        name: 'ATHE',
        logo: '/grabbedPhotos/partners/ATHE.png',
    },
    {
        name: 'ACBSP',
        logo: '/grabbedPhotos/partners/ACBSP.png',
    },
    {
        name: 'University of Bedfordshire',
        logo: '/grabbedPhotos/partners/University of Bedfordshire.png',
    },
    {
        name: 'University of Plymouth',
        logo: '/grabbedPhotos/partners/University of Plymouth.png',
    }
];

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
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
                    {accreditations.map((accreditation) => (
                        <div key={accreditation.name} className="aspect-square p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                                <img
                                    src={accreditation.logo}
                                    alt={accreditation.name}
                                className="w-full h-full object-contain max-w-full max-h-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Accreditations;