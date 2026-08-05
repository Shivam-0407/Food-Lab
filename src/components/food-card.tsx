"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card className="overflow-hidden pt-0">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src={imageString}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-base font-semibold">{formatINR(price)}</p>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t-0 bg-transparent">
        <Button
          className="w-full"
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
      </CardFooter>
    </Card>
  );
}
