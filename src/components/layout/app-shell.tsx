"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { ProgressBar } from "@/components/layout/progress-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ArtifactSidebar } from "@/components/sidebar/artifact-sidebar";
import { SessionExpiredOverlay } from "@/components/auth/session-expired";
import { useSession } from "@/hooks/use-session";

export function AppShell() {
  const { isExpired, resetSession } = useSession();

  return (
    <div className="flex h-screen flex-col">
      {/* Session expired overlay */}
      {isExpired && <SessionExpiredOverlay onReset={resetSession} />}

      {/* Main content: two-panel layout (stacks vertically on small screens) */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left panel: Chat — 60% on desktop, full width on mobile */}
        <div className="flex min-h-0 flex-1 flex-col md:w-3/5 md:flex-none">
          <ChatPanel />
        </div>

        {/* Right panel: Artifact sidebar — 40% on desktop, collapsible on mobile */}
        <div className="flex min-h-0 flex-1 flex-col md:w-2/5 md:flex-none">
          <ArtifactSidebar />
        </div>
      </div>

      {/* Bottom: Progress bar + theme toggle */}
      <div className="flex items-center border-t bg-background">
        <div className="flex items-center px-3">
          <ThemeToggle />
        </div>
        <div className="flex-1">
          <ProgressBar />
        </div>
      </div>
    </div>
  );
}
