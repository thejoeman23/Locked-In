"use client"

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    return null;
  }

  return (
    <Button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      variant="outline"
      size="icon"
      className="absolute top-4 left-4"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
