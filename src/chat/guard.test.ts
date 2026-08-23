import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { buildActions, buildProjectCards, buildSources, buildSuggestions } from "@/chat/actions";
import { deterministicAnswer, REDIRECT_MESSAGE, REFUSAL_MESSAGE } from "@/chat/fallback";
import { containsLeak, sanitizeOutput, validateAnswer } from "@/chat/guard";
import { detectEntities, detectIntent, emptyEntities } from "@/chat/intent";
import { knowledgeBase } from "@/chat/knowledge";
import { buildContextBlock, buildMessages, systemPrompt } from "@/chat/prompt";
import { retrieveContext } from "@/chat/retriever";

describe("output guard", () => {
  it("strips HTML so model output can never inject markup", () => {
    expect(sanitizeOutput("Hello <script>alert(1)</script> world")).toBe("Hello alert(1) world");
    expect(sanitizeOutput("<img src=x onerror=y>Angular")).toBe("Angular");
  });

  it("redacts anything shaped like a credential", () => {
    expect(sanitizeOutput("key is sk-abcdef0123456789abcd")).toContain("[redacted]");
    expect(sanitizeOutput("set GROQ_API_KEY now")).toContain("[redacted]");
    expect(sanitizeOutput("read process.env.SECRET")).toContain("[redacted]");
  });

  it("removes model-authored links, since navigation is delivered as actions", () => {
    expect(sanitizeOutput("See [the case study](https://example.com/x) here")).toBe("See the case study here");
    expect(sanitizeOutput("Visit https://evil.example.com now").trim()).toBe("Visit  now".trim());
  });

  it("rejects an answer that echoes its own instructions", () => {
    expect(containsLeak("My instructions say to only use the context")).toBe(true);
    expect(validateAnswer("You are Ask Rabin, the official portfolio assistant")).toBeNull();
    expect(validateAnswer("CONTEXT (the only facts you may use): ...")).toBeNull();
  });

  it("passes a normal grounded answer through unchanged", () => {
    const answer = "Angular is Rabin's primary frontend stack, alongside TypeScript and RxJS.";
    expect(validateAnswer(answer)).toBe(answer);
  });

  it("rejects an empty answer", () => {
    expect(validateAnswer("   ")).toBeNull();
  });
});

describe("system prompt", () => {
  const prompt = systemPrompt();

  it("carries behaviour rules but no portfolio facts", () => {
    expect(prompt).toContain("Answer ONLY from the CONTEXT");
    expect(prompt).toContain("I don't have verified information");
    // No fact from the content layer may be hard-coded into the prompt: that
    // is what would let the assistant drift away from the website.
    expect(prompt).not.toContain(profile.email);
    expect(prompt).not.toContain(profile.phone);
    expect(prompt).not.toContain(profile.yearsExperienceLabel);
    for (const project of projects) {
      expect(prompt).not.toContain(project.title);
    }
  });

  it("puts the retrieved records, and only those, into the context block", () => {
    const records = retrieveContext("Tell me about PRIMS", "PROJECT", detectEntities("Tell me about PRIMS"));
    const block = buildContextBlock(records);
    expect(block).toContain("CONTEXT");
    expect(block).toContain("PRIMS");
  });

  it("says so explicitly when there is nothing to ground an answer in", () => {
    expect(buildContextBlock([])).toContain("no matching portfolio records");
  });

  it("bounds replayed history", () => {
    const history = Array.from({ length: 30 }, (_, i) => ({ role: "user" as const, content: `turn ${i}` }));
    const messages = buildMessages("hello", knowledgeBase().slice(0, 2), history, "PROFILE");
    expect(messages.length).toBeLessThanOrEqual(9);
  });
});

describe("deterministic answers", () => {
  it("refuses secret extraction without echoing the request", () => {
    expect(deterministicAnswer("INJECTION", emptyEntities(), [])).toBe(REFUSAL_MESSAGE);
  });

  it("redirects off-topic requests to what it can actually do", () => {
    expect(deterministicAnswer("OFF_TOPIC", emptyEntities(), [])).toBe(REDIRECT_MESSAGE);
  });

  it("answers a technology question only from published technologies", () => {
    const yes = deterministicAnswer("TECHNOLOGY", detectEntities("Does he work with Ionic?"), []);
    expect(yes).toContain("Ionic");

    const unknown = deterministicAnswer(
      "TECHNOLOGY",
      { ...emptyEntities(), technologies: ["COBOL"] },
      [],
    );
    expect(unknown).toContain("don't have verified information");
  });

  it("builds a comparison table from real project data", () => {
    const answer = deterministicAnswer("COMPARE", detectEntities("Compare PRIMS and VNPF"), []);
    expect(answer).toContain("| Project |");
    expect(answer.split("\n").length).toBeGreaterThan(3);
  });

  it("never claims availability the content layer does not state", () => {
    const answer = deterministicAnswer("AVAILABILITY", emptyEntities(), []);
    expect(answer).toContain(profile.availability.label);
  });
});

describe("actions", () => {
  it("links a single named project straight to its case study", () => {
    const question = "Tell me about Fiji Immigration";
    const entities = detectEntities(question);
    const records = retrieveContext(question, "PROJECT", entities);
    const actions = buildActions("PROJECT", entities, records);
    expect(actions[0]).toMatchObject({
      label: "View Case Study",
      href: "/work/fiji-immigration-internal",
    });
  });

  it("offers the lead flow on hiring intent", () => {
    const actions = buildActions("LEAD", emptyEntities(), []);
    expect(actions.some((action) => action.type === "lead")).toBe(true);
  });

  it("points the resume action at the canonical resume path", () => {
    const actions = buildActions("RESUME", emptyEntities(), []);
    expect(actions.some((action) => action.href === profile.resumePath)).toBe(true);
  });

  it("caps actions at three and suggestions at three", () => {
    for (const intent of ["PROJECT", "AVAILABILITY", "CONTACT", "SERVICE"] as const) {
      expect(buildActions(intent, emptyEntities(), []).length).toBeLessThanOrEqual(3);
      expect(buildSuggestions(intent).length).toBeLessThanOrEqual(3);
    }
  });

  it("only ever emits internal hrefs that exist as routes", () => {
    const seen = new Set<string>();
    for (const intent of ["PROFILE", "PROJECT", "SKILLS", "RESUME", "CONTACT", "ENGAGEMENT", "INSIGHTS"] as const) {
      for (const action of buildActions(intent, emptyEntities(), [])) seen.add(action.href);
    }
    for (const href of seen) expect(href.startsWith("/")).toBe(true);
  });

  it("derives sources and project cards from the retrieved records", () => {
    const question = "Show me his projects";
    const { intent, entities } = detectIntent(question);
    const records = retrieveContext(question, intent, entities);
    expect(buildSources(records).length).toBeGreaterThan(0);

    const cards = buildProjectCards(records);
    for (const card of cards) {
      expect(projects.some((project) => project.slug === card.slug)).toBe(true);
      expect(card.url).toBe(`/work/${card.slug}`);
    }
  });
});
