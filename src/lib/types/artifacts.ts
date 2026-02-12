import type { StageNumber } from "./stages";

/** All possible artifact types across the 6 stages */
export type ArtifactType =
  // Stage 1: Discover & Intake
  | "project-brief"
  | "project-classification"
  // Stage 2: Define & Scope
  | "charter"
  | "scope-statement"
  | "business-case"
  | "success-criteria"
  // Stage 3: Structure & Plan
  | "wbs"
  | "schedule"
  | "budget"
  | "resource-plan"
  // Stage 4: Stakeholders & Governance
  | "stakeholder-register"
  | "raci-matrix"
  | "communication-plan"
  | "governance-structure"
  // Stage 5: Risk & Quality
  | "risk-register"
  | "quality-plan"
  | "change-management-plan"
  // Stage 6: Package & Kickoff
  | "sow-pid"
  | "kickoff-agenda"
  | "completeness-report";

/** Download format for generated documents */
export type ArtifactFormat = "docx" | "xlsx" | "pdf" | "zip";

/** The status of an artifact through its lifecycle */
export type ArtifactStatus = "generating" | "draft" | "revised" | "final";

/** A single generated artifact */
export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  stage: StageNumber;
  status: ArtifactStatus;
  format: ArtifactFormat;
  /** The structured data for this artifact (JSON from the AI) */
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
