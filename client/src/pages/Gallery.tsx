import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, Search } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import PaintingCard from '@/components/PaintingCard';
import PaintingDetailModal from '@/components/PaintingDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { Painting } from '@shared/schema';

export default function Gallery() {
  const { sessionId, setCartCount, showToast } = useApp();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const queryClient = useQueryClient();

  const { data: paintings = [], isLoading } = useQuery<Painting[]>({
    queryKey: ['/api/paintings'],
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart', sessionId],
    enabled: !!sessionId,
  });

  useEffect(() => {
    setCartCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0));
  }, [cartItems, setCartCount]);

  const addToCartMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      return apiRequest('POST', '/api/cart', {
        sessionId,
        paintingId,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
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
      {/* Hero Section - Modern Minimalist Style */}
      <section className="mb-20 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-charcoal leading-tight">
              Art that<br />
              <span className="bg-gradient-to-r from-elegant-gold to-yellow-600 bg-clip-text text-transparent">
                Inspires
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Browse our carefully curated collection of contemporary and classic paintings. 
              From emerging talents to established masters, find the perfect piece for your space.
            </p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-charcoal">{paintings.length}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Artworks</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-charcoal">{new Set(paintings.map(p => p.artist)).size}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Artists</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-elegant-gold">{paintings.filter(p => p.salePrice).length}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">On Sale</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-elegant-gold/20 to-yellow-600/20 rounded-3xl p-8">
              <div className="w-full h-full bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-elegant-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-charcoal">Premium Collection</p>
                  <p className="text-muted-foreground">Handpicked masterpieces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-charcoal">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-gray-200 focus:border-elegant-gold">
                  <SelectValue placeholder="Choose sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">🌟 Featured</SelectItem>
                  <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                  <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                  <SelectItem value="newest">🆕 Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{sortedPaintings.length} artwork{sortedPaintings.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{sortedPaintings.filter(p => !p.sold).length} available</span>
            </div>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search by title, artist, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 w-full sm:w-80 border-gray-200 focus:border-elegant-gold focus:ring-elegant-gold/20"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-charcoal"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Paintings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
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
          <div className="w-24 h-24 bg-gradient-to-br from-elegant-gold/20 to-yellow-600/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Search className="w-12 h-12 text-elegant-gold" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">No artworks found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search terms or browse our full collection</p>
          <Button 
            onClick={() => setSearchTerm('')}
            className="bg-elegant-gold text-white hover:bg-yellow-600"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Load More Button */}
      {sortedPaintings.length > 6 && (
        <div className="text-center">
          <Button className="bg-white border-2 border-elegant-gold text-elegant-gold hover:bg-elegant-gold hover:text-white font-medium px-8 py-3 rounded-xl shadow-md transition-all duration-200">
            <ArrowDown className="mr-2" size={16} />
            Discover More Artworks
          </Button>
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
