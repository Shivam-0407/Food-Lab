import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { RefreshOrderButton } from "@/components/refresh-order-button";
import { Progress } from "@/components/ui/progress";
import { getOrderById } from "@/lib/orders";

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "RECEIVED", label: "Order Received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const activeIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const progressValue = ((activeIndex + 1) / STATUS_STEPS.length) * 100;
  const currentLabel = STATUS_STEPS[activeIndex]?.label ?? order.status;

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Order tracking</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Order ID: {order.id}
          </p>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <RefreshOrderButton />
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{currentLabel}</span>
          <span className="text-muted-foreground">
            Step {activeIndex + 1} of {STATUS_STEPS.length}
          </span>
        </div>
        <Progress value={progressValue} />
        <ol className="space-y-2 text-sm">
          {STATUS_STEPS.map((step, index) => (
            <li
              key={step.key}
              className={
                index <= activeIndex
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              {index + 1}. {step.label}
            </li>
          ))}
        </ol>
      </div>

      <Link href="/" className="mt-8 inline-block text-sm underline">
        Back to menu
      </Link>
    </div>
  );
}
