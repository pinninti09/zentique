import { useState } from 'react';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { Painting } from '@shared/schema';

interface PaintingCardProps {
  painting: Painting;
  onQuickView: (painting: Painting) => void;
  onAddToCart: (paintingId: string) => void;
}

export default function PaintingCard({ painting, onQuickView, onAddToCart }: PaintingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(painting.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(painting);
  };

  return (
    <Card 
      className="painting-card group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
      onClick={() => onQuickView(painting)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={painting.imageUrl} 
          alt={painting.title}
          className={`w-full h-72 object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 font-medium">Loading artwork...</div>
          </div>
        )}
        
        <div className="painting-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickView}
            className="bg-white/95 backdrop-blur-sm text-charcoal hover:bg-elegant-gold hover:text-white border-0 shadow-lg"
          >
            <Eye className="mr-2" size={16} />
            View Details
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {painting.salePrice && (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-3 py-1 shadow-md">
              Sale
            </Badge>
          )}
          {painting.sold && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium px-3 py-1 shadow-md">
              Sold
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold mb-1 text-charcoal group-hover:text-elegant-gold transition-colors duration-300">
            {painting.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            by {painting.artist || 'Unknown Artist'}
          </p>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {painting.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="pricing">
            {painting.salePrice ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(painting.price)}
                </span>
                <span className="text-2xl font-bold text-elegant-gold">
                  {formatPrice(painting.salePrice)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-charcoal">
                {formatPrice(painting.price)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={painting.sold}
            size="sm"
            className={painting.sold ? 
              "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200" : 
              "bg-charcoal text-white hover:bg-elegant-gold hover:scale-105 transform transition-all duration-200 shadow-md"
            }
          >
            {painting.sold ? (
              <>
                <Check className="mr-1" size={14} />
                Sold
              </>
            ) : (
              <>
                <ShoppingBag className="mr-1" size={14} />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
