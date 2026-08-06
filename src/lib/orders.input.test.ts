import { describe, expect, it } from "vitest";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "@/lib/orders.input";

const validOrder = {
  customerName: "Shiva",
  customerPhone: "9876543210",
  address: "221B Baker Street",
  apartment: "Apt 2",
  items: [
    {
      menuItemId: "507f1f77bcf86cd799439011",
      quantity: 1,
    },
    {
      menuItemId: "507f1f77bcf86cd799439012",
      quantity: 2,
    },
  ],
};

describe("createOrderSchema", () => {
  it("accepts a valid order payload", () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      customerPhone: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty cart", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects short customer name", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      customerName: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing address", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      address: "x",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateOrderStatusSchema", () => {
  it("accepts valid statuses", () => {
    for (const status of [
      "RECEIVED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ]) {
      expect(updateOrderStatusSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const result = updateOrderStatusSchema.safeParse({ status: "CANCELLED" });
    expect(result.success).toBe(false);
  });
});
