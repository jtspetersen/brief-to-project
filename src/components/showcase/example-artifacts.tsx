import { IconDocuments } from "@/components/ui/icons";

interface ExampleArtifact {
  title: string;
  stage: number;
  type: string;
  highlights: string[];
}

const EXAMPLES: ExampleArtifact[] = [
  {
    title: "Project Brief",
    stage: 1,
    type: "DOCX",
    highlights: [
      "Problem statement and business drivers",
      "High-level objectives and success criteria",
      "Budget, timeline, and team estimates",
    ],
  },
  {
    title: "Risk Register",
    stage: 5,
    type: "XLSX",
    highlights: [
      "Categorized risks with probability and impact",
      "Mitigation strategies and contingency plans",
      "Automated risk scoring (P x I)",
    ],
  },
  {
    title: "RACI Matrix",
    stage: 4,
    type: "DOCX",
    highlights: [
      "Roles mapped to WBS deliverables",
      "Clear R/A/C/I assignments",
      "Cross-referenced with stakeholder register",
    ],
  },
];

export function ExampleArtifacts() {
  return (
    <section className="border-t border-border/50 bg-card/50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-display text-center text-2xl text-foreground">
          Example Artifacts
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Real documents generated from a single conversation
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {EXAMPLES.map((artifact) => (
            <div
              key={artifact.title}
              className="rounded-lg border border-border/50 bg-card p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <IconDocuments size={16} />
                <span className="text-sm font-semibold text-foreground">
                  {artifact.title}
                </span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Stage {artifact.stage} &middot; {artifact.type}
              </p>
              <ul className="space-y-1.5">
                {artifact.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
