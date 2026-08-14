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
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ body: 'I can only answer from the portfolio. Pick a topic below or use Contact.', choices: assistantChoices });
  const prompt = 'Answer only using this JSON. If unknown, say you do not have that fact. Never invent clients, prices, metrics or employers. Question: ' + question + ' Context: ' + JSON.stringify(approvedContext());
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
  const json = await res.json().catch(() => null);
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || 'I can only speak to published portfolio facts.';
  return NextResponse.json({ body: text, choices: assistantChoices });
}
