import { 
  paintings, 
  cartItems, 
  reviews,
  wishlistItems,
  availabilityNotifications,
  promoBanners,
  corporateGifts,
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
  type InsertPromoBanner,
  type CorporateGift,
  type InsertCorporateGift
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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
  getAllCorporateGifts(): Promise<CorporateGift[]>;
  getCorporateGiftById(id: string): Promise<CorporateGift | undefined>;
  createCorporateGift(gift: InsertCorporateGift): Promise<CorporateGift>;
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
        artistBio: "Elena Rodriguez is a contemporary landscape artist known for her vibrant seascapes and mastery of light. Born in Barcelona, she spent her childhood summers on the Mediterranean coast, which deeply influenced her artistic vision. She studied at the Royal Academy of Fine Arts and has been painting professionally for over 15 years.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        artistBornYear: 1985,
        artistAwards: "Winner of the International Seascape Competition 2022, Featured in Contemporary Art Magazine's '30 Under 40' Artists, First Place at the Barcelona Art Festival 2021",
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
        artistBio: "Marcus Chen is an urban contemporary artist who finds beauty in the intersection of architecture and human life. His work captures the dynamic energy of city living through bold compositions and innovative use of light. He holds an MFA from the San Francisco Art Institute and has exhibited in galleries across the West Coast.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        artistBornYear: 1988,
        artistAwards: "Emerging Artist Award at the San Francisco Art Fair 2023, Featured in Urban Arts Quarterly Magazine, Grant recipient from the California Arts Council 2022",
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
        artistBio: "Sarah Thompson is a nature-focused artist who specializes in capturing the spiritual essence of natural landscapes. Growing up in the Pacific Northwest, she developed a deep connection with old-growth forests and wilderness areas. Her work is characterized by masterful use of light and shadow to create atmospheric depth.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        artistBornYear: 1982,
        artistAwards: "National Park Service Artist-in-Residence 2020, Winner of the Wilderness Art Foundation Award 2021, Featured in Nature Art Magazine's Annual Exhibition",
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
        artistBio: "David Kim is a landscape artist renowned for his dramatic mountain scenes and mastery of atmospheric perspective. Born in Colorado, he has spent years hiking and studying the Rocky Mountains, bringing authentic knowledge of high-altitude environments to his work. His paintings capture both the grandeur and intimacy of mountain landscapes.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        artistBornYear: 1980,
        artistAwards: "Rocky Mountain Art Association Gold Medal 2023, Colorado State Arts Council Fellowship 2021, Best Landscape at the Denver Art Museum Annual Show 2022",
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
        artistBio: "Isabella Martinez is a contemporary abstract artist known for her bold use of color and dynamic compositions. She studied at the Art Institute of Chicago and has been exploring the intersection of emotion and abstract expression for over a decade. Her work is inspired by music, movement, and the energy of urban life.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        artistBornYear: 1990,
        artistAwards: "Chicago Abstract Art Prize 2023, Emerging Artist Fellowship at the Contemporary Art Museum 2022, Featured in Modern Art Quarterly's Rising Stars Issue",
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
        artistBio: "Robert Wilson is a classical realist artist specializing in traditional still life compositions. Trained at the Florence Academy of Art, he brings centuries-old techniques to contemporary subjects. His work demonstrates exceptional technical skill in capturing light, texture, and form through meticulous observation and traditional oil painting methods.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        artistBornYear: 1975,
        artistAwards: "Classical Realism Society Excellence Award 2022, Florence Academy Alumni Exhibition First Place 2021, Traditional Arts Magazine Featured Artist 2023",
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

export class DatabaseStorage implements IStorage {
  // User methods - keeping same as MemStorage for now
  async getUser(id: number): Promise<User | undefined> {
    // Implementation can be added later if needed
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Implementation can be added later if needed
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Implementation can be added later if needed
    throw new Error("User creation not implemented");
  }

  // Painting methods - using database
  async getAllPaintings(): Promise<Painting[]> {
    try {
      const result = await db.select().from(paintings);
      return result;
    } catch (error) {
      console.error('Error fetching paintings from database:', error);
      // Fallback to sample data if database is empty
      return this.getSamplePaintings();
    }
  }

  async getPaintingById(id: string): Promise<Painting | undefined> {
    try {
      const [painting] = await db.select().from(paintings).where(eq(paintings.id, id));
      return painting;
    } catch (error) {
      console.error('Error fetching painting by id:', error);
      return undefined;
    }
  }

  async createPainting(painting: InsertPainting): Promise<Painting> {
    try {
      const [newPainting] = await db.insert(paintings).values(painting).returning();
      return newPainting;
    } catch (error) {
      console.error('Error creating painting:', error);
      throw error;
    }
  }

  async updatePainting(id: string, updates: Partial<Painting>): Promise<Painting | undefined> {
    try {
      const [updatedPainting] = await db
        .update(paintings)
        .set(updates)
        .where(eq(paintings.id, id))
        .returning();
      return updatedPainting;
    } catch (error) {
      console.error('Error updating painting:', error);
      return undefined;
    }
  }

  private getSamplePaintings(): Painting[] {
    return [
      {
        id: "1",
        title: "Sunset Over the Ocean",
        description: "A breathtaking view of the sun setting over calm ocean waters, painted with vibrant oranges and purples.",
        price: 299,
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        category: "Landscape",
        material: "Oil on Canvas",
        year: "2023",
        artist: "Marina Solberg",
        artistBio: "Marina Solberg is a contemporary landscape artist known for her luminous seascapes and atmospheric paintings. Born in Norway, she draws inspiration from the dramatic coastlines and changing light of the Nordic landscape.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b606?w=400&h=400&fit=crop&crop=face",
        artistBornYear: "1985",
        artistAwards: "Winner of the International Seascape Art Competition 2022, Featured in Coastal Living Magazine",
        availableSizes: ["16\" x 20\"", "20\" x 24\"", "24\" x 30\""],
        availableFrames: ["Frameless Stretch", "Black Wood Frame", "White Wood Frame"],
        averageRating: 4.8,
        reviewCount: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2", 
        title: "Mountain Reflection",
        description: "Majestic mountain peaks reflected in a pristine alpine lake, capturing the serenity of untouched wilderness.",
        price: 425,
        salePrice: 340,
        imageUrl: "https://images.unsplash.com/photo-1464822759844-d150066c5c3c?w=800&h=600&fit=crop",
        category: "Landscape",
        material: "Acrylic on Canvas",
        year: "2023",
        artist: "James Chen",
        artistBio: "James Chen is a nature photographer turned painter who specializes in capturing the grandeur of mountain landscapes. His work reflects his passion for wilderness conservation and outdoor adventure.",
        artistPhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        artistBornYear: "1978",
        artistAwards: "National Geographic Nature Artist of the Year 2021, Sierra Club Art Award Winner",
        availableSizes: ["20\" x 24\"", "24\" x 30\"", "30\" x 40\""],
        availableFrames: ["Black Wood Frame", "Natural Wood Frame", "Gallery Float Frame"],
        averageRating: 4.9,
        reviewCount: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add more sample paintings as needed...
    ];
  }

  // Keep other methods as in-memory for now (cart, reviews, etc.)
  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    // For now, keep cart in memory - can be moved to database later
    return [];
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Implementation needed
    throw new Error("Cart functionality not implemented in DatabaseStorage");
  }

  async updateCartItemQuantity(sessionId: string, paintingId: string, quantity: number): Promise<CartItem | undefined> {
    return undefined;
  }

  async removeFromCart(sessionId: string, paintingId: string): Promise<boolean> {
    return false;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    return false;
  }

  // Review methods
  async getReviewsByPaintingId(paintingId: string): Promise<Review[]> {
    return [];
  }

  async createReview(review: InsertReview): Promise<Review> {
    throw new Error("Review functionality not implemented in DatabaseStorage");
  }

  async updatePaintingRating(paintingId: string): Promise<void> {
    // Implementation needed
  }

  // Wishlist methods
  async getWishlistItems(sessionId: string): Promise<WishlistItem[]> {
    return [];
  }

  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    throw new Error("Wishlist functionality not implemented in DatabaseStorage");
  }

  async removeFromWishlist(sessionId: string, paintingId: string): Promise<boolean> {
    return false;
  }

  async isInWishlist(sessionId: string, paintingId: string): Promise<boolean> {
    return false;
  }

  // Availability notification methods
  async createAvailabilityNotification(notification: InsertAvailabilityNotification): Promise<AvailabilityNotification> {
    throw new Error("Availability notifications not implemented in DatabaseStorage");
  }

  async getNotificationsByPaintingId(paintingId: string): Promise<AvailabilityNotification[]> {
    return [];
  }

  async markNotificationsSent(paintingId: string): Promise<void> {
    // Implementation needed
  }

  // Banner methods
  async getActiveBanner(): Promise<PromoBanner | undefined> {
    return {
      id: "july4-2024",
      text: "🇺🇸 July 4th Special: 25% OFF All Paintings! Use code JULY4 - Free Shipping on Orders Over $200",
      isActive: true,
      backgroundColor: "#1e40af",
      textColor: "#f8fafc",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async createBanner(banner: InsertPromoBanner): Promise<PromoBanner> {
    throw new Error("Banner creation not implemented in DatabaseStorage");
  }

  async updateBanner(id: string, updates: Partial<PromoBanner>): Promise<PromoBanner | undefined> {
    return undefined;
  }

  async deactivateAllBanners(): Promise<void> {
    // Implementation needed
  }

  // Corporate banner methods
  async getActiveCorporateBanner(): Promise<PromoBanner | undefined> {
    return {
      id: "corporate-2024",
      text: "🎁 Corporate Gifting: Strengthen workplace relationships with meaningful gifts that show you value your team",
      isActive: true,
      backgroundColor: "#059669",
      textColor: "#f0fdf4",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async createCorporateBanner(banner: InsertPromoBanner): Promise<PromoBanner> {
    throw new Error("Corporate banner creation not implemented in DatabaseStorage");
  }

  async deactivateAllCorporateBanners(): Promise<void> {
    // Implementation needed
  }

  // Corporate gift methods - using database
  async getAllCorporateGifts(): Promise<CorporateGift[]> {
    try {
      const result = await db.select().from(corporateGifts);
      if (result.length === 0) {
        // Return sample data if database is empty
        return [
          {
            id: "corp-1",
            title: "Premium Coffee Mug",
            description: "High-quality ceramic mug perfect for corporate branding",
            price: 24.99,
            salePrice: null,
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
            category: "Drinkware",
            material: "Ceramic",
            minQuantity: 25,
            maxQuantity: 500,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }
      return result;
    } catch (error) {
      console.error('Error fetching corporate gifts from database:', error);
      return [];
    }
  }

  async getCorporateGiftById(id: string): Promise<CorporateGift | undefined> {
    try {
      const [gift] = await db.select().from(corporateGifts).where(eq(corporateGifts.id, id));
      return gift;
    } catch (error) {
      console.error('Error fetching corporate gift by id:', error);
      return undefined;
    }
  }

  async createCorporateGift(gift: InsertCorporateGift): Promise<CorporateGift> {
    try {
      const giftWithId = {
        id: uuidv4(),
        ...gift
      };
      const [newGift] = await db.insert(corporateGifts).values(giftWithId).returning();
      return newGift;
    } catch (error) {
      console.error('Error creating corporate gift:', error);
      throw error;
    }
  }
}

// Use DatabaseStorage instead of MemStorage for painting persistence
export const storage = new DatabaseStorage();