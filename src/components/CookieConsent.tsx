'use client';

import React, { useState, useEffect } from 'react';
import { useCMS } from '../../app/contexts/cms-context';

const CookieConsent: React.FC = () => {
  const { getContent, loading: cmsLoading } = useCMS();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent || cmsLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          {getContent('cookie_consent_message')}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded text-sm transition-colors"
          >
            {getContent('cookie_consent_accept')}
          </button>
          <button
            onClick={handleDecline}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            {getContent('cookie_consent_decline')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 