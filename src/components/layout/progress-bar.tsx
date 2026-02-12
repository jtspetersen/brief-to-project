"use client";

import { useSession } from "@/hooks/use-session";
import { STAGES } from "@/lib/types/stages";

export function ProgressBar() {
  const { state } = useSession();
  const currentStage = state.currentStage;

  return (
    <div className="px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center">
        {STAGES.map((stage, index) => (
          <div key={stage.number} className="flex flex-1 items-center">
            {/* Stage circle + label */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  stage.number < currentStage
                    ? "bg-primary text-primary-foreground"
                    : stage.number === currentStage
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {stage.number}
              </div>
              <span
                className={`hidden text-[10px] sm:block ${
                  stage.number <= currentStage
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {/* Connector line */}
            {index < STAGES.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 rounded-full ${
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
