"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import { BotMark } from "@/components/chat/BotMark";
import { IconClose, QUICK_ICONS } from "@/components/chat/ChatIcons";
import { isStandaloneRoute } from "@/lib/chrome-routes";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * The only chat code on the critical path.
 *
 * Everything else — the panel, the transport, the markdown renderer — is
 * behind this dynamic import, so an unopened chat costs the page a button and
 * nothing more.
 */
const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow").then((m) => m.ChatWindow), {
  ssr: false,
});

/** How long the page is left alone before the preview card invites a question. */
const PREVIEW_DELAY_MS = 6000;

/** The three shortcuts the preview card offers, taken from the quick-action set. */
const PREVIEW_ACTIONS = chatConfig.quickActions.slice(0, 3);

function ChatLauncherInner() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  /** A prompt handed straight to the panel when it opens from a shortcut. */
  const [seed, setSeed] = useState<string | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setSeed(null);
    trackChat("chat_closed", {});
    // Focus returns to the control that opened the dialog.
    launcherRef.current?.focus();
  }, []);

  const openWith = useCallback((prompt: string | null) => {
    setPreview(false);
    setDismissed(true);
    setSeed(prompt);
    setOpen(true);
    trackChat("chat_opened", {});
  }, []);

  /* Phones never get the preview card unprompted.

     On a wide screen it is a small card in a corner the reader can ignore. On
     a phone it is full-width and lands over the bottom third of whatever they
     are reading — an interruption with no corner to sit in — and there is no
     "idle page" to time it against, because a phone reader is either swiping
     or gone. The launcher button is still there and still opens the panel the
     moment they want it; it just no longer speaks first. */
  const phone = useMediaQuery("(max-width: 767px)");

  // The preview card is an invitation, not an interruption: it appears once,
  // only on an idle page, and never again after it has been dismissed.
  //
  // It also waits until the hero is behind the reader, so it cannot drop over
  // the landing view's CTAs — the one thing that screen exists to offer.
  useEffect(() => {
    if (open || dismissed || phone) return;
    let timer = 0;
    const scrolledPastHero = () => window.scrollY > window.innerHeight * 0.6;

    const arm = () => {
      timer = window.setTimeout(() => {
        if (scrolledPastHero()) {
          setPreview(true);
        } else {
          window.addEventListener("scroll", onScroll, { passive: true });
        }
      }, PREVIEW_DELAY_MS);
    };
    const onScroll = () => {
      if (!scrolledPastHero()) return;
      window.removeEventListener("scroll", onScroll);
      setPreview(true);
    };

    arm();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, dismissed, phone]);

  if (!chatConfig.enabled) return null;

  return (
    <>
      {/* `phone` again, not just in the effect: a card already on screen when
          the viewport crosses the breakpoint has to go with it. */}
      {preview && !open && !phone ? (
        <div className="chat-preview" role="note">
          <button
            type="button"
            className="chat-preview__dismiss"
            aria-label="Dismiss assistant invitation"
            onClick={() => {
              setPreview(false);
              setDismissed(true);
            }}
          >
            <IconClose />
          </button>
          <span className="chat-preview__mark" aria-hidden="true">
            <BotMark />
          </span>
          <div className="chat-preview__body">
            <p className="chat-preview__greeting">Hi there! 👋</p>
            <p className="chat-preview__line">
              I&apos;m <strong>{chatConfig.name}</strong>.
              <br />
              How can I help you today?
            </p>
          </div>
          <div className="chat-preview__actions">
            {PREVIEW_ACTIONS.map((action) => {
              const Icon = QUICK_ICONS[action.icon];
              return (
                <button
                  key={action.label}
                  type="button"
                  className="chat-quick"
                  onClick={() => {
                    trackChat("quick_action_clicked", { label: action.label });
                    openWith(action.prompt);
                  }}
                >
                  <Icon className="chat-quick__icon" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        className="chat-launch"
        data-open={open ? "true" : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? `Close ${chatConfig.name}` : `Ask ${chatConfig.name} — ${chatConfig.subtitle}`}
        title={open ? undefined : `Ask ${chatConfig.name}`}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          openWith(null);
        }}
      >
        <span className="chat-launch__ring" aria-hidden="true" />
        {open ? <IconClose className="chat-launch__glyph" /> : <BotMark className="chat-launch__mark" />}
      </button>

      {open ? <ChatWindow onClose={close} seed={seed} /> : null}
    </>
  );
}

/* The maintenance screen is standalone: it ships its own header and footer, so
   the global chrome stays out of its way. */
export function ChatLauncher() {
  const pathname = usePathname();
  if (isStandaloneRoute(pathname)) return null;
  return <ChatLauncherInner />;
}
