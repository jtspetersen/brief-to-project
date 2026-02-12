# Brief-to-Project App: Technical Architecture & User Journey Map

## Deliverable 1 of 3 | For Review

**Prepared for:** Josh
**Date:** February 11, 2026
**Status:** Draft for Approval

---

## 1. Executive Summary

The "Brief-to-Project" app is a conversational AI-powered web application that guides program managers from an initial project idea (or existing brief) through to a complete, downloadable project documentation package. The app adapts to the PM's experience level, industry, and project type — providing structured guidance when needed and staying out of the way when the PM knows what they want.

**Core principle:** The AI is a sidecar advisor, not a form wizard. It meets the PM where they are and helps them build the right documentation for their specific situation.

---

## 2. User Journey Map

### 2.1 Journey Overview

The journey is organized into **6 stages**, mapped against industry best practices from PMI (PMBOK 8th Edition process groups), PRINCE2 (Starting Up / Initiating a Project), and Agile (Discovery/Inception). The app covers the pre-execution lifecycle only — from idea through to project kickoff readiness.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  STAGE 1    │    │  STAGE 2    │    │  STAGE 3    │
│  Discover   │───▶│  Define     │───▶│  Structure  │
│  & Intake   │    │  & Scope    │    │  & Plan     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
  Project Brief      Project Charter    WBS, Schedule,
  Problem Statement  Scope Statement      Budget
  Context & Goals    Success Criteria   Resource Plan

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  STAGE 4    │    │  STAGE 5    │    │  STAGE 6    │
│  Stakeholders│───▶│  Risk &     │───▶│  Package &  │
│  & Governance│    │  Quality    │    │  Kickoff    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
  Stakeholder Map    Risk Register      SOW / PID
  RACI Matrix        Quality Plan       Kickoff Deck
  Comms Plan         Change Mgmt Plan   Documentation Package
