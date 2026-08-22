import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact/ContactForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const longMessage = "We are looking for a senior Angular consultant to help ship a member portal this quarter with accessibility and performance as first-class requirements.";

describe("ContactForm", () => {
  it("shows required-field errors and does not submit an empty form", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.tab();
    expect(await screen.findByText(/valid email/i)).toBeTruthy();
  });

  it("prevents duplicate submission while loading and shows success with a reference id", async () => {
    const user = userEvent.setup();
    let resolveFetch: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm defaultInquiryType="Project" />);
    await user.type(screen.getByLabelText(/^name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^message/i), longMessage);

    const submit = screen.getByRole("button", { name: /send message/i });
    await user.click(submit);
    expect(submit).toBeDisabled();
    expect(screen.getByRole("button", { name: /sending/i })).toBeTruthy();

    await user.click(submit);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch?.(
      new Response(JSON.stringify({ ok: true, referenceId: "RR-20260822-TEST", responseTime: "Usually responds within 1 business day" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(await screen.findByRole("status")).toBeTruthy();
    expect(screen.getByText("Message received.")).toBeTruthy();
    expect(screen.getByText("RR-20260822-TEST")).toBeTruthy();
    expect(screen.getByRole("link", { name: /return to portfolio/i })).toHaveAttribute("href", "/work");
  });

  it("shows a recoverable failure state when the API errors", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "Too many requests. Please wait a few minutes and try again." }), { status: 429 })),
    );

    render(<ContactForm defaultInquiryType="Contract" />);
    await user.type(screen.getByLabelText(/^name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^message/i), longMessage);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many requests/i);
    expect(screen.getByRole("link", { name: /email me instead/i })).toBeTruthy();
  });

  it("keeps labels associated for keyboard users", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/^name/i).tagName).toBe("INPUT");
    expect(screen.getByLabelText(/^email/i).tagName).toBe("INPUT");
    expect(screen.getByLabelText(/inquiry type/i).tagName).toBe("SELECT");
    expect(screen.getByLabelText(/^message/i).tagName).toBe("TEXTAREA");
  });
});
