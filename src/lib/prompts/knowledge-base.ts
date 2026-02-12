/**
 * Layer 2: PM Knowledge Base
 *
 * Defines WHAT the AI knows — PM frameworks, templates, classification
 * rules, and bias detection. This gives the AI deep domain expertise
 * without having to re-discover it every conversation.
 */
export const KNOWLEDGE_BASE = `## Project Classification Framework

When classifying a project in Stage 1, assess these dimensions:

PROJECT TYPE (determines WBS templates, risk categories, and terminology):
- Software / Digital — Apps, platforms, systems, integrations
- Infrastructure — Construction, facilities, network, cloud migration
- Marketing / Creative — Campaigns, rebranding, content programs
- Organizational Change — Restructuring, process transformation, culture change
- Research / Innovation — R&D, proof of concept, pilot programs
- Hybrid — Combination of the above

METHODOLOGY RECOMMENDATION (based on project characteristics):
- Agile: High uncertainty, evolving requirements, software-heavy, team < 15
- Waterfall: Fixed scope, regulatory requirements, construction/infrastructure, clear phases
- Hybrid: Mix of fixed milestones with iterative delivery, brand approvals + agile development

COMPLEXITY INDICATORS:
- Budget: < $100K (small), $100K-$500K (medium), $500K-$2M (large), > $2M (enterprise)
- Timeline: < 3 months (short), 3-6 months (medium), 6-12 months (long), > 12 months (extended)
- Team: < 5 (small), 5-15 (medium), 15-30 (large), > 30 (enterprise)
- Stakeholders: < 5 (focused), 5-15 (moderate), > 15 (complex governance needed)

## Program Charter Structure

A comprehensive charter should include:
1. Executive Summary — One paragraph capturing the "what and why"
2. Business Case — Problem statement, strategic alignment, expected benefits, cost-benefit summary
3. Objectives — SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)
4. Success Criteria / KPIs — Measurable indicators of project success
5. Scope — In-scope items, out-of-scope items, assumptions, constraints
6. Work Breakdown Structure — Hierarchical decomposition of deliverables
7. Timeline & Milestones — Key dates, phases, dependencies
8. Stakeholder Map — Key stakeholders with power/interest classification
9. Resource Plan — Roles, allocation percentages, skill requirements
10. Budget Estimate — Cost categories, contingency, funding source
11. Risk Summary — Top 5-10 risks with probability, impact, and mitigation
12. Communication Plan — Who gets what information, how often, via what channel
13. Governance — Decision authority, escalation paths, approval processes
14. Quality Approach — Standards, review cadence, acceptance criteria

## Stakeholder Analysis Framework

POWER-INTEREST GRID:
- High Power, High Interest → Manage Closely (key decision makers)
- High Power, Low Interest → Keep Satisfied (executives, sponsors)
- Low Power, High Interest → Keep Informed (end users, team leads)
- Low Power, Low Interest → Monitor (peripheral stakeholders)

RACI DEFINITIONS:
- Responsible (R): Does the work
- Accountable (A): Ultimately answerable, only ONE per task
- Consulted (C): Provides input before the work
- Informed (I): Notified after the work

## Risk Management Framework

RISK CATEGORIES (adapt based on project type):
1. Technical / Technology — Architecture, integration, performance, security
2. Resource / People — Availability, skills gaps, turnover, dependencies on key people
3. Schedule / Timeline — Dependencies, critical path, external milestones
4. Budget / Financial — Cost overruns, funding changes, vendor pricing
5. Scope / Requirements — Scope creep, unclear requirements, changing priorities

PROBABILITY-IMPACT MATRIX:
- Probability: Very Low (1), Low (2), Medium (3), High (4), Very High (5)
- Impact: Negligible (1), Minor (2), Moderate (3), Major (4), Severe (5)
- Risk Score = Probability × Impact
- High risks (score ≥ 12): Require mitigation plan + contingency plan + named owner
- Medium risks (score 6-11): Require mitigation plan + named owner
- Low risks (score ≤ 5): Monitor, document in register

## Bias Detection Framework

Watch for these cognitive biases during the conversation and gently challenge them:

OPTIMISM BIAS — PM overestimates positive outcomes
- Warning signs: "Everything should go smoothly", no risks identified, aggressive timeline with no buffer
- Challenge: "That's an ambitious timeline. What's your contingency if the design approval takes longer than expected?"

PLANNING FALLACY — Underestimating time, costs, or complexity
- Warning signs: Estimates significantly below industry averages, no buffer for unknowns
- Challenge: "Based on similar projects, a design system build typically takes 3-4 months. Your estimate of 6 weeks — is that based on a specific team capability?"

CONFIRMATION BIAS — Only considering evidence that supports existing beliefs
- Warning signs: Dismissing risks, ignoring stakeholder concerns, "we've always done it this way"
- Challenge: "You mentioned the team is confident about the migration. Have you explored what could go wrong? Sometimes the biggest risks are the ones we don't expect."

AVAILABILITY BIAS — Overweighting recent or memorable events
- Warning signs: Risk register only contains risks from the last project, uniform risk ratings
- Challenge: "I notice all risks are rated Medium. Could some of these be higher? Sometimes we rate things lower when we haven't experienced them recently."

ANCHORING BIAS — Over-relying on first piece of information
- Warning signs: Budget or timeline locked to initial estimate without validation
- Challenge: "The $500K figure — where did that come from? Let's build up the budget from the work breakdown to see if it holds."`;
