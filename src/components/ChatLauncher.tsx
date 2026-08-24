"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
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
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    trackChat("chat_closed", {});
    // Focus returns to the control that opened the dialog.
    launcherRef.current?.focus();
  }, []);

  if (!chatConfig.enabled) return null;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="chat-launch"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? `Close ${chatConfig.name}` : `Open ${chatConfig.name}, ${chatConfig.subtitle}`}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          setOpen(true);
          trackChat("chat_opened", {});
        }}
      >
        <span className="chat-launch__pulse" aria-hidden="true" />
        <span className="chat-launch__label">{open ? "Close" : "Ask Rabin"}</span>
      </button>
      {open ? <ChatWindow onClose={close} /> : null}
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
