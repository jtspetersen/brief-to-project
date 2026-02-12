"use client";

import { useState } from "react";
import type { Artifact, ArtifactType } from "@/lib/types/artifacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";

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
  const Icon = hasXlsx ? FileSpreadsheet : FileText;
  const [downloading, setDownloading] = useState<"docx" | "xlsx" | null>(null);
  const isDisabled = downloading !== null || artifact.status === "generating";

  const handleDownload = async (format: "docx" | "xlsx") => {
    setDownloading(format);
    try {
      await downloadArtifact(artifact, format);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-sm font-medium">
            {artifact.title}
          </CardTitle>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={statusInfo.variant} className="text-[10px] px-1.5 py-0">
              {statusInfo.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Stage {artifact.stage}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2 px-4 pb-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={() => onPreview(artifact)}
        >
          <Eye className="mr-1 h-3 w-3" />
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
            <Download className="mr-1 h-3 w-3" />
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
              <Download className="mr-1 h-3 w-3" />
            )}
            .xlsx
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
