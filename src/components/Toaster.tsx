"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import { Check, CircleAlert } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "sonner-toast",
        },
      }}
      icons={{ success: <Check aria-hidden />, error: <CircleAlert aria-hidden /> }}
    />
  );
}

export { toast };