```

### 2.2 Stage Details

---

#### STAGE 1: Discover & Intake
**Purpose:** Understand what the PM is trying to accomplish and what they already have.

**PMI Alignment:** Initiating Process Group — Develop Project Charter (initial inputs)
**PRINCE2 Alignment:** Starting Up a Project — Project Mandate, Project Brief
**Agile Alignment:** Discovery / Lean Canvas

**User Activities:**
| Activity | What the PM Does | What the AI Does |
|----------|-----------------|------------------|
| 1.1 Entry Point | Starts a conversation OR pastes existing brief/document | Detects whether input is structured (existing brief) or unstructured (idea description) |
| 1.2 Context Gathering | Describes the project idea, problem, or opportunity | Asks targeted questions to fill gaps: Why now? Who's asking? What's the business driver? |
| 1.3 Classification | Confirms project type, industry, size indicators | Classifies project (software, infrastructure, marketing, organizational change, etc.) and recommends appropriate methodology (Agile, Waterfall, Hybrid) |
| 1.4 Existing Asset Intake | Pastes any existing documents they have | Parses pasted content, identifies what's already covered, notes what's missing |
| 1.5 Brief Generation | Reviews and refines AI-generated project brief | Generates a structured 1-page project brief summarizing the idea |

**Artifacts Produced:**
- ✅ Project Brief (1-page summary)
- ✅ Project Classification (type, methodology recommendation, complexity estimate)

**Adaptive Behavior:**
- *New PM:* AI asks discovery questions one at a time, explains why each matters
- *Experienced PM:* AI accepts bulk input, identifies gaps efficiently, skips explanations
- *Has existing docs:* AI parses what they have, identifies gaps against best practices, asks only about missing elements

---

#### STAGE 2: Define & Scope
**Purpose:** Formalize what the project will and won't do, establish objectives, and build the business case.

**PMI Alignment:** Planning Process Group — Define Scope, Collect Requirements
**PRINCE2 Alignment:** Initiating a Project — Project Definition, Business Case
**First Principles Reference:** "Are we speaking the same language or are we in the illusion of agreement?"

**User Activities:**
| Activity | What the PM Does | What the AI Does |
|----------|-----------------|------------------|
| 2.1 Objectives Setting | Articulates project goals | Helps refine into SMART objectives; challenges vague goals |
| 2.2 Scope Definition | Defines in-scope and out-of-scope items | Generates scope boundaries based on project type; flags common scope creep areas for this type of project |
| 2.3 Success Criteria | Defines what "done" looks like | Recommends measurable KPIs based on industry and project type |
| 2.4 Business Case | Provides cost/benefit context | Structures business case; helps quantify benefits |
| 2.5 Assumptions & Constraints | Lists known assumptions | Challenges assumptions using bias detection; identifies hidden constraints |

**Artifacts Produced:**
- ✅ Project Charter (comprehensive)
- ✅ Scope Statement (in-scope, out-of-scope, assumptions, constraints)
- ✅ Business Case Summary
- ✅ Success Criteria / KPIs

**Bias Detection Integration:**
- Optimism bias check on timeline/budget estimates
- Planning fallacy check against similar project types
- Confirmation bias check on assumptions

---

#### STAGE 3: Structure & Plan
**Purpose:** Break the work down, create the timeline, estimate the budget, and plan resources.

**PMI Alignment:** Planning Process Group — Create WBS, Develop Schedule, Estimate Costs, Plan Resources
**PRINCE2 Alignment:** Project Plan creation
**Agile Alignment:** Release Planning, Story Mapping

**User Activities:**
| Activity | What the PM Does | What the AI Does |
|----------|-----------------|------------------|
| 3.1 Work Breakdown | Identifies major deliverables and work packages | Generates WBS template based on project type; suggests common work packages for this kind of project |
| 3.2 Dependency Mapping | Confirms critical dependencies | Identifies likely dependencies; flags critical path items |
| 3.3 Timeline Development | Reviews and adjusts milestones | Generates phase-based timeline with milestones; applies buffer recommendations based on project complexity |
| 3.4 Budget Estimation | Provides cost inputs where known | Structures budget by category; flags typical cost areas PMs miss for this project type |
| 3.5 Resource Planning | Lists known team members/roles needed | Generates resource plan template; recommends roles based on WBS; identifies gaps |

**Artifacts Produced:**
- ✅ Work Breakdown Structure (hierarchical)
- ✅ Project Schedule / Timeline with milestones
- ✅ Budget Estimate (by category)
- ✅ Resource Plan (roles, allocation, skills needed)

---

#### STAGE 4: Stakeholders & Governance
**Purpose:** Identify who's involved, define roles, establish communication cadence, and set up governance.

**PMI Alignment:** Planning Process Group — Identify Stakeholders, Plan Communications
**PRINCE2 Alignment:** Project Management Team Structure, Communication Management Approach
**First Principles Reference:** Ensuring shared understanding across all stakeholders

**User Activities:**
| Activity | What the PM Does | What the AI Does |
|----------|-----------------|------------------|
| 4.1 Stakeholder Identification | Lists known stakeholders | Suggests commonly missed stakeholders based on project type; helps classify by power/interest |
| 4.2 Stakeholder Analysis | Confirms influence and interests | Generates Power-Interest grid; suggests engagement strategy for each quadrant |
| 4.3 RACI Development | Assigns roles per deliverable | Generates RACI matrix template pre-populated based on WBS and stakeholder list |
| 4.4 Communication Planning | Defines preferred communication approach | Recommends cadence, channels, and content per audience; generates communication plan |
| 4.5 Governance Setup | Defines decision-making structure | Recommends governance structure (steering committee, decision authority, escalation paths) based on project size |

**Artifacts Produced:**
- ✅ Stakeholder Register (with Power-Interest classification)
- ✅ RACI Matrix
- ✅ Communication Plan
- ✅ Governance Structure

---

#### STAGE 5: Risk & Quality
**Purpose:** Identify what could go wrong, plan for quality, and establish change management.

**PMI Alignment:** Planning Process Group — Plan Risk Management, Plan Quality, Plan Change Management
**PRINCE2 Alignment:** Risk Management Approach, Quality Management Approach, Change Control Approach

**User Activities:**
| Activity | What the PM Does | What the AI Does |
|----------|-----------------|------------------|
| 5.1 Risk Identification | Lists known risks | Generates comprehensive risk list based on project type, industry, and scope; uses risk categories (Technical, Schedule, Resource, Stakeholder, External) |
| 5.2 Risk Assessment | Rates probability and impact | Helps calibrate ratings; flags where biases might be affecting assessment |
| 5.3 Risk Response Planning | Defines mitigation strategies | Recommends mitigation and contingency for each risk; generates risk register |
| 5.4 Quality Planning | Defines quality expectations | Recommends quality standards and review processes based on project type |
| 5.5 Change Management | Defines change control process | Generates change management plan template with thresholds and approval workflows |

**Artifacts Produced:**
- ✅ Risk Register (with probability, impact, mitigation, contingency, owner)
- ✅ Quality Management Plan
- ✅ Change Management Plan

---

#### STAGE 6: Package & Kickoff
**Purpose:** Assemble all artifacts into a complete project documentation package, run a completeness check, and prepare for kickoff.

**PMI Alignment:** Transition from Planning to Executing — baseline everything
**PRINCE2 Alignment:** Project Initiation Documentation (PID) assembly
**First Principles Reference:** Final alignment check — "Is everyone truly aligned, or is this the illusion of agreement?"

**User Activities:**
| Activity | What the PM Does | What the AI Does |
|----------|-----------------|------------------|
| 6.1 Completeness Review | Reviews assembled documentation | Runs automated completeness check against best practices for this project type; identifies gaps |
| 6.2 Consistency Check | Validates cross-document alignment | Checks that names, dates, scope items, and stakeholders are consistent across all artifacts |
| 6.3 SOW / PID Assembly | Reviews the master project document | Assembles Statement of Work or Project Initiation Document pulling from all artifacts |
| 6.4 Kickoff Preparation | Plans the kickoff meeting | Generates kickoff meeting agenda, talking points, and pre-read package |
| 6.5 Export & Download | Downloads the documentation package | Packages all artifacts as downloadable files (.docx, .pdf) |

**Artifacts Produced:**
- ✅ Statement of Work / Project Initiation Document
- ✅ Kickoff Meeting Agenda
- ✅ Complete Documentation Package (all artifacts bundled)
- ✅ Completeness & Consistency Report

---

### 2.3 Complete Artifact Map

| Stage | Artifacts | Formats |
|-------|-----------|---------|
| 1. Discover & Intake | Project Brief, Project Classification | .md (on-screen), .docx (download) |
| 2. Define & Scope | Charter, Scope Statement, Business Case, KPIs | .docx |
| 3. Structure & Plan | WBS, Schedule, Budget, Resource Plan | .docx, .xlsx (budget) |
| 4. Stakeholders & Governance | Stakeholder Register, RACI, Comms Plan, Governance | .docx |
| 5. Risk & Quality | Risk Register, Quality Plan, Change Mgmt Plan | .docx, .xlsx (risk register) |
| 6. Package & Kickoff | SOW/PID, Kickoff Agenda, Full Package | .docx, .pdf, .zip |

**Total: ~15 artifacts** (adjustable per project type and complexity)

---

## 3. Technical Architecture

### 3.1 Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   USER'S BROWSER                      │
│                                                       │
│  ┌─────────────────────┬───────────────────────────┐ │
│  │   Chat Panel        │   Artifact Sidebar         │ │
│  │   (Conversation)    │   (Generated Documents)    │ │
│  │                     │                            │ │
│  │   [User messages]   │   📄 Project Brief         │ │
│  │   [AI responses]    │   📄 Charter               │ │
│  │   [Paste text]      │   📄 Risk Register         │ │
│  │                     │   📄 RACI Matrix            │ │
│  │   ┌──────────────┐  │                            │ │
│  │   │ Message Input │  │   [Preview] [Download]    │ │
│  │   └──────────────┘  │                            │ │
│  └─────────────────────┴───────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Progress Bar: Stage 1 ● ● ○ ○ ○ ○ Stage 6     │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
                          │
                    HTTPS / WSS
                          │
┌──────────────────────────────────────────────────────┐
│                  YOUR LINUX SERVER                     │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Next.js Application                 │ │
│  │                                                  │ │
│  │  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │  React UI    │  │  API Routes              │ │ │
│  │  │  (shadcn/ui) │  │  /api/chat               │ │ │
│  │  │  (Tailwind)  │  │  /api/generate-artifact  │ │ │
│  │  │              │  │  /api/export             │ │ │
│  │  └──────────────┘  └──────────┬───────────────┘ │ │
│  │                               │                  │ │
│  │  ┌────────────────────────────┴───────────────┐ │ │
│  │  │         Conversation Engine                 │ │ │
│  │  │  - Session state management                │ │ │
│  │  │  - Stage tracking & transitions            │ │ │
│  │  │  - Artifact accumulator                    │ │ │
│  │  │  - Context window management               │ │ │
│  │  └────────────────────────────┬───────────────┘ │ │
│  │                               │                  │ │
│  │  ┌────────────────────────────┴───────────────┐ │ │
│  │  │         Document Generator                  │ │ │
│  │  │  - docx generation (docx-js)               │ │ │
│  │  │  - xlsx generation (exceljs)               │ │ │
│  │  │  - pdf generation (from docx)              │ │ │
│  │  │  - zip bundling                            │ │ │
│  │  └────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────┘ │
│                          │                            │
└──────────────────────────┼────────────────────────────┘
                           │
                     Anthropic API
                     (Claude Sonnet)
                           │
                    ┌──────┴──────┐
                    │  Claude API  │
                    │  (External)  │
                    └─────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| **Framework** | Next.js 14+ (App Router) | Full-stack React with API routes in one codebase. Self-hostable on Linux. No separate backend needed. |
| **UI Components** | shadcn/ui + Tailwind CSS | Well-regarded, accessible, customizable component library. Not a dependency — components are copied into your codebase, so no version lock-in. Great chat and sidebar components available. |
| **AI Integration** | Vercel AI SDK (@ai-sdk/anthropic) | Unified streaming interface for Claude. Handles SSE streaming, message state, and React hooks (useChat). Works self-hosted — no Vercel deployment required. |
| **LLM Provider** | Anthropic Claude (Sonnet 4.5) | Best balance of quality and cost. Sonnet is ~10x cheaper than Opus with strong reasoning. Prompt caching reduces repeat costs. |
| **Document Generation** | docx-js (Word), ExcelJS (spreadsheets) | Server-side document generation. No LibreOffice dependency. Pure JS. |
| **PDF Generation** | Puppeteer or html-pdf-node | Converts HTML to PDF for the final package. Lightweight. |
| **State Management** | React state + useChat hook | Single session = no database needed. All state lives in memory during the session. |
| **Hosting** | Your Linux server (Node.js) | `npm run build && npm start` — runs as a Node.js process. Use PM2 for process management. Reverse proxy with nginx. |

### 3.3 Cost Architecture

**Goal:** Minimize API token costs without degrading the natural conversational experience.

**Strategy: Smart Context Management**

Rather than the binary "template vs. AI" approach (which you rightly flagged as too rigid), we use intelligent context management:

| Technique | How It Works | Estimated Savings |
|-----------|-------------|------------------|
| **Prompt Caching** | System prompt + project knowledge base cached across turns using Anthropic's prompt caching. First turn costs full price; subsequent turns use cached context at 90% discount. | 50-70% on system prompt tokens |
| **Progressive Summarization** | As conversation grows, earlier stages are summarized into compact context rather than sending full history. Stage 1 conversation becomes a structured brief that feeds Stage 2. | 30-40% on context tokens |
| **Structured Output for Artifacts** | When generating artifacts, use structured output (JSON mode) so the LLM produces clean data that the app formats into documents. No wasted tokens on formatting instructions. | 15-20% on generation tokens |
| **Sonnet over Opus** | Claude Sonnet 4.5 handles all tasks at ~$3/M input, $15/M output vs Opus at ~$15/$75. Quality is more than sufficient for guided PM workflows. | 80% vs Opus |

**Estimated Cost Per Session:**

| Component | Tokens (est.) | Cost (est.) |
|-----------|--------------|-------------|
| System prompt (cached after turn 1) | ~4,000 input | ~$0.003 |
| Conversation (6 stages, ~20 turns avg) | ~30,000 input + ~20,000 output | ~$0.39 |
| Artifact generation (15 artifacts) | ~15,000 input + ~30,000 output | ~$0.50 |
| **Total per session** | | **~$0.90** |

**Cost Controls:**
- Rate limiting: configurable max sessions per day
- Optional password gate for the demo
- Session timeout (2 hours)
- Model selection: can drop to Haiku ($0.25/M input) for simpler stages

### 3.4 Key Design Decisions

**1. Next.js self-hosted, NOT Vercel-deployed**
- Runs on your existing Linux server with `node`
- No vendor lock-in, no per-request pricing
- Full control over environment and costs

**2. Single-session architecture (MVP)**
- All state in React memory — no database
- Simplifies deployment dramatically
- Future: add SQLite or Postgres for session persistence

**3. Streaming responses**
- AI responses stream token-by-token for natural feel
- Vercel AI SDK handles this with `useChat` hook
- Artifacts appear progressively in the sidebar

**4. Conversation drives everything**
- No step-by-step wizard or forced navigation
- The progress bar reflects where the PM is, but doesn't constrain them
- PM can jump between stages or revisit earlier artifacts
- AI tracks what's been covered and what's still needed

**5. Artifact sidebar is live**
- Artifacts update in real-time as the conversation progresses
- PM can preview any artifact at any time
- Each artifact has a "download" button
- Final stage bundles everything into a .zip

---

## 4. System Prompt Architecture

The AI's behavior is driven by a layered system prompt:

```
Layer 1: Core Identity & Role
  "You are a senior program management advisor..."
  Defines conversational style, adaptive behavior, PM expertise

