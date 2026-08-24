import type { ContactPayload } from "@/types/contact";
import { promises as fs } from "fs";
import { isAbsolute, join, resolve } from "path";

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

/** Most recent messages kept in memory before the oldest are dropped. */
const MEMORY_STORE_LIMIT = 200;

export class MemoryMessageStore implements MessageStore {
  private readonly items = new Map<string, StoredContact>();

  async save(entry: StoredContact): Promise<void> {
    // Re-insert so the map stays ordered oldest-first for eviction.
    this.items.delete(entry.referenceId);
    this.items.set(entry.referenceId, entry);

    while (this.items.size > MEMORY_STORE_LIMIT) {
      const oldest = this.items.keys().next().value;
      if (oldest === undefined) break;
      this.items.delete(oldest);
    }
  }

  async get(referenceId: string): Promise<StoredContact | undefined> {
    return this.items.get(referenceId);
  }
}

export class FileMessageStore implements MessageStore {
  private readonly dir: string;
  private readonly fallback = new MemoryMessageStore();
  private useFallback = false;

  constructor(dir: string) {
    // Resolve relative dirs up front: the server process cwd is not guaranteed
    // to be the project root (and may not exist at all in a bundled runtime).
    this.dir = isAbsolute(dir) ? dir : resolve(process.cwd(), dir);
  }

  private getPath(referenceId: string): string {
    const fileName = `${referenceId}.json`.replace(/[^a-zA-Z0-9.-]/g, "_");
    return join(this.dir, fileName);
  }

  async save(entry: StoredContact): Promise<void> {
    await this.fallback.save(entry);

    if (this.useFallback) return;

    try {
      await fs.mkdir(this.dir, { recursive: true });
      const path = this.getPath(entry.referenceId);
      await fs.writeFile(path, JSON.stringify(entry, null, 2), "utf-8");
    } catch (error) {
      // A read-only or unavailable filesystem must not fail the request: the
      // message is already held in memory and the emails still go out.
      this.useFallback = true;
      console.error(
        `[contact] Disk persistence unavailable (${this.dir}); falling back to in-memory store:`,
        error,
      );
    }
  }

  async get(referenceId: string): Promise<StoredContact | undefined> {
    try {
      const path = this.getPath(referenceId);
      const data = await fs.readFile(path, "utf-8");
      return JSON.parse(data) as StoredContact;
    } catch {
      return this.fallback.get(referenceId);
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
const fileStores = new Map<string, FileMessageStore>();

export function createMessageStore(env: NodeJS.Dict<string> = process.env): MessageStore {
  if (env.CONTACT_PERSIST === "memory") {
    memoryStore ??= new MemoryMessageStore();
    return memoryStore;
  }

  if (env.CONTACT_PERSIST === "file") {
    // On Vercel the function filesystem is read-only apart from /tmp, and /tmp
    // is per-instance and ephemeral — a file store there would fail on every
    // write (or silently lose the file). Emails are the real delivery channel,
    // so keep an in-memory record for the lifetime of the request instead.
    if (env.VERCEL) {
      memoryStore ??= new MemoryMessageStore();
      return memoryStore;
    }

    const dir = env.CONTACT_STORE_DIR || "./.contact-messages";
    let store = fileStores.get(dir);
    if (!store) {
      store = new FileMessageStore(dir);
      fileStores.set(dir, store);
    }
    return store;
  }

  return new NullMessageStore();
}