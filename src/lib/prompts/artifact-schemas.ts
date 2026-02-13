/**
 * Layer 4: Artifact Schemas
 *
 * Defines HOW the AI should output structured data for each artifact type.
 * Only sends schemas relevant to the current stage (+ next stage) to reduce tokens.
 */
import type { StageNumber } from "@/lib/types/stages";

const SCHEMA_HEADER = `## Artifact Output Format

When generating an artifact, wrap it in a fenced code block tagged "artifact":

\`\`\`artifact
{
  "type": "<artifact-type>",
  "title": "<Document Title>",
  "stage": <stage-number>,
  "data": { ... }
}
\`\`\`

## Data Completeness Rules

- Fields marked "if known" can be omitted or set to "TBD" if the user hasn't provided the info
- For stakeholder names, company names, and other specific identifiers: use role-based placeholders (e.g., "Project Sponsor", "Engineering Lead") unless the user has provided actual names
- Never invent specific names, companies, or figures — use generic role titles or "[To be confirmed]" instead
- It is OK to leave sections partially complete; the user can refine later
`;

const STAGE_1_SCHEMAS = `### Stage 1 Schemas

#### project-brief
{ "type": "project-brief", "stage": 1, "data": {
  "projectName": "string",
  "projectSponsor": "string (if known)",
  "date": "string (YYYY-MM-DD)",
  "problemStatement": "string",
  "projectDescription": "string — 2-3 sentence overview",
  "businessDrivers": ["string"],
  "objectives": ["string — high-level"],
  "estimatedBudget": "string",
  "estimatedTimeline": "string",
  "estimatedTeamSize": "string",
  "keyStakeholders": ["string — name/role if known"],
  "initialRisks": ["string"],
  "methodology": "string — Agile | Waterfall | Hybrid",
  "successCriteria": ["string"]
}}

#### project-classification
{ "type": "project-classification", "stage": 1, "data": {
  "projectName": "string",
  "projectType": "string",
  "industry": "string",
  "methodology": "string",
  "methodologyRationale": "string",
  "complexity": "string — Small | Medium | Large | Enterprise",
  "complexityFactors": { "budget": "string", "timeline": "string", "teamSize": "string", "stakeholderCount": "string" },
  "keyCharacteristics": ["string"],
  "recommendedArtifacts": ["string"]
}}`;

const STAGE_2_SCHEMAS = `### Stage 2 Schemas

#### charter
{ "type": "charter", "stage": 2, "data": {
  "projectName": "string",
  "projectSponsor": "string (if known)",
  "projectManager": "string (if known)",
  "date": "string",
  "executiveSummary": "string",
  "businessCase": { "problemStatement": "string", "strategicAlignment": "string", "expectedBenefits": ["string"], "costBenefitSummary": "string" },
  "objectives": [{ "objective": "string", "measure": "string", "target": "string" }],
  "scope": { "inScope": ["string"], "outOfScope": ["string"], "assumptions": ["string"], "constraints": ["string"] },
  "milestones": [{ "milestone": "string", "targetDate": "string" }],
  "budget": { "estimated": "string", "contingency": "string", "fundingSource": "string (if known)" },
  "risks": [{ "risk": "string", "impact": "string", "mitigation": "string" }],
  "approvers": [{ "name": "string (or role)", "role": "string" }]
}}

#### scope-statement
{ "type": "scope-statement", "stage": 2, "data": {
  "projectName": "string",
  "projectObjective": "string",
  "inScope": [{ "item": "string", "description": "string" }],
  "outOfScope": [{ "item": "string", "rationale": "string" }],
  "deliverables": [{ "deliverable": "string", "description": "string", "acceptanceCriteria": "string" }],
  "assumptions": ["string"],
  "constraints": ["string"]
}}

#### business-case
{ "type": "business-case", "stage": 2, "data": {
  "projectName": "string",
  "executiveSummary": "string",
  "problemStatement": "string",
  "proposedSolution": "string",
  "benefits": [{ "benefit": "string", "type": "tangible|intangible", "estimatedValue": "string (if known)" }],
  "costs": [{ "category": "string", "amount": "string", "notes": "string" }],
  "roi": "string (if calculable)",
  "risks": ["string"],
  "recommendation": "string"
}}

#### success-criteria
{ "type": "success-criteria", "stage": 2, "data": {
  "projectName": "string",
  "kpis": [{ "name": "string", "description": "string", "baseline": "string (if known)", "target": "string", "measurementMethod": "string", "frequency": "string" }]
}}`;

