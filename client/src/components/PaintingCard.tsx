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
      className="painting-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      onClick={() => onQuickView(painting)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={painting.imageUrl} 
          alt={painting.title}
          className={`w-full h-64 object-cover transition-transform duration-300 hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        
        <div className="painting-overlay absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickView}
            className="bg-white text-charcoal hover:bg-elegant-gold hover:text-white"
          >
            <Eye className="mr-2" size={16} />
            Quick View
          </Button>
        </div>
        
        <div className="absolute top-4 right-4">
          {painting.salePrice && (
            <Badge className="bg-green-500 text-white">On Sale</Badge>
          )}
          {painting.sold && (
            <Badge variant="destructive">Sold</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-2">{painting.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{painting.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="pricing">
            {painting.salePrice ? (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(painting.price)}
                </span>
                <span className="text-2xl font-bold text-elegant-gold ml-2">
                  {formatPrice(painting.salePrice)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-charcoal">
                {formatPrice(painting.price)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={painting.sold}
            className={painting.sold ? 
              "bg-gray-300 text-gray-500 cursor-not-allowed" : 
              "bg-charcoal text-white hover:bg-elegant-gold"
            }
          >
            {painting.sold ? (
              <>
                <Check className="mr-2" size={16} />
                Sold Out
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2" size={16} />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
