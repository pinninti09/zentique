import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Star, Heart, Plus, Minus, Package, Shield, Truck, ShoppingCart, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import ReviewsSection from '@/components/ReviewsSection';
import type { Painting, CartItem, Review } from '@shared/schema';

interface PaintingDetailProps {
  params: {
    id: string;
  };
}

export default function PaintingDetail({ params }: PaintingDetailProps) {
  const [, setLocation] = useLocation();
  const { sessionId, showToast } = useApp();
  const queryClient = useQueryClient();

  const { data: painting, isLoading } = useQuery<Painting>({
    queryKey: [`/api/paintings/${params.id}`],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/paintings/${params.id}/reviews`],
    enabled: !!params.id,
  });

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  const { data: wishlistData } = useQuery<{ isInWishlist: boolean }>({
    queryKey: [`/api/wishlist/${sessionId}/${params.id}/check`],
    enabled: !!sessionId && !!params.id,
  });

  const isInWishlist = wishlistData?.isInWishlist ?? false;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!painting) {
        console.error('No painting data available');
        throw new Error('No painting data available');
      }
      if (!sessionId) {
        console.error('No session ID available');
        throw new Error('No session ID available');
      }
      console.log('Adding to cart:', { sessionId, paintingId: painting.id, quantity: 1 });
      return apiRequest('POST', '/api/cart', {
        sessionId,
        paintingId: painting.id,
        quantity: 1,
      });
    },
    onSuccess: (data) => {
      console.log('Add to cart success:', data);
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Added to cart successfully!', 'success');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      showToast('Failed to add to cart', 'error');
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ paintingId, change }: { paintingId: string; change: number }) => {
      const currentItem = cartItems.find(item => item.paintingId === paintingId);
      if (!currentItem) return;
      
      const newQuantity = Math.max(0, currentItem.quantity + change);
      
      if (newQuantity === 0) {
        return apiRequest('DELETE', `/api/cart/${sessionId}/${paintingId}`);
      } else {
        return apiRequest('PUT', `/api/cart/${sessionId}/${paintingId}`, { quantity: newQuantity });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
    onError: (error) => {
      console.error('Error updating cart:', error);
      showToast('Failed to update cart', 'error');
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      return apiRequest('DELETE', `/api/cart/${sessionId}/${paintingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Removed from cart', 'success');
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      showToast('Failed to remove from cart', 'error');
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (!painting) {
        console.error('No painting data available for wishlist');
        throw new Error('No painting data available');
      }
      if (!sessionId) {
        console.error('No session ID available for wishlist');
        throw new Error('No session ID available');
      }
      
      console.log('Toggling wishlist:', { 
        sessionId, 
        paintingId: painting.id, 
        currentlyInWishlist: isInWishlist 
      });
      
      if (isInWishlist) {
        return apiRequest('DELETE', `/api/wishlist/${sessionId}/${painting.id}`);
      } else {
        return apiRequest('POST', '/api/wishlist', {
          sessionId,
          paintingId: painting.id,
        });
      }
    },
    onSuccess: (data) => {
      console.log('Wishlist toggle success:', data);
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}/${params.id}/check`] });
      showToast(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    },
    onError: (error) => {
      console.error('Error toggling wishlist:', error);
      showToast('Failed to update wishlist', 'error');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading painting...</p>
        </div>
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Painting not found</h1>
          <Button onClick={() => setLocation('/')} variant="outline">
            <ArrowLeft className="mr-2" size={20} />
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const currentCartItem = cartItems.find(item => item.paintingId === painting.id);
  const cartQuantity = currentCartItem?.quantity || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            onClick={() => setLocation('/')} 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Gallery
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Large Image Section */}
          <div className="bg-gray-50 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
              <img
                src={painting.imageUrl}
                alt={painting.title}
                className="w-full h-auto object-contain max-h-[600px]"
              />
            </div>
          </div>

          {/* Product Information Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Title and Rating */}
              <div className="mb-8">
                <h1 className="text-4xl font-light text-gray-900 mb-4 leading-tight">{painting.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`${
                          star <= averageRating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                <div className="text-4xl font-light text-gray-900 mb-8">
                  {formatPrice(painting.price)}
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {painting.description}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-10">
                <h3 className="text-lg font-medium mb-4 text-gray-900">Size (Height x Width)</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="border border-gray-300 px-4 py-3 bg-gray-50 text-center">
                    24" x 20" / 61 x 51 CM
                  </div>
                </div>
              </div>

              {/* Frame Options */}
              <div className="mb-10">
                <h3 className="text-lg font-medium mb-4 text-gray-900">Stretch or Frame</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="border border-gray-300 px-4 py-3 bg-gray-50 text-center">
                    Frameless Stretch
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {cartQuantity > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-emerald-50 rounded border border-emerald-200">
                    <span className="text-emerald-800 font-medium text-lg">In your cart</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-emerald-300 rounded bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateCartMutation.mutate({ paintingId: painting.id, change: -1 })}
                          disabled={updateCartMutation.isPending}
                          className="h-10 w-10 p-0 hover:bg-emerald-100"
                        >
                          <Minus size={18} />
                        </Button>
                        <span className="px-6 py-2 border-x border-emerald-300 text-center font-medium text-lg min-w-[4rem]">
                          {cartQuantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateCartMutation.mutate({ paintingId: painting.id, change: 1 })}
                          disabled={updateCartMutation.isPending}
                          className="h-10 w-10 p-0 hover:bg-emerald-100"
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCartMutation.mutate(painting.id)}
                        disabled={removeFromCartMutation.isPending}
                        className="h-10 w-10 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg font-medium"
                >
                  <ShoppingCart className="mr-3" size={22} />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => toggleWishlistMutation.mutate()}
                disabled={toggleWishlistMutation.isPending}
                className={`w-full py-6 text-lg border-2 ${
                  isInWishlist
                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart 
                  className={`mr-3 ${isInWishlist ? 'fill-current' : ''}`} 
                  size={22} 
                />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>

              {/* Product Details */}
              <div className="border-t pt-8 mt-8">
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center gap-4">
                    <Package size={20} />
                    <span className="text-lg">Free shipping worldwide</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Shield size={20} />
                    <span className="text-lg">30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Truck size={20} />
                    <span className="text-lg">Delivered in 5-7 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="border-t bg-gray-50">
          <div className="p-8 lg:p-12">
            <ReviewsSection painting={painting} />
          </div>
        </div>
      </div>
    </div>
  );
}