import { pgTable, text, serial, real, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const paintings = pgTable("paintings", {
  id: text("id").primaryKey(),
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
});

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  paintingId: text("painting_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertPaintingSchema = createInsertSchema(paintings).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type InsertPainting = z.infer<typeof insertPaintingSchema>;
export type Painting = typeof paintings.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
