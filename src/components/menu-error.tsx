"use client";

import { Button } from "@/components/ui/button";

type MenuErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function MenuError({ message, onRetry }: MenuErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center">
      <p className="text-sm font-medium">Couldn&apos;t load the menu</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
