import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface BannerData {
  id: string;
  text: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  updatedAt: string;
}

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [location] = useLocation();

  // Determine which banner to show based on current page
  const isCorporatePage = location.includes('/corporate-gifting');
  const bannerEndpoint = isCorporatePage ? '/api/corporate-banner/active' : '/api/banner/active';

  // Fetch appropriate banner from API
  const { data: banner } = useQuery<BannerData>({
    queryKey: [bannerEndpoint]
  });

  if (!isVisible || !banner || !banner.isActive) return null;

  const handleClose = () => {
    setIsVisible(false);
    // Store in localStorage to remember user dismissed it
    localStorage.setItem(`banner-dismissed-${banner.id}`, 'true');
  };

  // Check if user already dismissed this banner
  const isDismissed = localStorage.getItem(`banner-dismissed-${banner.id}`) === 'true';
  if (isDismissed) return null;

  return (
    <div 
      className="relative px-4 py-3 text-center shadow-sm"
      style={{ 
        backgroundColor: banner.backgroundColor || '#dc2626',
        color: banner.textColor || '#ffffff'
      }}
    >
      <div className="flex items-center justify-center gap-2 max-w-6xl mx-auto">
        <Sparkles className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium text-sm md:text-base">
          {banner.text}
        </span>
        <Sparkles className="w-5 h-5 flex-shrink-0" />
      </div>
      
      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}