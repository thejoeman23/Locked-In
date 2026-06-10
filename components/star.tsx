"use client"

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StarButton({ filled, className, ...props }: { filled: boolean } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "h-9 w-9 rounded-full border-0 bg-transparent px-0 text-current shadow-none hover:text-yellow-700",
        filled && "text-yellow-700",
        className
      )}
      {...props}
    >
      <Star className={cn("size-4", filled && "fill-current")} />
    </Button>
  );
}
