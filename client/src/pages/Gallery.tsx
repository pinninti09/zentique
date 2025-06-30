import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, Search, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import PaintingCard from '@/components/PaintingCard';
import PaintingDetailModal from '@/components/PaintingDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { Painting, CartItem } from '@shared/schema';

export default function Gallery() {
  const { sessionId, cartCount, setCartCount, showToast } = useApp();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const queryClient = useQueryClient();

  const { data: paintings = [], isLoading } = useQuery<Painting[]>({
    queryKey: ['/api/paintings'],
  });

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  // Update cart count in context when cart items change
  useEffect(() => {
    const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }, [cartItems, setCartCount]);

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      setCartCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0));
    }
  }, [cartItems, setCartCount]);

  const addToCartMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      return apiRequest('/api/cart', 'POST', {
        sessionId,
        paintingId,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Painting added to cart!');
    },
    onError: () => {
      showToast('Failed to add painting to cart', 'error');
    },
  });

  const handleQuickView = (painting: Painting) => {
    setSelectedPainting(painting);
    setModalOpen(true);
  };

  const handleAddToCart = (paintingId: string) => {
    addToCartMutation.mutate(paintingId);
  };

  const filteredPaintings = paintings.filter(painting =>
    painting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    painting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    painting.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPaintings = [...filteredPaintings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-high':
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case 'newest':
        return (b.year || 0) - (a.year || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16 text-center">
          <Skeleton className="h-16 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Skeleton className="w-full h-64" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section - Ballard Designs Inspired */}
      <section className="mb-16 animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-elegant-gold/10 rounded-full mb-6">
            <span className="text-sm font-medium text-elegant-gold uppercase tracking-wide">Curated Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 text-rich-brown leading-tight">
            Fine Art for Your Home
          </h1>
          <p className="text-lg text-sophisticated-gray max-w-2xl mx-auto leading-relaxed mb-8">
            Discover exceptional paintings that transform your space into a gallery of personal expression. 
            Each piece is carefully selected for its artistic merit and timeless appeal.
          </p>
          
        </div>
      </section>

      {/* Refined Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-soft-taupe/40 p-6 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-rich-brown tracking-wide">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-52 border-soft-taupe/50 focus:border-elegant-gold bg-white">
                  <SelectValue placeholder="Choose sorting option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured Selection</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-sophisticated-gray">
              <span className="font-medium">{sortedPaintings.length}</span> artwork{sortedPaintings.length !== 1 ? 's' : ''} 
              <span className="mx-2">•</span>
              <span className="font-medium">{sortedPaintings.filter(p => !p.sold).length}</span> available
            </div>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-10 w-full sm:w-72 border-soft-taupe/50 focus:border-elegant-gold bg-white text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sophisticated-gray" size={16} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sophisticated-gray hover:text-rich-brown transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Paintings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {sortedPaintings.map((painting) => (
          <PaintingCard
            key={painting.id}
            painting={painting}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {sortedPaintings.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-elegant-gold/10 rounded-lg mx-auto mb-6 flex items-center justify-center">
            <Search className="w-10 h-10 text-elegant-gold" />
          </div>
          <h3 className="text-2xl font-serif font-light text-rich-brown mb-3">No artworks found</h3>
          <p className="text-sophisticated-gray mb-8 max-w-md mx-auto leading-relaxed">
            We couldn't find any pieces matching your search. Try different keywords or browse our full collection.
          </p>
          <Button 
            onClick={() => setSearchTerm('')}
            className="bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white font-medium px-6 py-2 transition-colors"
          >
            View All Artworks
          </Button>
        </div>
      )}

      {/* Load More Button */}
      {sortedPaintings.length > 6 && (
        <div className="text-center border-t border-soft-taupe/30 pt-12">
          <Button className="bg-white border border-elegant-gold text-rich-brown hover:bg-elegant-gold hover:text-white font-medium px-8 py-3 transition-all duration-200">
            <ArrowDown className="mr-2" size={16} />
            View More Artworks
          </Button>
        </div>
      )}

      {/* Floating Proceed to Checkout Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/cart">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full px-6 py-4 flex items-center gap-3"
            >
              <ShoppingCart size={20} />
              <span className="font-medium">
                Proceed to Checkout ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      )}

      {/* Painting Detail Modal */}
      <PaintingDetailModal
        painting={selectedPainting}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
