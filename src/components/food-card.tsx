"use client";

import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

type FoodCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageString: string;
};

export function FoodCard({
  id,
  name,
  description,
  price,
  imageString,
}: FoodCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Card size="sm" className="gap-0 overflow-hidden py-0">
      <div className="relative aspect-16/10 bg-muted">
        <Image src={imageString} alt={name} fill className="object-cover" />
      </div>
      <CardHeader className="p-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <div className="flex items-center justify-between px-4 pb-4">
        <p className="font-semibold">{formatINR(price)}</p>
        <Button
          size="sm"
          onClick={() =>
            addItem({
              menuItemId: id,
              name,
              price,
              image: imageString,
            })
          }
        >
          Add
        </Button>
      </div>
    </Card>
  );
}