Layer 2: Project Knowledge Base (from your existing templates)
  - Program Charter Template structure
  - Risk Register categories and scoring
  - Stakeholder management frameworks
  - RACI matrix patterns
  - Communication plan structures
  - First Principles framework
  - SkillUp Class prompt patterns
  - BI Glossary (for tech projects)

Layer 3: Stage-Aware Instructions
  Current stage context, what artifacts have been produced,
  what gaps remain, what to focus on next

Layer 4: Artifact Generation Instructions
  JSON schemas for each artifact type, ensuring structured
  output that the app can render and export
```

**Layer 2 leverages your entire existing template system** — the templates from your project files become the AI's knowledge base for best practices, ensuring consistency between the app's output and your established frameworks.

---

## 5. Industry & Project Type Adaptation

The app adapts its recommendations based on detected project characteristics:

| Dimension | How Detected | How It Adapts |
|-----------|-------------|---------------|
| **Industry** | User states or AI infers from context | Risk categories, compliance requirements, terminology, typical stakeholders |
| **Project Type** | Classified in Stage 1 (software, infrastructure, marketing, org change, etc.) | WBS templates, common risks, typical roles, methodology recommendation |
| **Methodology** | Recommended by AI, confirmed by PM | Artifact names (Sprint Plan vs Phase Plan), ceremony recommendations, documentation depth |
| **Complexity** | Derived from budget, timeline, team size, dependencies | Number of artifacts recommended, governance formality, risk depth |
| **PM Experience** | Detected from conversation style and responses | Explanation depth, question pacing, terminology level |

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Response time** | First token in < 2 seconds for conversational turns |
| **Session duration** | Support sessions up to 2 hours |
| **Concurrent users** | 5-10 simultaneous sessions (demo scale) |
| **Browser support** | Modern browsers (Chrome, Firefox, Safari, Edge) |
| **Mobile** | Responsive but optimized for desktop (PM work is typically desktop) |
| **Accessibility** | shadcn/ui provides WCAG 2.1 AA baseline |
| **Security** | API key server-side only, HTTPS, no user data persisted |

---

## 7. Deployment Architecture

```
Internet
    │
    ▼
