import { describe, expect, it, vi, beforeEach } from "vitest";

const mockFindMany = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: {
    menuItem: {
      findMany: mockFindMany,
    },
  },
}));

import { GET } from "@/app/api/menu/route";

describe("GET /api/menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns menu items", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "1",
        name: "Paneer Butter Masala",
        description: "Rich gravy",
        price: 249,
        image: "/paneer.jpg",
        category: "Curries",
      },
    ]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Paneer Butter Masala");
  });
});
