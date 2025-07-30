import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin 
} from 'lucide-react';
import { SiTiktok, SiSnapchat, SiX } from 'react-icons/si';
import { useSettings } from '../../app/contexts/settings-context';
import { useCMS } from '../../app/contexts/cms-context';

interface SocialMediaLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
  variant?: 'default' | 'footer' | 'header';
}

export default function SocialMediaLinks({ 
  className = '', 
  iconSize = 20,
  showLabels = false,
  variant = 'default'
}: SocialMediaLinksProps) {
  const { socialMedia, isLoading } = useSettings();
  const { currentLanguage } = useCMS();
  const isRTL = currentLanguage === 'ar';

  if (isLoading) {
    return null;
  }

  const getSocialIcon = (platform: string, url: string) => {
    const baseClassName = variant === 'footer' 
      ? "text-white hover:text-accent transition-colors" 
      : "text-gray-600 hover:text-primary transition-colors";
    
    const iconProps = { 
      size: iconSize, 
      className: baseClassName
    };
    
    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'twitter':
        return <SiX {...iconProps} />;
      case 'x':
        return <SiX {...iconProps} />;
      case 'snapchat':
        return <SiSnapchat {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'tiktok':
        return <SiTiktok {...iconProps} />;
      default:
        return null;
    }
  };

  const getPlatformLabel = (platform: string) => {
    const labels: { [key: string]: string } = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'X (Twitter)',
      x: 'X.com',
      snapchat: 'Snapchat',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok'
    };
    return labels[platform] || platform;
  };

  // Filter out empty links
  const activeSocialMedia = Object.entries(socialMedia).filter(([_, url]) => url.trim() !== '');

  if (activeSocialMedia.length === 0) {
    return null;
  }

  // Use RTL-aware spacing
  const spacingClass = isRTL ? 'gap-4' : 'space-x-4';
  const labelSpacingClass = isRTL ? 'gap-2' : 'space-x-2';

  return (
    <div className={`flex items-center ${spacingClass} ${className}`}>
      {activeSocialMedia.map(([platform, url]) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${showLabels ? `flex items-center ${labelSpacingClass}` : ''} transition-transform hover:scale-110`}
          title={`Follow us on ${getPlatformLabel(platform)}`}
        >
          {getSocialIcon(platform, url)}
          {showLabels && (
            <span className={`text-sm font-medium ${
              variant === 'footer' ? 'text-white' : 'text-gray-700'
            }`}>
              {getPlatformLabel(platform)}
            </span>
          )}
        </a>
      ))}
    </div>
  );
} 