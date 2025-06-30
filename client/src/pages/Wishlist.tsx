import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingBag, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { apiRequest } from '@/lib/queryClient';
import PaintingDetailModal from '@/components/PaintingDetailModal';
import type { WishlistItem, Painting } from '@shared/schema';

interface WishlistItemWithPainting extends WishlistItem {
  painting?: Painting;
}

export default function Wishlist() {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sessionId, setCartCount, showToast } = useApp();
  const queryClient = useQueryClient();

  // Fetch wishlist items
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: [`/api/wishlist/${sessionId}`],
    enabled: !!sessionId
  });

  // Fetch paintings data
  const { data: paintings = [] } = useQuery({
    queryKey: ['/api/paintings']
  });

  // Fetch cart items for updating count
  const { data: cartItems = [] } = useQuery<any[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId
  });

  // Update cart count when cart items change
  useEffect(() => {
    const totalQuantity = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }, [cartItems, setCartCount]);

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      await apiRequest(`/api/wishlist/${sessionId}/${paintingId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      showToast('Removed from wishlist', 'success');
    },
    onError: () => {
      showToast('Failed to remove from wishlist', 'error');
    }
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      await apiRequest('/api/cart', 'POST', {
        sessionId,
        paintingId,
        quantity: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      showToast('Added to cart', 'success');
    },
    onError: () => {
      showToast('Failed to add to cart', 'error');
    }
  });

  // Combine wishlist items with painting details
  const wishlistWithPaintings: WishlistItemWithPainting[] = Array.isArray(wishlistItems) && Array.isArray(paintings) 
    ? (wishlistItems as WishlistItem[]).map((item: WishlistItem) => ({
        ...item,
        painting: (paintings as Painting[]).find((p: Painting) => p.id === item.paintingId)
      })).filter((item: WishlistItemWithPainting) => item.painting)
    : [];

  const handleQuickView = (painting: Painting) => {
    setSelectedPainting(painting);
    setIsModalOpen(true);
  };

  const handleAddToCart = (paintingId: string) => {
    addToCartMutation.mutate(paintingId);
  };

  const handleRemoveFromWishlist = (paintingId: string) => {
    removeFromWishlistMutation.mutate(paintingId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-soft-taupe/30 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-soft-taupe/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-elegant-gold fill-current" />
            <h1 className="text-4xl font-serif font-light text-rich-brown">
              Your Wishlist
            </h1>
          </div>
          <p className="text-sophisticated-gray max-w-2xl mx-auto leading-relaxed">
            Curated pieces that caught your eye. Your personal collection of inspiring artworks.
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlistWithPaintings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-soft-taupe/20 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-10 h-10 text-sophisticated-gray/50" />
            </div>
            <h3 className="text-2xl font-serif font-light text-rich-brown mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-sophisticated-gray mb-8 max-w-md mx-auto leading-relaxed">
              Browse our gallery and heart the artworks that inspire you. They'll appear here for easy access.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white font-medium px-6 py-2"
            >
              Explore Gallery
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistWithPaintings.map((item) => {
              const painting = item.painting!;
              return (
                <Card 
                  key={item.id}
                  className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden bg-warm-cream/30">
                    <img 
                      src={painting.imageUrl} 
                      alt={painting.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-rich-brown/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickView(painting)}
                        className="bg-white text-rich-brown hover:bg-elegant-gold hover:text-white border-0 shadow-lg font-medium"
                      >
                        <Eye className="mr-2" size={16} />
                        Quick View
                      </Button>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      {painting.salePrice && (
                        <Badge className="bg-elegant-gold text-rich-brown font-medium px-3 py-1 mb-2">
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
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-medium text-rich-brown mb-1">
                        {painting.title}
                      </h3>
                      <p className="text-sm text-sophisticated-gray font-light">
                        {painting.artist || 'Unknown Artist'}
                      </p>
                    </div>
                    
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-serif font-semibold text-rich-brown">
                        {painting.salePrice ? formatPrice(painting.salePrice) : formatPrice(painting.price)}
                      </span>
                      {painting.salePrice && (
                        <span className="text-sm text-sophisticated-gray line-through font-light">
                          {formatPrice(painting.price)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAddToCart(painting.id)}
                        disabled={painting.sold || addToCartMutation.isPending}
                        className="flex-1 bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white font-medium transition-colors disabled:opacity-50"
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        {painting.sold ? 'Sold Out' : 'Add to Cart'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(painting.id)}
                        disabled={removeFromWishlistMutation.isPending}
                        className="p-2 border-soft-taupe/40 text-sophisticated-gray hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Painting Detail Modal */}
      <PaintingDetailModal
        painting={selectedPainting}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}