import type { ContactPayload } from "@/types/contact";
import { promises as fs } from "fs";
import { join } from "path";

export interface StoredMessage {
  referenceId: string;
  receivedAt: string;
  payload: ContactPayload;
}

export interface MessageStore {
  save(entry: StoredMessage): Promise<void>;
  get(referenceId: string): Promise<StoredMessage | undefined>;
}

export class MemoryMessageStore implements MessageStore {
  private readonly items = new Map<string, StoredMessage>();

  async save(entry: StoredMessage): Promise<void> {
    this.items.set(entry.referenceId, entry);
  }

  async get(referenceId: string): Promise<StoredMessage | undefined> {
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

  async save(entry: StoredMessage): Promise<void> {
    try {
      await fs.mkdir(this.dir, { recursive: true });
      const path = this.getPath(entry.referenceId);
      await fs.writeFile(path, JSON.stringify(entry, null, 2), "utf-8");
    } catch (error) {
      console.error(`[contact] Failed to save message ${entry.referenceId}:`, error);
      throw error;
    }
  }

  async get(referenceId: string): Promise<StoredMessage | undefined> {
    try {
      const path = this.getPath(referenceId);
      const data = await fs.readFile(path, "utf-8");
      return JSON.parse(data) as StoredMessage;
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
