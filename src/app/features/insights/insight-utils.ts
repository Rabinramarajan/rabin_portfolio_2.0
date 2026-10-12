import { absoluteUrl } from '../../core/seo/seo.service';
import { SITE_URL, profile } from '../../data/profile';
import { insights, isPublished, publishedInsights } from '../../data/insights';
import type { Insight, InsightBlock } from '../../data/types';

/** A live article: written and past its publication date. Unpublished slugs 404. */
export function getInsight(slug: string): Insight | undefined {
  return insights.find((insight) => insight.id === slug && isPublished(insight));
}

/** Live articles, newest first. */
export function latestInsights(): Insight[] {
  return [...publishedInsights()].sort((a, b) => (b.datePublished ?? '').localeCompare(a.datePublished ?? ''));
}

/** Narrowed block shapes, so templates can switch on `kind` with full typing. */
type Retag<B> = B extends { type: infer T } ? Omit<B, 'type'> & { kind: T } : never;

export type ArticleBlock = { kind: 'paragraph'; text: string } | Retag<Exclude<InsightBlock, string>>;

export function toArticleBlocks(body: InsightBlock[] = []): ArticleBlock[] {
  return body.map((block) => {
    if (typeof block === 'string') return { kind: 'paragraph', text: block };
    if (block.type === 'code' && BRACE_LANGUAGES.has(block.language)) {
      const { type, ...rest } = block;
      return { kind: type, ...rest, code: formatBraceCode(block.code) };
    }
    const { type, ...rest } = block;
    return { kind: type, ...rest } as ArticleBlock;
  });
}

const BRACE_LANGUAGES = new Set(['typescript', 'ts', 'javascript', 'js', 'scss', 'css']);
const INDENT = '  ';

/**
 * The article content stores code samples on a single line. This re-flows
 * brace languages for display: a line break after `{`, `;` and `}` (outside
 * strings, and not for `;` inside parentheses), indented by brace depth.
 * Purely presentational; the stored content is unchanged.
 */
export function formatBraceCode(source: string): string {
  if (source.includes('\n')) return source;

  let out = '';
  let depth = 0;
  let parens = 0;
  let quote: string | null = null;

  const newline = () => {
    out = out.replace(/[ \t]+$/, '') + '\n' + INDENT.repeat(depth);
  };

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];

    if (quote) {
      out += ch;
      if (ch === '\\') out += source[++i] ?? '';
      else if (ch === quote) quote = null;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      out += ch;
    } else if (ch === '(' || ch === '[') {
      parens++;
      out += ch;
    } else if (ch === ')' || ch === ']') {
      parens = Math.max(0, parens - 1);
      out += ch;
    } else if (ch === '{') {
      // Keep empty and single-token objects like `{}` or `{ id }` inline
      const close = source.indexOf('}', i);
      const inner = close > i ? source.slice(i + 1, close) : '';
      if (close > i && !/[{;,]/.test(inner) && inner.trim().length <= 24) {
        out += source.slice(i, close + 1);
        i = close;
        continue;
      }
      depth++;
      out += ch;
      newline();
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      newline();
      out += ch;
      const next = source.slice(i + 1).trimStart()[0];
      if (next && ![')', ',', ';', ']', '.'].includes(next)) newline();
    } else if (ch === ';' && parens === 0) {
      out += ch;
      newline();
    } else if (ch === ' ' && out.endsWith('\n' + INDENT.repeat(depth))) {
      // swallow spaces after an inserted line break
    } else {
      out += ch;
    }
  }

  return out.replace(/\n\s*\n/g, '\n').trim();
}

export function insightJsonLd(insight: Insight): Record<string, unknown> {
  const url = absoluteUrl(`/insights/${insight.id}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: insight.title,
    description: insight.seoDescription ?? insight.dek,
    datePublished: insight.datePublished,
    dateModified: insight.dateModified ?? insight.datePublished,
    image: insight.cover ? absoluteUrl(insight.cover.src) : undefined,
    articleSection: insight.topic,
    inLanguage: 'en-IN',
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: profile.name, url: SITE_URL + '/' },
    publisher: { '@id': `${SITE_URL}/#person` },
  };
}
