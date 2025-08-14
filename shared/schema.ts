import { pgTable, text, serial, real, boolean, integer, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const paintings = pgTable("paintings", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  imageUrl: text("image_url").notNull(),
  sold: boolean("sold").default(false),
  medium: text("medium"),
  dimensions: text("dimensions"),
  year: integer("year"),
  artist: text("artist"),
  artistBio: text("artist_bio"),
  artistPhotoUrl: text("artist_photo_url"),
  artistBornYear: integer("artist_born_year"),
  artistAwards: text("artist_awards"),
  category: text("category"),
  averageRating: real("average_rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  availableSizes: text("available_sizes").array().default([]),
  availableFrames: text("available_frames").array().default([]),
});

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  paintingId: text("painting_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  selectedSize: text("selected_size"),
  selectedFrame: text("selected_frame"),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  paintingId: text("painting_id").notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  paintingId: text("painting_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const availabilityNotifications = pgTable("availability_notifications", {
  id: text("id").primaryKey(),
  paintingId: text("painting_id").notNull(),
  email: text("email").notNull(),
  notified: boolean("notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promoBanners = pgTable("promo_banners", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  isActive: boolean("is_active").default(true),
  backgroundColor: text("background_color").default("#dc2626"),
  textColor: text("text_color").default("#ffffff"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const corporateGifts = pgTable("corporate_gifts", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  imageUrl: text("image_url").notNull(),
  category: text("category").default("Corporate Gift"),
  material: text("material").default("Premium Quality"),
  minQuantity: integer("min_quantity").default(1),
  maxQuantity: integer("max_quantity").default(500),
  averageRating: real("average_rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const corporateGiftReviews = pgTable("corporate_gift_reviews", {
  id: text("id").primaryKey(),
  corporateGiftId: text("corporate_gift_id").notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const paintingsRelations = relations(paintings, ({ many }) => ({
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
  availabilityNotifications: many(availabilityNotifications),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  painting: one(paintings, {
    fields: [reviews.paintingId],
    references: [paintings.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  painting: one(paintings, {
    fields: [wishlistItems.paintingId],
    references: [paintings.id],
  }),
}));

export const availabilityNotificationsRelations = relations(availabilityNotifications, ({ one }) => ({
  painting: one(paintings, {
    fields: [availabilityNotifications.paintingId],
    references: [paintings.id],
  }),
}));

export const corporateGiftsRelations = relations(corporateGifts, ({ many }) => ({
  reviews: many(corporateGiftReviews),
}));

export const corporateGiftReviewsRelations = relations(corporateGiftReviews, ({ one }) => ({
  corporateGift: one(corporateGifts, {
    fields: [corporateGiftReviews.corporateGiftId],
    references: [corporateGifts.id],
  }),
}));

// Insert schemas
export const insertPaintingSchema = createInsertSchema(paintings).omit({
  id: true,
  averageRating: true,
  totalReviews: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

export const insertAvailabilityNotificationSchema = createInsertSchema(availabilityNotifications).omit({
  id: true,
  notified: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
});

// Types
export type InsertPainting = z.infer<typeof insertPaintingSchema>;
export type Painting = typeof paintings.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertAvailabilityNotification = z.infer<typeof insertAvailabilityNotificationSchema>;
export type AvailabilityNotification = typeof availabilityNotifications.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "admin" or "user"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Promo Banner schemas and types
export const insertPromoBannerSchema = createInsertSchema(promoBanners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPromoBanner = z.infer<typeof insertPromoBannerSchema>;
export type PromoBanner = typeof promoBanners.$inferSelect;

// Corporate Gift schemas and types
export const insertCorporateGiftSchema = createInsertSchema(corporateGifts).omit({
  id: true,
  averageRating: true,
  totalReviews: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCorporateGiftReviewSchema = createInsertSchema(corporateGiftReviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export type InsertCorporateGift = z.infer<typeof insertCorporateGiftSchema>;
export type CorporateGift = typeof corporateGifts.$inferSelect;
export type InsertCorporateGiftReview = z.infer<typeof insertCorporateGiftReviewSchema>;
export type CorporateGiftReview = typeof corporateGiftReviews.$inferSelect;

// Background images table for configurable hero backgrounds
export const backgroundImages = pgTable("background_images", {
  id: varchar("id").primaryKey().notNull(),
  section: varchar("section").notNull(), // 'gallery' or 'corporate'
  imageUrl: varchar("image_url").notNull(),
  title: varchar("title"),
  subtitle: varchar("subtitle"),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Background image schemas and types
export const insertBackgroundImageSchema = createInsertSchema(backgroundImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBackgroundImage = z.infer<typeof insertBackgroundImageSchema>;
export type BackgroundImage = typeof backgroundImages.$inferSelect;
