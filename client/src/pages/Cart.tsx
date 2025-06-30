import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import type { CartItem, Painting } from '@shared/schema';

interface CartItemWithPainting extends CartItem {
  painting?: Painting;
}

export default function Cart() {
  const { sessionId, setCartCount, showToast } = useApp();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  const { data: paintings = [] } = useQuery<Painting[]>({
    queryKey: ['/api/paintings'],
  });

  // Update cart count in context when cart items change
  useEffect(() => {
    const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }, [cartItems, setCartCount]);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ paintingId, quantity }: { paintingId: string; quantity: number }) => {
      return apiRequest('PUT', `/api/cart/${sessionId}/${paintingId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Cart updated!');
    },
    onError: () => {
      showToast('Failed to update cart', 'error');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      return apiRequest(`/api/cart/${sessionId}/${paintingId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Item removed from cart!');
    },
    onError: () => {
      showToast('Failed to remove item', 'error');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/cart/${sessionId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Cart cleared!');
    },
    onError: () => {
      showToast('Failed to clear cart', 'error');
    },
  });

  // Enrich cart items with painting data
  const enrichedCartItems: CartItemWithPainting[] = cartItems.map(item => ({
    ...item,
    painting: paintings.find(p => p.id === item.paintingId)
  })).filter(item => item.painting); // Filter out items without painting data

  const updateQuantity = (paintingId: string, change: number) => {
    const item = cartItems.find(item => item.paintingId === paintingId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      removeItemMutation.mutate(paintingId);
    } else {
      updateQuantityMutation.mutate({ paintingId, quantity: newQuantity });
    }
  };

  const removeItem = (paintingId: string) => {
    removeItemMutation.mutate(paintingId);
  };

  const subtotal = enrichedCartItems.reduce((sum, item) => {
    if (!item.painting) return sum;
    const price = item.painting.salePrice || item.painting.price;
    return sum + (price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Update cart count
  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems, setCartCount]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-charcoal">Shopping Cart</h2>
            {enrichedCartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCartMutation.mutate()}
                disabled={clearCartMutation.isPending}
              >
                Clear Cart
              </Button>
            )}
          </div>
          
          {enrichedCartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
              <Link href="/">
                <Button className="bg-charcoal text-white hover:bg-elegant-gold">
                  <ArrowLeft className="mr-2" size={16} />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {enrichedCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 pb-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6"
                  >
                    <img
                      src={item.painting?.imageUrl}
                      alt={item.painting?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-serif text-xl font-semibold">
                        {item.painting?.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.painting?.description.slice(0, 80)}...
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.paintingId, -1)}
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.paintingId, 1)}
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      <div className="text-right min-w-[5rem]">
                        <div className="text-lg font-bold text-charcoal">
                          {formatPrice((item.painting?.salePrice || item.painting?.price || 0) * item.quantity)}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.paintingId)}
                        disabled={removeItemMutation.isPending}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-muted-foreground">Subtotal:</span>
                  <span className="text-lg font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-muted-foreground">Shipping:</span>
                  <span className="text-lg font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-elegant-gold">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2" size={16} />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 bg-elegant-gold text-white hover:bg-yellow-600 font-medium"
                    onClick={() => showToast('Checkout functionality coming soon!')}
                  >
                    <CreditCard className="mr-2" size={16} />
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
