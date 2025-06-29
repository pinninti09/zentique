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
      {/* Hero Section */}
      <section className="mb-16 text-center animate-fade-in">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-charcoal leading-tight">
          Curated Collection of<br />
          <span className="text-elegant-gold">Exceptional Art</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover unique paintings from emerging and established artists. Each piece tells a story, waiting to become part of yours.
        </p>
      </section>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Sort by: Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search paintings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
          <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
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
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No paintings found matching your search.</p>
        </div>
      )}

      {/* Load More Button */}
      {sortedPaintings.length > 0 && (
        <div className="text-center">
          <Button className="bg-charcoal text-white hover:bg-elegant-gold font-medium">
            <ArrowDown className="mr-2" size={16} />
            Load More Paintings
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
