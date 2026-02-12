/**
 * Layer 4: Artifact Schemas
 *
 * Defines HOW the AI should output structured data for each artifact type.
 * These JSON schemas tell the AI exactly what fields to include when
 * generating an artifact, so the frontend can parse and render them.
 */
export const ARTIFACT_SCHEMAS = `## Artifact Output Format

When generating an artifact, wrap it in a fenced code block tagged "artifact":

\`\`\`artifact
{
  "type": "<artifact-type>",
  "title": "<Document Title>",
  "stage": <stage-number>,
  "data": { ... }
}
\`\`\`

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

### Stage 3 Artifact Schemas (Structure & Plan)

#### wbs
{
  "type": "wbs",
  "title": "Work Breakdown Structure — <Project Name>",
  "stage": 3,
  "data": {
    "projectName": "string",
    "methodology": "string — Agile | Waterfall | Hybrid",
    "deliverables": [{
      "id": "string — e.g., '1.0'",
      "name": "string — deliverable name",
      "workPackages": [{
        "id": "string — e.g., '1.1'",
        "name": "string",
        "tasks": [{
          "id": "string — e.g., '1.1.1'",
          "name": "string",
          "estimatedEffort": "string — e.g., '40 hours'",
          "estimatedDuration": "string — e.g., '2 weeks'",
          "owner": "string — role or person"
        }]
      }]
    }]
  }
}

#### schedule
{
  "type": "schedule",
  "title": "Project Schedule — <Project Name>",
  "stage": 3,
  "data": {
    "projectName": "string",
    "startDate": "string",
    "endDate": "string",
    "phases": [{
      "name": "string",
      "startDate": "string",
      "endDate": "string",
      "milestones": [{ "name": "string", "date": "string" }],
      "dependencies": ["string — what must complete before this phase"],
      "keyDeliverables": ["string"]
    }],
    "criticalPath": ["string — phases/tasks on the critical path"]
  }
}

#### budget
{
  "type": "budget",
  "title": "Budget Estimate — <Project Name>",
  "stage": 3,
  "data": {
    "projectName": "string",
    "currency": "string — e.g., 'USD'",
    "categories": [{
      "category": "string — e.g., 'Personnel', 'Tools & Licenses'",
      "lineItems": [{
        "item": "string",
        "amount": "string",
        "notes": "string"
      }],
      "subtotal": "string"
    }],
    "contingency": { "percentage": "string", "amount": "string" },
    "totalBudget": "string"
  }
}

#### resource-plan
{
  "type": "resource-plan",
  "title": "Resource Plan — <Project Name>",
  "stage": 3,
  "data": {
    "projectName": "string",
    "roles": [{
      "role": "string",
      "description": "string",
      "skills": ["string"],
      "allocation": "string — e.g., '100%' or '50%'",
      "duration": "string — e.g., 'Months 1-8'",
      "source": "string — Internal | Contractor | Vendor",
      "estimatedCost": "string"
    }],
    "totalHeadcount": "string",
    "sourcingNotes": "string — any notes on hiring, onboarding, etc."
  }
}

### Stage 4 Artifact Schemas (Stakeholders & Governance)

#### stakeholder-register
{
  "type": "stakeholder-register",
  "title": "Stakeholder Register — <Project Name>",
  "stage": 4,
  "data": {
    "projectName": "string",
    "stakeholders": [{
      "name": "string",
      "role": "string",
      "organization": "string",
      "power": "string — High | Medium | Low",
      "interest": "string — High | Medium | Low",
      "classification": "string — Manage Closely | Keep Satisfied | Keep Informed | Monitor",
      "attitude": "string — Supportive | Neutral | Resistant",
      "engagementStrategy": "string"
    }]
  }
}

#### raci-matrix
{
  "type": "raci-matrix",
  "title": "RACI Matrix — <Project Name>",
  "stage": 4,
  "data": {
    "projectName": "string",
    "roles": ["string — column headers (role names)"],
    "items": [{
      "deliverable": "string — from WBS",
      "assignments": [{ "role": "string", "type": "string — R | A | C | I" }]
    }]
  }
}

#### communication-plan
{
  "type": "communication-plan",
  "title": "Communication Plan — <Project Name>",
  "stage": 4,
  "data": {
    "projectName": "string",
    "communications": [{
      "audience": "string — stakeholder or group",
      "information": "string — what they need to know",
      "frequency": "string — e.g., 'Weekly', 'Monthly', 'As needed'",
      "channel": "string — e.g., 'Email', 'Meeting', 'Slack', 'Report'",
      "owner": "string — who sends/manages this communication"
    }]
  }
}

#### governance-structure
{
  "type": "governance-structure",
  "title": "Governance Structure — <Project Name>",
  "stage": 4,
  "data": {
    "projectName": "string",
    "decisionAuthority": [{
      "decisionType": "string — e.g., 'Scope change', 'Budget reallocation'",
      "authority": "string — who can approve",
      "threshold": "string — e.g., 'Changes > $10K require steering committee'"
    }],
    "escalationPath": [{
      "level": "string — e.g., 'Level 1: Project Manager'",
      "role": "string",
      "timeframe": "string — e.g., 'Within 24 hours'"
    }],
    "meetings": [{
      "name": "string — e.g., 'Steering Committee'",
      "frequency": "string",
      "attendees": ["string"],
      "purpose": "string"
    }]
  }
}

### Stage 5 Artifact Schemas (Risk & Quality)

#### risk-register
{
  "type": "risk-register",
  "title": "Risk Register — <Project Name>",
  "stage": 5,
  "data": {
    "projectName": "string",
    "risks": [{
      "id": "string — e.g., 'R-001'",
      "category": "string — Technical | Resource | Schedule | Budget | Scope",
      "description": "string",
      "probability": "number — 1-5",
      "impact": "number — 1-5",
      "score": "number — probability x impact",
      "rating": "string — Low | Medium | High | Critical",
      "mitigation": "string",
      "contingency": "string",
      "owner": "string",
      "status": "string — Open | Mitigating | Closed"
    }]
  }
}

#### quality-plan
{
  "type": "quality-plan",
  "title": "Quality Management Plan — <Project Name>",
  "stage": 5,
  "data": {
    "projectName": "string",
    "qualityObjectives": ["string"],
    "standards": [{
      "deliverable": "string",
      "qualityStandard": "string",
      "acceptanceCriteria": "string",
      "reviewProcess": "string",
      "reviewer": "string"
    }],
    "qualityMetrics": [{
      "metric": "string",
      "target": "string",
      "measurementMethod": "string",
      "frequency": "string"
    }],
    "continuousImprovement": "string"
  }
}

#### change-management-plan
{
  "type": "change-management-plan",
  "title": "Change Management Plan — <Project Name>",
  "stage": 5,
  "data": {
    "projectName": "string",
    "changeProcess": {
      "submissionMethod": "string — how to submit a change request",
      "requiredInformation": ["string — what must be included"],
      "impactAssessment": "string — how changes are evaluated"
    },
    "approvalThresholds": [{
      "changeType": "string — e.g., 'Schedule change < 1 week'",
      "approver": "string",
      "process": "string"
    }],
    "changeLogFields": ["string — fields tracked for each change"]
  }
}

### Stage 6 Artifact Schemas (Package & Kickoff)

#### sow-pid
{
  "type": "sow-pid",
  "title": "Statement of Work / Project Initiation Document — <Project Name>",
  "stage": 6,
  "data": {
    "projectName": "string",
    "version": "string",
    "date": "string",
    "executiveSummary": "string — pulls from charter",
    "objectives": ["string — from charter/success criteria"],
    "scopeSummary": { "inScope": ["string"], "outOfScope": ["string"] },
    "wbsSummary": ["string — top-level deliverables from WBS"],
    "scheduleSummary": { "startDate": "string", "endDate": "string", "keyMilestones": [{ "milestone": "string", "date": "string" }] },
    "budgetSummary": { "totalBudget": "string", "contingency": "string" },
    "teamSummary": ["string — key roles from resource plan"],
    "governanceSummary": "string",
    "topRisks": [{ "risk": "string", "rating": "string", "mitigation": "string" }],
    "qualityApproach": "string",
    "approvals": [{ "name": "string", "role": "string", "date": "string" }]
  }
}

#### kickoff-agenda
{
  "type": "kickoff-agenda",
  "title": "Kickoff Meeting Agenda — <Project Name>",
  "stage": 6,
  "data": {
    "projectName": "string",
    "meetingDate": "string",
    "meetingTime": "string",
    "location": "string",
    "attendees": [{ "name": "string", "role": "string" }],
    "agendaItems": [{
      "topic": "string",
      "presenter": "string",
      "duration": "string",
      "description": "string"
    }],
    "preReadMaterials": ["string — documents to review before the meeting"],
    "actionItems": ["string — post-meeting follow-ups"]
  }
}

#### completeness-report
{
  "type": "completeness-report",
  "title": "Documentation Completeness Report — <Project Name>",
  "stage": 6,
  "data": {
    "projectName": "string",
    "generatedDate": "string",
    "artifacts": [{
      "type": "string",
      "title": "string",
      "stage": "number",
      "status": "string — Complete | Partial | Missing",
      "notes": "string"
    }],
    "consistencyChecks": [{
      "check": "string — what was verified",
      "result": "string — Pass | Warning | Fail",
      "notes": "string"
    }],
    "recommendations": ["string"],
    "overallStatus": "string — Ready for Kickoff | Needs Review | Incomplete"
  }
}`;
