import { 
  paintings, 
  cartItems, 
  reviews,
  wishlistItems,
  availabilityNotifications,
  promoBanners,
  corporateGifts,
  corporateGiftReviews,
  backgroundImages,
  users,
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
  type InsertCorporateGift,
  type CorporateGiftReview,
  type InsertCorporateGiftReview,
  type BackgroundImage,
  type InsertBackgroundImage
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import * as crypto from 'crypto';

// Password hashing utilities
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashToVerify;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
  // Painting methods
  getAllPaintings(): Promise<Painting[]>;
  getPaintingById(id: string): Promise<Painting | undefined>;
  createPainting(painting: InsertPainting): Promise<Painting>;
  updatePainting(id: string, updates: Partial<Painting>): Promise<Painting | undefined>;
  deletePainting(id: string): Promise<boolean>;
  
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
  updateCorporateGift(id: string, updates: Partial<CorporateGift>): Promise<CorporateGift | undefined>;
  deleteCorporateGift(id: string): Promise<boolean>;

  // Corporate gift review methods
  getReviewsByCorporateGiftId(corporateGiftId: string): Promise<CorporateGiftReview[]>;
  createCorporateGiftReview(review: InsertCorporateGiftReview): Promise<CorporateGiftReview>;
  updateCorporateGiftRating(corporateGiftId: string): Promise<void>;

  // Background image methods
  getActiveBackgroundImage(section: string): Promise<BackgroundImage | undefined>;
  createBackgroundImage(image: InsertBackgroundImage): Promise<BackgroundImage>;
  updateBackgroundImage(id: string, updates: Partial<BackgroundImage>): Promise<BackgroundImage | undefined>;
  deactivateAllBackgroundImages(section: string): Promise<void>;
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

    // No sample paintings - using real data only

    // No sample reviews - using real data only
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
  constructor() {
    // Initialize default admin users
    this.initializeDefaultUsers();
  }

  private async initializeDefaultUsers(): Promise<void> {
    try {
      // Check if admin users already exist
      const yogeshUser = await this.getUserByUsername('yogesh');
      const gayatriUser = await this.getUserByUsername('gayatri');

      if (!yogeshUser) {
        await this.createUser({
          username: 'yogesh',
          password: hashPassword('pinninti09'),
          role: 'admin'
        });
        console.log('Created default admin user: yogesh');
      }

      if (!gayatriUser) {
        await this.createUser({
          username: 'gayatri', 
          password: hashPassword('pinninti09'),
          role: 'admin'
        });
        console.log('Created default admin user: gayatri');
      }
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values(user).returning();
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByUsername(username);
      if (user && verifyPassword(password, user.password)) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  // Painting methods - using database
  async getAllPaintings(): Promise<Painting[]> {
    try {
      const result = await db.select().from(paintings);
      return result;
    } catch (error) {
      console.error('Error fetching paintings from database:', error);
      return [];
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
      const paintingWithId = {
        id: uuidv4(),
        ...painting
      };
      const [newPainting] = await db.insert(paintings).values(paintingWithId).returning();
      return newPainting;
    } catch (error) {
      console.error('Error creating painting:', error);
      throw error;
    }
  }

  private async initializeSamplePaintings(): Promise<void> {
    const samplePaintings = this.getSamplePaintings();
    
    for (const painting of samplePaintings) {
      try {
        const paintingWithId = {
          id: uuidv4(),
          ...painting
        };
        await db.insert(paintings).values(paintingWithId);
      } catch (error) {
        console.error('Error inserting sample painting:', error);
      }
    }
  }

  async updatePainting(id: string, updates: Partial<Painting>): Promise<Painting | undefined> {
    try {
      console.log(`Storage: Updating painting ${id} with updates:`, updates);
      const [updatedPainting] = await db
        .update(paintings)
        .set(updates)
        .where(eq(paintings.id, id))
        .returning();
      console.log(`Storage: Updated painting result:`, updatedPainting?.sold);
      return updatedPainting;
    } catch (error) {
      console.error('Error updating painting:', error);
      return undefined;
    }
  }

  async deletePainting(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(paintings)
        .where(eq(paintings.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting painting:', error);
      return false;
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
    try {
      const result = await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
      return result;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    try {
      // Check if item already exists in cart
      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(and(
          eq(cartItems.sessionId, cartItem.sessionId),
          eq(cartItems.paintingId, cartItem.paintingId)
        ));

      if (existingItem) {
        // Update quantity if item exists
        const [updatedItem] = await db
          .update(cartItems)
          .set({ 
            quantity: existingItem.quantity + (cartItem.quantity || 1)
          })
          .where(eq(cartItems.id, existingItem.id))
          .returning();
        return updatedItem;
      } else {
        // Add new item
        const cartData = {
          ...cartItem,
          id: crypto.randomUUID()
        };
        const [newCartItem] = await db
          .insert(cartItems)
          .values(cartData)
          .returning();
        return newCartItem;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItemQuantity(sessionId: string, paintingId: string, quantity: number): Promise<CartItem | undefined> {
    try {
      const [updatedItem] = await db
        .update(cartItems)
        .set({ 
          quantity: quantity
        })
        .where(and(
          eq(cartItems.sessionId, sessionId),
          eq(cartItems.paintingId, paintingId)
        ))
        .returning();
      return updatedItem;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return undefined;
    }
  }

  async removeFromCart(sessionId: string, paintingId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.sessionId, sessionId),
          eq(cartItems.paintingId, paintingId)
        ));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  async clearCart(sessionId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(cartItems)
        .where(eq(cartItems.sessionId, sessionId));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Review methods
  async getReviewsByPaintingId(paintingId: string): Promise<Review[]> {
    try {
      const result = await db.select().from(reviews).where(eq(reviews.paintingId, paintingId));
      return result;
    } catch (error) {
      console.error('Error fetching reviews by painting id:', error);
      return [];
    }
  }

  async createReview(review: InsertReview): Promise<Review> {
    try {
      const reviewData = {
        ...review,
        id: crypto.randomUUID(),
        createdAt: new Date()
      };
      const [newReview] = await db
        .insert(reviews)
        .values(reviewData)
        .returning();
      
      // Update painting rating after creating review
      await this.updatePaintingRating(review.paintingId);
      
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async updatePaintingRating(paintingId: string): Promise<void> {
    try {
      // Get all reviews for this painting
      const paintingReviews = await db.select().from(reviews).where(eq(reviews.paintingId, paintingId));
      
      if (paintingReviews.length === 0) {
        // No reviews, set defaults
        await db
          .update(paintings)
          .set({ 
            averageRating: 0, 
            totalReviews: 0,
            updatedAt: new Date() 
          })
          .where(eq(paintings.id, paintingId));
        return;
      }

      // Calculate average rating
      const totalRating = paintingReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / paintingReviews.length;

      // Update painting with new rating and review count
      await db
        .update(paintings)
        .set({ 
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalReviews: paintingReviews.length,
          updatedAt: new Date() 
        })
        .where(eq(paintings.id, paintingId));
    } catch (error) {
      console.error('Error updating painting rating:', error);
    }
  }

  // Corporate gift review methods
  async getReviewsByCorporateGiftId(corporateGiftId: string): Promise<CorporateGiftReview[]> {
    try {
      const result = await db.select().from(corporateGiftReviews).where(eq(corporateGiftReviews.corporateGiftId, corporateGiftId));
      return result;
    } catch (error) {
      console.error('Error fetching reviews by corporate gift id:', error);
      return [];
    }
  }

  async createCorporateGiftReview(review: InsertCorporateGiftReview): Promise<CorporateGiftReview> {
    try {
      const reviewData = {
        ...review,
        id: crypto.randomUUID(),
        createdAt: new Date()
      };
      const [newReview] = await db
        .insert(corporateGiftReviews)
        .values(reviewData)
        .returning();
      
      // Update corporate gift rating after creating review
      await this.updateCorporateGiftRating(review.corporateGiftId);
      
      return newReview;
    } catch (error) {
      console.error('Error creating corporate gift review:', error);
      throw error;
    }
  }

  async updateCorporateGiftRating(corporateGiftId: string): Promise<void> {
    try {
      // Get all reviews for this corporate gift
      const giftReviews = await db.select().from(corporateGiftReviews).where(eq(corporateGiftReviews.corporateGiftId, corporateGiftId));
      
      if (giftReviews.length === 0) {
        // No reviews, set defaults
        await db
          .update(corporateGifts)
          .set({ 
            averageRating: 0, 
            totalReviews: 0,
            updatedAt: new Date() 
          })
          .where(eq(corporateGifts.id, corporateGiftId));
        return;
      }

      // Calculate average rating
      const totalRating = giftReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / giftReviews.length;

      // Update corporate gift with new rating and review count
      await db
        .update(corporateGifts)
        .set({ 
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalReviews: giftReviews.length,
          updatedAt: new Date() 
        })
        .where(eq(corporateGifts.id, corporateGiftId));
    } catch (error) {
      console.error('Error updating corporate gift rating:', error);
    }
  }

  // Wishlist methods
  async getWishlistItems(sessionId: string): Promise<WishlistItem[]> {
    try {
      const result = await db.select().from(wishlistItems).where(eq(wishlistItems.sessionId, sessionId));
      return result;
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      return [];
    }
  }

  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    try {
      const wishlistData = {
        ...wishlistItem,
        id: crypto.randomUUID()
      };
      const [newWishlistItem] = await db
        .insert(wishlistItems)
        .values(wishlistData)
        .returning();
      return newWishlistItem;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(sessionId: string, paintingId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(wishlistItems)
        .where(and(
          eq(wishlistItems.sessionId, sessionId),
          eq(wishlistItems.paintingId, paintingId)
        ));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  async isInWishlist(sessionId: string, paintingId: string): Promise<boolean> {
    try {
      const [item] = await db
        .select()
        .from(wishlistItems)
        .where(and(
          eq(wishlistItems.sessionId, sessionId),
          eq(wishlistItems.paintingId, paintingId)
        ));
      return !!item;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  // Availability notification methods
  async createAvailabilityNotification(notification: InsertAvailabilityNotification): Promise<AvailabilityNotification> {
    try {
      const notificationData = {
        ...notification,
        id: crypto.randomUUID()
      };
      const [newNotification] = await db
        .insert(availabilityNotifications)
        .values(notificationData)
        .returning();
      return newNotification;
    } catch (error) {
      console.error('Error creating availability notification:', error);
      throw error;
    }
  }

  async getNotificationsByPaintingId(paintingId: string): Promise<AvailabilityNotification[]> {
    try {
      const result = await db
        .select()
        .from(availabilityNotifications)
        .where(eq(availabilityNotifications.paintingId, paintingId));
      return result;
    } catch (error) {
      console.error('Error fetching notifications by painting id:', error);
      return [];
    }
  }

  async markNotificationsSent(paintingId: string): Promise<void> {
    try {
      await db
        .update(availabilityNotifications)
        .set({ notified: true })
        .where(eq(availabilityNotifications.paintingId, paintingId));
    } catch (error) {
      console.error('Error marking notifications as sent:', error);
    }
  }

  // Banner methods
  async getActiveBanner(): Promise<PromoBanner | undefined> {
    try {
      const result = await db
        .select()
        .from(promoBanners)
        .where(eq(promoBanners.isActive, true))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching active banner:', error);
      return undefined;
    }
  }

  async createBanner(banner: InsertPromoBanner): Promise<PromoBanner> {
    try {
      const bannerData = {
        ...banner,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const [newBanner] = await db
        .insert(promoBanners)
        .values(bannerData)
        .returning();
      return newBanner;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  }

  async updateBanner(id: string, updates: Partial<PromoBanner>): Promise<PromoBanner | undefined> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      const [updatedBanner] = await db
        .update(promoBanners)
        .set(updateData)
        .where(eq(promoBanners.id, id))
        .returning();
      return updatedBanner;
    } catch (error) {
      console.error('Error updating banner:', error);
      return undefined;
    }
  }

  async deactivateAllBanners(): Promise<void> {
    try {
      await db
        .update(promoBanners)
        .set({ 
          isActive: false, 
          updatedAt: new Date() 
        });
    } catch (error) {
      console.error('Error deactivating all banners:', error);
      throw error;
    }
  }

  // Corporate banner methods
  async getActiveCorporateBanner(): Promise<PromoBanner | undefined> {
    try {
      const result = await db.select()
        .from(promoBanners)
        .where(and(
          eq(promoBanners.isActive, true),
          sql`${promoBanners.id} LIKE 'corp-banner-%'`
        ))
        .limit(1);
      
      if (result.length > 0) {
        return result[0];
      }
      
      // Fallback to default if no active corporate banner found
      return {
        id: "corporate-2024",
        text: "🎁 Corporate Gifting: Strengthen workplace relationships with meaningful gifts that show you value your team",
        isActive: true,
        backgroundColor: "#059669",
        textColor: "#f0fdf4",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error fetching active corporate banner:', error);
      // Return fallback banner on error
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
  }

  async createCorporateBanner(banner: InsertPromoBanner): Promise<PromoBanner> {
    try {
      const id = `corp-banner-${Date.now()}`;
      const newBanner = {
        id,
        text: banner.text,
        isActive: true,
        backgroundColor: banner.backgroundColor || "#059669",
        textColor: banner.textColor || "#f0fdf4",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [result] = await db.insert(promoBanners).values(newBanner).returning();
      return result;
    } catch (error) {
      console.error('Error creating corporate banner:', error);
      throw error;
    }
  }

  async deactivateAllCorporateBanners(): Promise<void> {
    try {
      await db.update(promoBanners)
        .set({ 
          isActive: false, 
          updatedAt: new Date() 
        })
        .where(sql`${promoBanners.id} LIKE 'corp-banner-%'`);
    } catch (error) {
      console.error('Error deactivating corporate banners:', error);
      throw error;
    }
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

  async updateCorporateGift(id: string, updates: Partial<CorporateGift>): Promise<CorporateGift | undefined> {
    try {
      const [updatedGift] = await db
        .update(corporateGifts)
        .set(updates)
        .where(eq(corporateGifts.id, id))
        .returning();
      return updatedGift;
    } catch (error) {
      console.error('Error updating corporate gift:', error);
      return undefined;
    }
  }

  async deleteCorporateGift(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(corporateGifts)
        .where(eq(corporateGifts.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting corporate gift:', error);
      return false;
    }
  }

  // Background image methods
  async getActiveBackgroundImage(section: string): Promise<BackgroundImage | undefined> {
    try {
      const [backgroundImage] = await db
        .select()
        .from(backgroundImages)
        .where(and(eq(backgroundImages.section, section), eq(backgroundImages.isActive, true)));
      return backgroundImage;
    } catch (error) {
      console.error('Error fetching active background image:', error);
      return undefined;
    }
  }

  async createBackgroundImage(image: InsertBackgroundImage): Promise<BackgroundImage> {
    try {
      const imageWithId = {
        id: uuidv4(),
        ...image
      };
      const [newImage] = await db.insert(backgroundImages).values(imageWithId).returning();
      return newImage;
    } catch (error) {
      console.error('Error creating background image:', error);
      throw error;
    }
  }

  async updateBackgroundImage(id: string, updates: Partial<BackgroundImage>): Promise<BackgroundImage | undefined> {
    try {
      const [updated] = await db
        .update(backgroundImages)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(backgroundImages.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating background image:', error);
      return undefined;
    }
  }

  async deactivateAllBackgroundImages(section: string): Promise<void> {
    try {
      await db
        .update(backgroundImages)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(backgroundImages.section, section));
    } catch (error) {
      console.error('Error deactivating background images:', error);
    }
  }
}

// Use DatabaseStorage instead of MemStorage for painting persistence
export const storage = new DatabaseStorage();