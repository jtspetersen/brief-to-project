"use client";

import { useSession } from "@/hooks/use-session";
import { STAGES } from "@/lib/types/stages";
import { STAGE_ICONS } from "@/components/ui/icons";

export function ProgressBar() {
  const { state } = useSession();
  const currentStage = state.currentStage;

  return (
    <div className="px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center">
        {STAGES.map((stage, index) => {
          const StageIcon = STAGE_ICONS[index];
          const isComplete = stage.number < currentStage;
          const isActive = stage.number === currentStage;

          return (
            <div key={stage.number} className="flex flex-1 items-center">
              {/* Stage icon circle + label */}
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isComplete
                      ? "bg-[#5B7C50] text-white"
                      : isActive
                        ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(249,168,66,0.3)] ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StageIcon size={14} />
                </div>
                <span
                  className={`hidden text-[10px] sm:block ${
                    isActive
                      ? "font-semibold text-primary"
                      : isComplete
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
                    isComplete ? "bg-[#5B7C50]" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
