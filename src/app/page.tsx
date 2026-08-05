"use client";

import { FoodCard } from "@/components/food-card";
import { FoodCardSkeleton } from "@/components/food-card-skeleton";
import { MenuError } from "@/components/menu-error";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { MenuItem } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {
  const clearCart = useCartStore((s) => s.clearCart);
  const itemCount = useCartStore((s) => s.itemCount());

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to load menu");
        const data = await res.json();
        setMenuItems(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  async function handleRetry() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load menu");
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Foodie</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Delicious food, delivered fast
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Cart · {itemCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              disabled={itemCount === 0}
            >
              Clear
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <MenuError message={error} onRetry={handleRetry} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <FoodCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                imageString={item.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
