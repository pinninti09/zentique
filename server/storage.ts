import { 
  paintings, 
  cartItems, 
  reviews,
  wishlistItems,
  availabilityNotifications,
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
  type InsertAvailabilityNotification
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private paintings: Map<string, Painting>;
  private cartItems: Map<string, CartItem>;
  private reviews: Map<string, Review>;
  private wishlistItems: Map<string, WishlistItem>;
  private availabilityNotifications: Map<string, AvailabilityNotification>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.paintings = new Map();
    this.cartItems = new Map();
    this.reviews = new Map();
    this.wishlistItems = new Map();
    this.availabilityNotifications = new Map();
    this.currentUserId = 1;
    
    this.initializeSampleData();
  }

  private initializeSampleData() {
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
        totalReviews: 12
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
        totalReviews: 8
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
        totalReviews: 15
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
        totalReviews: 22
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
        totalReviews: 6
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
        totalReviews: 10
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
      artist: painting.artist ?? null
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
      quantity: cartItem.quantity ?? 1
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
}

export const storage = new MemStorage();