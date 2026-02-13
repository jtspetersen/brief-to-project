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

/**
 * Parse a message for artifact blocks and stage transitions.
 *
 * Two detection strategies:
 * 1. Fenced code blocks (```artifact ... ```) — the preferred format
 * 2. Unfenced JSON fallback — catches cases where the AI outputs raw JSON
 *    without wrapping it in a fenced block
 */
export function parseMessageForArtifacts(text: string): ParseResult {
  const artifacts: ParsedArtifact[] = [];

  // --- Step 1: Extract artifacts from fenced code blocks ---
  // Split on triple-backtick boundaries. Between every pair of ```
  // markers is a code block's content (possibly with a language tag).
  const FENCE = "```";
  let cleanText = "";
  let searchFrom = 0;

  while (searchFrom < text.length) {
    const openIdx = text.indexOf(FENCE, searchFrom);

    // No more code blocks — append the rest and stop
    if (openIdx === -1) {
      cleanText += text.slice(searchFrom);
      break;
    }

    // Append everything before this opening fence
    cleanText += text.slice(searchFrom, openIdx);

    // Find the closing fence (start searching after the opening ```)
    const afterOpen = openIdx + FENCE.length;
    const closeIdx = text.indexOf(FENCE, afterOpen);

    // Unclosed code block — keep the rest as-is
    if (closeIdx === -1) {
      cleanText += text.slice(openIdx);
      break;
    }

    // Raw content between the fences (includes optional tag on first line)
    const raw = text.slice(afterOpen, closeIdx);

    // Extract JSON from within the code block by finding { ... } boundaries.
    // This handles any tag (artifact, json, none) and any whitespace/newline pattern.
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    const jsonContent =
      firstBrace !== -1 && lastBrace > firstBrace
        ? raw.slice(firstBrace, lastBrace + 1)
        : "";

    // Try to parse as an artifact
    const artifact = tryParseArtifact(jsonContent);

    if (artifact) {
      artifacts.push(artifact);
    } else {
      // Not an artifact — keep the full code block in the output
      cleanText += FENCE + raw + FENCE;
    }

    // Move past the closing fence
    searchFrom = closeIdx + FENCE.length;
  }

  // --- Step 2: Fallback — detect unfenced artifact JSON ---
  // The AI sometimes outputs artifact JSON without ``` fencing.
  // Scan the remaining text for JSON objects matching the artifact schema.
  const unfenced = findUnfencedArtifacts(cleanText);
  if (unfenced.artifacts.length > 0) {
    artifacts.push(...unfenced.artifacts);
    cleanText = unfenced.cleanText;
  }

  // --- Step 3: Detect [STAGE:N] markers ---
  let stageTransition: StageNumber | null = null;
  const STAGE_RE = /\[STAGE\s*:\s*(\d)\]/gi;
  const finalText = cleanText.replace(STAGE_RE, (_match, num: string) => {
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

/**
 * Fallback: scan text for unfenced artifact JSON objects.
 * Uses brace-depth matching (with string-awareness) to extract candidate
 * JSON, then validates each candidate has the artifact signature fields.
 */
function findUnfencedArtifacts(text: string): { artifacts: ParsedArtifact[]; cleanText: string } {
  const found: { artifact: ParsedArtifact; start: number; end: number }[] = [];
  let searchFrom = 0;

  while (searchFrom < text.length) {
    const braceIdx = text.indexOf("{", searchFrom);
    if (braceIdx === -1) break;

    // Quick lookahead: skip if no "type" field nearby (avoids wasting
    // time on non-artifact JSON or random braces in prose)
    const lookahead = text.slice(braceIdx, Math.min(braceIdx + 60, text.length));
    if (!lookahead.includes('"type"')) {
      searchFrom = braceIdx + 1;
      continue;
    }

    // Find matching closing brace using depth counting.
    // Track string context so braces inside JSON strings don't confuse us.
    let depth = 0;
    let endIdx = -1;
    let inString = false;
    let escaped = false;

    for (let i = braceIdx; i < text.length; i++) {
      const ch = text[i];
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) { endIdx = i; break; }
      }
    }

    if (endIdx === -1) { searchFrom = braceIdx + 1; continue; }

    const candidate = text.slice(braceIdx, endIdx + 1);
    const artifact = tryParseArtifact(candidate);

    if (artifact) {
      found.push({ artifact, start: braceIdx, end: endIdx + 1 });
      searchFrom = endIdx + 1;
    } else {
      searchFrom = braceIdx + 1;
    }
  }

  // Build clean text by removing found artifacts (from end to preserve indices)
  let cleanText = text;
  for (let i = found.length - 1; i >= 0; i--) {
    cleanText = cleanText.slice(0, found[i].start) + cleanText.slice(found[i].end);
  }

  return {
    artifacts: found.map((f) => f.artifact),
    cleanText,
  };
}

/** Default display titles by artifact type (used when AI omits the title field) */
const DEFAULT_TITLES: Record<string, string> = {
  "project-brief": "Project Brief",
  "project-classification": "Project Classification",
  "charter": "Project Charter",
  "scope-statement": "Scope Statement",
  "business-case": "Business Case",
  "success-criteria": "Success Criteria & KPIs",
  "wbs": "Work Breakdown Structure",
  "schedule": "Project Schedule",
  "budget": "Budget Estimate",
  "resource-plan": "Resource Plan",
  "stakeholder-register": "Stakeholder Register",
  "raci-matrix": "RACI Matrix",
  "communication-plan": "Communication Plan",
  "governance-structure": "Governance Structure",
  "risk-register": "Risk Register",
  "quality-plan": "Quality Plan",
  "change-management-plan": "Change Management Plan",
  "sow-pid": "Statement of Work / PID",
  "kickoff-agenda": "Kickoff Meeting Agenda",
  "completeness-report": "Completeness Report",
};

function tryParseArtifact(content: string): ParsedArtifact | null {
  const trimmed = content.trim();
  if (!trimmed.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(trimmed);
    const hasType = typeof parsed.type === "string";
    const hasStage = parsed.stage != null;
    const hasData = parsed.data != null && typeof parsed.data === "object";

    // Require type, stage, and data. Title is optional — derive from type if missing.
    if (hasType && hasStage && hasData) {
      const title = typeof parsed.title === "string"
        ? parsed.title
        : DEFAULT_TITLES[parsed.type] ?? parsed.type.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      return {
        type: parsed.type as ArtifactType,
        title,
        stage: parsed.stage as StageNumber,
        data: parsed.data as Record<string, unknown>,
      };
    }
  } catch {
    // JSON parse failed — not an artifact
  }

  return null;
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
