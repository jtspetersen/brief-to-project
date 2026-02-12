import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type UIMessage } from "ai";
import { CORE_IDENTITY } from "@/lib/prompts/core-identity";
import { KNOWLEDGE_BASE } from "@/lib/prompts/knowledge-base";
import { getStageInstructions } from "@/lib/prompts/stage-instructions";
import { ARTIFACT_SCHEMAS } from "@/lib/prompts/artifact-schemas";
import type { StageNumber } from "@/lib/types/stages";

export async function POST(req: Request) {
  const { messages, currentStage = 1 }: { messages: UIMessage[]; currentStage?: StageNumber } =
    await req.json();

  // Assemble the 4-layer system prompt
  const systemPrompt = [
    CORE_IDENTITY,
    KNOWLEDGE_BASE,
    getStageInstructions(currentStage),
    ARTIFACT_SCHEMAS,
  ].join("\n\n---\n\n");

  // Convert UIMessage (parts-based) to the format streamText expects
  const modelMessages = messages.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(""),
  }));

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
