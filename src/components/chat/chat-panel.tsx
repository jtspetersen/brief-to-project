"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useSession } from "@/hooks/use-session";
import {
  parseMessageForArtifacts,
  toArtifact,
} from "@/lib/utils/artifact-parser";
import { Send, Loader2, AlertCircle } from "lucide-react";

export function ChatPanel() {
  const { state, addArtifact, updateArtifact, setStage } = useSession();
  const { messages, sendMessage, status, error } = useChat({
    body: { currentStage: state.currentStage },
  });
  const [input, setInput] = useState("");
  // Track which artifacts we've already processed so we don't add duplicates
  const processedArtifactsRef = useRef<Set<string>>(new Set());

  const isLoading = status === "submitted" || status === "streaming";

  // Smart auto-scroll: only scroll to bottom when user is already near the bottom
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Consider "near bottom" if within 100px of the bottom
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    shouldAutoScrollRef.current = isNearBottom;
  }, []);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Detect artifacts in completed AI messages and add to session state
  useEffect(() => {
    if (status !== "ready") return;

    for (const message of messages) {
      if (message.role !== "assistant") continue;

      const rawText = message.parts
        .filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("");

      const { artifacts, stageTransition } = parseMessageForArtifacts(rawText);

      // Debug: log what the parser found (remove after debugging)
      if (artifacts.length > 0 || rawText.includes("artifact")) {
        console.log("[Artifact Debug] Message ID:", message.id);
        console.log("[Artifact Debug] Raw text (first 500 chars):", rawText.slice(0, 500));
        console.log("[Artifact Debug] Parsed artifacts:", artifacts);
        console.log("[Artifact Debug] Has ```artifact block:", rawText.includes("```artifact"));
      }

      let highestArtifactStage = state.currentStage;

      for (const parsed of artifacts) {
        const key = `${parsed.type}-${message.id}`;
        if (processedArtifactsRef.current.has(key)) continue;
        processedArtifactsRef.current.add(key);

        console.log("[Artifact Debug] Adding artifact:", parsed.type, parsed.title, "stage:", parsed.stage);

        // Track the highest stage seen in artifacts
        if (parsed.stage > highestArtifactStage) {
          highestArtifactStage = parsed.stage;
        }

        // Check if this artifact type already exists (it's an update)
        const existing = state.artifacts.find((a) => a.type === parsed.type);
        if (existing) {
          updateArtifact(existing.id, {
            data: parsed.data,
            title: parsed.title,
            status: "revised",
          });
        } else {
          addArtifact(toArtifact(parsed));
        }
      }

      // Handle stage transitions — two methods:
      // 1. Explicit [STAGE:N] marker from AI (primary)
      if (stageTransition) {
        const transitionKey = `stage-${stageTransition}-${message.id}`;
        if (!processedArtifactsRef.current.has(transitionKey)) {
          processedArtifactsRef.current.add(transitionKey);
          console.log("[Stage Debug] Transition marker found:", stageTransition);
          setStage(stageTransition);
        }
      }
      // 2. Auto-advance when artifacts from a later stage are generated (fallback)
      if (highestArtifactStage > state.currentStage) {
        const autoKey = `auto-stage-${highestArtifactStage}-${message.id}`;
        if (!processedArtifactsRef.current.has(autoKey)) {
          processedArtifactsRef.current.add(autoKey);
          console.log("[Stage Debug] Auto-advancing to stage", highestArtifactStage, "based on artifact stage");
          setStage(highestArtifactStage as 1 | 2 | 3 | 4 | 5 | 6);
        }
      }
    }
  }, [messages, status, state.artifacts, addArtifact, updateArtifact, setStage]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Brief-to-Project</h1>
        <span className="ml-2 text-sm text-muted-foreground">
          AI Project Advisor
        </span>
      </div>

      {/* Message area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4"
      >
        {!hasMessages ? (
          /* Welcome state — shown before any messages */
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Welcome to Brief-to-Project
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Describe your project idea and I&apos;ll guide you through
                creating a complete documentation package — from brief to
                kickoff-ready.
              </p>
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Loading indicator before streaming starts */}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={scrollAnchorRef} />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-6 mb-2 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Something went wrong. Please try again.</p>
        </div>
      )}

      {/* Input area */}
      <div className="border-t px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Describe your project idea..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
