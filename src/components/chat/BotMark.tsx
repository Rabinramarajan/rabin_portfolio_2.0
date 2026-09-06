/**
 * The assistant's face.
 *
 * One rendered badge — the neon robot with the R monogram — used at every size
 * the widget needs: the launcher, the preview card, the panel header and the
 * transcript avatar. The artwork carries its own ring and glow, so the frames
 * around it stay borderless and let the mark be the whole shape.
 *
 * Served from `public/` rather than through `media()`: the asset is registered
 * in the manifest as `other/chatbot/mark.png`, but until `npm run blob:migrate`
 * uploads it the CDN has no such object, and a 404 leaves the widget faceless.
 * Swap this for `media("other/chatbot/mark.png")` once it is on the store.
 *
 * Points at `mark-256.webp`, not the 1254px `1.png` source it was derived from.
 * The mark never renders above 128 CSS px, so the original was shipping 1.5 MB
 * to paint a 128px badge on every page — the single largest image on the site.
 * Regenerate with `node scripts/optimize-media.js` if the artwork changes.
 */
export function BotMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size chrome inside an on-demand overlay; already sized to its display box, so the optimizer would add a request without shrinking the bytes
    <img
      className={className ? `chat-mark ${className}` : "chat-mark"}
      src="/media/chatbot/mark-256.webp"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={128}
      height={128}
      draggable={false}
    />
  );
}
