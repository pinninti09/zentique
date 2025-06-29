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
import type { Review, Painting } from '@shared/schema';

interface ReviewsSectionProps {
  painting: Painting;
}

export default function ReviewsSection({ painting }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const { showToast } = useApp();
  const queryClient = useQueryClient();

  // Fetch reviews for this painting
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['/api/paintings', painting.id, 'reviews']
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/paintings/${painting.id}/reviews`, 'POST', {
        customerName,
        rating,
        comment: comment.trim() || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/paintings', painting.id, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/paintings'] });
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
              ? 'fill-elegant-gold text-elegant-gold'
              : 'text-sophisticated-gray/30'
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
          {(painting.averageRating || 0) > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(painting.averageRating || 0)}
              </div>
              <span className="text-sophisticated-gray font-light">
                {(painting.averageRating || 0).toFixed(1)} out of 5 ({painting.totalReviews} review{painting.totalReviews !== 1 ? 's' : ''})
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
        <Card className="border-soft-taupe/30">
          <CardContent className="p-6">
            <h4 className="font-serif font-medium text-rich-brown mb-4">Write Your Review</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rich-brown mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-1">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-rich-brown mb-2">
                  Your Name *
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-soft-taupe/40 focus:border-elegant-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-rich-brown mb-2">
                  Your Review (Optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this artwork..."
                  rows={4}
                  className="border-soft-taupe/40 focus:border-elegant-gold resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitReviewMutation.isPending || !customerName.trim() || rating === 0}
                  className="bg-elegant-gold text-rich-brown hover:bg-rich-brown hover:text-white font-medium"
                >
                  {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  className="border-soft-taupe/40 text-sophisticated-gray hover:bg-soft-taupe/20"
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
        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="text-center py-8 text-sophisticated-gray">
            <div className="w-16 h-16 bg-soft-taupe/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Star className="w-8 h-8 text-sophisticated-gray/50" />
            </div>
            <p className="font-light">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          (reviews as Review[]).map((review: Review) => (
            <Card key={review.id} className="border-soft-taupe/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-soft-taupe/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-sophisticated-gray" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-rich-brown">{review.customerName}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-sophisticated-gray font-light">
                        {formatDate(review.createdAt || new Date())}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sophisticated-gray leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}