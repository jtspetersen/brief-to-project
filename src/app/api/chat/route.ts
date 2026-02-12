import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/prompts/core-identity";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
