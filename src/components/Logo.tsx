import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Brand mark — the neon "R" badge. Shipped as a pre-trimmed PNG (the glow and
 * inner rings don't survive a stroke-only redraw) sized well above its largest
 * render (46px in the footer) so it stays crisp on retina.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      aria-hidden
      width={128}
      height={128}
      priority
      className={cn("monogram", className)}
    />
  );
}

/**
 * Logo lockup — mark + wordmark. `tag` renders a small technical line beneath
 * the name (used in the footer). Color of the mark follows currentColor.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("logo", className)}>
      <span className="logo__mark">
        <Monogram />
      </span>
      {showWordmark ? (
        <span className="logo__name">
          RABIN <em>R</em>
        </span>
      ) : null}
    </span>
  );
}