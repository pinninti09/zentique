import { useState } from 'react';
import { Eye, ShoppingBag, Check, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Painting } from '@shared/schema';

interface PaintingCardProps {
  painting: Painting;
  onQuickView: (painting: Painting) => void;
  onAddToCart: (paintingId: string) => void;
}

export default function PaintingCard({ painting, onQuickView, onAddToCart }: PaintingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { sessionId } = useApp();
  const queryClient = useQueryClient();

  // Check if painting is in wishlist
  const { data: wishlistStatus } = useQuery({
    queryKey: [`/api/wishlist/${sessionId}/${painting.id}/check`],
    enabled: !!sessionId
  });

  // Wishlist mutations
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/wishlist', 'POST', {
        sessionId,
        paintingId: painting.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}/${painting.id}/check`] });
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/wishlist/${sessionId}/${painting.id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}/${painting.id}/check`] });
    }
  });

  const isInWishlist = (wishlistStatus as any)?.isInWishlist === true;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(painting.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(painting);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlistMutation.mutate();
    } else {
      addToWishlistMutation.mutate();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card 
      className="painting-card group bg-transparent rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0"
      onClick={() => onQuickView(painting)}
    >
      <div className="relative overflow-hidden bg-warm-cream/30">
        <img 
          src={painting.imageUrl} 
          alt={painting.title}
          className={`w-full h-80 object-contain transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-warm-cream animate-pulse flex items-center justify-center">
            <div className="text-sophisticated-gray font-light">Loading...</div>
          </div>
        )}
        
        <div className="painting-overlay absolute inset-0 bg-rich-brown/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickView}
            className="bg-white text-rich-brown hover:bg-elegant-gold hover:text-white border-0 shadow-lg font-medium"
          >
            <Eye className="mr-2" size={16} />
            Quick View
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          {painting.salePrice && (
            <Badge className="bg-elegant-gold text-rich-brown font-medium px-3 py-1">
              Sale
            </Badge>
          )}
          {painting.sold && (
            <Badge className="bg-sophisticated-gray text-white font-medium px-3 py-1">
              Sold
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-lg font-medium mb-1 text-rich-brown leading-tight flex-1">
            {painting.title}
            {painting.sku && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                {painting.sku}
              </span>
            )}
          </h3>
          <Button
            variant="ghost"
            onClick={handleWishlistToggle}
            className={`px-3 py-2 ml-2 h-10 transition-all duration-200 ${
              isInWishlist ? 'text-red-500' : 'text-sophisticated-gray hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 transition-all duration-200 ${isInWishlist ? 'fill-red-500 text-red-500 scale-110' : 'hover:scale-105'}`} />
          </Button>
        </div>
        
        <div className="space-y-2">
          
          {/* Star Rating Display */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {painting.averageRating && (painting.totalReviews || 0) > 0 
                ? renderStars(painting.averageRating)
                : renderStars(0)
              }
            </div>
            <span className="text-xs text-sophisticated-gray">
              {painting.averageRating && (painting.totalReviews || 0) > 0 
                ? `${painting.averageRating.toFixed(1)} (${painting.totalReviews || 0} review${(painting.totalReviews || 0) !== 1 ? 's' : ''})`
                : '(0 reviews)'
              }
            </span>
          </div>
          
          <div className="flex items-center text-xs text-sophisticated-gray space-x-4">
            <span>{painting.medium || 'Oil on Canvas'}</span>
            <span>•</span>
            <span>{painting.dimensions || '24" × 36"'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 gap-4">
          <div className="pricing">
            {painting.salePrice ? (
              <div>
                <div className="text-sophisticated-gray line-through text-sm font-light">
                  {formatPrice(painting.price)}
                </div>
                <div className="text-xl font-serif font-medium text-elegant-gold">
                  {formatPrice(painting.salePrice)}
                </div>
              </div>
            ) : (
              <div className="text-xl font-serif font-medium text-rich-brown">
                {formatPrice(painting.price)}
              </div>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={painting.sold || false}
            className={painting.sold ? 
              "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 h-10" : 
              "bg-gray-400 text-white hover:bg-gray-500 transition-all duration-200 font-medium px-4 py-2 h-10 shadow-lg hover:shadow-xl"
            }
          >
            {painting.sold ? (
              <>
                <Check className="mr-1" size={14} />
                Sold
              </>
            ) : (
              <>
                <ShoppingBag className="mr-1" size={14} />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
