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
 * Points at `mark-128.webp`, not the 1254px `1.png` source it was derived from.
 * The mark never renders above 64 CSS px — .chat-launch is 64px and every other
 * surface is smaller — so the original was shipping 1.5 MB to paint a 64px badge
 * on every page, the single largest image on the site. 128px covers 2x displays.
 * Regenerate with `node scripts/optimize-media.js` if the artwork changes.
 *
 * Loaded eagerly at high priority, which looks wrong for a decorative badge
 * until you measure it: on mobile this 64px mark IS the LCP element. The hero
 * behind it contributes no LCP candidate — the poster fades to opacity 0 once
 * the reel binds, which disqualifies it, and the headline is painted with
 * `-webkit-text-fill-color: transparent` for its gradient, so it is not
 * counted as a text paint either. That leaves the launcher as the largest
 * thing Chrome will score, and `loading="lazy"` was deferring it until after
 * layout, costing ~400ms of resource load delay on Slow 4G. It is 7 KB.
 */
export function BotMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size chrome inside an on-demand overlay; already sized to its display box, so the optimizer would add a request without shrinking the bytes
    <img
      className={className ? `chat-mark ${className}` : "chat-mark"}
      src="/media/chatbot/mark-128.webp"
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      decoding="async"
      width={128}
      height={128}
      draggable={false}
    />
  );
}
