"use client";

import type { Artifact } from "@/lib/types/artifacts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtifactPreviewProps {
  artifact: Artifact;
  onClose: () => void;
}

/** Render a value from the artifact data as readable content */
function RenderValue({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null;

  // String
  if (typeof value === "string") {
    return (
      <div className="mb-3">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {formatLabel(label)}
        </dt>
        <dd className="mt-1 whitespace-pre-wrap break-words text-sm">{value}</dd>
      </div>
    );
  }

  // Array of strings
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return (
      <div className="mb-3">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {formatLabel(label)}
        </dt>
        <dd className="mt-1">
          <ul className="list-inside list-disc space-y-1 text-sm">
            {value.map((item, i) => (
              <li key={i} className="break-words">{item}</li>
            ))}
          </ul>
        </dd>
      </div>
    );
  }

  // Array of objects
  if (Array.isArray(value)) {
    return (
      <div className="mb-3">
        <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {formatLabel(label)}
        </dt>
        <dd>
          <div className="space-y-2">
            {value.map((item, i) => (
              <div key={i} className="rounded-md border bg-muted/30 p-3 break-words">
                {typeof item === "object" && item !== null ? (
                  <dl>
                    {Object.entries(item).map(([k, v]) => (
                      <RenderValue key={k} label={k} value={v} />
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm">{String(item)}</p>
                )}
              </div>
            ))}
          </div>
        </dd>
      </div>
    );
  }

  // Nested object
  if (typeof value === "object") {
    return (
      <div className="mb-3">
        <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {formatLabel(label)}
        </dt>
        <dd className="rounded-md border bg-muted/30 p-3 break-words">
          <dl>
            {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
              <RenderValue key={k} label={k} value={v} />
            ))}
          </dl>
        </dd>
      </div>
    );
  }

  // Fallback
  return (
    <div className="mb-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {formatLabel(label)}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm">{String(value)}</dd>
    </div>
  );
}

/** Convert camelCase keys to readable labels */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function ArtifactPreview({ artifact, onClose }: ArtifactPreviewProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-4xl p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="pr-8 text-lg">{artifact.title}</DialogTitle>
          <Badge variant="outline" className="mr-auto text-xs">
            {artifact.status}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Stage {artifact.stage} &middot; {artifact.format.toUpperCase()} &middot; Last
            updated {artifact.updatedAt.toLocaleString()}
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] px-6 py-4">
          <dl>
            {Object.entries(artifact.data).map(([key, value]) => (
              <RenderValue key={key} label={key} value={value} />
            ))}
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
