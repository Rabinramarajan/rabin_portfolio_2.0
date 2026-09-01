"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Share a case study — copy link, LinkedIn, X. Three, not a wall.
 *
 * The copy action reports its result in an `aria-live` region rather than only
 * swapping a label, and falls back to a selectable input's `execCommand` path
 * being unavailable by simply staying silent: clipboard access is a
 * progressive enhancement, never the only way to get the URL.
 */
export function ShareCase({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked — the address bar still has the URL. */
    }
  };

  const encoded = encodeURIComponent(url);

  return (
    <div className="cshare">
      <span className="cshare__label">Share</span>
      <button type="button" className={cn("btn btn--pill", copied && "is-done")} onClick={copy}>
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        className="btn btn--pill"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        LinkedIn
      </a>
      <a
        className="btn btn--pill"
        href={`https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        X
      </a>
      <span className="sr-only" role="status">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
