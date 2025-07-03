import { useState } from 'react';
import { X, Star, Heart, Plus, Minus, Package, Shield, Truck, ShoppingCart, Building2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import type { CorporateGift, CartItem } from '@shared/schema';

interface CorporateGiftDetailModalProps {
  gift: CorporateGift | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (giftId: string, quantity: number) => void;
}

export default function CorporateGiftDetailModal({ 
  gift, 
  isOpen, 
  onClose, 
  onAddToCart 
}: CorporateGiftDetailModalProps) {
  const { sessionId, showToast } = useApp();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState([1]);

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  const { data: wishlistData } = useQuery<{ isInWishlist: boolean }>({
    queryKey: [`/api/wishlist/${sessionId}/${gift?.id}/check`],
    enabled: !!sessionId && !!gift?.id,
  });

  const isInWishlist = wishlistData?.isInWishlist ?? false;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!gift) return;
      return apiRequest('/api/cart', 'POST', {
        sessionId,
        paintingId: gift.id, // Using paintingId field for compatibility
        quantity: quantity[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Added to cart successfully!', 'success');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      showToast('Failed to add to cart', 'error');
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ giftId, change }: { giftId: string; change: number }) => {
      const currentItem = cartItems.find(item => item.paintingId === giftId);
      if (!currentItem) return;
      
      const newQuantity = Math.max(0, currentItem.quantity + change);
      
      if (newQuantity === 0) {
        return apiRequest(`/api/cart/${sessionId}/${giftId}`, 'DELETE');
      } else {
        return apiRequest(`/api/cart/${sessionId}/${giftId}`, 'PUT', { quantity: newQuantity });
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
    mutationFn: async (giftId: string) => {
      return apiRequest(`/api/cart/${sessionId}/${giftId}`, 'DELETE');
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
      if (!gift) return;
      
      if (isInWishlist) {
        return apiRequest(`/api/wishlist/${sessionId}/${gift.id}`, 'DELETE');
      } else {
        return apiRequest('/api/wishlist', 'POST', {
          sessionId,
          paintingId: gift.id, // Using paintingId field for compatibility
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}/${gift?.id}/check`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}`] });
      showToast(
        isInWishlist ? 'Removed from wishlist' : 'Added to wishlist', 
        'success'
      );
    },
    onError: (error) => {
      console.error('Error toggling wishlist:', error);
      showToast('Failed to update wishlist', 'error');
    },
  });

  if (!gift) return null;

  const currentCartItem = cartItems.find(item => item.paintingId === gift.id);
  const cartQuantity = currentCartItem?.quantity || 0;
  const displayPrice = gift.salePrice || gift.price;
  const wasPrice = gift.salePrice ? gift.price : null;

  const handleAddToCart = () => {
    addToCartMutation.mutate();
    onAddToCart(gift.id, quantity[0]);
  };

  const handleQuantityChange = (change: number) => {
    updateCartMutation.mutate({ giftId: gift.id, change });
  };

  const handleRemoveFromCart = () => {
    removeFromCartMutation.mutate(gift.id);
  };

  const handleWishlistToggle = () => {
    toggleWishlistMutation.mutate();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full shadow-sm"
          >
            <X size={20} />
          </Button>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gray-100 aspect-square lg:aspect-[4/5]">
              <img
                src={gift.imageUrl}
                alt={gift.title}
                className="w-full h-full object-cover"
              />
              {gift.salePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Sale
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 lg:p-12 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={20} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                    Corporate Gift
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-4">
                  {gift.title}
                </h1>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-charcoal">
                    {formatPrice(displayPrice)}
                  </span>
                  {wasPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(wasPrice)}
                    </span>
                  )}
                </div>

                {/* Category and Min Quantity */}
                <div className="flex gap-4 mb-6">
                  <div className="text-sm text-sophisticated-gray">
                    <span className="font-medium">Category:</span> {gift.category || 'Corporate Gift'}
                  </div>
                  <div className="text-sm text-sophisticated-gray">
                    <span className="font-medium">Min Order:</span> {gift.minQuantity || 1} items
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-serif font-medium text-charcoal mb-3">Description</h3>
                <p className="text-sophisticated-gray leading-relaxed">
                  {gift.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-serif font-medium text-charcoal">
                    Quantity
                  </label>
                  <span className="text-sm text-sophisticated-gray">
                    {quantity[0]} item{quantity[0] !== 1 ? 's' : ''}
                  </span>
                </div>
                <Slider
                  value={quantity}
                  onValueChange={setQuantity}
                  max={gift.maxQuantity || 500}
                  min={gift.minQuantity || 1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-sophisticated-gray mt-2">
                  <span>{gift.minQuantity || 1}</span>
                  <span>{gift.maxQuantity || 500}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                {cartQuantity > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">In Cart: {cartQuantity} items</span>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleQuantityChange(-1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center">{cartQuantity}</span>
                        <Button
                          onClick={() => handleQuantityChange(1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleRemoveFromCart}
                      variant="outline"
                      className="w-full"
                      disabled={removeFromCartMutation.isPending}
                    >
                      Remove from Cart
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-medium"
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart ({quantity[0]} item{quantity[0] !== 1 ? 's' : ''})
                  </Button>
                )}

                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  className="w-full h-12"
                  disabled={toggleWishlistMutation.isPending}
                >
                  <Heart 
                    size={20} 
                    className={`mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <Package className="mx-auto mb-2 text-purple-600" size={24} />
                  <p className="text-xs text-sophisticated-gray">Bulk Orders</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-purple-600" size={24} />
                  <p className="text-xs text-sophisticated-gray">Quality Guarantee</p>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-purple-600" size={24} />
                  <p className="text-xs text-sophisticated-gray">Fast Delivery</p>
                </div>
              </div>

              {/* Corporate Information */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-serif font-medium text-charcoal mb-3">Corporate Benefits</h4>
                <ul className="space-y-2 text-sm text-sophisticated-gray">
                  <li>• Custom branding available</li>
                  <li>• Volume discounts for large orders</li>
                  <li>• Dedicated account management</li>
                  <li>• Flexible payment terms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}