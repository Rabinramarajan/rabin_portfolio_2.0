import { DestroyRef, afterNextRender, inject } from '@angular/core';
import { CONTACT_LIMITS, ContactMessage } from '../../../core/contact/contact.model';

/** The slice of the WebMCP draft API used here (W3C Web Machine Learning CG draft). */
interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean; consequentialHint?: boolean; untrustedContentHint?: boolean };
  execute(input: Record<string, unknown>): Promise<{ content: { type: 'text'; text: string }[] }>;
}

interface ModelContext {
  registerTool(tool: ModelContextTool, options?: { signal?: AbortSignal }): Promise<void> | void;
}

/**
 * Exposes the contact form to in-browser AI agents as a WebMCP tool.
 *
 * The tool only fills in the form. It never sends: the visitor reviews the
 * draft and presses "Send message" themselves, through the normal handler.
 * Feature-detected, so browsers without WebMCP are unaffected.
 */
export function registerContactDraftTool(fill: (draft: ContactMessage) => void): void {
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    const host = document as Document & { modelContext?: ModelContext };
    const nav = navigator as Navigator & { modelContext?: ModelContext };
    const modelContext = host.modelContext ?? nav.modelContext;
    if (!modelContext?.registerTool) return;

    const controller = new AbortController();
    destroyRef.onDestroy(() => controller.abort());
    const { name, subject, message } = CONTACT_LIMITS;

    void modelContext.registerTool(
      {
        name: 'draft_contact_message',
        title: 'Draft a message to Rabin',
        description:
          'Fills in the contact form on this page with a message to Rabin R. It does not send anything: ' +
          'the person must review the draft and press "Send message" themselves.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: name.min, maxLength: name.max, description: "Sender's name" },
            email: { type: 'string', format: 'email', description: "Sender's email, for the reply" },
            subject: { type: 'string', minLength: subject.min, maxLength: subject.max },
            message: { type: 'string', minLength: message.min, maxLength: message.max },
          },
          required: ['name', 'email', 'subject', 'message'],
        },
        annotations: { readOnlyHint: false, consequentialHint: false },
        async execute(input) {
          const text = (key: string) => (typeof input[key] === 'string' ? (input[key] as string) : '');
          fill({ name: text('name'), email: text('email'), subject: text('subject'), message: text('message') });
          return {
            content: [
              { type: 'text', text: 'The message is drafted in the contact form. Ask the person to review it and press "Send message".' },
            ],
          };
        },
      },
      { signal: controller.signal },
    );
  });
}
