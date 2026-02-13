"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ErrorBannerProps {
  error: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  expired: "This demo link has expired. Request a new demo link below.",
  used: "This demo link has been fully used. Request a new demo link below.",
  invalid: "This demo link wasn't recognized. Request a demo link below.",
  revoked:
    "Your session token has expired. Please request a new token if you require access again.",
};

export function ErrorBanner({ error }: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const message = ERROR_MESSAGES[error];
  if (!message || dismissed) return null;

  return (
    <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-3">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <p className="text-sm text-destructive">{message}</p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 text-destructive/60 hover:text-destructive"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
