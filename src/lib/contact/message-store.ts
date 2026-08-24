import type { ContactPayload } from "@/types/contact";
import { promises as fs } from "fs";
import { join } from "path";

export interface StoredContact {
  referenceId: string;
  receivedAt: string;
  payload: ContactPayload;
  notificationStatus: "pending" | "processing" | "sent" | "failed" | "retrying";
  acknowledgementStatus: "pending" | "processing" | "sent" | "failed";
  notificationAttempts: number;
  acknowledgementAttempts: number;
  lastEmailError?: string;
  lastAttemptAt: string;
  deliveredAt?: string;
}

export interface MessageStore {
  save(entry: StoredContact): Promise<void>;
  get(referenceId: string): Promise<StoredContact | undefined>;
}

export interface MessageSummary {
  referenceId: string;
  receivedAt: string;
  notificationStatus: StoredContact["notificationStatus"];
  acknowledgementStatus: StoredContact["acknowledgementStatus"];
  lastAttemptAt: string;
}

export class MemoryMessageStore implements MessageStore {
  private readonly items = new Map<string, StoredContact>();

  async save(entry: StoredContact): Promise<void> {
    this.items.set(entry.referenceId, entry);
  }

  async get(referenceId: string): Promise<StoredContact | undefined> {
    return this.items.get(referenceId);
  }
}

export class FileMessageStore implements MessageStore {
  private readonly dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  private getPath(referenceId: string): string {
    const fileName = `${referenceId}.json`.replace(/[^a-zA-Z0-9.-]/g, "_");
    return join(this.dir, fileName);
  }

  async save(entry: StoredContact): Promise<void> {
    try {
      await fs.mkdir(this.dir, { recursive: true });
      const path = this.getPath(entry.referenceId);
      await fs.writeFile(path, JSON.stringify(entry, null, 2), "utf-8");
    } catch (error) {
      console.error(`[contact] Failed to save message ${entry.referenceId}:`, error);
      throw error;
    }
  }

  async get(referenceId: string): Promise<StoredContact | undefined> {
    try {
      const path = this.getPath(referenceId);
      const data = await fs.readFile(path, "utf-8");
      return JSON.parse(data) as StoredContact;
    } catch {
      return undefined;
    }
  }
}

export class NullMessageStore implements MessageStore {
  async save(): Promise<void> {}
  async get(): Promise<undefined> {
    return undefined;
  }
}

let memoryStore: MemoryMessageStore | undefined;

export function createMessageStore(env: NodeJS.Dict<string> = process.env): MessageStore {
  if (env.CONTACT_PERSIST === "memory") {
    memoryStore ??= new MemoryMessageStore();
    return memoryStore;
  }

  if (env.CONTACT_PERSIST === "file") {
    const dir = env.CONTACT_STORE_DIR || "./.contact-messages";
    return new FileMessageStore(dir);
  }

  return new NullMessageStore();
}