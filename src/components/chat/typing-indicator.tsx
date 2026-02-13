"use client";

import { IconAiAdvisor } from "@/components/ui/icons";

/**
 * Animated typing indicator — "Warm Bloom" style.
 * Concentric amber rings ripple outward from a warm center.
 * Used during general thinking / question processing.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar — matches MessageBubble assistant style */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <IconAiAdvisor size={16} />
      </div>

      {/* Warm Bloom animation */}
      <div className="flex items-center justify-center rounded-2xl bg-muted px-5 py-3">
        <div className="bloom-indicator">
          <div className="bloom-ring" />
          <div className="bloom-ring" />
          <div className="bloom-ring" />
          <div className="bloom-center" />
        </div>
      </div>
    </div>
  );
}
