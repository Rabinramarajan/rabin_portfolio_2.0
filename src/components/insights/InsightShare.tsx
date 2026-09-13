"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The share row at the foot of an article.
 *
 * The three network links are plain anchors with the share URL already built
 * on the server, so they work without JavaScript and are not a tracking
 * surface — nothing is loaded from LinkedIn, X or Facebook unless the reader
 * clicks. Only "copy link" needs the client, and it degrades to a link to the
 * article itself where the clipboard API is unavailable or refused.
 */
export function InsightShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked (insecure context, or permission refused). The
         address bar already holds the URL, so there is nothing useful to say
         and an error toast would only be noise. */
    }
  }

  return (
    <div className="insd-share">
      <p className="insd-share__label">Share this article</p>
      <div className="insd-share__actions">
        <a
          className="insd-share__btn"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.06 3.76-2.06C21.2 8.64 22 10.9 22 14.06V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21h-4V9Z" />
          </svg>
        </a>
        <a
          className="insd-share__btn"
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
            <path d="M17.53 3h3.17l-6.93 7.92L21.94 21h-6.38l-5-6.54L4.83 21H1.66l7.41-8.47L2.06 3h6.54l4.52 5.98L17.53 3Zm-1.11 16.08h1.76L7.66 4.82H5.78l10.64 14.26Z" />
          </svg>
        </a>
        <a
          className="insd-share__btn"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M14 9V7.2c0-.83.34-1.2 1.2-1.2H17V3h-2.6C11.8 3 11 4.42 11 6.6V9H9v3h2v9h3v-9h2.3l.4-3H14Z" />
          </svg>
        </a>
        <button
          className="insd-share__btn"
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link to this article"}
          data-copied={copied ? "true" : undefined}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
              <path
                d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1 1M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1-1"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Announced on copy without moving focus away from the button. */}
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
