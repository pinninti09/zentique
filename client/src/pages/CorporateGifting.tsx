import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, Search, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import type { Painting, CartItem } from '@shared/schema';

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
  }
];

interface CorporateProductCardProps {
  product: typeof corporateProducts[0];
  onAddToCart: (productId: string, quantity: number) => void;
}

function CorporateProductCard({ product, onAddToCart }: CorporateProductCardProps) {
  const [quantity, setQuantity] = useState([1]);

  const handleQuantityChange = (value: number[]) => {
    setQuantity(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.salePrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Sale
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">({product.totalReviews})</span>
          </div>
        </div>
        
        <h3 className="text-xl font-serif font-semibold mb-2 text-rich-brown">
          {product.title}
        </h3>
        
        <p className="text-sophisticated-gray text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-rich-brown">
                {formatPrice(product.price)}
              </span>
            )}
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
        
        <Button
          onClick={() => onAddToCart(product.id, quantity[0])}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
        >
          <ShoppingCart className="mr-2" size={16} />
          Add {quantity[0]} to Cart
        </Button>
      </div>
    </div>
  );
}

export default function CorporateGifting() {
  const { sessionId, cartCount, setCartCount, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
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

  const handleAddToCart = (productId: string, quantity: number) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  // Filter and sort products
  const filteredProducts = corporateProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-high':
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case 'newest':
        return b.year - a.year;
      case 'featured':
      default:
        return b.averageRating - a.averageRating;
    }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Corporate Hero Section */}
      <section className="mb-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-brand font-bold mb-6 text-rich-brown leading-tight uppercase tracking-wide">
            Corporate Gifting
          </h1>
          <p className="text-lg text-sophisticated-gray max-w-5xl mx-auto leading-relaxed mb-8 font-brand">
            We believe gifting is more than a gesture—it's a message. Every hand-selected gift we create is a reminder to your team that they matter, that they're valued, and that your company always remembers the hearts behind the hard work. Gifting nurtures bonds, enriches workplace culture, and turns everyday routines into shared celebrations. Because when a company cares, every employee feels it—wrapped up, ribbon-tied, and ready to inspire.
          </p>
        </div>
      </section>

      {/* Filter Section */}
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
                  <SelectItem value="featured">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-sophisticated-gray">
              <span className="font-medium">{sortedProducts.length}</span> product{sortedProducts.length !== 1 ? 's' : ''} 
              <span className="mx-2">•</span>
              <span className="font-medium">{sortedProducts.filter(p => !p.sold).length}</span> available
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search corporate gifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-soft-taupe/50 focus:border-elegant-gold"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProducts.map((product) => (
          <CorporateProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {sortedProducts.length === 0 && (
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
    </main>
  );
}