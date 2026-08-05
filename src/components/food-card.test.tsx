import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FoodCard } from "@/components/food-card";
import { useCartStore } from "@/store/cart";

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}));

describe("FoodCard", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("renders name, description, and price", () => {
    render(
      <FoodCard
        id="item-1"
        name="Paneer Butter Masala"
        description="Rich tomato gravy"
        price={249}
        imageString="/paneer.jpg"
      />,
    );

    expect(screen.getByText("Paneer Butter Masala")).toBeInTheDocument();
    expect(screen.getByText("Rich tomato gravy")).toBeInTheDocument();
    expect(screen.getByText("₹249")).toBeInTheDocument();
  });

  it("adds the item to the cart when Add is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FoodCard
        id="item-1"
        name="Paneer Butter Masala"
        description="Rich tomato gravy"
        price={249}
        imageString="/paneer.jpg"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add" }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      menuItemId: "item-1",
      name: "Paneer Butter Masala",
      price: 249,
      quantity: 1,
    });
  });
});
