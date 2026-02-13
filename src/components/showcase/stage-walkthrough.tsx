import { STAGE_ICONS } from "@/components/ui/icons";

interface StageInfo {
  name: string;
  description: string;
  artifacts: string[];
}

const STAGES: StageInfo[] = [
  {
    name: "Discover & Intake",
    description: "Understand the project, classify it, generate a Project Brief",
    artifacts: ["Project Brief", "Project Classification"],
  },
  {
    name: "Define & Scope",
    description: "Set objectives, define scope, build the business case",
    artifacts: ["Charter", "Scope Statement", "Business Case", "KPIs"],
  },
  {
    name: "Structure & Plan",
    description: "Create WBS, schedule, budget, and resource plan",
    artifacts: ["WBS", "Schedule", "Budget", "Resource Plan"],
  },
  {
    name: "Stakeholders & Governance",
    description: "Map stakeholders, build RACI, plan communications",
    artifacts: ["Stakeholder Register", "RACI Matrix", "Comms Plan"],
  },
  {
    name: "Risk & Quality",
    description: "Identify risks, plan quality and change management",
    artifacts: ["Risk Register", "Quality Plan", "Change Mgmt Plan"],
  },
  {
    name: "Package & Kickoff",
    description: "Assemble final docs, review completeness, prepare kickoff",
    artifacts: ["SOW/PID", "Kickoff Agenda", "Full Package (.zip)"],
  },
];

export function StageWalkthrough() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-display text-center text-2xl text-foreground">
          The 6-Stage Journey
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
          From initial idea to complete, downloadable documentation. One
          conversation. Dynamically shaped to your project — whether
          that&apos;s a lean brief or an enterprise-ready package.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage, index) => {
            const StageIcon = STAGE_ICONS[index];
            return (
              <div
                key={index}
                className="rounded-lg border border-border/50 bg-card p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <StageIcon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Stage {index + 1}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground">
                      {stage.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stage.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {stage.artifacts.map((artifact) => (
                    <span
                      key={artifact}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      {artifact}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
