"use client";

import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/use-session";
import { STAGES } from "@/lib/types/stages";

export function ProgressBar() {
  const { state } = useSession();
  const currentStage = state.currentStage;

  return (
    <div className="border-t bg-background px-6 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        {STAGES.map((stage, index) => (
          <div key={stage.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  stage.number < currentStage
                    ? "bg-primary text-primary-foreground"
                    : stage.number === currentStage
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {stage.number}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  stage.number <= currentStage
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <Separator
                className={`mx-2 w-8 ${
                  stage.number < currentStage ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
