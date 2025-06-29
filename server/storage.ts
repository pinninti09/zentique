import { paintings, cartItems, type Painting, type InsertPainting, type CartItem, type InsertCartItem, type User, type InsertUser } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private paintings: Map<string, Painting>;
  private cartItems: Map<string, CartItem>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.paintings = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    
    // Add sample paintings for demonstration
    this.initializeSamplePaintings();
  }

  private initializeSamplePaintings() {
    const samplePaintings = [
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
        artist: "Elena Rodriguez"
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
        artist: "Marcus Chen"
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
        artist: "Sarah Thompson"
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
        artist: "David Kim"
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
        artist: "Isabella Martinez"
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
        artist: "Robert Anderson"
      }
    ];

    samplePaintings.forEach(painting => {
      this.paintings.set(painting.id, painting);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
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
    return Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const id = uuidv4();
    const newCartItem: CartItem = { 
      ...cartItem, 
      id,
      quantity: cartItem.quantity ?? 1
    };
    
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === cartItem.sessionId && item.paintingId === cartItem.paintingId
    );
    
    if (existingItem) {
      // Update quantity instead of adding new item
      existingItem.quantity += (cartItem.quantity ?? 1);
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }
    
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItemQuantity(sessionId: string, paintingId: string, quantity: number): Promise<CartItem | undefined> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.paintingId === paintingId
    );
    
    if (!item) return undefined;
    
    if (quantity <= 0) {
      this.cartItems.delete(item.id);
      return undefined;
    }
    
    item.quantity = quantity;
    this.cartItems.set(item.id, item);
    return item;
  }

  async removeFromCart(sessionId: string, paintingId: string): Promise<boolean> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.paintingId === paintingId
    );
    
    if (!item) return false;
    
    this.cartItems.delete(item.id);
    return true;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );
    
    itemsToDelete.forEach(item => this.cartItems.delete(item.id));
    return true;
  }
}

export const storage = new MemStorage();
