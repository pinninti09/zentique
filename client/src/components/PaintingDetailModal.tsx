import { useState } from 'react';
import { X, ShoppingBag, Truck, Star, Heart } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import ReviewsSection from './ReviewsSection';
import type { Painting } from '@shared/schema';

interface PaintingDetailModalProps {
  painting: Painting | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (paintingId: string) => void;
}

export default function PaintingDetailModal({ 
  painting, 
  isOpen, 
  onClose, 
  onAddToCart 
}: PaintingDetailModalProps) {
  const [imageZoomed, setImageZoomed] = useState(false);
  const { sessionId, showToast } = useApp();
  const queryClient = useQueryClient();

  if (!isOpen || !painting) return null;

  // Check if painting is in wishlist
  const { data: wishlistStatus } = useQuery<{ isInWishlist: boolean }>({
    queryKey: ['/api/wishlist', sessionId, painting.id, 'check'],
    enabled: !!painting && !!sessionId
  });

  const isInWishlist = wishlistStatus?.isInWishlist || false;

  // Wishlist mutations
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/wishlist', 'POST', {
        sessionId,
        paintingId: painting.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist', sessionId, painting.id, 'check'] });
      showToast('Added to wishlist!', 'success');
    },
    onError: () => {
      showToast('Failed to add to wishlist', 'error');
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/wishlist/${sessionId}/${painting.id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist', sessionId, painting.id, 'check'] });
      showToast('Removed from wishlist', 'success');
    },
    onError: () => {
      showToast('Failed to remove from wishlist', 'error');
    }
  });

  const handleAddToCart = () => {
    onAddToCart(painting.id);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate();
    } else {
      addToWishlistMutation.mutate();
    }
  };

  const handleImageClick = () => {
    setImageZoomed(!imageZoomed);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-full overflow-y-auto animate-slide-up">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-serif font-bold text-charcoal">
              {painting.title}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={24} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <img 
                src={painting.imageUrl} 
                alt={painting.title}
                className={`w-full rounded-xl shadow-lg cursor-pointer transition-transform duration-300 ${
                  imageZoomed ? 'scale-150 transform-gpu' : 'hover:scale-105'
                }`}
                onClick={handleImageClick}
              />
              <div className="mt-2 text-sm text-muted-foreground text-center">
                Click image to zoom {imageZoomed ? '(click again to zoom out)' : ''}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {painting.description}
                </p>
              </div>

              {/* Star Rating Display */}
              {(painting.averageRating || 0) > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (painting.averageRating || 0)
                            ? 'fill-elegant-gold text-elegant-gold'
                            : 'text-sophisticated-gray/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-sophisticated-gray">
                    {(painting.averageRating || 0).toFixed(1)} ({painting.totalReviews || 0} review{painting.totalReviews !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Details</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <span>{painting.medium || 'Oil on Canvas'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>{painting.dimensions || '24" × 36"'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span>{painting.year || new Date().getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Artist:</span>
                    <span>{painting.artist || 'Unknown Artist'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="pricing">
                    {painting.salePrice ? (
                      <>
                        <span className="text-gray-400 line-through text-lg">
                          {formatPrice(painting.price)}
                        </span>
                        <span className="text-3xl font-bold text-elegant-gold ml-2">
                          {formatPrice(painting.salePrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-charcoal">
                        {formatPrice(painting.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="text-green-500" size={16} />
                    <span className="text-sm text-green-500">Free Shipping</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={painting.sold || false}
                    className={`flex-1 py-4 text-lg font-medium ${
                      painting.sold 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg transition-all duration-200'
                    }`}
                  >
                    {painting.sold ? (
                      'Sold Out'
                    ) : (
                      <>
                        <ShoppingBag className="mr-2" size={20} />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleWishlistToggle}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                    className={`py-4 px-6 text-lg font-medium transition-all duration-200 ${
                      isInWishlist
                        ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                    variant="outline"
                  >
                    <Heart 
                      className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <ReviewsSection painting={painting} />
          </div>
        </div>
      </div>
    </div>
  );
}
