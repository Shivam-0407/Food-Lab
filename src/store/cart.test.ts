import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/store/cart";

const sampleItem = {
  menuItemId: "item-1",
  name: "Paneer Butter Masala",
  price: 249,
  image: "/paneer.jpg",
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("adds a new item to the cart", () => {
    useCartStore.getState().addItem(sampleItem);

    const { items, itemCount, subtotal } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(itemCount()).toBe(1);
    expect(subtotal()).toBe(249);
  });

  it("increments quantity when adding the same item", () => {
    const { addItem } = useCartStore.getState();
    addItem(sampleItem);
    addItem(sampleItem);

    expect(useCartStore.getState().items[0].quantity).toBe(2);
    expect(useCartStore.getState().subtotal()).toBe(498);
  });

  it("updates quantity and removes item at quantity 0", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().updateQuantity("item-1", 3);
    expect(useCartStore.getState().items[0].quantity).toBe(3);

    useCartStore.getState().updateQuantity("item-1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removes an item from the cart", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().removeItem("item-1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
