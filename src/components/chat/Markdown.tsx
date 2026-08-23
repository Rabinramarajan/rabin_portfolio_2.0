import { Fragment, type ReactNode } from "react";

/**
 * A deliberately tiny markdown renderer.
 *
 * It builds React elements directly — there is no `dangerouslySetInnerHTML`
 * anywhere in the chat UI, so model output can never inject markup. Only the
 * subset the assistant is told to emit is supported: bold, inline code,
 * bullets and simple tables. Anything else renders as plain text.
 */

type Block =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "list"; items: string[] }
  | { kind: "table"; header: string[]; rows: string[][] };

const isListItem = (line: string) => /^\s*[-*•]\s+/.test(line);
const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableDivider = (line: string) => /^\s*\|[\s:|-]+\|\s*$/.test(line);

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (isTableRow(line) && isTableDivider(lines[index + 1] ?? "")) {
      const header = cells(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      blocks.push({ kind: "table", header, rows });
      continue;
    }

    if (isListItem(line)) {
      const items: string[] = [];
      while (index < lines.length && isListItem(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*•]\s+/, ""));
        index += 1;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !isListItem(lines[index]) && !isTableRow(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ kind: "paragraph", lines: paragraph });
  }

  return blocks;
}

/** Splits a line into bold / inline-code / text runs. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const id = `${keyPrefix}-${key++}`;

    if (token.startsWith("**")) {
      nodes.push(<strong key={id}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={id}>{token.slice(1, -1)}</code>);
    } else {
      nodes.push(<em key={id}>{token.slice(1, -1)}</em>);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <>
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;

        if (block.kind === "list") {
          return (
            <ul key={key} className="chat-md__list">
              {block.items.map((item, i) => (
                <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.kind === "table") {
          return (
            <div key={key} className="chat-md__table-wrap">
              <table className="chat-md__table">
                <thead>
                  <tr>
                    {block.header.map((cell, i) => (
                      <th key={`${key}-h-${i}`}>{renderInline(cell, `${key}-h-${i}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={`${key}-r-${r}`}>
                      {row.map((cell, c) => (
                        <td key={`${key}-r-${r}-${c}`}>{renderInline(cell, `${key}-r-${r}-${c}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={key} className="chat-md__p">
            {block.lines.map((line, i) => (
              <Fragment key={`${key}-${i}`}>
                {i > 0 ? <br /> : null}
                {renderInline(line, `${key}-${i}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
