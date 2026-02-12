"use client";

import { Bot } from "lucide-react";

/**
 * Animated typing indicator that mimics an incoming AI message bubble.
 * Shows three bouncing dots to indicate the AI is thinking/processing.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar — matches MessageBubble assistant style */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="h-4 w-4" />
      </div>

      {/* Typing bubble */}
      <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
