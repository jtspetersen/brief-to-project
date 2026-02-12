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
 * Extracts all artifact JSON blocks and summarizes the conversation.
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

  // Build summary sections
  for (const [stage, artifacts] of Array.from(artifactsByStage.entries()).sort(
    (a, b) => a[0] - b[0]
  )) {
    sections.push(`## Stage ${stage} Artifacts`);
    for (const artifact of artifacts) {
      sections.push(
        `### ${artifact.title}\n\`\`\`json\n${JSON.stringify(artifact.data, null, 2)}\n\`\`\``
      );
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

  return sections.join("\n\n");
}