const STAGE_3_SCHEMAS = `### Stage 3 Schemas

#### wbs
{ "type": "wbs", "stage": 3, "data": {
  "projectName": "string",
  "methodology": "string",
  "deliverables": [{ "id": "string (e.g. 1.0)", "name": "string", "workPackages": [{ "id": "string (e.g. 1.1)", "name": "string", "tasks": [{ "id": "string (e.g. 1.1.1)", "name": "string", "estimatedEffort": "string", "estimatedDuration": "string", "owner": "string (role)" }] }] }]
}}

#### schedule
{ "type": "schedule", "stage": 3, "data": {
  "projectName": "string",
  "startDate": "string",
  "endDate": "string",
  "phases": [{ "name": "string", "startDate": "string", "endDate": "string", "milestones": [{ "name": "string", "date": "string" }], "dependencies": ["string"], "keyDeliverables": ["string"] }],
  "criticalPath": ["string"]
}}

#### budget
{ "type": "budget", "stage": 3, "data": {
  "projectName": "string",
  "currency": "string",
  "categories": [{ "category": "string", "lineItems": [{ "item": "string", "amount": "string", "notes": "string" }], "subtotal": "string" }],
  "contingency": { "percentage": "string", "amount": "string" },
  "totalBudget": "string"
}}

#### resource-plan
{ "type": "resource-plan", "stage": 3, "data": {
  "projectName": "string",
  "roles": [{ "role": "string", "description": "string", "skills": ["string"], "allocation": "string", "duration": "string", "source": "Internal | Contractor | Vendor", "estimatedCost": "string (if known)" }],
  "totalHeadcount": "string",
  "sourcingNotes": "string"
}}`;

const STAGE_4_SCHEMAS = `### Stage 4 Schemas

#### stakeholder-register
{ "type": "stakeholder-register", "stage": 4, "data": {
  "projectName": "string",
  "stakeholders": [{ "name": "string (role title if name unknown)", "role": "string", "organization": "string (if known)", "power": "High | Medium | Low", "interest": "High | Medium | Low", "classification": "Manage Closely | Keep Satisfied | Keep Informed | Monitor", "attitude": "Supportive | Neutral | Resistant", "engagementStrategy": "string" }]
}}

#### raci-matrix
{ "type": "raci-matrix", "stage": 4, "data": {
  "projectName": "string",
  "roles": ["string"],
  "items": [{ "deliverable": "string (from WBS)", "assignments": [{ "role": "string", "type": "R | A | C | I" }] }]
}}

#### communication-plan
{ "type": "communication-plan", "stage": 4, "data": {
  "projectName": "string",
  "communications": [{ "audience": "string", "information": "string", "frequency": "string", "channel": "string", "owner": "string (role)" }]
}}

#### governance-structure
{ "type": "governance-structure", "stage": 4, "data": {
  "projectName": "string",
  "decisionAuthority": [{ "decisionType": "string", "authority": "string", "threshold": "string" }],
  "escalationPath": [{ "level": "string", "role": "string", "timeframe": "string" }],
  "meetings": [{ "name": "string", "frequency": "string", "attendees": ["string"], "purpose": "string" }]
}}`;

