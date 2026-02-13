"use client";

import { useState } from "react";
import type { Artifact, ArtifactType } from "@/lib/types/artifacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { IconPreview, IconDownload, IconDocuments } from "@/components/ui/icons";
import { toast } from "sonner";

interface ArtifactCardProps {
  artifact: Artifact;
  onPreview: (artifact: Artifact) => void;
}

const STATUS_STYLES: Record<Artifact["status"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  generating: { label: "Generating...", variant: "secondary" },
  draft: { label: "Draft", variant: "outline" },
  revised: { label: "Revised", variant: "default" },
  final: { label: "Final", variant: "default" },
};

/** Artifact types that have an xlsx alternative */
const XLSX_TYPES: Set<ArtifactType> = new Set(["risk-register", "budget"]);

async function downloadArtifact(
  artifact: Artifact,
  format: "docx" | "xlsx",
) {
  const res = await fetch("/api/generate-artifact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: artifact.type,
      data: artifact.data,
      projectName: artifact.data.projectName ?? "Project",
      format,
    }),
  });

  if (!res.ok) throw new Error("Download failed");

  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="(.+)"/);
  const fileName = match?.[1] ?? `${artifact.type}.${format}`;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ArtifactCard({ artifact, onPreview }: ArtifactCardProps) {
  const statusInfo = STATUS_STYLES[artifact.status];
  const hasXlsx = XLSX_TYPES.has(artifact.type);
  // All artifact types use the same Documents icon now
  const [downloading, setDownloading] = useState<"docx" | "xlsx" | null>(null);
  const isDisabled = downloading !== null || artifact.status === "generating";

  const handleDownload = async (format: "docx" | "xlsx") => {
    setDownloading(format);
    try {
      await downloadArtifact(artifact, format);
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <IconDocuments size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-sm font-medium leading-tight">
            {artifact.title}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Badge variant={statusInfo.variant} className="text-[10px] px-1.5 py-0">
              {statusInfo.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Stage {artifact.stage}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2 px-3 pb-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={() => onPreview(artifact)}
        >
          <IconPreview size={12} className="mr-1" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={() => handleDownload("docx")}
          disabled={isDisabled}
        >
          {downloading === "docx" ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <IconDownload size={12} className="mr-1" />
          )}
          .docx
        </Button>
        {hasXlsx && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 flex-1 text-xs"
            onClick={() => handleDownload("xlsx")}
            disabled={isDisabled}
          >
            {downloading === "xlsx" ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <IconDownload size={12} className="mr-1" />
            )}
            .xlsx
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
