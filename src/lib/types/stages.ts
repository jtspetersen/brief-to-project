/** The 6 stages of the project documentation journey */
export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface Stage {
  number: StageNumber;
  label: string;
  description: string;
}

export const STAGES: Stage[] = [
  { number: 1, label: "Discover", description: "Discover & Intake" },
  { number: 2, label: "Define", description: "Define & Scope" },
  { number: 3, label: "Plan", description: "Structure & Plan" },
  { number: 4, label: "Govern", description: "Stakeholders & Governance" },
  { number: 5, label: "Risk", description: "Risk & Quality" },
  { number: 6, label: "Package", description: "Package & Kickoff" },
];
