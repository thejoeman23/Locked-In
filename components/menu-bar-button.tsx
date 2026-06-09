"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button>;

export function MenuBarButton({ className, variant = "ghost", size = "sm", ...props }: Props) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "h-8 rounded-md px-3 text-xs font-medium text-foreground/80 hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
