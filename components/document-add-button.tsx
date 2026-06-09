"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button> & {
  icon: React.ReactNode;
};

export function DocumentAddButton({ icon, className, children, ...props }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn("h-8 rounded-md px-3 text-xs font-medium shadow-xs whitespace-nowrap", className)}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}
