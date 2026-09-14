"use client";

import { Toaster as SonnerToaster } from "sonner";
import { Check, CircleAlert } from "lucide-react";

export function ToasterSurface() {
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

