"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { ArtifactCard } from "@/components/sidebar/artifact-card";
import { ArtifactPreview } from "@/components/sidebar/artifact-preview";
import type { Artifact } from "@/lib/types/artifacts";
import { FolderDown, Loader2, X } from "lucide-react";
import { IconDocuments } from "@/components/ui/icons";
import { toast } from "sonner";

interface ArtifactSidebarProps {
  onClose?: () => void;
}

export function ArtifactSidebar({ onClose }: ArtifactSidebarProps) {
  const { state } = useSession();
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);
  const [bundling, setBundling] = useState(false);
  const artifactCount = state.artifacts.length;

  const handleDownloadAll = async () => {
    setBundling(true);
    try {
      const res = await fetch("/api/generate-bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifacts: state.artifacts.map((a) => ({ type: a.type, data: a.data })),
          projectName: state.projectContext.name ?? "Project",
        }),
      });

      if (!res.ok) throw new Error("Bundle download failed");

      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      const fileName = match?.[1] ?? "Documentation.zip";

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Bundle generation failed. Please try again.");
    } finally {
      setBundling(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center border-b px-6 py-4">
        <IconDocuments size={20} className="mr-2 text-muted-foreground" />
        <h2 className="font-display text-lg">Documents</h2>
        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {artifactCount}
        </span>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={onClose}
            aria-label="Close documents"
          >
            <X className="h-4 w-4" style={{ color: "#8a602b" }} />
          </Button>
        )}
      </div>

      {/* Document list */}
      <ScrollArea className="min-h-0 flex-1 px-4 py-2">
        {artifactCount === 0 ? (
          /* Empty state */
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <IconDocuments size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No documents yet</p>
              <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                Start a conversation and I&apos;ll generate project documents as
                we go.
              </p>
            </div>
          </div>
        ) : (
          /* Artifact cards */
          <div className="space-y-3">
            {state.artifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onPreview={setPreviewArtifact}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Download All button */}
      {artifactCount >= 2 && (
        <div className="border-t px-4 py-3">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={handleDownloadAll}
            disabled={bundling}
          >
            {bundling ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FolderDown className="mr-2 h-4 w-4" />
            )}
            {bundling ? "Generating bundle..." : "Download All (.zip)"}
          </Button>
        </div>
      )}

      {/* Preview modal */}
      {previewArtifact && (
        <ArtifactPreview
          artifact={previewArtifact}
          onClose={() => setPreviewArtifact(null)}
        />
      )}
    </div>
  );
}
