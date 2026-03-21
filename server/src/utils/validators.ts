import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, "Password is too weak"),
  phone: z.string().optional(),
  role: z.enum(["CUSTOMER", "SELLER"]).default("CUSTOMER")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const restaurantSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(20),
  address: z.string().min(10),
  city: z.string().min(2),
  categories: z.array(z.string()).min(1),
  openingHours: z.string().min(3),
  deliveryRadius: z.number().min(1).max(50),
  deliveryFee: z.number().min(0)
});

export const ownerRestaurantUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(20).optional(),
  address: z.string().min(10).optional(),
  city: z.string().min(2).optional(),
  categories: z.array(z.string()).min(1).optional(),
  openingHours: z.string().min(3).optional(),
  deliveryRadius: z.number().min(1).max(50).optional(),
  deliveryFee: z.number().min(0).optional(),
  isOpen: z.boolean().optional(),
  images: z.array(z.string()).optional()
});

export const menuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.number().int().positive(),
  category: z.string().min(2),
  image: z.string().url().optional(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  discount: z.number().int().min(0).max(100).optional()
});

export const menuItemUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.number().int().positive().optional(),
  category: z.string().min(2).optional(),
  image: z.string().url().nullable().optional(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  discount: z.number().int().min(0).max(100).optional()
});

export const orderSchema = z.object({
  restaurantId: z.string().min(1),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1),
      quantity: z.number().int().positive()
    })
  ).min(1),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  couponCode: z.string().optional(),
  deliveryAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    line1: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4)
  }),
  notes: z.string().optional()
});

export const reviewSchema = z.object({
  restaurantId: z.string().min(1),
  menuItemId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5)
});
