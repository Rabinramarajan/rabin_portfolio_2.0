import type { ContactPayload } from "@/types/contact";

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
  return new NullMessageStore();
}
