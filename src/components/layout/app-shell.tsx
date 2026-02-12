import { ChatPanel } from "@/components/chat/chat-panel";
import { ProgressBar } from "@/components/layout/progress-bar";
import { ArtifactSidebar } from "@/components/sidebar/artifact-sidebar";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col">
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

      {/* Bottom: Progress bar */}
      <ProgressBar />
    </div>
  );
}
