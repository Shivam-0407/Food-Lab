"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * Order tracking page skeleton — fill in next step
 * GET /api/orders/[id] + status UI
 */
export default function OrderPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Order placed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order ID: {params.id}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        TODO: fetch order + show status tracker
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Back to menu
      </Link>
    </div>
  );
}
