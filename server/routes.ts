import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPaintingSchema, 
  insertCartItemSchema, 
  insertReviewSchema,
  insertWishlistItemSchema,
  insertAvailabilityNotificationSchema,
  insertCorporateGiftSchema,
  insertBackgroundImageSchema,
  insertUserSchema,
  loginUserSchema
} from "@shared/schema";
import { z } from "zod";
import { upload, uploadArtistPhoto, uploadCorporateGift } from "./cloudinary";

// Authentication middleware
async function requireAuth(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    
    // Check for user-based auth
    if (authHeader?.startsWith('User ')) {
      const userId = authHeader.replace('User ', '');
      const user = await storage.getUser(parseInt(userId));
      
      if (user && user.role === 'admin') {
        req.user = user;
        return next();
      }
    }
    
    return res.status(403).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication error" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for load balancers and monitoring
  app.get('/health', async (req, res) => {
    try {
      // Basic health check
      res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(503).json({ 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginUserSchema.parse(req.body);
      const user = await storage.authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Return user data without password
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash the password using the same method as storage
      const crypto = require('crypto');
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.scryptSync(userData.password, salt, 64).toString('hex');
      const hashedPassword = `${salt}:${hash}`;
      
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || 'user' // Default role is 'user'
      });

      // Return user data without password
      const { password: _, ...userResponse } = newUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Paintings routes
  app.get("/api/paintings", async (req, res) => {
    try {
      const paintings = await storage.getAllPaintings();
      res.json(paintings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch paintings" });
    }
  });

  app.get("/api/paintings/:id", async (req, res) => {
    try {
      const painting = await storage.getPaintingById(req.params.id);
      if (!painting) {
        return res.status(404).json({ error: "Painting not found" });
      }
      res.json(painting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch painting" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart item data" });
      }
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:sessionId/:paintingId", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItemQuantity(
        req.params.sessionId,
        req.params.paintingId,
        quantity
      );
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:sessionId/:paintingId", async (req, res) => {
    try {
      const removed = await storage.removeFromCart(
        req.params.sessionId,
        req.params.paintingId
      );
      if (!removed) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Reviews routes
  app.get("/api/paintings/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByPaintingId(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/paintings/:id/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        paintingId: req.params.id,
      });
      const review = await storage.createReview(reviewData);
      
      // Update painting's average rating
      await storage.updatePaintingRating(req.params.id);
      
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data" });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist/:sessionId", async (req, res) => {
    try {
      const wishlistItems = await storage.getWishlistItems(req.params.sessionId);
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistItemData = insertWishlistItemSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(wishlistItemData);
      res.json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid wishlist item data" });
      }
      res.status(500).json({ error: "Failed to add item to wishlist" });
    }
  });

  app.delete("/api/wishlist/:sessionId/:paintingId", async (req, res) => {
    try {
      const removed = await storage.removeFromWishlist(
        req.params.sessionId,
        req.params.paintingId
      );
      if (!removed) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove wishlist item" });
    }
  });

  app.get("/api/wishlist/:sessionId/:paintingId/check", async (req, res) => {
    try {
      const isInWishlist = await storage.isInWishlist(
        req.params.sessionId,
        req.params.paintingId
      );
      res.json({ isInWishlist });
    } catch (error) {
      res.status(500).json({ error: "Failed to check wishlist status" });
    }
  });

  // Availability notification routes
  app.post("/api/paintings/:id/notify", async (req, res) => {
    try {
      const notificationData = insertAvailabilityNotificationSchema.parse({
        ...req.body,
        paintingId: req.params.id,
      });
      const notification = await storage.createAvailabilityNotification(notificationData);
      res.json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid notification data" });
      }
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  // Banner routes
  app.get("/api/banner/active", async (req, res) => {
    try {
      const banner = await storage.getActiveBanner();
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active banner" });
    }
  });

  app.get("/api/corporate-banner/active", async (req, res) => {
    try {
      const banner = await storage.getActiveCorporateBanner();
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active corporate banner" });
    }
  });

  // Corporate gifts routes
  app.get("/api/corporate-gifts", async (req, res) => {
    try {
      const gifts = await storage.getAllCorporateGifts();
      res.json(gifts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch corporate gifts" });
    }
  });

  app.get("/api/corporate-gifts/:id", async (req, res) => {
    try {
      const gift = await storage.getCorporateGiftById(req.params.id);
      if (!gift) {
        return res.status(404).json({ error: "Corporate gift not found" });
      }
      res.json(gift);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch corporate gift" });
    }
  });

  // Background image routes
  app.get("/api/background/:section", async (req, res) => {
    try {
      const backgroundImage = await storage.getActiveBackgroundImage(req.params.section);
      res.json(backgroundImage);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch background image" });
    }
  });

  // Admin routes
  app.post("/api/admin/paintings", requireAuth, upload.single("imageFile"), async (req, res) => {
    try {
      // Get image URL from Cloudinary upload or use provided URL
      let imageUrl = req.body.imageUrl;
      
      if (req.file) {
        // File was uploaded to Cloudinary, use the secure URL
        imageUrl = req.file.path;
      }

      if (!imageUrl) {
        return res.status(400).json({ error: "Either imageUrl or imageFile is required" });
      }

      // Parse available sizes and frames as arrays
      const availableSizes = req.body.availableSizes ? 
        (Array.isArray(req.body.availableSizes) ? req.body.availableSizes : req.body.availableSizes.split(',')) : 
        [];
      const availableFrames = req.body.availableFrames ? 
        (Array.isArray(req.body.availableFrames) ? req.body.availableFrames : req.body.availableFrames.split(',')) : 
        [];

      const paintingData = insertPaintingSchema.parse({
        ...req.body,
        imageUrl,
        price: parseFloat(req.body.price),
        salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : undefined,
        year: req.body.year ? parseInt(req.body.year) : undefined,
        artistBornYear: req.body.artistBornYear ? parseInt(req.body.artistBornYear) : undefined,
        availableSizes,
        availableFrames,
      });
      
      const painting = await storage.createPainting(paintingData);
      res.json(painting);
    } catch (error) {
      console.error("Error creating painting:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid painting data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create painting" });
    }
  });

  // Artist photo upload route
  app.post("/api/admin/upload-artist-photo", requireAuth, uploadArtistPhoto.single("artistPhoto"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Return the Cloudinary URL for the uploaded artist photo
      res.json({ 
        url: req.file.path,
        publicId: req.file.filename
      });
    } catch (error) {
      console.error("Artist photo upload error:", error);
      res.status(500).json({ error: "Failed to upload artist photo" });
    }
  });

  app.put("/api/admin/paintings/:id/sold", requireAuth, async (req, res) => {
    try {
      const painting = await storage.updatePainting(req.params.id, { sold: true });
      
      if (!painting) {
        return res.status(404).json({ error: "Painting not found" });
      }
      
      res.json(painting);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark painting as sold" });
    }
  });

  app.put("/api/admin/paintings/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const painting = await storage.updatePainting(req.params.id, updates);
      
      if (!painting) {
        return res.status(404).json({ error: "Painting not found" });
      }
      
      res.json(painting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update painting" });
    }
  });

  app.post("/api/admin/banners", requireAuth, async (req, res) => {
    try {
      const bannerData = req.body;
      
      // Deactivate all existing banners first
      await storage.deactivateAllBanners();
      
      // Create new banner
      const banner = await storage.createBanner(bannerData);
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to create banner" });
    }
  });

  app.put("/api/admin/banners/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const banner = await storage.updateBanner(req.params.id, updates);
      
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }
      
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to update banner" });
    }
  });

  app.post("/api/admin/corporate-banners", requireAuth, async (req, res) => {
    try {
      const bannerData = req.body;
      
      // Deactivate all existing corporate banners first
      await storage.deactivateAllCorporateBanners();
      
      // Create new corporate banner
      const banner = await storage.createCorporateBanner(bannerData);
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to create corporate banner" });
    }
  });

  app.post("/api/admin/corporate-gifts", requireAuth, uploadCorporateGift.single("imageFile"), async (req, res) => {
    try {
      // Get image URL from Cloudinary upload or use provided URL
      let imageUrl = req.body.imageUrl;
      
      if (req.file) {
        // File was uploaded to Cloudinary, use the secure URL
        imageUrl = req.file.path;
      }

      if (!imageUrl) {
        return res.status(400).json({ error: "Either imageUrl or imageFile is required" });
      }

      const giftData = insertCorporateGiftSchema.parse({
        ...req.body,
        imageUrl,
        price: parseFloat(req.body.price),
        salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : undefined,
        minQuantity: req.body.minQuantity ? parseInt(req.body.minQuantity) : 1,
        maxQuantity: req.body.maxQuantity ? parseInt(req.body.maxQuantity) : 500,
      });
      
      const gift = await storage.createCorporateGift(giftData);
      res.json(gift);
    } catch (error) {
      console.error("Error creating corporate gift:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid corporate gift data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create corporate gift" });
    }
  });

  app.post("/api/admin/background-images", requireAuth, async (req, res) => {
    try {
      const backgroundData = insertBackgroundImageSchema.parse(req.body);
      
      // Deactivate all existing background images for this section
      await storage.deactivateAllBackgroundImages(backgroundData.section);
      
      // Create new background image
      const backgroundImage = await storage.createBackgroundImage(backgroundData);
      res.json(backgroundImage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid background image data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create background image" });
    }
  });

  app.put("/api/admin/background-images/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const backgroundImage = await storage.updateBackgroundImage(req.params.id, updates);
      
      if (!backgroundImage) {
        return res.status(404).json({ error: "Background image not found" });
      }
      
      res.json(backgroundImage);
    } catch (error) {
      res.status(500).json({ error: "Failed to update background image" });
    }
  });

  // Admin painting management routes
  app.put("/api/admin/paintings/:id/sold", requireAuth, async (req, res) => {
    try {
      const { sold } = req.body;
      const painting = await storage.updatePainting(req.params.id, { sold });
      
      if (!painting) {
        return res.status(404).json({ error: "Painting not found" });
      }
      
      res.json(painting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update painting status" });
    }
  });

  app.delete("/api/admin/paintings/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePainting(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Painting not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete painting" });
    }
  });

  // Admin corporate gift management routes
  app.put("/api/admin/corporate-gifts/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const gift = await storage.updateCorporateGift(req.params.id, updates);
      
      if (!gift) {
        return res.status(404).json({ error: "Corporate gift not found" });
      }
      
      res.json(gift);
    } catch (error) {
      res.status(500).json({ error: "Failed to update corporate gift" });
    }
  });

  app.delete("/api/admin/corporate-gifts/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteCorporateGift(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Corporate gift not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete corporate gift" });
    }
  });

  const server = createServer(app);
  return server;
}