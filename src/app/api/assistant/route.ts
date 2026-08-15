import { NextRequest, NextResponse } from 'next/server';
import { answerFromChoice, approvedContext, assistantChoices } from '@/lib/assistant';
import { rateLimit } from '@/lib/rate-limit';
import { clean } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  if (!rateLimit('a'+ip, 20, 10*60*1000)) return NextResponse.json({ error: 'Slow down.' }, { status: 429 });
  const body = await req.json().catch(() => null);
  const choice = clean(body?.choice, 40);
  if (choice && assistantChoices.some((c) => c.id === choice)) return NextResponse.json({ ...answerFromChoice(choice), choices: assistantChoices });
  const question = clean(body?.question, 500);
  if (!question) return NextResponse.json({ choices: assistantChoices, body: 'What are you looking for?' });

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!groqKey && !geminiKey) return NextResponse.json({ body: 'I can only answer from the portfolio. Pick a topic below or use Contact.', choices: assistantChoices });

  const system = 'Answer only using the provided JSON context about Rabin. If unknown, say you do not have that fact. Never invent clients, prices, metrics or employers. Keep answers under 80 words.';
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
