import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await generateText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      prompt: "Say hello in one sentence. Keep it brief.",
    });

    return NextResponse.json({
      success: true,
      message: result.text,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
