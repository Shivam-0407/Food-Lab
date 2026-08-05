import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  apartment: z.string().optional(),
  total: z.number().nonnegative(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        name: z.string().min(1),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Cart cannot be empty"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
