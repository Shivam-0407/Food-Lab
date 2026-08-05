import { Card, CardHeader } from "@/components/ui/card";

export function FoodCardSkeleton() {
  return (
    <Card size="sm" className="gap-0 overflow-hidden py-0">
      <div className="aspect-16/10 animate-pulse bg-muted" />
      <CardHeader className="gap-2 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="h-5 w-14 animate-pulse rounded-md bg-muted" />
        <div className="h-7 w-14 animate-pulse rounded-md bg-muted" />
      </div>
    </Card>
  );
}
