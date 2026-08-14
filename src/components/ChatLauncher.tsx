'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Chatbot = dynamic(() => import('@/components/Chatbot').then((m) => m.Chatbot), { ssr: false });

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="chat-launch" onClick={() => setOpen(true)}>Ask</button>
      {open ? <Chatbot onClose={() => setOpen(false)} /> : null}
    </>
  );
}
