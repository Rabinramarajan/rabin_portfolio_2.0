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
 */
export function BotMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size chrome inside an on-demand overlay; the optimizer adds a request without changing what ships
    <img
      className={className ? `chat-mark ${className}` : "chat-mark"}
      src="/media/chatbot/1.png"
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
