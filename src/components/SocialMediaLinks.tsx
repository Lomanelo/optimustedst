import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Music 
} from 'lucide-react';
import { useSettings } from '../../app/contexts/settings-context';

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

  if (isLoading) {
    return null;
  }

  const getSocialIcon = (platform: string, url: string) => {
    const iconProps = { 
      size: iconSize, 
      className: variant === 'footer' 
        ? "text-white hover:text-accent transition-colors" 
        : "text-gray-600 hover:text-primary transition-colors" 
    };
    
    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'snapchat':
        return <MessageCircle {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'tiktok':
        return <Music {...iconProps} />;
      default:
        return null;
    }
  };

  const getPlatformLabel = (platform: string) => {
    const labels: { [key: string]: string } = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
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

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {activeSocialMedia.map(([platform, url]) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${showLabels ? 'flex items-center space-x-2' : ''} transition-transform hover:scale-110`}
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