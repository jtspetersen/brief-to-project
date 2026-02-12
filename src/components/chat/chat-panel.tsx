import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export function ChatPanel() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Brief-to-Project</h1>
        <span className="ml-2 text-sm text-muted-foreground">
          AI Project Advisor
        </span>
      </div>

      {/* Message area — empty for now, will be wired in Task 1.20 */}
      <ScrollArea className="flex-1 px-6 py-4">
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
      </ScrollArea>

      {/* Input area */}
      <div className="border-t px-6 py-4">
        <form className="flex gap-2">
          <Input
            placeholder="Describe your project idea..."
            className="flex-1"
            disabled
          />
          <Button type="submit" size="icon" disabled>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Input will be enabled once chat is wired up (Task 1.19)
        </p>
      </div>
    </div>
  );
}
