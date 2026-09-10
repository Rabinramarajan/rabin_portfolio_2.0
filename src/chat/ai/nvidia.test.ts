import { describe, expect, it } from "vitest";
import { stripThinking } from "@/chat/ai/nvidia";

async function* from(chunks: string[]): AsyncIterable<string> {
  for (const chunk of chunks) yield chunk;
}

async function run(chunks: string[]): Promise<string> {
  let out = "";
  for await (const delta of stripThinking(from(chunks))) out += delta;
  return out;
}

describe("stripThinking", () => {
  it("passes untagged answers through unchanged", async () => {
    expect(await run(["Rabin builds ", "Angular and Next.js ", "interfaces."])).toBe(
      "Rabin builds Angular and Next.js interfaces.",
    );
  });

  it("removes a think block and keeps the answer", async () => {
    expect(await run(["<think>Let me plan this.</think>Rabin is available from June."])).toBe(
      "Rabin is available from June.",
    );
  });

  it("removes a think block split across chunk boundaries", async () => {
    expect(await run(["<thi", "nk>plan", "ning</thi", "nk>Rabin ships fast."])).toBe("Rabin ships fast.");
  });

  it("does not leak a partial tag while it is still ambiguous", async () => {
    // "<" here is real answer text, not the head of a tag.
    expect(await run(["latency < ", "200ms"])).toBe("latency < 200ms");
  });

  it("drops everything when the think block never closes", async () => {
    expect(await run(["<think>reasoning that got cut off"])).toBe("");
  });

  it("handles multiple think blocks", async () => {
    expect(await run(["<think>a</think>One. <think>b</think>Two."])).toBe("One. Two.");
  });
});
