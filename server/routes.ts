import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPaintingSchema, 
  insertCartItemSchema, 
  insertReviewSchema,
  insertWishlistItemSchema,
  insertAvailabilityNotificationSchema 
} from "@shared/schema";
import { z } from "zod";
import { upload, uploadArtistPhoto } from "./cloudinary";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "secure-admin-token";

export async function registerRoutes(app: Express): Promise<Server> {
  // Public painting routes
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

  // Corporate gifts routes
  app.get("/api/corporate-gifts", async (req, res) => {
    try {
      const corporateGifts = await storage.getAllCorporateGifts();
      res.json(corporateGifts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch corporate gifts" });
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
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
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
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(
        req.params.sessionId,
        req.params.paintingId,
        quantity
      );
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:sessionId/:paintingId", async (req, res) => {
    try {
      const success = await storage.removeFromCart(
        req.params.sessionId,
        req.params.paintingId
      );
      
      if (!success) {
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

  // Review routes
  app.get("/api/paintings/:paintingId/reviews", async (req, res) => {
    try {
      const { paintingId } = req.params;
      const reviews = await storage.getReviewsByPaintingId(paintingId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/paintings/:paintingId/reviews", async (req, res) => {
    try {
      const { paintingId } = req.params;
      const reviewData = insertReviewSchema.parse({ ...req.body, paintingId });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  // Wishlist routes
  app.get("/api/wishlist/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const wishlistItems = await storage.getWishlistItems(sessionId);
      res.json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistData = insertWishlistItemSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(wishlistData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid wishlist data", errors: error.errors });
      } else {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Failed to add to wishlist" });
      }
    }
  });

  app.delete("/api/wishlist/:sessionId/:paintingId", async (req, res) => {
    try {
      const { sessionId, paintingId } = req.params;
      const removed = await storage.removeFromWishlist(sessionId, paintingId);
      
      if (removed) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Wishlist item not found" });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get("/api/wishlist/:sessionId/:paintingId/check", async (req, res) => {
    try {
      const { sessionId, paintingId } = req.params;
      const isInWishlist = await storage.isInWishlist(sessionId, paintingId);
      res.json({ isInWishlist });
    } catch (error) {
      console.error("Error checking wishlist:", error);
      res.status(500).json({ message: "Failed to check wishlist" });
    }
  });

  // Availability notification routes
  app.post("/api/paintings/:paintingId/notify", async (req, res) => {
    try {
      const { paintingId } = req.params;
      const notificationData = insertAvailabilityNotificationSchema.parse({ 
        ...req.body, 
        paintingId 
      });
      const notification = await storage.createAvailabilityNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      } else {
        console.error("Error creating notification:", error);
        res.status(500).json({ message: "Failed to create notification" });
      }
    }
  });

  // Banner routes
  app.get('/api/banner/active', async (req, res) => {
    try {
      const banner = await storage.getActiveBanner();
      if (!banner) {
        return res.status(404).json({ message: 'No active banner found' });
      }
      res.json(banner);
    } catch (error) {
      console.error('Error fetching active banner:', error);
      res.status(500).json({ message: 'Failed to fetch banner' });
    }
  });

  app.get('/api/corporate-banner/active', async (req, res) => {
    try {
      const banner = await storage.getActiveCorporateBanner();
      if (!banner) {
        return res.status(404).json({ message: 'No active corporate banner found' });
      }
      res.json(banner);
    } catch (error) {
      console.error('Error fetching active corporate banner:', error);
      res.status(500).json({ message: 'Failed to fetch corporate banner' });
    }
  });

  // Admin routes
  app.post("/api/admin/paintings", upload.single("imageFile"), async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Get image URL from Cloudinary upload or use provided URL
      let imageUrl = req.body.imageUrl;
      
      if (req.file) {
        // File was uploaded to Cloudinary, use the secure URL
        imageUrl = (req.file as any).path;
      }

      if (!imageUrl) {
        return res.status(400).json({ error: "Image is required (either upload file or provide URL)" });
      }

      const paintingData = {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null,
        imageUrl: imageUrl,
        sold: false,
        medium: req.body.medium || "Oil on Canvas",
        dimensions: req.body.dimensions || "24\" × 36\"",
        year: req.body.year ? parseInt(req.body.year) : new Date().getFullYear(),
        artist: req.body.artist || "Unknown Artist",
        artistBio: req.body.artistBio,
        artistPhotoUrl: req.body.artistPhotoUrl,
        artistBornYear: req.body.artistBornYear ? parseInt(req.body.artistBornYear) : null,
        artistAwards: req.body.artistAwards,
        availableSizes: req.body.availableSizes ? JSON.parse(req.body.availableSizes) : [],
        availableFrames: req.body.availableFrames ? JSON.parse(req.body.availableFrames) : []
      };

      const validatedData = insertPaintingSchema.parse(paintingData);
      const painting = await storage.createPainting(validatedData);
      
      res.json(painting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid painting data", details: error.errors });
      }
      console.error("Error creating painting:", error);
      res.status(500).json({ error: "Failed to create painting" });
    }
  });

  // Artist photo upload route
  app.post("/api/admin/upload-artist-photo", uploadArtistPhoto.single("artistPhoto"), async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Return the Cloudinary URL
      res.json({ 
        imageUrl: (req.file as any).path,
        publicId: (req.file as any).filename
      });
    } catch (error) {
      console.error("Error uploading artist photo:", error);
      res.status(500).json({ error: "Failed to upload artist photo" });
    }
  });

  app.put("/api/admin/paintings/:id/sold", async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const painting = await storage.updatePainting(req.params.id, { sold: true });
      
      if (!painting) {
        return res.status(404).json({ error: "Painting not found" });
      }
      
      res.json(painting);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark painting as sold" });
    }
  });

  app.put("/api/admin/paintings/:id", async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

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

  // Admin banner management routes
  app.post('/api/admin/banner', async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Deactivate all existing banners first
      await storage.deactivateAllBanners();
      
      // Create new banner
      const bannerData = {
        text: req.body.text,
        isActive: true,
        backgroundColor: req.body.backgroundColor || "#dc2626",
        textColor: req.body.textColor || "#ffffff"
      };

      const newBanner = await storage.createBanner(bannerData);
      res.status(201).json(newBanner);
    } catch (error) {
      console.error('Error creating banner:', error);
      res.status(500).json({ message: 'Failed to create banner' });
    }
  });

  app.put('/api/admin/banner/:id', async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updates = {
        text: req.body.text,
        isActive: req.body.isActive,
        backgroundColor: req.body.backgroundColor,
        textColor: req.body.textColor
      };

      const updatedBanner = await storage.updateBanner(req.params.id, updates);
      if (!updatedBanner) {
        return res.status(404).json({ message: 'Banner not found' });
      }
      
      res.json(updatedBanner);
    } catch (error) {
      console.error('Error updating banner:', error);
      res.status(500).json({ message: 'Failed to update banner' });
    }
  });

  // Corporate banner management routes
  app.post('/api/admin/corporate-banner', async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Deactivate all existing corporate banners first
      await storage.deactivateAllCorporateBanners();
      
      // Create new corporate banner
      const bannerData = {
        text: req.body.text,
        isActive: true,
        backgroundColor: req.body.backgroundColor || "#1e40af",
        textColor: req.body.textColor || "#ffffff"
      };

      const newBanner = await storage.createCorporateBanner(bannerData);
      res.status(201).json(newBanner);
    } catch (error) {
      console.error('Error creating corporate banner:', error);
      res.status(500).json({ message: 'Failed to create corporate banner' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
