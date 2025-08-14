import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, Search, ShoppingCart, ArrowRight, LayoutGrid, List, Globe, Palette, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import PaintingCard from '@/components/PaintingCard';

import { MostPopularSection } from '@/components/MostPopularSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import type { Painting, CartItem } from '@shared/schema';

export default function Gallery() {
  const { sessionId, cartCount, setCartCount, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const [, setLocation] = useLocation();
  
  const itemsPerPage = 6;
  const queryClient = useQueryClient();

  const { data: paintings = [], isLoading } = useQuery<Painting[]>({
    queryKey: ['/api/paintings'],
  });

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  const { data: wishlistItems = [] } = useQuery<any[]>({
    queryKey: [`/api/wishlist/${sessionId}`],
    enabled: !!sessionId,
  });

  // Fetch gallery background image
  const { data: backgroundImage = {} } = useQuery<any>({
    queryKey: ['/api/background/gallery'],
    retry: false,
  });

  // Update cart count in context when cart items change
  useEffect(() => {
    const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
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

  const toggleWishlistMutation = useMutation({
    mutationFn: async (paintingId: string) => {
      const isInWishlist = wishlistItems.some((item: any) => item.paintingId === paintingId);
      
      if (isInWishlist) {
        return apiRequest(`/api/wishlist/${sessionId}/${paintingId}`, 'DELETE');
      } else {
        return apiRequest('/api/wishlist', 'POST', {
          sessionId,
          paintingId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/${sessionId}`] });
    },
    onError: () => {
      showToast('Failed to update wishlist', 'error');
    },
  });

  const handleQuickView = (painting: Painting) => {
    setLocation(`/painting/${painting.id}`);
  };

  const handleAddToCart = (paintingId: string) => {
    addToCartMutation.mutate(paintingId);
  };

  const filteredPaintings = paintings.filter(painting => {
    const matchesSearch = painting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      painting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      painting.artist?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(category => 
        painting.category?.toLowerCase() === category.toLowerCase()
      );
    
    return matchesSearch && matchesCategory;
  });

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

  // Pagination calculations
  const totalItems = sortedPaintings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPaintings = sortedPaintings.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, sortBy]);

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
    <>
    {/* Hero Section with Configurable Background - Full Width */}
    <section className="mb-16 animate-fade-in relative w-full">
      <div 
        className="relative bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${
            backgroundImage?.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
          }')`
        }}
      >
        <div className="text-center w-full px-8 py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-brand font-bold mb-6 text-white leading-tight uppercase tracking-wide drop-shadow-lg">
            {backgroundImage?.title || 'Zentique'}
          </h1>
          <p className="text-lg text-white max-w-5xl mx-auto leading-relaxed mb-8 font-brand drop-shadow-md">
            {backgroundImage?.subtitle || 'An experience of elegance — painted just for you. Each masterwork here isn\'t simply a painting; it\'s the exclamation point in a room\'s story. Curated for those who believe that art is the signature accessory of every interior, our collection turns walls into wonders and corners into conversations.'}
          </p>
        </div>
      </div>
    </section>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Refined Filter Section */}
      <div className="p-6 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-rich-brown tracking-wide">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-52 border-soft-taupe/30 focus:border-elegant-gold bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
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
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-rich-brown tracking-wide">Filter by</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-52 border-soft-taupe/30 focus:border-elegant-gold bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 justify-between">
                    {selectedCategories.length === 0 
                      ? "All Categories" 
                      : `${selectedCategories.length} selected`
                    }
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-3">
                  <div className="space-y-3">
                    <div className="font-medium text-sm text-rich-brown">Select Categories</div>
                    {['cartoon', 'devotional', 'abstract', 'scenaries', 'flowers'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm capitalize cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                    {selectedCategories.length > 0 && (
                      <div className="pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedCategories([])}
                          className="w-full text-xs"
                        >
                          Clear All
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search artworks, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-10 w-full sm:w-72 border-soft-taupe/30 focus:border-elegant-gold bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-sm"
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
            
            {/* View Toggle */}
            <div className="flex items-center border border-soft-taupe/30 rounded-lg bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-r-none border-0 ${viewMode === 'grid' ? 'bg-elegant-gold text-rich-brown shadow-sm' : 'text-sophisticated-gray hover:text-rich-brown hover:bg-elegant-gold/10'}`}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-l-none border-0 ${viewMode === 'list' ? 'bg-elegant-gold text-rich-brown shadow-sm' : 'text-sophisticated-gray hover:text-rich-brown hover:bg-elegant-gold/10'}`}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Paintings Display - Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentPaintings.map((painting) => (
            <PaintingCard
              key={painting.id}
              painting={painting}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6 mb-16">
          {currentPaintings.map((painting) => (
            <div key={painting.id} className="bg-transparent border-0 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-80 h-64 md:h-48 relative overflow-hidden">
                  <img
                    src={painting.imageUrl}
                    alt={painting.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                  {painting.sold && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium text-sm">
                        SOLD
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-serif font-medium text-rich-brown mb-1">
                          {painting.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-light text-elegant-gold mb-1">
                          ${painting.price}
                        </p>
                        <p className="text-xs text-sophisticated-gray">
                          {painting.dimensions}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${(painting.averageRating || 0) > 0 && i < Math.round(painting.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-sophisticated-gray">
                          {(painting.averageRating || 0) > 0 && (painting.totalReviews || 0) > 0 
                            ? `(${painting.totalReviews || 0} review${(painting.totalReviews || 0) !== 1 ? 's' : ''})`
                            : '(0 reviews)'
                          }
                        </span>
                      </div>
                      <span className="text-xs bg-elegant-gold/10 text-rich-brown px-2 py-1 rounded-full capitalize">
                        {painting.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleQuickView(painting)}
                      variant="outline"
                      className="flex-1 border-elegant-gold text-rich-brown hover:bg-elegant-gold/10"
                    >
                      View Details
                    </Button>
                    {!painting.sold && (
                      <Button
                        onClick={() => handleAddToCart(painting.id)}
                        disabled={addToCartMutation.isPending}
                        className="flex-1 bg-gray-400 text-white hover:bg-gray-500 hover:text-white transition-colors"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalItems === 0 && !isLoading && (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 border-t border-soft-taupe/30 pt-12">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-rich-brown hover:text-elegant-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm font-medium transition-colors ${
                  page === currentPage 
                    ? 'text-elegant-gold border-b-2 border-elegant-gold' 
                    : 'text-rich-brown hover:text-elegant-gold'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-rich-brown hover:text-elegant-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

    </main>

    {/* Most Popular Section */}
    <MostPopularSection
      type="paintings"
      sessionId={sessionId}
      onQuickView={(painting) => setLocation(`/painting/${painting.id}`)}
      onAddToCart={addToCartMutation.mutate}
      onToggleWishlist={toggleWishlistMutation.mutate}
      wishlistItems={wishlistItems as any[]}
      cartItems={cartItems}
    />
    
    {/* Trust Banner - Outside main container for full width */}
    <div className="bg-gray-400 border-t border-soft-taupe/30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Global Reach */}
          <div className="flex items-center justify-center space-x-3 md:flex-col md:space-x-0 md:space-y-2">
            <div className="flex items-center justify-center">
              <Globe size={28} className="text-rich-brown" />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-base font-serif font-medium text-rich-brown mb-1">
                Global Reach
              </h3>
              <p className="text-rich-brown/70 text-xs leading-relaxed">
                USA, Sweden & India
              </p>
            </div>
          </div>

          {/* Professional Artists */}
          <div className="flex items-center justify-center space-x-3 md:flex-col md:space-x-0 md:space-y-2">
            <div className="flex items-center justify-center">
              <Palette size={28} className="text-rich-brown" />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-base font-serif font-medium text-rich-brown mb-1">
                Professional Artists
              </h3>
              <p className="text-rich-brown/70 text-xs leading-relaxed">
                Curated collection
              </p>
            </div>
          </div>

          {/* Happy Customers */}
          <div className="flex items-center justify-center space-x-3 md:flex-col md:space-x-0 md:space-y-2">
            <div className="flex items-center justify-center">
              <Users size={28} className="text-rich-brown" />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-base font-serif font-medium text-rich-brown mb-1">
                Happy Customers
              </h3>
              <p className="text-rich-brown/70 text-xs leading-relaxed">
                Thousands satisfied
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Painting Detail Modal */}

    </>
  );
}
