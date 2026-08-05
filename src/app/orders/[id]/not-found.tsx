import Link from "next/link";

export default function OrderNotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Order not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&apos;t find that order.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Back to menu
      </Link>
    </div>
  );
}
