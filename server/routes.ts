import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaintingSchema, insertCartItemSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage() });
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

  // Admin routes
  app.post("/api/admin/paintings", upload.single("imageFile"), async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const paintingData = {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null,
        imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        sold: false,
        medium: req.body.medium || "Oil on Canvas",
        dimensions: req.body.dimensions || "24\" × 36\"",
        year: req.body.year ? parseInt(req.body.year) : new Date().getFullYear(),
        artist: req.body.artist || "Unknown Artist"
      };

      const validatedData = insertPaintingSchema.parse(paintingData);
      const painting = await storage.createPainting(validatedData);
      
      res.json(painting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid painting data" });
      }
      res.status(500).json({ error: "Failed to create painting" });
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

  const httpServer = createServer(app);
  return httpServer;
}
