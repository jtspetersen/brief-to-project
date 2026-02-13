"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ProgressBar } from "@/components/layout/progress-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ArtifactSidebar } from "@/components/sidebar/artifact-sidebar";
import { SessionExpiredOverlay } from "@/components/auth/session-expired";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

export function AppShell() {
  const { isExpired, resetSession, state } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const artifactCount = state.artifacts.length;

  // Close mobile sidebar on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [sidebarOpen, handleKeyDown]);

  return (
    <div className="flex h-screen flex-col">
      {/* Session expired overlay */}
      {isExpired && <SessionExpiredOverlay onReset={resetSession} />}

      {/* Main content: two-panel layout */}
      <div className="relative flex flex-1 overflow-hidden md:flex-row">
        {/* Left panel: Chat — full width on mobile, 60% on desktop */}
        <div className="flex min-h-0 w-full flex-col md:w-3/5">
          <ChatPanel />
        </div>

        {/* Right panel: Artifact sidebar — overlay on mobile, inline on desktop */}
        {/* Desktop: always visible */}
        <div className="hidden min-h-0 md:flex md:w-2/5 md:flex-col md:border-l">
          <ArtifactSidebar />
        </div>

        {/* Mobile: slide-over overlay */}
        {sidebarOpen && (
          <div className="absolute inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar panel */}
            <div className="absolute inset-y-0 right-0 flex w-4/5 max-w-sm flex-col bg-background shadow-xl">
              <div className="flex items-center justify-end px-4 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ArtifactSidebar />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Theme toggle + progress bar + mobile sidebar toggle */}
      <div className="flex items-center border-t bg-background">
        <div className="flex items-center px-3">
          <ThemeToggle />
        </div>
        <div className="flex-1">
          <ProgressBar />
        </div>
        {/* Mobile sidebar toggle button */}
        <div className="flex items-center px-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open documents sidebar"
          >
            <FileText className="h-4 w-4" />
            {artifactCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {artifactCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
