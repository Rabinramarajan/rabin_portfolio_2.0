import { NextRequest, NextResponse } from 'next/server';
import { answerFromChoice, approvedContext, assistantChoices } from '@/lib/assistant';
import { assistantRequestSchema } from '@/lib/assistant-schema';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  if (!rateLimit('a'+ip, 60, 10*60*1000)) return NextResponse.json({ error: 'Slow down.' }, { status: 429 });

  const rawBody = await req.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ choices: assistantChoices, body: 'What are you looking for?' });
  const { choice, question } = parsed.data;

  // ---- Layer 1: guided, deterministic response — no AI call ----
  if (choice) {
    logAssistantEvent('choice', choice);
    return NextResponse.json({ ...answerFromChoice(choice), choices: assistantChoices });
  }
  if (!question) return NextResponse.json({ choices: assistantChoices, body: 'What are you looking for?' });

  // ---- Layer 3: AI fallback, grounded in Layer 2 structured context ----
  logAssistantEvent('question', question);

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!groqKey && !geminiKey) return NextResponse.json({ body: 'I can only answer from the portfolio. Pick a topic below or use Contact.', choices: assistantChoices });

  const system = 'You are a portfolio assistant for Rabin, a frontend engineer, talking to site visitors. ' +
    'Ground every claim strictly in the provided JSON context — never invent clients, metrics, employers, or a price beyond what context.pricing.plans gives. If a visitor asks a factual question with no answer in context, say you do not have that fact. ' +
    'If a visitor states a project need or intent (e.g. "I want a SaaS app", "need a website built"), do NOT treat it as an unanswerable factual question — instead briefly confirm Rabin can help based on his relevant services/projects in context, and invite them to share details via the contact form or the /pricing page. ' +
    'For pricing questions, quote the starting prices from context.pricing.plans and point to the /pricing page (write literally "/pricing") for full details. Keep answers under 80 words.';
  const context = JSON.stringify(approvedContext());

  const upstream = groqKey
    ? await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + groqKey },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          stream: true,
          messages: [
            { role: 'system', content: system + ' Context: ' + context },
            { role: 'user', content: question },
          ],
        }),
      })
    : await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=' + geminiKey,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: system + ' Question: ' + question + ' Context: ' + context }] }] }) }
      );

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ body: 'I can only speak to published portfolio facts.', choices: assistantChoices });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === '[DONE]') continue;
            try {
              const chunk = JSON.parse(payload);
              const text = groqKey ? chunk?.choices?.[0]?.delta?.content : chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) controller.enqueue(new TextEncoder().encode(text));
            } catch {
              // partial JSON line, skip
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Choices': JSON.stringify(assistantChoices) } });
}

/** Minimal server-log analytics — swap for a real sink (Vercel Analytics, etc.) if usage grows. */
function logAssistantEvent(kind: 'choice' | 'question', value: string) {
  console.log(`[assistant] ${kind}: ${value.slice(0, 120)}`);
}
