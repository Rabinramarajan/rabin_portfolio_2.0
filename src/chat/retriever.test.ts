import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { detectEntities, detectIntent, emptyEntities } from "@/chat/intent";
import { knowledgeBase } from "@/chat/knowledge";
import { JsonRetriever, retrieveContext } from "@/chat/retriever";

const retriever = new JsonRetriever();

describe("knowledgeBase", () => {
  it("covers every record type the assistant answers from", () => {
    const types = new Set(knowledgeBase().map((record) => record.type));
    for (const expected of [
      "profile",
      "service",
      "project",
      "experience",
      "skills",
      "process",
      "faq",
      "availability",
      "resume",
      "contact",
      "engagement",
      "insight",
    ]) {
      expect(types.has(expected as never), `missing ${expected}`).toBe(true);
    }
  });

  it("builds one record per published project and service", () => {
    expect(retriever.findByType("project")).toHaveLength(projects.length);
    expect(retriever.findByType("service")).toHaveLength(services.length);
  });

  it("points every project record at its real case-study route", () => {
    for (const record of retriever.findByType("project")) {
      expect(record.url).toBe(`/work/${record.slug}`);
      expect(projects.some((project) => project.slug === record.slug)).toBe(true);
    }
  });

  it("has unique ids", () => {
    const ids = knowledgeBase().map((record) => record.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("retrieval", () => {
  it("pins the named project above everything else", () => {
    const question = "Tell me about Fiji Immigration";
    const records = retrieveContext(question, "PROJECT", detectEntities(question));
    expect(records[0].id).toBe("project-fiji-immigration-internal");
  });

  it("returns both projects for a comparison", () => {
    const question = "Compare PRIMS and VNPF";
    const records = retrieveContext(question, "COMPARE", detectEntities(question));
    const ids = records.map((record) => record.id);
    expect(ids).toContain("project-prims-member-portal");
    expect(ids).toContain("project-vnpf-blo-mi");
  });

  it("finds availability for a hiring question", () => {
    const question = "Is Rabin available for freelance work?";
    const { intent, entities } = detectIntent(question);
    const records = retrieveContext(question, intent, entities);
    expect(records.some((record) => record.type === "availability")).toBe(true);
  });

  it("finds the contact record for a contact question", () => {
    const question = "How can I contact Rabin?";
    const { intent, entities } = detectIntent(question);
    const records = retrieveContext(question, intent, entities);
    expect(records.some((record) => record.id === "contact")).toBe(true);
  });

  it("finds the resume record", () => {
    const question = "Show me his resume";
    const { intent, entities } = detectIntent(question);
    const records = retrieveContext(question, intent, entities);
    expect(records.some((record) => record.id === "resume")).toBe(true);
  });

  it("retrieves Angular projects for an Angular technology question", () => {
    const question = "Which projects use Angular?";
    const { intent, entities } = detectIntent(question);
    const records = retrieveContext(question, intent, entities);
    const projectRecords = records.filter((record) => record.type === "project");
    expect(projectRecords.length).toBeGreaterThan(0);
    for (const record of projectRecords) {
      const project = projects.find((p) => p.slug === record.slug);
      expect(project?.technologies).toContain("Angular");
    }
  });

  it("tolerates a typo in a technology name", () => {
    const records = retriever.search("angualr skills", { limit: 5 });
    expect(records.length).toBeGreaterThan(0);
  });

  it("returns nothing for a question the portfolio cannot answer", () => {
    const records = retriever.search("quantum blockchain sommelier certification", {
      types: ["profile", "experience"],
      entities: emptyEntities(),
    });
    expect(records).toHaveLength(0);
  });

  it("finds records by id and by type", () => {
    expect(retriever.findById("contact")?.type).toBe("contact");
    expect(retriever.findById("nope")).toBeUndefined();
    expect(retriever.findByType("availability").length).toBeGreaterThan(0);
  });
});
