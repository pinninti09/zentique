import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, Search, ShoppingCart, ArrowRight, Heart, Check, LayoutGrid, List, Globe, Smile, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { MostPopularSection } from '@/components/MostPopularSection';


import type { Painting, CartItem, CorporateGift } from '@shared/schema';

// Type for products that works with both database and hardcoded format
type ProductType = CorporateGift | typeof corporateProducts[0];

// Corporate gifting products with mug and t-shirt imagery
const corporateProducts = [
  {
    id: 'corp-1',
    title: 'Premium Coffee Mug',
    description: 'High-quality ceramic mug perfect for corporate gifts and employee appreciation. Dishwasher safe with premium print quality.',
    price: 24.99,
    salePrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: 'Ceramic',
    dimensions: '11 oz',
    year: 2024,
    artist: 'Custom Design',
    averageRating: 4.8,
    totalReviews: 127,
    availableSizes: null,
    availableFrames: null
  },
  {
    id: 'corp-2',
    title: 'Corporate T-Shirt',
    description: 'Premium cotton t-shirt ideal for team building events, corporate retreats, and branded merchandise. Available in multiple colors.',
    price: 19.99,
    salePrice: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: '100% Cotton',
    dimensions: 'S-XXL',
    year: 2024,
    artist: 'Corporate Design',
    averageRating: 4.6,
    totalReviews: 89,
    availableSizes: null,
    availableFrames: null
  },
  {
    id: 'corp-3',
    title: 'Executive Notebook Set',
    description: 'Elegant leather-bound notebook set perfect for executive gifts and corporate awards. Includes premium pen and gift box.',
    price: 49.99,
    salePrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: 'Leather & Paper',
    dimensions: '8" x 10"',
    year: 2024,
    artist: 'Executive Collection',
    averageRating: 4.9,
    totalReviews: 156,
    availableSizes: null,
    availableFrames: null
  },
  {
    id: 'corp-4',
    title: 'Branded Water Bottle',
    description: 'Stainless steel water bottle with corporate branding options. Perfect for employee wellness programs and promotional events.',
    price: 29.99,
    salePrice: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: 'Stainless Steel',
    dimensions: '20 oz',
    year: 2024,
    artist: 'Corporate Line',
    averageRating: 4.7,
    totalReviews: 203,
    availableSizes: null,
    availableFrames: null
  },
  {
    id: 'corp-5',
    title: 'Custom Tote Bag',
    description: 'Eco-friendly canvas tote bag perfect for corporate events, trade shows, and sustainable corporate gifting initiatives.',
    price: 16.99,
    salePrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: 'Canvas',
    dimensions: '15" x 16"',
    year: 2024,
    artist: 'Eco Collection',
    averageRating: 4.5,
    totalReviews: 94,
    availableSizes: null,
    availableFrames: null
  },
  {
    id: 'corp-6',
    title: 'Premium Desk Organizer',
    description: 'Bamboo desk organizer with custom engraving options. Ideal for executive gifts and office decoration.',
    price: 39.99,
    salePrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: 'Bamboo',
    dimensions: '12" x 8"',
    year: 2024,
    artist: 'Office Collection',
    averageRating: 4.8,
    totalReviews: 167,
    availableSizes: null,
    availableFrames: null
  },
  {
    id: 'corp-7',
    title: 'New Corporate Gift',
    description: 'Brand new corporate gift item just added to our collection. Be the first to review!',
    price: 34.99,
    salePrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    sold: false,
    medium: 'Premium Materials',
    dimensions: '10" x 8"',
    year: 2024,
    artist: 'New Collection',
    averageRating: 0,
    totalReviews: 0,
    availableSizes: null,
    availableFrames: null
  }
];

interface CorporateProductCardProps {
  product: any; // Support both database and hardcoded format
  onAddToCart: (productId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: any) => void;
  isInWishlist: boolean;
}

