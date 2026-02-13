import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { parseMessageForArtifacts } from "@/lib/utils/artifact-parser";
import { IconUser, IconAiAdvisor, IconComplete } from "@/components/ui/icons";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Extract text content from the parts array
  const rawText = message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text"
    )
    .map((part) => part.text)
    .join("");

  if (!rawText) return null;

  // Parse for artifact blocks (AI messages only)
  const { cleanText, artifacts } = isUser
    ? { cleanText: rawText, artifacts: [] }
    : parseMessageForArtifacts(rawText);

  // Don't render empty messages (artifact-only responses)
  const hasText = cleanText.length > 0;
  const hasArtifacts = artifacts.length > 0;
  if (!hasText && !hasArtifacts) return null;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? <IconUser size={16} /> : <IconAiAdvisor size={16} />}
      </div>

      {/* Message content */}
      <div className="min-w-0 max-w-[80%] space-y-2">
        {/* Text portion */}
        {hasText && (
          <div
            className={`overflow-hidden rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{cleanText}</p>
            ) : (
              <div className="prose-chat">
                <ReactMarkdown>{cleanText}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Artifact cards inline in the chat */}
        {artifacts.map((artifact) => (
          <div
            key={`${artifact.type}-${artifact.stage}`}
            className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconComplete size={16} />
            </div>
            <div>
              <p className="font-medium">{artifact.title}</p>
              <p className="text-xs text-muted-foreground">
                Document generated — see sidebar
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
