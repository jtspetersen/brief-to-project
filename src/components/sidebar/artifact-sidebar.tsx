"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/hooks/use-session";
import { FileText } from "lucide-react";

export function ArtifactSidebar() {
  const { state } = useSession();
  const artifactCount = state.artifacts.length;

  return (
    <div className="flex h-full flex-col border-l">
      {/* Header */}
      <div className="flex items-center border-b px-6 py-4">
        <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Documents</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {artifactCount}
        </span>
      </div>

      {/* Document list — empty state for now, cards added in Phase 2 */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No documents yet</p>
            <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
              Start a conversation and I&apos;ll generate project documents as
              we go.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