function CorporateProductCard({ product, onAddToCart, onToggleWishlist, onProductClick, isInWishlist }: CorporateProductCardProps) {
  const [quantity, setQuantity] = useState([1]);

  const handleQuantityChange = (value: number[]) => {
    setQuantity(value);
  };

  return (
    <div className="group bg-transparent rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0">
      <div className="relative overflow-hidden bg-warm-cream/30" onClick={() => onProductClick(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-80 object-contain transition-all duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.salePrice && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sale
            </div>
          )}
          {product.sold && (
            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sold
            </div>
          )}
        </div>

      </div>
      
      <div className="p-4 bg-warm-cream/50">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-serif font-semibold text-rich-brown flex-1">
            {product.title}
            {product.sku && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                {product.sku}
              </span>
            )}
          </h3>
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-1 ml-2 transition-all duration-200 ${
              isInWishlist
                ? 'text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart 
              className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
            />
          </button>
        </div>
        
        <p className="text-sophisticated-gray text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({(product.totalReviews || 0) === 0 ? '0 reviews' : `${product.totalReviews} review${product.totalReviews !== 1 ? 's' : ''}`})
            </span>
          </div>
        </div>
        
        {/* Bulk Quantity Slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity: {quantity[0]} {quantity[0] > 1 ? 'items' : 'item'}
          </label>
          <Slider
            value={quantity}
            onValueChange={handleQuantityChange}
            max={500}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>500</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-rich-brown">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(product.id, quantity[0])}
            disabled={product.sold || false}
            className={product.sold ? 
              "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium" : 
              "bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            }
          >
            {product.sold ? (
              <>
                <Check className="mr-1" size={14} />
                Sold Out
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1" size={14} />
                Add {quantity[0]} to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CorporateGifting() {
  const { sessionId, cartCount, setCartCount, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  
  const itemsPerPage = 6;

  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  // Fetch corporate gifts from database API
  const { data: corporateGifts = [], isLoading } = useQuery<CorporateGift[]>({
    queryKey: ['/api/corporate-gifts'],
  });

  // Wishlist functionality
  const { data: wishlistItems = [] } = useQuery<any[]>({
    queryKey: [`/api/wishlist/${sessionId}`],
    enabled: !!sessionId,
  });

  // Fetch corporate background image
  const { data: backgroundImage } = useQuery({
    queryKey: ['/api/background/corporate'],
    retry: false,
  });

  // Update cart count in context when cart items change
  useEffect(() => {
    const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }, [cartItems, setCartCount]);

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return apiRequest('/api/cart', 'POST', {
        sessionId,
        paintingId: productId,
        quantity,
        selectedSize: null,
        selectedFrame: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      showToast('Added to cart successfully!');
    },
    onError: () => {
      showToast('Failed to add to cart', 'error');
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const isCurrentlyInWishlist = Array.isArray(wishlistItems) && wishlistItems.some((item: any) => item.paintingId === productId);
      
      if (isCurrentlyInWishlist) {
        return apiRequest(`/api/wishlist/${sessionId}/${productId}`, 'DELETE');
      } else {
        return apiRequest('/api/wishlist', 'POST', {
          sessionId,
          paintingId: productId,
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

  const handleAddToCart = (productId: string, quantity: number) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlistMutation.mutate(productId);
  };

  const isInWishlist = (productId: string) => {
    return Array.isArray(wishlistItems) && wishlistItems.some((item: any) => item.paintingId === productId);
  };

  const [, setLocation] = useLocation();
  
  const handleGiftClick = (gift: CorporateGift) => {
    setLocation(`/corporate-gift/${gift.id}`);
  };



  // Filter and sort products - use database data or fallback to hardcoded
  const productsToShow = corporateGifts.length > 0 ? corporateGifts : corporateProducts;
  const filteredProducts = productsToShow.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(category => {
        const categoryLower = category.toLowerCase();
        const titleLower = product.title?.toLowerCase() || '';
        const descriptionLower = product.description?.toLowerCase() || '';
        const mediumLower = product.medium?.toLowerCase() || '';
        
        // Handle special cases for better matching
        if (categoryLower === 'waterbottles') {
          return titleLower.includes('water bottle') || titleLower.includes('bottle') ||
                 descriptionLower.includes('water bottle') || descriptionLower.includes('bottle');
        }
        if (categoryLower === 'tshirt') {
          return titleLower.includes('t-shirt') || titleLower.includes('tshirt') || titleLower.includes('shirt') ||
                 descriptionLower.includes('t-shirt') || descriptionLower.includes('tshirt') || descriptionLower.includes('shirt');
        }
        if (categoryLower === 'ondesk') {
          return titleLower.includes('notebook') || titleLower.includes('desk') || titleLower.includes('office') ||
                 descriptionLower.includes('notebook') || descriptionLower.includes('desk') || descriptionLower.includes('office') ||
                 descriptionLower.includes('executive');
        }
        
        // Default exact match for other categories
        return titleLower.includes(categoryLower) ||
               descriptionLower.includes(categoryLower) ||
               mediumLower.includes(categoryLower);
      });
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'price-low':
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-high':
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case 'newest':
        // Use createdAt for database items, year for hardcoded items
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return (b.year || 2024) - (a.year || 2024);
      case 'featured':
      default:
        return (b.averageRating || 4.5) - (a.averageRating || 4.5);
    }
  });

  // Pagination calculations
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, sortBy]);

  return (
    <>
    {/* Corporate Hero Section with Configurable Background - Full Width */}
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
            {backgroundImage?.title || 'Corporate Gifting'}
          </h1>
          <p className="text-lg text-white max-w-5xl mx-auto leading-relaxed mb-8 font-brand drop-shadow-md">
            {backgroundImage?.subtitle || 'We believe gifting is more than a gesture—it\'s a message. Every hand-selected gift we create is a reminder to your team that they matter, that they\'re valued, and that your company always remembers the hearts behind the hard work. Gifting nurtures bonds, enriches workplace culture, and turns everyday routines into shared celebrations. Because when a company cares, every employee feels it—wrapped up, ribbon-tied, and ready to inspire.'}
          </p>
        </div>
      </div>
    </section>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Filter Section */}
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
                  <SelectItem value="featured">Most Popular</SelectItem>
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
                    {['tshirt', 'mugs', 'ondesk', 'waterbottles'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`corp-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <Label htmlFor={`corp-${category}`} className="text-sm cursor-pointer">
                          {category === 'tshirt' ? 'T-Shirt' : 
                           category === 'mugs' ? 'Mugs' : 
                           category === 'ondesk' ? 'On Desk' : 
                           category === 'waterbottles' ? 'Water Bottles' : category}
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
            <div className="relative">
              <Input
                type="text"
                placeholder="Search corporate gifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 border-soft-taupe/30 focus:border-elegant-gold bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
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

      {/* Products Display - Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
            <CorporateProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onProductClick={handleGiftClick}
              isInWishlist={isInWishlist(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-transparent border-0 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-80 h-64 md:h-48 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleGiftClick(product)}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.salePrice && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sale
                      </div>
                    )}
                    {product.sold && (
                      <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sold
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(product.id);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                      isInWishlist(product.id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-white/80 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} 
                    />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-serif font-medium text-rich-brown mb-1">
                          {product.title}
                          {product.sku && (
                            <span className="ml-2 text-xs font-normal text-gray-400">
                              {product.sku}
                            </span>
                          )}
                        </h3>
                        <p className="text-sophisticated-gray text-sm mb-2">
                          by {product.artist}
                        </p>
                      </div>
                      <div className="text-right">
                        {product.salePrice ? (
                          <div>
                            <p className="text-2xl font-light text-elegant-gold mb-1">
                              ${product.salePrice}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-light text-elegant-gold mb-1">
                            ${product.price}
                          </p>
                        )}
                        <p className="text-xs text-sophisticated-gray">
                          {product.dimensions}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sophisticated-gray text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-sophisticated-gray">
                          ({(product.totalReviews || 0) === 0 ? '0 reviews' : `${product.totalReviews} review${product.totalReviews !== 1 ? 's' : ''}`})
                        </span>
                      </div>
                      <span className="text-xs bg-elegant-gold/10 text-rich-brown px-2 py-1 rounded-full">
                        {product.material || 'Premium Quality'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-rich-brown">Qty:</span>
                      <div className="flex items-center border border-soft-taupe/50 rounded-lg">
                        <button className="px-3 py-1 hover:bg-gray-100">-</button>
                        <span className="px-3 py-1 border-x border-soft-taupe/50">1</span>
                        <button className="px-3 py-1 hover:bg-gray-100">+</button>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product.id, 1)}
                      disabled={product.sold}
                      className={
                        product.sold 
                          ? "flex-1 bg-gray-400 text-white cursor-not-allowed"
                          : "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                      }
                    >
                      {product.sold ? (
                        <>
                          <Check className="mr-2" size={16} />
                          Sold Out
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2" size={16} />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalItems === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-6">No products found matching your search.</p>
          <Button 
            onClick={() => setSearchTerm('')} 
            variant="outline"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 border-t border-soft-taupe/30 pt-12 mb-16">
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
      type="corporate-gifts"
      sessionId={sessionId}
      onQuickView={(gift) => setLocation(`/corporate-gift/${gift.id}`)}
      onAddToCart={(giftId) => handleAddToCart(giftId, 1)}
      onToggleWishlist={handleToggleWishlist}
      wishlistItems={wishlistItems}
      cartItems={cartItems}
    />
    
    {/* Trust Banner - Outside main container for full width */}
    <div className="bg-gray-400 border-t border-soft-taupe/30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Global Reach */}
          <div className="flex items-center justify-center space-x-3 md:flex-col md:space-x-0 md:space-y-2">
            <div className="w-14 h-14 bg-rich-brown/20 rounded-full flex items-center justify-center">
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

          {/* Happy Clients */}
          <div className="flex items-center justify-center space-x-3 md:flex-col md:space-x-0 md:space-y-2">
            <div className="w-14 h-14 bg-rich-brown/20 rounded-full flex items-center justify-center">
              <Smile size={28} className="text-rich-brown" />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-base font-serif font-medium text-rich-brown mb-1">
                Happy Clients
              </h3>
              <p className="text-rich-brown/70 text-xs leading-relaxed">
                Corporate humour products
              </p>
            </div>
          </div>

          {/* Workplace Friendly */}
          <div className="flex items-center justify-center space-x-3 md:flex-col md:space-x-0 md:space-y-2">
            <div className="w-14 h-14 bg-rich-brown/20 rounded-full flex items-center justify-center">
              <Gift size={28} className="text-rich-brown" />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-base font-serif font-medium text-rich-brown mb-1">
                Workplace Friendly
              </h3>
              <p className="text-rich-brown/70 text-xs leading-relaxed">
                Work place friendly gifts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Corporate Gift Detail Modal */}

    </>
  );
}