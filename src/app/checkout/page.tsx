"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatINR } from "@/lib/utils";
import { createOrderSchema, type CreateOrderInput } from "@/lib/orders.input";
import { useCartStore } from "@/store/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      address: "",
      apartment: "",
      total: subtotal,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    },
  });

  async function onSubmit(values: CreateOrderInput) {
    setError(null);

    try {
      const { data: order } = await axios.post("/api/orders", {
        ...values,
        apartment: values.apartment || undefined,
      });

      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Failed to place order");
      } else {
        setError("Something went wrong");
      }
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your cart is empty</p>
        <Link href="/" className="mt-6 inline-block text-sm underline">
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter delivery details to place your order
      </p>

      <ul className="mt-6 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex justify-between gap-4">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatINR(item.price * item.quantity)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>{formatINR(subtotal)}</span>
        </li>
      </ul>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Placing order..."
              : `Place Order · ${formatINR(subtotal)}`}
          </Button>
        </form>
      </Form>
    </div>
  );
}
