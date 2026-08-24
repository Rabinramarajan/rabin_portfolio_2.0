/**
 * Mail delivery logging for debugging and monitoring.
 * Logs all SMTP operations for troubleshooting.
 */

export interface MailEvent {
  timestamp: string;
  type: "send" | "bounce" | "error" | "retry";
  referenceId: string;
  to: string;
  from: string;
  subject: string;
  status: "pending" | "success" | "failed";
  errorMessage?: string;
  errorCode?: string;
  attempt?: number;
  maxAttempts?: number;
  /** Message-ID header, for correlating with the relay's own logs. */
  messageId?: string;
  /** Raw SMTP reply, e.g. "250 2.0.0 Ok: queued as 4c9Ql…". */
  smtpResponse?: string;
}

class MailLogger {
  private events: MailEvent[] = [];
  private readonly maxEvents = 1000;

  log(event: MailEvent) {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    const prefix = `[contact:mail]`;
    const timestamp = new Date(event.timestamp).toLocaleString();

    switch (event.type) {
      case "send":
        if (event.status === "success") {
          // "Accepted", not "Delivered": the relay has taken the message, but
          // the receiving mailbox can still bounce or spam-file it later. The
          // queue id in the SMTP reply is what you trace at the relay.
          console.log(
            `${prefix} [${timestamp}] ✅ Accepted by relay for ${event.to} | Ref: ${event.referenceId}` +
              (event.messageId ? ` | Message-ID: ${event.messageId}` : "") +
              (event.smtpResponse ? ` | SMTP: ${event.smtpResponse}` : ""),
          );
        } else {
          console.log(
            `${prefix} [${timestamp}] Sending to ${event.to} | Subject: "${event.subject}" | Ref: ${event.referenceId}`,
          );
        }
        break;

      case "retry":
        console.warn(
          `${prefix} [${timestamp}] ⚠️  Retry ${event.attempt}/${event.maxAttempts} to ${event.to} | Error: ${event.errorMessage} | Ref: ${event.referenceId}`,
        );
        break;

      case "bounce":
        console.error(
          `${prefix} [${timestamp}] 🔴 BOUNCE to ${event.to} | Error: ${event.errorMessage} (Code: ${event.errorCode}) | Ref: ${event.referenceId}`,
        );
        break;

      case "error":
        console.error(
          `${prefix} [${timestamp}] 🔴 ERROR sending to ${event.to} | Error: ${event.errorMessage} | Ref: ${event.referenceId}`,
        );
        break;
    }
  }

  getEvents(type?: MailEvent["type"]): MailEvent[] {
    if (!type) return this.events;
    return this.events.filter((e) => e.type === type);
  }

  getBounces(): MailEvent[] {
    return this.getEvents("bounce");
  }

  getErrors(): MailEvent[] {
    return this.events.filter((e) => e.status === "failed");
  }

  clear() {
    this.events = [];
  }

  summary() {
    const total = this.events.length;
    const success = this.events.filter((e) => e.status === "success").length;
    const failed = this.events.filter((e) => e.status === "failed").length;
    const bounces = this.events.filter((e) => e.type === "bounce").length;

    return {
      total,
      success,
      failed,
      bounces,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) + "%" : "N/A",
    };
  }
}

export const mailLogger = new MailLogger();
