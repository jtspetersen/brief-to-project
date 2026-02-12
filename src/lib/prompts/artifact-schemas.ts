/**
 * Layer 4: Artifact Schemas
 *
 * Defines HOW the AI should output structured data for each artifact type.
 * These JSON schemas tell the AI exactly what fields to include when
 * generating an artifact, so the frontend can parse and render them.
 *
 * Only Stage 1 schemas are fully defined for now (MVP focus).
 * Other stages will be expanded as we build them in Phase 3.
 */
export const ARTIFACT_SCHEMAS = `## Artifact Output Format

When generating an artifact, wrap it in a fenced code block tagged "artifact":

\\\`\\\`\\\`artifact
{
  "type": "<artifact-type>",
  "title": "<Document Title>",
  "stage": <stage-number>,
  "data": { ... }
}
\\\`\\\`\\\`

### Stage 1 Artifact Schemas

#### project-brief
{
  "type": "project-brief",
  "title": "Project Brief — <Project Name>",
  "stage": 1,
  "data": {
    "projectName": "string",
    "projectSponsor": "string",
    "date": "string (YYYY-MM-DD)",
    "problemStatement": "string — What problem or opportunity does this address?",
    "projectDescription": "string — 2-3 sentence overview of what will be delivered",
    "businessDrivers": ["string — Why now? What's driving this?"],
    "objectives": ["string — High-level project objectives"],
    "estimatedBudget": "string — e.g., '$850,000'",
    "estimatedTimeline": "string — e.g., '8 months'",
    "estimatedTeamSize": "string — e.g., '12-15 people'",
    "keyStakeholders": ["string — Name and role"],
    "initialRisks": ["string — Any early-identified risks"],
    "methodology": "string — Recommended approach (Agile, Waterfall, Hybrid)",
    "successCriteria": ["string — How will we know it succeeded?"]
  }
}

#### project-classification
{
  "type": "project-classification",
  "title": "Project Classification — <Project Name>",
  "stage": 1,
  "data": {
    "projectName": "string",
    "projectType": "string — e.g., 'Software / Digital'",
    "industry": "string — e.g., 'E-commerce / Retail'",
    "methodology": "string — Agile | Waterfall | Hybrid",
    "methodologyRationale": "string — Why this methodology fits",
    "complexity": "string — Small | Medium | Large | Enterprise",
    "complexityFactors": {
      "budget": "string — range and assessment",
      "timeline": "string — duration and assessment",
      "teamSize": "string — size and assessment",
      "stakeholderCount": "string — count and assessment"
    },
    "keyCharacteristics": ["string — Notable project characteristics"],
    "recommendedArtifacts": ["string — Which documents are most important for this project type"]
  }
}

### Stage 2 Artifact Schemas (Define & Scope)

#### charter
{
  "type": "charter",
  "title": "Project Charter — <Project Name>",
  "stage": 2,
  "data": {
    "projectName": "string",
    "projectSponsor": "string",
    "projectManager": "string",
    "date": "string",
    "executiveSummary": "string",
    "businessCase": {
      "problemStatement": "string",
      "strategicAlignment": "string",
      "expectedBenefits": ["string"],
      "costBenefitSummary": "string"
    },
    "objectives": [{ "objective": "string", "measure": "string", "target": "string" }],
    "scope": {
      "inScope": ["string"],
      "outOfScope": ["string"],
      "assumptions": ["string"],
      "constraints": ["string"]
    },
    "milestones": [{ "milestone": "string", "targetDate": "string" }],
    "budget": { "estimated": "string", "contingency": "string", "fundingSource": "string" },
    "risks": [{ "risk": "string", "impact": "string", "mitigation": "string" }],
    "approvers": [{ "name": "string", "role": "string" }]
  }
}

#### scope-statement
{
  "type": "scope-statement",
  "title": "Scope Statement — <Project Name>",
  "stage": 2,
  "data": {
    "projectName": "string",
    "projectObjective": "string",
    "inScope": [{ "item": "string", "description": "string" }],
    "outOfScope": [{ "item": "string", "rationale": "string" }],
    "deliverables": [{ "deliverable": "string", "description": "string", "acceptanceCriteria": "string" }],
    "assumptions": ["string"],
    "constraints": ["string"]
  }
}

#### business-case
{
  "type": "business-case",
  "title": "Business Case — <Project Name>",
  "stage": 2,
  "data": {
    "projectName": "string",
    "executiveSummary": "string",
    "problemStatement": "string",
    "proposedSolution": "string",
    "benefits": [{ "benefit": "string", "type": "string (tangible|intangible)", "estimatedValue": "string" }],
    "costs": [{ "category": "string", "amount": "string", "notes": "string" }],
    "roi": "string",
    "risks": ["string"],
    "recommendation": "string"
  }
}

#### success-criteria
{
  "type": "success-criteria",
  "title": "Success Criteria & KPIs — <Project Name>",
  "stage": 2,
  "data": {
    "projectName": "string",
    "kpis": [{
      "name": "string",
      "description": "string",
      "baseline": "string",
      "target": "string",
      "measurementMethod": "string",
      "frequency": "string"
    }]
  }
}

### Stages 3-6 Schemas

Schemas for Stages 3-6 artifacts (WBS, Schedule, Budget, Resource Plan, Stakeholder Register, RACI, Risk Register, etc.) will be defined when those stages are built. For now, if a PM jumps ahead, use reasonable JSON structures following the same pattern.`;
