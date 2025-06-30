import { 
  paintings, 
  cartItems, 
  reviews,
  wishlistItems,
  availabilityNotifications,
  promoBanners,
  type Painting, 
  type InsertPainting, 
  type CartItem, 
  type InsertCartItem, 
  type User, 
  type InsertUser,
  type Review,
  type InsertReview,
  type WishlistItem,
  type InsertWishlistItem,
  type AvailabilityNotification,
  type InsertAvailabilityNotification,
  type PromoBanner,
  type InsertPromoBanner
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Painting methods
  getAllPaintings(): Promise<Painting[]>;
  getPaintingById(id: string): Promise<Painting | undefined>;
  createPainting(painting: InsertPainting): Promise<Painting>;
  updatePainting(id: string, updates: Partial<Painting>): Promise<Painting | undefined>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, paintingId: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, paintingId: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Review methods
  getReviewsByPaintingId(paintingId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updatePaintingRating(paintingId: string): Promise<void>;

  // Wishlist methods
  getWishlistItems(sessionId: string): Promise<WishlistItem[]>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(sessionId: string, paintingId: string): Promise<boolean>;
  isInWishlist(sessionId: string, paintingId: string): Promise<boolean>;

  // Availability notification methods
  createAvailabilityNotification(notification: InsertAvailabilityNotification): Promise<AvailabilityNotification>;
  getNotificationsByPaintingId(paintingId: string): Promise<AvailabilityNotification[]>;
  markNotificationsSent(paintingId: string): Promise<void>;

  // Banner methods
  getActiveBanner(): Promise<PromoBanner | undefined>;
  createBanner(banner: InsertPromoBanner): Promise<PromoBanner>;
  updateBanner(id: string, updates: Partial<PromoBanner>): Promise<PromoBanner | undefined>;
  deactivateAllBanners(): Promise<void>;

  // Corporate banner methods
  getActiveCorporateBanner(): Promise<PromoBanner | undefined>;
  createCorporateBanner(banner: InsertPromoBanner): Promise<PromoBanner>;
  deactivateAllCorporateBanners(): Promise<void>;

  // Corporate gift methods
  getAllCorporateGifts(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private paintings: Map<string, Painting>;
  private cartItems: Map<string, CartItem>;
  private reviews: Map<string, Review>;
  private wishlistItems: Map<string, WishlistItem>;
  private availabilityNotifications: Map<string, AvailabilityNotification>;
  private banners: Map<string, PromoBanner>;
  private corporateBanners: Map<string, PromoBanner>;
  private corporateGifts: Map<string, any>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.paintings = new Map();
    this.cartItems = new Map();
    this.reviews = new Map();
    this.wishlistItems = new Map();
    this.availabilityNotifications = new Map();
    this.banners = new Map();
    this.corporateBanners = new Map();
    this.corporateGifts = new Map();
    this.currentUserId = 1;
    
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize July 4th banner
    const july4Banner: PromoBanner = {
      id: "july4-2024",
      text: "🇺🇸 July 4th Special: 25% OFF All Paintings! Use code JULY4 - Free Shipping on Orders Over $200",
      isActive: true,
      backgroundColor: "#1e40af",
      textColor: "#f8fafc",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.banners.set(july4Banner.id, july4Banner);

    // Initialize corporate banner
    const corporateBanner: PromoBanner = {
      id: "corporate-2024",
      text: "🎁 Corporate Gifting: Strengthen workplace relationships with meaningful gifts that show you value your team",
      isActive: true,
      backgroundColor: "#1e40af",
      textColor: "#ffffff",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.corporateBanners.set(corporateBanner.id, corporateBanner);

    // Initialize sample corporate gifts
    const sampleCorporateGifts = [
      {
        id: "corp-1",
        title: "Premium Coffee Mug",
        description: "High-quality ceramic mug perfect for daily use",
        price: 24.99,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Drinkware",
        material: "Ceramic",
        minQuantity: 1,
        maxQuantity: 500
      },
      {
        id: "corp-2",
        title: "Corporate T-Shirt",
        description: "Comfortable cotton t-shirt with custom branding",
        price: 19.99,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Apparel",
        material: "Cotton",
        minQuantity: 1,
        maxQuantity: 500
      },
      {
        id: "corp-3",
        title: "Branded Notebook",
        description: "Professional notebook for meetings and notes",
        price: 12.99,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Office",
        material: "Paper",
        minQuantity: 1,
        maxQuantity: 500
      },
      {
        id: "corp-4",
        title: "Water Bottle",
        description: "Insulated water bottle with company logo",
        price: 18.99,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Drinkware",
        material: "Stainless Steel",
        minQuantity: 1,
        maxQuantity: 500
      }
    ];
    
    sampleCorporateGifts.forEach(gift => {
      this.corporateGifts.set(gift.id, gift);
    });

    // Sample paintings with ratings
    const samplePaintings: Painting[] = [
      {
        id: "1",
        title: "Sunset Over the Ocean",
        description: "A breathtaking view of the sun setting over calm ocean waters, painted with warm oranges and deep blues that capture the peaceful moment when day meets night.",
        price: 1200,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: false,
        medium: "Oil on Canvas",
        dimensions: "24\" × 36\"",
        year: 2024,
        artist: "Elena Rodriguez",
        averageRating: 4.8,
        totalReviews: 12,
        availableSizes: ["16\" x 20\"", "20\" x 24\"", "24\" x 30\"", "30\" x 40\""],
        availableFrames: ["Frameless Stretch", "Black Wood Frame", "White Wood Frame", "Gold Ornate Frame"]
      },
      {
        id: "2",
        title: "Urban Reflections",
        description: "A modern cityscape capturing the reflection of glass buildings in rain-soaked streets, showcasing the beauty found in urban environments.",
        price: 950,
        salePrice: 750,
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: false,
        medium: "Acrylic on Canvas",
        dimensions: "20\" × 30\"",
        year: 2024,
        artist: "Marcus Chen",
        averageRating: 4.2,
        totalReviews: 8,
        availableSizes: ["12\" x 16\"", "16\" x 20\"", "20\" x 24\"", "24\" x 32\""],
        availableFrames: ["Frameless Stretch", "Black Metal Frame", "Silver Frame", "Natural Wood Frame"]
      },
      {
        id: "3",
        title: "Forest Sanctuary",
        description: "Deep within an ancient forest, this painting captures the mystical quality of light filtering through old-growth trees, creating a sense of peace and wonder.",
        price: 1450,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: false,
        medium: "Oil on Canvas",
        dimensions: "30\" × 40\"",
        year: 2023,
        artist: "Sarah Thompson",
        averageRating: 4.9,
        totalReviews: 15,
        availableSizes: ["20\" x 24\"", "24\" x 30\"", "30\" x 40\"", "36\" x 48\""],
        availableFrames: ["Frameless Stretch", "Dark Walnut Frame", "Rustic Wood Frame", "Gallery Float Frame"]
      },
      {
        id: "4",
        title: "Mountain Majesty",
        description: "Snow-capped peaks reaching toward dramatic clouds, this landscape painting celebrates the raw power and beauty of mountain wilderness.",
        price: 1800,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: true,
        medium: "Oil on Canvas",
        dimensions: "36\" × 48\"",
        year: 2024,
        artist: "David Kim",
        averageRating: 4.7,
        totalReviews: 22,
        availableSizes: ["24\" x 32\"", "30\" x 40\"", "36\" x 48\"", "40\" x 60\""],
        availableFrames: ["Frameless Stretch", "Black Wood Frame", "Bronze Frame", "Custom Gallery Frame"]
      },
      {
        id: "5",
        title: "Abstract Harmony",
        description: "Bold strokes of color dance across the canvas in this vibrant abstract piece, evoking emotions through pure form and color rather than representation.",
        price: 800,
        salePrice: 650,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: false,
        medium: "Acrylic on Canvas",
        dimensions: "16\" × 20\"",
        year: 2024,
        artist: "Isabella Martinez",
        averageRating: 4.1,
        totalReviews: 6,
        availableSizes: ["12\" x 16\"", "16\" x 20\"", "20\" x 24\"", "24\" x 30\""],
        availableFrames: ["Frameless Stretch", "White Frame", "Black Frame", "Colorful Pop Frame"]
      },
      {
        id: "6",
        title: "Vintage Still Life",
        description: "Classic arrangement of fruit and pottery rendered in traditional style, showcasing technical mastery and timeless composition principles.",
        price: 1100,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: false,
        medium: "Oil on Canvas",
        dimensions: "18\" × 24\"",
        year: 2023,
        artist: "Robert Wilson",
        averageRating: 4.5,
        totalReviews: 10,
        availableSizes: ["14\" x 18\"", "18\" x 24\"", "24\" x 30\"", "30\" x 36\""],
        availableFrames: ["Frameless Stretch", "Classic Gold Frame", "Antique Silver Frame", "Traditional Wood Frame"]
      }
    ];

    samplePaintings.forEach(painting => {
      this.paintings.set(painting.id, painting);
    });

    // Sample reviews
    const sampleReviews: Review[] = [
      {
        id: "r1",
        paintingId: "1",
        customerName: "Sarah M.",
        rating: 5,
        comment: "Absolutely stunning! The colors are so vibrant and peaceful.",
        createdAt: new Date("2024-06-15")
      },
      {
        id: "r2", 
        paintingId: "1",
        customerName: "John D.",
        rating: 5,
        comment: "This painting brings such tranquility to our living room.",
        createdAt: new Date("2024-06-20")
      },
      {
        id: "r3",
        paintingId: "3",
        customerName: "Emma L.",
        rating: 5,
        comment: "The detail in this forest scene is incredible. Love it!",
        createdAt: new Date("2024-06-10")
      }
    ];

    sampleReviews.forEach(review => {
      this.reviews.set(review.id, review);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Painting methods
  async getAllPaintings(): Promise<Painting[]> {
    return Array.from(this.paintings.values());
  }

  async getPaintingById(id: string): Promise<Painting | undefined> {
    return this.paintings.get(id);
  }

  async createPainting(painting: InsertPainting): Promise<Painting> {
    const id = uuidv4();
    const newPainting: Painting = { 
      ...painting, 
      id,
      averageRating: 0,
      totalReviews: 0,
      sold: painting.sold ?? false,
      salePrice: painting.salePrice ?? null,
      medium: painting.medium ?? null,
      dimensions: painting.dimensions ?? null,
      year: painting.year ?? null,
      artist: painting.artist ?? null,
      availableSizes: painting.availableSizes || null,
      availableFrames: painting.availableFrames || null
    };
    this.paintings.set(id, newPainting);
    return newPainting;
  }

  async updatePainting(id: string, updates: Partial<Painting>): Promise<Painting | undefined> {
    const painting = this.paintings.get(id);
    if (!painting) return undefined;
    
    const updatedPainting = { ...painting, ...updates };
    this.paintings.set(id, updatedPainting);
    return updatedPainting;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const id = uuidv4();
    const newCartItem: CartItem = { 
      ...cartItem, 
      id,
      quantity: cartItem.quantity ?? 1,
      selectedSize: cartItem.selectedSize || null,
      selectedFrame: cartItem.selectedFrame || null
    };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItemQuantity(sessionId: string, paintingId: string, quantity: number): Promise<CartItem | undefined> {
    const cartEntries = Array.from(this.cartItems.entries());
    for (const [id, item] of cartEntries) {
      if (item.sessionId === sessionId && item.paintingId === paintingId) {
        const updatedItem = { ...item, quantity };
        this.cartItems.set(id, updatedItem);
        return updatedItem;
      }
    }
    return undefined;
  }

  async removeFromCart(sessionId: string, paintingId: string): Promise<boolean> {
    const cartEntries = Array.from(this.cartItems.entries());
    for (const [id, item] of cartEntries) {
      if (item.sessionId === sessionId && item.paintingId === paintingId) {
        this.cartItems.delete(id);
        return true;
      }
    }
    return false;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    let removed = false;
    const cartEntries = Array.from(this.cartItems.entries());
    for (const [id, item] of cartEntries) {
      if (item.sessionId === sessionId) {
        this.cartItems.delete(id);
        removed = true;
      }
    }
    return removed;
  }

  // Review methods
  async getReviewsByPaintingId(paintingId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.paintingId === paintingId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = uuidv4();
    const newReview: Review = { 
      ...review, 
      id, 
      createdAt: new Date(),
      comment: review.comment ?? null
    };
    this.reviews.set(id, newReview);
    
    // Update painting rating
    await this.updatePaintingRating(review.paintingId);
    
    return newReview;
  }

  async updatePaintingRating(paintingId: string): Promise<void> {
    const reviews = await this.getReviewsByPaintingId(paintingId);
    const painting = this.paintings.get(paintingId);
    
    if (!painting) return;
    
    if (reviews.length === 0) {
      painting.averageRating = 0;
      painting.totalReviews = 0;
    } else {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      painting.averageRating = Number((totalRating / reviews.length).toFixed(1));
      painting.totalReviews = reviews.length;
    }
    
    this.paintings.set(paintingId, painting);
  }

  // Wishlist methods
  async getWishlistItems(sessionId: string): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = uuidv4();
    const newWishlistItem: WishlistItem = { 
      ...wishlistItem, 
      id, 
      createdAt: new Date() 
    };
    this.wishlistItems.set(id, newWishlistItem);
    return newWishlistItem;
  }

  async removeFromWishlist(sessionId: string, paintingId: string): Promise<boolean> {
    const wishlistEntries = Array.from(this.wishlistItems.entries());
    for (const [id, item] of wishlistEntries) {
      if (item.sessionId === sessionId && item.paintingId === paintingId) {
        this.wishlistItems.delete(id);
        return true;
      }
    }
    return false;
  }

  async isInWishlist(sessionId: string, paintingId: string): Promise<boolean> {
    const wishlistValues = Array.from(this.wishlistItems.values());
    for (const item of wishlistValues) {
      if (item.sessionId === sessionId && item.paintingId === paintingId) {
        return true;
      }
    }
    return false;
  }

  // Availability notification methods
  async createAvailabilityNotification(notification: InsertAvailabilityNotification): Promise<AvailabilityNotification> {
    const id = uuidv4();
    const newNotification: AvailabilityNotification = { 
      ...notification, 
      id, 
      notified: false,
      createdAt: new Date() 
    };
    this.availabilityNotifications.set(id, newNotification);
    return newNotification;
  }

  async getNotificationsByPaintingId(paintingId: string): Promise<AvailabilityNotification[]> {
    return Array.from(this.availabilityNotifications.values()).filter(
      notification => notification.paintingId === paintingId
    );
  }

  async markNotificationsSent(paintingId: string): Promise<void> {
    const notificationEntries = Array.from(this.availabilityNotifications.entries());
    for (const [id, notification] of notificationEntries) {
      if (notification.paintingId === paintingId && !notification.notified) {
        const updatedNotification = { ...notification, notified: true };
        this.availabilityNotifications.set(id, updatedNotification);
      }
    }
  }

  // Banner methods
  async getActiveBanner(): Promise<PromoBanner | undefined> {
    const bannerValues = Array.from(this.banners.values());
    return bannerValues.find(banner => banner.isActive);
  }

  async createBanner(banner: InsertPromoBanner): Promise<PromoBanner> {
    const id = uuidv4();
    const newBanner: PromoBanner = {
      ...banner,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: banner.isActive ?? null,
      backgroundColor: banner.backgroundColor ?? null,
      textColor: banner.textColor ?? null
    };
    this.banners.set(id, newBanner);
    return newBanner;
  }

  async updateBanner(id: string, updates: Partial<PromoBanner>): Promise<PromoBanner | undefined> {
    const banner = this.banners.get(id);
    if (!banner) return undefined;
    
    const updatedBanner = { 
      ...banner, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.banners.set(id, updatedBanner);
    return updatedBanner;
  }

  async deactivateAllBanners(): Promise<void> {
    const bannerEntries = Array.from(this.banners.entries());
    for (const [id, banner] of bannerEntries) {
      const updatedBanner = { 
        ...banner, 
        isActive: false, 
        updatedAt: new Date() 
      };
      this.banners.set(id, updatedBanner);
    }
  }

  // Corporate banner methods
  async getActiveCorporateBanner(): Promise<PromoBanner | undefined> {
    const bannerEntries = Array.from(this.corporateBanners.values());
    return bannerEntries.find(banner => banner.isActive);
  }

  async createCorporateBanner(banner: InsertPromoBanner): Promise<PromoBanner> {
    const id = `corp-banner-${Date.now()}`;
    const newBanner: PromoBanner = {
      id,
      ...banner,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.corporateBanners.set(id, newBanner);
    return newBanner;
  }

  async deactivateAllCorporateBanners(): Promise<void> {
    const bannerEntries = Array.from(this.corporateBanners.entries());
    for (const [id, banner] of bannerEntries) {
      const updatedBanner = { 
        ...banner, 
        isActive: false, 
        updatedAt: new Date() 
      };
      this.corporateBanners.set(id, updatedBanner);
    }
  }

  // Corporate gift methods
  async getAllCorporateGifts(): Promise<any[]> {
    return Array.from(this.corporateGifts.values());
  }
}

export const storage = new MemStorage();