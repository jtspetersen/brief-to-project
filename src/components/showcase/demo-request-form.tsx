"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function DemoRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorText("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, honeypot }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorText(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorText("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="border-t border-border/50 py-16">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mb-4 text-3xl">&#10003;</div>
          <h2 className="font-display text-2xl text-foreground">Thanks!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            I&apos;ll send you a demo link shortly. Check your email.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border/50 py-16">
      <div className="mx-auto max-w-md px-4">
        <h2 className="font-display text-center text-2xl text-foreground">
          Request Demo Access
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Start your project with every t crossed and every i dotted.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="demo-name" className="mb-1 block text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="demo-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={status === "submitting"}
            />
          </div>

          <div>
            <label htmlFor="demo-email" className="mb-1 block text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="demo-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={status === "submitting"}
            />
          </div>

          <div>
            <label htmlFor="demo-message" className="mb-1 block text-sm font-medium">
              Message <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="demo-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g., I'm a hiring manager at Acme Corp"
              disabled={status === "submitting"}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>

          {/* Honeypot field — hidden from humans, catches bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {errorText && (
            <p className="text-sm text-destructive">{errorText}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={status === "submitting" || !name.trim() || !email.trim()}
          >
            {status === "submitting" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Request Demo Link
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This is a limited-access proof of concept.
        </p>
      </div>
    </section>
  );
}
