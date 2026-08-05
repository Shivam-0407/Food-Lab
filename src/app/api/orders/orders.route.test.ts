import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCreate,
  mockFindMany,
  mockFindUnique,
  mockUpdate,
  mockDelete,
  mockGetOrderById,
} = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockGetOrderById: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      create: mockCreate,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}));

vi.mock("@/lib/orders", () => ({
  getOrderById: mockGetOrderById,
}));

import { GET as getOrders, POST as createOrder } from "@/app/api/orders/route";
import {
  GET as getOrder,
  DELETE as deleteOrder,
} from "@/app/api/orders/[id]/route";
import { PATCH as updateStatus } from "@/app/api/orders/[id]/status/route";

const MENU_ITEM_ID = "507f1f77bcf86cd799439011";
const ORDER_ID = "507f1f77bcf86cd799439099";

const validBody = {
  customerName: "Shiva",
  customerPhone: "9876543210",
  address: "221B Baker Street",
  total: 249,
  items: [
    {
      menuItemId: MENU_ITEM_ID,
      name: "Paneer Butter Masala",
      price: 249,
      quantity: 1,
    },
  ],
};

const mockOrder = {
  id: ORDER_ID,
  ...validBody,
  status: "RECEIVED",
  apartment: null,
  items: [
    {
      id: "507f1f77bcf86cd799439088",
      orderId: ORDER_ID,
      ...validBody.items[0],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function jsonRequest(url: string, method: string, body?: unknown) {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("Orders API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/orders (Create)", () => {
    it("creates an order and returns 201", async () => {
      mockCreate.mockResolvedValue(mockOrder);

      const res = await createOrder(
        jsonRequest("http://localhost/api/orders", "POST", validBody),
      );
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.id).toBe(ORDER_ID);
      expect(mockCreate).toHaveBeenCalledOnce();
    });

    it("returns 400 for invalid input", async () => {
      const res = await createOrder(
        jsonRequest("http://localhost/api/orders", "POST", {
          ...validBody,
          customerPhone: "123",
        }),
      );

      expect(res.status).toBe(400);
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/orders (Read list)", () => {
    it("returns all orders", async () => {
      mockFindMany.mockResolvedValue([mockOrder]);

      const res = await getOrders();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledOnce();
    });
  });

  describe("GET /api/orders/[id] (Read one)", () => {
    it("returns an order by id", async () => {
      mockGetOrderById.mockResolvedValue(mockOrder);

      const res = await getOrder(new Request("http://localhost"), {
        params: Promise.resolve({ id: ORDER_ID }),
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe(ORDER_ID);
    });

    it("returns 404 when order is missing", async () => {
      mockGetOrderById.mockResolvedValue(null);

      const res = await getOrder(new Request("http://localhost"), {
        params: Promise.resolve({ id: ORDER_ID }),
      });

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/orders/[id]/status (Update)", () => {
    it("updates order status", async () => {
      mockFindUnique.mockResolvedValue(mockOrder);
      mockUpdate.mockResolvedValue({ ...mockOrder, status: "PREPARING" });

      const res = await updateStatus(
        jsonRequest("http://localhost", "PATCH", { status: "PREPARING" }),
        { params: Promise.resolve({ id: ORDER_ID }) },
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe("PREPARING");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: ORDER_ID },
          data: { status: "PREPARING" },
        }),
      );
    });

    it("returns 400 for invalid status", async () => {
      const res = await updateStatus(
        jsonRequest("http://localhost", "PATCH", { status: "CANCELLED" }),
        { params: Promise.resolve({ id: ORDER_ID }) },
      );

      expect(res.status).toBe(400);
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 404 when order is missing", async () => {
      mockFindUnique.mockResolvedValue(null);

      const res = await updateStatus(
        jsonRequest("http://localhost", "PATCH", { status: "PREPARING" }),
        { params: Promise.resolve({ id: ORDER_ID }) },
      );

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/orders/[id] (Delete)", () => {
    it("deletes an order", async () => {
      mockFindUnique.mockResolvedValue(mockOrder);
      mockDelete.mockResolvedValue(mockOrder);

      const res = await deleteOrder(new Request("http://localhost"), {
        params: Promise.resolve({ id: ORDER_ID }),
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe("Order deleted");
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: ORDER_ID } });
    });

    it("returns 404 when order is missing", async () => {
      mockFindUnique.mockResolvedValue(null);

      const res = await deleteOrder(new Request("http://localhost"), {
        params: Promise.resolve({ id: ORDER_ID }),
      });

      expect(res.status).toBe(404);
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
