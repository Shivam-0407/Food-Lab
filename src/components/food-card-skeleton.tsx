import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function FoodCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <CardHeader className="gap-2">
        <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent">
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
      </CardFooter>
    </Card>
  );
}