const STAGE_5_SCHEMAS = `### Stage 5 Schemas

#### risk-register
{ "type": "risk-register", "stage": 5, "data": {
  "projectName": "string",
  "risks": [{ "id": "string (e.g. R-001)", "category": "Technical | Resource | Schedule | Budget | Scope", "description": "string", "probability": "number 1-5", "impact": "number 1-5", "score": "number (p×i)", "rating": "Low | Medium | High | Critical", "mitigation": "string", "contingency": "string (for High/Critical)", "owner": "string (role)", "status": "Open | Mitigating | Closed" }]
}}

#### quality-plan
{ "type": "quality-plan", "stage": 5, "data": {
  "projectName": "string",
  "qualityObjectives": ["string"],
  "standards": [{ "deliverable": "string", "qualityStandard": "string", "acceptanceCriteria": "string", "reviewProcess": "string", "reviewer": "string (role)" }],
  "qualityMetrics": [{ "metric": "string", "target": "string", "measurementMethod": "string", "frequency": "string" }],
  "continuousImprovement": "string"
}}

#### change-management-plan
{ "type": "change-management-plan", "stage": 5, "data": {
  "projectName": "string",
  "changeProcess": { "submissionMethod": "string", "requiredInformation": ["string"], "impactAssessment": "string" },
  "approvalThresholds": [{ "changeType": "string", "approver": "string", "process": "string" }],
  "changeLogFields": ["string"]
}}`;

const STAGE_6_SCHEMAS = `### Stage 6 Schemas

#### sow-pid
{ "type": "sow-pid", "stage": 6, "data": {
  "projectName": "string",
  "version": "string",
  "date": "string",
  "executiveSummary": "string",
  "objectives": ["string"],
  "scopeSummary": { "inScope": ["string"], "outOfScope": ["string"] },
  "wbsSummary": ["string — top-level deliverables"],
  "scheduleSummary": { "startDate": "string", "endDate": "string", "keyMilestones": [{ "milestone": "string", "date": "string" }] },
  "budgetSummary": { "totalBudget": "string", "contingency": "string" },
  "teamSummary": ["string — key roles"],
  "governanceSummary": "string",
  "topRisks": [{ "risk": "string", "rating": "string", "mitigation": "string" }],
  "qualityApproach": "string",
  "approvals": [{ "name": "string (or role)", "role": "string", "date": "string" }]
}}

#### kickoff-agenda
{ "type": "kickoff-agenda", "stage": 6, "data": {
  "projectName": "string",
  "meetingDate": "string (or TBD)",
  "meetingTime": "string (or TBD)",
  "location": "string (or TBD)",
  "attendees": [{ "name": "string (or role)", "role": "string" }],
  "agendaItems": [{ "topic": "string", "presenter": "string (role)", "duration": "string", "description": "string" }],
  "preReadMaterials": ["string"],
  "actionItems": ["string"]
}}

#### completeness-report
{ "type": "completeness-report", "stage": 6, "data": {
  "projectName": "string",
  "generatedDate": "string",
  "artifacts": [{ "type": "string", "title": "string", "stage": "number", "status": "Complete | Partial | Missing", "notes": "string" }],
  "consistencyChecks": [{ "check": "string", "result": "Pass | Warning | Fail", "notes": "string" }],
  "recommendations": ["string"],
  "overallStatus": "Ready for Kickoff | Needs Review | Incomplete"
}}`;

const SCHEMAS_BY_STAGE: Record<StageNumber, string> = {
  1: STAGE_1_SCHEMAS,
  2: STAGE_2_SCHEMAS,
  3: STAGE_3_SCHEMAS,
  4: STAGE_4_SCHEMAS,
  5: STAGE_5_SCHEMAS,
  6: STAGE_6_SCHEMAS,
};

/**
 * Returns artifact schemas for the current stage and the next stage only,
 * reducing token usage significantly vs. sending all 15 schemas every time.
 */
export function getArtifactSchemas(currentStage: StageNumber): string {
  const parts = [SCHEMA_HEADER, SCHEMAS_BY_STAGE[currentStage]];

  // Include next stage schemas so the AI can anticipate what's coming
  const nextStage = (currentStage + 1) as StageNumber;
  if (nextStage <= 6 && SCHEMAS_BY_STAGE[nextStage]) {
    parts.push(SCHEMAS_BY_STAGE[nextStage]);
  }

  return parts.join("\n\n");
}
