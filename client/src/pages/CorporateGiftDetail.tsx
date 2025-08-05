import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  Building2, 
  Package, 
  Star,
  Minus,
  Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

export default function CorporateGiftDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [quantity, setQuantity] = useState(1);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionId', id);
    }
    return id;
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch corporate gift data
  const { data: gift, isLoading } = useQuery({
    queryKey: [`/api/corporate-gifts/${id}`],
    enabled: !!id
  });

  // Check if item is in wishlist
  const { data: isInWishlist = false } = useQuery({
    queryKey: [`/api/wishlist/${sessionId}/${id}/check`],
    enabled: !!sessionId && !!id
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/cart', 'POST', {
        sessionId,
        paintingId: id,
        quantity: quantity
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      toast({
        title: "Added to Cart",
        description: `${quantity} ${gift?.title} added to your cart`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    }
  });

  // Wishlist mutation
  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isInWishlist 
        ? `/api/wishlist/${sessionId}/${id}` 
        : '/api/wishlist';
      const method = isInWishlist ? 'DELETE' : 'POST';
      const body = isInWishlist ? undefined : { sessionId, paintingId: id };
      
      const response = await apiRequest(endpoint, method, body);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}/${id}/check`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}`] });
      toast({
        title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
        description: `${gift?.title} ${isInWishlist ? 'removed from' : 'added to'} your wishlist`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Corporate Gift Not Found</h2>
          <p className="text-gray-600 mb-4">The corporate gift you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/corporate-gifting')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Corporate Gifts
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  const handleWishlistToggle = () => {
    wishlistMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/corporate-gifting')}
          className="mb-6 text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Corporate Gifts
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={gift.imageUrl}
                alt={gift.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                disabled={wishlistMutation.isPending}
                className={`absolute top-4 right-4 ${
                  isInWishlist 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Corporate Gift
                </Badge>
                {gift.sold && (
                  <Badge className="bg-gray-500 text-white">
                    Sold Out
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gift.title}</h1>
              <p className="text-2xl font-semibold text-purple-600 mb-4">
                ${gift.price}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{gift.description}</p>
            </div>

            {gift.category && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category</h3>
                <Badge variant="outline" className="border-purple-200 text-purple-800">
                  {gift.category}
                </Badge>
              </div>
            )}

            {gift.minQuantity && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Minimum Order Quantity
                </h3>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{gift.minQuantity} units</span>
                </div>
              </div>
            )}

            <Separator />

            {/* Quantity Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(500, quantity + 1))}
                  disabled={quantity >= 500}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[quantity]}
                  onValueChange={(value) => setQuantity(value[0])}
                  max={500}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1 unit</span>
                  <span>500 units</span>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${(gift.price * quantity).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {quantity} × ${gift.price} each
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || gift.sold}
                className={gift.sold ? 
                  "flex-1 bg-gray-300 text-gray-600 cursor-not-allowed" :
                  "flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                }
              >
                {gift.sold ? (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Sold Out
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                disabled={wishlistMutation.isPending}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Bulk Order Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Need a Custom Quote?
                </h4>
                <p className="text-blue-800 text-sm">
                  For orders over 100 units or custom branding options, 
                  contact our corporate sales team for special pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}