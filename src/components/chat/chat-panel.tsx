"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useCallback, useMemo, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useSession } from "@/hooks/use-session";
import {
  parseMessageForArtifacts,
  toArtifact,
} from "@/lib/utils/artifact-parser";
import { STAGES } from "@/lib/types/stages";
import type { StageNumber } from "@/lib/types/stages";
import type { ArtifactType } from "@/lib/types/artifacts";
import { Send, Loader2, AlertCircle, ArrowRight } from "lucide-react";

/** Which artifact types mark a stage as "complete enough" to offer advancing */
const STAGE_KEY_ARTIFACTS: Record<number, ArtifactType[]> = {
  1: ["project-brief"],
  2: ["charter", "scope-statement"],
  3: ["wbs"],
  4: ["stakeholder-register", "raci-matrix"],
  5: ["risk-register"],
};

export function ChatPanel() {
  const { state, addArtifact, updateArtifact, setStage } = useSession();
  // Use a ref so the transport body always reads the latest stage value
  const currentStageRef = useRef(state.currentStage);
  currentStageRef.current = state.currentStage;

  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ currentStage: currentStageRef.current }),
      })
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  // Track which artifacts we've already processed so we don't add duplicates
  const processedArtifactsRef = useRef<Set<string>>(new Set());

  const isLoading = status === "submitted" || status === "streaming";
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-focus the input after the AI finishes responding
  useEffect(() => {
    if (status === "ready") {
      inputRef.current?.focus();
    }
  }, [status]);

  // Smart auto-scroll: only scroll to bottom when user is already near the bottom
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
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

      for (const parsed of artifacts) {
        const key = `${parsed.type}-${message.id}`;
        if (processedArtifactsRef.current.has(key)) continue;
        processedArtifactsRef.current.add(key);

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

      // Handle explicit [STAGE:N] markers from AI (kept as secondary method)
      if (stageTransition) {
        const transitionKey = `stage-${stageTransition}-${message.id}`;
        if (!processedArtifactsRef.current.has(transitionKey)) {
          processedArtifactsRef.current.add(transitionKey);
          setStage(stageTransition);
        }
      }
    }
  }, [messages, status, state.artifacts, addArtifact, updateArtifact, setStage]);

  // Determine if the user can advance to the next stage
  const nextStage = (state.currentStage + 1) as StageNumber;
  const nextStageInfo = STAGES.find((s) => s.number === nextStage);

  const canAdvanceStage = useMemo(() => {
    if (state.currentStage >= 6) return false;
    const requiredTypes = STAGE_KEY_ARTIFACTS[state.currentStage];
    if (!requiredTypes) return false;
    const existingTypes = state.artifacts.map((a) => a.type);
    return requiredTypes.every((t) => existingTypes.includes(t));
  }, [state.currentStage, state.artifacts]);

  const handleAdvanceStage = () => {
    if (nextStage >= 2 && nextStage <= 6 && nextStageInfo) {
      setStage(nextStage);
      sendMessage({
        text: `Let's move on to Stage ${nextStage}: ${nextStageInfo.description}.`,
      });
    }
  };

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
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}

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

      {/* Stage advance banner */}
      {canAdvanceStage && !isLoading && nextStageInfo && (
        <div className="mx-6 mb-2 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
          <span className="text-sm">
            Ready to move on to <strong>Stage {nextStage}: {nextStageInfo.description}</strong>?
          </span>
          <Button
            size="sm"
            className="ml-3 h-7 text-xs"
            onClick={handleAdvanceStage}
          >
            Continue
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
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
