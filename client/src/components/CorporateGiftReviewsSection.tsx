import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import type { CorporateGiftReview, CorporateGift } from '@shared/schema';

interface CorporateGiftReviewsSectionProps {
  corporateGift: CorporateGift;
}

export default function CorporateGiftReviewsSection({ corporateGift }: CorporateGiftReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const { showToast } = useApp();
  const queryClient = useQueryClient();

  // Fetch reviews for this corporate gift
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: [`/api/corporate-gifts/${corporateGift.id}/reviews`]
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/corporate-gifts/${corporateGift.id}/reviews`, 'POST', {
        customerName,
        rating,
        comment: comment.trim() || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/corporate-gifts/${corporateGift.id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-gifts'] });
      setShowReviewForm(false);
      setRating(0);
      setCustomerName('');
      setComment('');
      showToast('Review submitted successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to submit review', 'error');
    }
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || rating === 0) {
      showToast('Please provide your name and rating', 'error');
      return;
    }
    submitReviewMutation.mutate();
  };

  const renderStars = (ratingValue: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 cursor-pointer transition-colors ${
            i <= (interactive ? (hoverRating || rating) : ratingValue)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && setRating(i)}
        />
      );
    }
    return stars;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="text-center py-4 text-sophisticated-gray">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6" data-reviews-section>
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-medium text-rich-brown mb-2">
            Customer Reviews
          </h3>
          {(corporateGift.averageRating || 0) > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(corporateGift.averageRating || 0)}
              </div>
              <span className="text-sophisticated-gray font-light">
                {(corporateGift.averageRating || 0).toFixed(1)} out of 5 ({corporateGift.totalReviews} review{corporateGift.totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        
        {!showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white font-medium"
            data-write-review-btn
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="bg-warm-cream/30 border-elegant-gold/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <h4 className="text-lg font-serif font-medium text-rich-brown mb-4">
                  Share Your Experience
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rich-brown mb-2">
                    Your Name *
                  </label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-white border-elegant-gold/30 focus:border-elegant-gold"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-rich-brown mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(rating, true)}
                    </div>
                    <span className="text-sm text-sophisticated-gray">
                      ({rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'No rating'})
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-rich-brown mb-2">
                  Your Review (Optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about your experience with this corporate gift..."
                  rows={4}
                  className="bg-white border-elegant-gold/30 focus:border-elegant-gold resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitReviewMutation.isPending}
                  className="bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white font-medium"
                >
                  {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setRating(0);
                    setCustomerName('');
                    setComment('');
                  }}
                  className="border-elegant-gold/30 text-rich-brown hover:bg-elegant-gold/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-sophisticated-gray">
            <p className="text-lg mb-2">No reviews yet</p>
            <p className="text-sm">Be the first to share your experience with this corporate gift!</p>
          </div>
        ) : (
          reviews.map((review: CorporateGiftReview) => (
            <Card key={review.id} className="bg-white/50 border-elegant-gold/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-elegant-gold/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-rich-brown" />
                    </div>
                    <div>
                      <h5 className="font-medium text-rich-brown">{review.customerName}</h5>
                      <p className="text-sm text-sophisticated-gray">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <Badge variant="secondary" className="ml-2 bg-elegant-gold/10 text-rich-brown border-elegant-gold/20">
                      {review.rating} star{review.rating !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-sophisticated-gray leading-relaxed mt-3">
                    {review.comment}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}