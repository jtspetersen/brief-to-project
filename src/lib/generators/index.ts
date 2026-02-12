/**
 * Generator Index
 *
 * Maps artifact types to their document generator functions.
 * Used by the /api/generate-artifact route to dispatch to the right generator.
 */
import type { ArtifactType } from "@/lib/types/artifacts";

import { generateProjectBrief } from "./project-brief-generator";
import { generateProjectClassification } from "./project-classification-generator";
import { generateCharter } from "./charter-generator";
import { generateScopeStatement } from "./scope-statement-generator";
import { generateBusinessCase } from "./business-case-generator";
import { generateSuccessCriteria } from "./success-criteria-generator";
import { generateWbs } from "./wbs-generator";
import { generateSchedule } from "./schedule-generator";
import { generateBudget } from "./budget-generator";
import { generateResourcePlan } from "./resource-plan-generator";
import { generateStakeholderRegister } from "./stakeholder-register-generator";
import { generateRaciMatrix } from "./raci-matrix-generator";
import { generateCommunicationPlan } from "./communication-plan-generator";
import { generateGovernanceStructure } from "./governance-structure-generator";
import { generateRiskRegister } from "./risk-register-generator";
import { generateQualityPlan } from "./quality-plan-generator";
import { generateChangeManagementPlan } from "./change-management-plan-generator";
import { generateSowPid } from "./sow-pid-generator";
import { generateKickoffAgenda } from "./kickoff-agenda-generator";
import { generateCompletenessReport } from "./completeness-report-generator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratorFn = (data: any) => Promise<Buffer>;

/**
 * Registry of all document generators, keyed by artifact type.
 * Each function takes the artifact's `data` object and returns a Buffer (.docx).
 */
export const generators: Record<ArtifactType, GeneratorFn> = {
  "project-brief": generateProjectBrief,
  "project-classification": generateProjectClassification,
  "charter": generateCharter,
  "scope-statement": generateScopeStatement,
  "business-case": generateBusinessCase,
  "success-criteria": generateSuccessCriteria,
  "wbs": generateWbs,
  "schedule": generateSchedule,
  "budget": generateBudget,
  "resource-plan": generateResourcePlan,
  "stakeholder-register": generateStakeholderRegister,
  "raci-matrix": generateRaciMatrix,
  "communication-plan": generateCommunicationPlan,
  "governance-structure": generateGovernanceStructure,
  "risk-register": generateRiskRegister,
  "quality-plan": generateQualityPlan,
  "change-management-plan": generateChangeManagementPlan,
  "sow-pid": generateSowPid,
  "kickoff-agenda": generateKickoffAgenda,
  "completeness-report": generateCompletenessReport,
};

/** File name for a downloaded artifact */
export function getFileName(artifactType: ArtifactType, projectName: string): string {
  const safeName = projectName.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "_");
  const typeLabel = artifactType.replace(/-/g, "_");
  return `${safeName}_${typeLabel}.docx`;
}
