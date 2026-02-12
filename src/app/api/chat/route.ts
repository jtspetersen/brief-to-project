import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type UIMessage } from "ai";
import { SYSTEM_PROMPT } from "@/lib/prompts/core-identity";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
