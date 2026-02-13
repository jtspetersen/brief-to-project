"use client";

import { IconAiAdvisor } from "@/components/ui/icons";

/**
 * Animated indicator shown when the AI is generating a document.
 * Three amber pages stack up sequentially while "Building..." pulses.
 */
export function DocAssemblyIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar — matches MessageBubble assistant style */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <IconAiAdvisor size={16} />
      </div>

      {/* Assembly animation */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-muted px-4 py-3">
        <div className="assembly-pages">
          <div className="assembly-page" />
          <div className="assembly-page" />
          <div className="assembly-page" />
        </div>
        <span className="text-xs text-muted-foreground" style={{ animation: "assemblyFade 1.8s ease-in-out infinite" }}>
          Building...
        </span>
      </div>
    </div>
  );
}
