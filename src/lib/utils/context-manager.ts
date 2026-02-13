import type { StageNumber } from "@/lib/types/stages";
import { parseMessageForArtifacts } from "@/lib/utils/artifact-parser";

interface SimpleMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Compresses conversation history to manage context window size.
 *
 * Strategy:
 * - Keep recent messages (current stage conversation) in full
 * - Compress older messages into a structured summary that preserves
 *   all artifact data and key decisions but drops the back-and-forth
 *
 * This runs server-side in the chat API route before sending to Claude.
 */
export function compressConversation(
  messages: SimpleMessage[],
  currentStage: StageNumber
): SimpleMessage[] {
  // For Stage 1 or very short conversations, no compression needed
  if (currentStage <= 1 || messages.length <= 10) {
    return messages;
  }

  // Find where the current stage's conversation begins.
  // We look for the user message that triggered the stage transition
  // (e.g., "Let's move on to Stage N: ...")
  const stageTransitionIndex = findStageTransitionIndex(messages, currentStage);

  // If we can't find a clear boundary, keep the last 20 messages
  // and summarize everything before that
  const keepFromIndex =
    stageTransitionIndex >= 0
      ? stageTransitionIndex
      : Math.max(0, messages.length - 20);

  // If almost everything would be kept, skip compression
  if (keepFromIndex <= 2) {
    return messages;
  }

  const olderMessages = messages.slice(0, keepFromIndex);
  const recentMessages = messages.slice(keepFromIndex);

  // Extract artifacts and key info from older messages
  const summary = buildStageSummary(olderMessages);

  // Return a single summary message followed by the recent conversation
  const compressed: SimpleMessage[] = [
    {
      role: "user",
      content: `[CONTEXT FROM EARLIER STAGES — This is a compressed summary of our prior conversation. Reference this for project details, decisions made, and artifact data.]\n\n${summary}`,
    },
    {
      role: "assistant",
      content:
        "Understood. I have the full context from our earlier stages and will reference it as we continue.",
    },
    ...recentMessages,
  ];

  return compressed;
}

/**
 * Find the index of the message where the current stage began.
 * Looks for the "Let's move on to Stage N" pattern or [STAGE:N] markers.
 */
function findStageTransitionIndex(
  messages: SimpleMessage[],
  currentStage: StageNumber
): number {
  const stagePattern = new RegExp(
    `(move on to Stage ${currentStage}|\\[STAGE\\s*:\\s*${currentStage}\\])`,
    "i"
  );

  // Search backwards from the end — find the most recent transition to this stage
  for (let i = messages.length - 1; i >= 0; i--) {
    if (stagePattern.test(messages[i].content)) {
      return i;
    }
  }

  return -1;
}

/**
 * Build a structured summary from older messages.
 *
 * Uses compact TEXT bullet-point summaries instead of raw JSON dumps.
 * This is critical: raw JSON in the context causes the AI to mimic
 * unfenced JSON output, which the artifact parser can't detect.
 */
