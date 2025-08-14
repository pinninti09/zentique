import { useQuery } from '@tanstack/react-query';
import PaintingCard from './PaintingCard';
import { Skeleton } from './ui/skeleton';
import type { Painting, CorporateGift } from '@shared/schema';

interface MostPopularSectionProps {
  type: 'paintings' | 'corporate-gifts';
  sessionId: string;
  onQuickView: (item: Painting | CorporateGift) => void;
  onAddToCart: (itemId: string) => void;
  onToggleWishlist: (itemId: string) => void;
  wishlistItems: any[];
  cartItems: any[];
}

export function MostPopularSection({
  type,
  sessionId,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
  cartItems
}: MostPopularSectionProps) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: [`/api/${type}`],
    select: (data: (Painting | CorporateGift)[]) => {
      // Sort by average rating and total reviews, then take top 6
      return data
        .filter(item => {
          // Check if item has sold property (paintings) or assume available (corporate gifts)
          return 'sold' in item ? !item.sold : true;
        })
        .sort((a, b) => {
          // Prioritize items with higher ratings and more reviews, handle null values
          const aRating = 'averageRating' in a ? (a.averageRating || 0) : 0;
          const aReviews = 'totalReviews' in a ? (a.totalReviews || 0) : 0;
          const bRating = 'averageRating' in b ? (b.averageRating || 0) : 0;
          const bReviews = 'totalReviews' in b ? (b.totalReviews || 0) : 0;
          
          const aScore = aRating * Math.log(Math.max(1, aReviews) + 1);
          const bScore = bRating * Math.log(Math.max(1, bReviews) + 1);
          return bScore - aScore;
        })
        .slice(0, 6);
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-cream/30 to-warm-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
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
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const sectionTitle = type === 'paintings' ? 'Most Popular Paintings' : 'Most Popular Corporate Gifts';

  return (
    <section className="py-16 bg-gradient-to-br from-cream/30 to-warm-beige/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-xl font-brand font-medium text-rich-brown mb-4 uppercase tracking-wide">
            {sectionTitle}
          </h2>
        </div>

        {/* Popular Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const isInWishlist = wishlistItems.some(w => w.paintingId === item.id);
            const isInCart = cartItems.some(c => c.paintingId === item.id);

            return (
              <div key={item.id} className="relative">

                
                <PaintingCard
                  painting={item as Painting}
                  onQuickView={onQuickView}
                  onAddToCart={() => onAddToCart(item.id)}
                />
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}