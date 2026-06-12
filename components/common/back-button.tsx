"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton({ ...props }: React.ComponentProps<typeof Button>) {
  const router = useRouter();

  return (
    <Button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      variant="outline"
      size="icon"
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
