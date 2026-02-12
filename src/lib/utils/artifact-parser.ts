import type { Artifact, ArtifactType, ArtifactFormat } from "@/lib/types/artifacts";
import type { StageNumber } from "@/lib/types/stages";

/** Raw artifact data extracted from an AI response */
export interface ParsedArtifact {
  type: ArtifactType;
  title: string;
  stage: StageNumber;
  data: Record<string, unknown>;
}

/** Result of parsing a message for artifacts */
export interface ParseResult {
  /** The message text with artifact blocks removed */
  cleanText: string;
  /** Any artifacts found in the message */
  artifacts: ParsedArtifact[];
  /** If the AI signals a stage transition, the new stage number */
  stageTransition: StageNumber | null;
}

const ARTIFACT_REGEX = /```artifact\s*\n([\s\S]*?)```/g;
const STAGE_REGEX = /\[STAGE:(\d)\]/g;

/**
 * Parse a message for artifact blocks.
 * Returns the clean text (without artifact JSON) and any parsed artifacts.
 */
export function parseMessageForArtifacts(text: string): ParseResult {
  const artifacts: ParsedArtifact[] = [];

  const cleanText = text.replace(ARTIFACT_REGEX, (_match, jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr.trim());
      if (parsed.type && parsed.title && parsed.stage && parsed.data) {
        artifacts.push({
          type: parsed.type,
          title: parsed.title,
          stage: parsed.stage,
          data: parsed.data,
        });
      }
    } catch {
      // If JSON parsing fails, leave the block in the text
      return _match;
    }
    return ""; // Remove successfully parsed artifact blocks from display
  });

  // Detect stage transition markers like [STAGE:2]
  let stageTransition: StageNumber | null = null;
  const finalText = cleanText.replace(STAGE_REGEX, (_match, num: string) => {
    const stage = parseInt(num, 10);
    if (stage >= 1 && stage <= 6) {
      stageTransition = stage as StageNumber;
    }
    return ""; // Remove marker from display
  });

  return {
    cleanText: finalText.trim(),
    artifacts,
    stageTransition,
  };
}

/** Format for download based on artifact type */
const FORMAT_MAP: Partial<Record<ArtifactType, ArtifactFormat>> = {
  "budget": "xlsx",
  "risk-register": "xlsx",
};

/** Convert a ParsedArtifact to a full Artifact for session state */
export function toArtifact(parsed: ParsedArtifact): Artifact {
  return {
    id: `${parsed.type}-${Date.now()}`,
    type: parsed.type,
    title: parsed.title,
    stage: parsed.stage,
    status: "draft",
    format: FORMAT_MAP[parsed.type] ?? "docx",
    data: parsed.data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
