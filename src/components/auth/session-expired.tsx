"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface SessionExpiredOverlayProps {
  onReset: () => void;
}

/**
 * Full-screen overlay shown when the 2-hour session timer expires.
 * The user can start a new conversation by clicking the button.
 */
export function SessionExpiredOverlay({ onReset }: SessionExpiredOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Session Expired</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your session has timed out after 2 hours of inactivity. Start a new
            conversation to continue.
          </p>
        </div>
        <Button onClick={onReset} className="w-full">
          Start New Conversation
        </Button>
      </div>
    </div>
  );
}
