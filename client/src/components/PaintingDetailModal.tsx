import { useState } from 'react';
import { X, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Painting } from '@shared/schema';

interface PaintingDetailModalProps {
  painting: Painting | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (paintingId: string) => void;
}

export default function PaintingDetailModal({ 
  painting, 
  isOpen, 
  onClose, 
  onAddToCart 
}: PaintingDetailModalProps) {
  const [imageZoomed, setImageZoomed] = useState(false);

  if (!isOpen || !painting) return null;

  const handleAddToCart = () => {
    onAddToCart(painting.id);
    onClose();
  };

  const handleImageClick = () => {
    setImageZoomed(!imageZoomed);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-full overflow-y-auto animate-slide-up">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-serif font-bold text-charcoal">
              {painting.title}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={24} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <img 
                src={painting.imageUrl} 
                alt={painting.title}
                className={`w-full rounded-xl shadow-lg cursor-pointer transition-transform duration-300 ${
                  imageZoomed ? 'scale-150 transform-gpu' : 'hover:scale-105'
                }`}
                onClick={handleImageClick}
              />
              <div className="mt-2 text-sm text-muted-foreground text-center">
                Click image to zoom {imageZoomed ? '(click again to zoom out)' : ''}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {painting.description}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Details</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <span>{painting.medium || 'Oil on Canvas'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>{painting.dimensions || '24" × 36"'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span>{painting.year || new Date().getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Artist:</span>
                    <span>{painting.artist || 'Unknown Artist'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="pricing">
                    {painting.salePrice ? (
                      <>
                        <span className="text-gray-400 line-through text-lg">
                          {formatPrice(painting.price)}
                        </span>
                        <span className="text-3xl font-bold text-elegant-gold ml-2">
                          {formatPrice(painting.salePrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-charcoal">
                        {formatPrice(painting.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="text-green-500" size={16} />
                    <span className="text-sm text-green-500">Free Shipping</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={painting.sold}
                  className={`w-full py-4 text-lg font-medium ${
                    painting.sold 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-charcoal text-white hover:bg-elegant-gold'
                  }`}
                >
                  {painting.sold ? (
                    'Sold Out'
                  ) : (
                    <>
                      <ShoppingBag className="mr-2" size={20} />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
