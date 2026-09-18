"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import { BotMark } from "@/components/chat/BotMark";
import { IconClose } from "@/components/chat/ChatIcons";
import { isStandaloneRoute } from "@/lib/chrome-routes";

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

function ChatLauncherInner() {
  const [open, setOpen] = useState(false);
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
    setSeed(prompt);
    setOpen(true);
    trackChat("chat_opened", {});
  }, []);

  if (!chatConfig.enabled) return null;

  return (
    <>
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
