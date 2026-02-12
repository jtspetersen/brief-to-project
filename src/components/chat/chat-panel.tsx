"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Send, Loader2, AlertCircle } from "lucide-react";

export function ChatPanel() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll: ref to the bottom of the message list
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <ScrollArea className="flex-1 px-6 py-4">
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
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

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