function buildStageSummary(messages: SimpleMessage[]): string {
  const sections: string[] = [];
  const allArtifacts: { type: string; title: string; stage: number; data: Record<string, unknown> }[] = [];

  // Extract all artifacts from assistant messages
  for (const msg of messages) {
    if (msg.role === "assistant") {
      const { artifacts } = parseMessageForArtifacts(msg.content);
      for (const artifact of artifacts) {
        allArtifacts.push({
          type: artifact.type,
          title: artifact.title,
          stage: artifact.stage,
          data: artifact.data,
        });
      }
    }
  }

  // Group artifacts by stage
  const artifactsByStage = new Map<number, typeof allArtifacts>();
  for (const artifact of allArtifacts) {
    const existing = artifactsByStage.get(artifact.stage) ?? [];
    existing.push(artifact);
    artifactsByStage.set(artifact.stage, existing);
  }

  // Build compact text summaries — NO raw JSON to prevent format mimicry
  for (const [stage, artifacts] of Array.from(artifactsByStage.entries()).sort(
    (a, b) => a[0] - b[0]
  )) {
    sections.push(`## Stage ${stage} Artifacts`);
    for (const artifact of artifacts) {
      const summary = summarizeArtifactData(artifact.data);
      sections.push(`**${artifact.title}** (type: ${artifact.type})\n${summary}`);
    }
  }

  // Extract key user decisions/statements (first and last user messages per ~10 message chunk)
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length > 0) {
    sections.push("## Key User Inputs");
    // Keep first message (project description) and a sample of others
    const keyMessages = [
      userMessages[0],
      ...userMessages.slice(1).filter((_m, i) => i % 3 === 0), // Every 3rd message
    ];
    for (const msg of keyMessages) {
      // Truncate long messages
      const text =
        msg.content.length > 300
          ? msg.content.slice(0, 300) + "..."
          : msg.content;
      sections.push(`- ${text}`);
    }
  }

  // Reinforce the correct artifact output format (the AI just saw text
  // summaries above, so remind it to use fenced blocks for NEW artifacts)
  sections.push(
    "## Reminder: Artifact Output Format\nWhen generating new artifacts, you MUST use a fenced code block:\n```artifact\n{ \"type\": \"...\", \"title\": \"...\", \"stage\": N, \"data\": { ... } }\n```\nDo NOT output artifact JSON without the fenced code block wrapper."
  );

  return sections.join("\n\n");
}

/**
 * Create a compact text summary of artifact data.
 * Extracts key fields as bullet points — no raw JSON.
 *
 * This prevents the AI from seeing unfenced JSON in the context
 * and mimicking that format instead of using ```artifact fencing.
 */
function summarizeArtifactData(data: Record<string, unknown>): string {
  const lines: string[] = [];
  const MAX_LINES = 10;
  const MAX_STR = 300;

  for (const [key, val] of Object.entries(data)) {
    if (lines.length >= MAX_LINES) break;
    if (val == null) continue;

    if (typeof val === "string") {
      lines.push(`${key}: ${val.length > MAX_STR ? val.slice(0, MAX_STR) + "…" : val}`);
    } else if (typeof val === "number" || typeof val === "boolean") {
      lines.push(`${key}: ${val}`);
    } else if (Array.isArray(val)) {
      if (val.length === 0) continue;
      if (typeof val[0] === "string") {
        const joined = val.join("; ");
        lines.push(`${key}: ${joined.length > MAX_STR ? joined.slice(0, MAX_STR) + "…" : joined}`);
      } else if (typeof val[0] === "object" && val[0] !== null) {
        // Array of objects — show primary fields from first few items
        const previews = val.slice(0, 5).map((item: unknown) => {
          const obj = item as Record<string, unknown>;
          const label = obj.name ?? obj.item ?? obj.deliverable ?? obj.description ??
            obj.role ?? obj.risk ?? obj.check ?? obj.audience ?? obj.topic ??
            obj.objective ?? obj.benefit ?? obj.milestone ?? obj.id ?? "";
          return String(label).slice(0, 80);
        });
        const more = val.length > 5 ? ` (+${val.length - 5} more)` : "";
        lines.push(`${key} (${val.length}): ${previews.join("; ")}${more}`);
      }
    } else if (typeof val === "object") {
      // Nested object — summarize its key fields compactly
      const parts: string[] = [];
      for (const [subKey, subVal] of Object.entries(val as Record<string, unknown>)) {
        if (typeof subVal === "string" && subVal.length > 0) {
          parts.push(`${subKey}: ${subVal.length > 100 ? subVal.slice(0, 100) + "…" : subVal}`);
        } else if (Array.isArray(subVal)) {
          parts.push(`${subKey}: ${subVal.length} items`);
        }
        if (parts.length >= 4) break;
      }
      if (parts.length > 0) {
        lines.push(`${key}: { ${parts.join(", ")} }`);
      }
    }
  }

  return lines.map(l => `  - ${l}`).join("\n");
}