┌────────┐
│ nginx  │  (reverse proxy, SSL termination, rate limiting)
│        │
└───┬────┘
    │
    ▼
┌────────────────┐
│ Node.js        │  (Next.js production server)
│ PM2 managed    │  (auto-restart, clustering)
│ Port 3000      │
└────────────────┘
    │
    ▼ (outbound HTTPS)
┌────────────────┐
│ Anthropic API  │
│ api.anthropic  │
│ .com           │
└────────────────┘
```

**Deployment Steps (high level):**
1. Clone repo to your server
2. `npm install && npm run build`
3. Set `ANTHROPIC_API_KEY` in `.env`
4. `pm2 start npm --name "brief-to-project" -- start`
5. Configure nginx reverse proxy to your domain/subdomain
6. SSL via Let's Encrypt / certbot

---

## 8. Risk & Considerations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| API costs exceed expectations | Medium | Rate limiting, session caps, Haiku fallback for simple tasks |
| Long sessions hit context window limits | High | Progressive summarization; each stage compresses prior context |
| Document generation quality varies | Medium | Structured JSON output + deterministic templates; AI generates content, app formats |
| User expects full project management tool | Low | Clear positioning as "brief-to-project" scope; not ongoing PM tool |
| Anthropic API downtime | Low | Graceful error handling; save-and-resume (future) |

---

## 9. Future Enhancements (Post-MVP)

These are explicitly OUT of scope for the MVP but inform architecture decisions:

1. **File upload** — drag-and-drop existing briefs, SOWs, PDFs
2. **Session persistence** — save and resume sessions (add SQLite)
3. **Template customization** — PMs can upload their org's templates
4. **Multi-user** — authentication, team sharing
5. **Integration** — export to Jira, Asana, MS Project
6. **Analytics** — track which stages take longest, common gaps

---

## 10. Decision Points for Your Review

Before I proceed to **Deliverable 2 (Project Plan)**, I'd like your input on:

1. **Does the 6-stage journey capture the right workflow?** Any stages to add, remove, or restructure?

2. **Is the artifact list right?** Too many? Too few? Any specific artifacts you want to ensure are included?

3. **Tech stack comfort level?** Next.js + shadcn/ui + Vercel AI SDK is the recommended approach. Any concerns or preferences?

4. **Cost estimate of ~$0.90/session acceptable?** This can be reduced with Haiku for simpler stages, or increased with Opus for higher quality.

5. **Deployment approach work?** Self-hosted Node.js behind nginx on your Linux server.

6. **Any industry-specific adaptations you want to prioritize?** (e.g., should the MVP focus on IT/software projects, or be fully industry-agnostic from day one?)

---

*Awaiting your review before proceeding to Deliverable 2: Project Plan with phases, tasks, and timeline.*
