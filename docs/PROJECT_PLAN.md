# Brief-to-Project App: Project Plan

## Deliverable 2 of 3 | For Review

**Prepared for:** Josh
**Date:** February 12, 2026
**Status:** Draft for Approval
**Depends on:** Deliverable 1 (Technical Architecture) — Approved Feb 12, 2026

---

## 1. Executive Summary

This project plan translates the approved Technical Architecture (Deliverable 1) into a phased, task-level build plan. The plan is designed for a **solo developer** working **full-time (~40 hrs/week)** with a **coding beginner** skill level, targeting an **MVP launch in 5 weeks** (by approximately March 19, 2026).

Every phase is broken into small, testable steps. The principle: **build a thin working slice first, then widen it.** You'll have a working (if minimal) app by the end of Week 2, and spend Weeks 3–5 adding the full journey stages, document generation, and polish.

**Key decisions reflected from Deliverable 1 approval:**
- ✅ 6-stage user journey (approved as-is)
- ✅ ~15 artifacts (approved as-is)
- ✅ Next.js + shadcn/ui + Vercel AI SDK tech stack
- ✅ ~$0.90/session cost target with rate limiting by IP + password-protected demo
- ✅ Self-hosted on existing Linux server
- ✅ Fully industry-agnostic from day 1

---

## 2. Timeline Overview

```
Week 1          Week 2          Week 3          Week 4          Week 5
Feb 13-19       Feb 20-26       Feb 27-Mar 5    Mar 6-12        Mar 13-19
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ PHASE 1 │    │ PHASE 2 │    │ PHASE 3 │    │ PHASE 4 │    │ PHASE 5 │
│ Founda- │    │ Chat +  │    │ All 6   │    │ Document│    │ Polish, │
│ tion &  │    │ Stage 1 │    │ Stages  │    │ Gen &   │    │ Deploy, │
│ Setup   │    │ Working │    │ Working │    │ Export  │    │ Launch  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  Dev env        Chat UI +     Full convo     Download       Live on
  running,       AI responds,   through all    .docx/.xlsx    your
  blank app      Stage 1        6 stages,      for all 15     server,
  deploys        artifacts      artifacts      artifacts,     password
  locally        show in        appear in      .zip bundle    protected
                 sidebar        sidebar
```

**Total: 5 weeks / ~200 hours**

---

## 3. Phase Details

---

### PHASE 1: Foundation & Dev Environment (Week 1)

**Goal:** Get your development environment set up, create the blank app skeleton, and deploy it locally. By Friday of Week 1, you should be able to open your browser, see the app layout (chat panel + sidebar), and type a message (even though the AI won't respond yet).

**Why this phase matters:** Everything else builds on this. If the foundation is solid, the rest flows. If it's shaky, everything takes longer.

---

#### Day 1–2: Dev Environment Setup (8 hrs)

These are one-time setup tasks. Take your time — getting these right prevents hours of debugging later.

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 1.1 | Install Node.js | Install Node.js v20 LTS on your dev machine | Run `node --version` → shows v20.x | 0.5 |
| 1.2 | Install code editor | Install VS Code + extensions (ESLint, Prettier, Tailwind IntelliSense) | VS Code opens, extensions show as installed | 0.5 |
| 1.3 | Install Git | Set up Git, create a GitHub/GitLab repo for the project | `git --version` works, you can push a test commit | 0.5 |
| 1.4 | Create Next.js app | Run `npx create-next-app@latest brief-to-project` with App Router, TypeScript, Tailwind | `npm run dev` → browser shows Next.js welcome page at localhost:3000 | 0.5 |
| 1.5 | Install shadcn/ui | Run `npx shadcn@latest init` inside the project | No errors, `components.json` file created | 0.5 |
| 1.6 | Install key dependencies | `npm install ai @ai-sdk/anthropic` (Vercel AI SDK) | No install errors, packages appear in package.json | 0.5 |
| 1.7 | Set up environment variables | Create `.env.local` with `ANTHROPIC_API_KEY=your-key-here` | File exists, key is not committed to git (.gitignore check) | 0.5 |
| 1.8 | Test API connectivity | Create a throwaway test route that calls Claude, verify you get a response | Browser shows Claude's response at localhost:3000/api/test | 1.5 |
| 1.9 | First Git commit | Commit everything, push to remote repo | `git log` shows your commit, code is on GitHub/GitLab | 0.5 |

**Checkpoint:** You have a running Next.js app that can talk to Claude's API. 🎉

---

#### Day 2–3: App Layout Shell (8 hrs)

Now you'll build the visual skeleton — the two-panel layout that the entire app lives inside.

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 1.10 | Install layout components | `npx shadcn@latest add card button input scroll-area separator tabs` | Components appear in `components/ui/` folder | 0.5 |
| 1.11 | Create main layout | Build the two-panel layout: left = chat, right = artifact sidebar | Browser shows two columns side by side | 2.0 |
| 1.12 | Build chat panel skeleton | Left panel with: header, message area (scrollable), input box at bottom | You can see the layout; typing in the input box does nothing yet | 2.0 |
| 1.13 | Build artifact sidebar skeleton | Right panel with: header ("Documents"), empty state message, placeholder cards | Right panel shows "No documents yet" placeholder | 1.5 |
| 1.14 | Build progress bar | Bottom bar showing Stage 1–6 dots (all gray for now) | Six labeled dots appear at bottom of page | 1.0 |
| 1.15 | Responsive check | Verify layout doesn't break at different browser widths | Resize browser — nothing overlaps or breaks | 0.5 |
| 1.16 | Git commit | Commit layout work | Clean commit in Git history | 0.5 |

**Checkpoint:** The app looks like an app. Two panels, a progress bar, a chat input box. Nothing works yet, but the structure is in place.

---

#### Day 4–5: Core Chat Wiring (12 hrs)

This is where the app comes alive. You'll wire the chat UI to Claude via the Vercel AI SDK.

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 1.17 | Create chat API route | Build `/api/chat/route.ts` using Vercel AI SDK's `streamText()` with Anthropic provider | File exists, no TypeScript errors | 1.5 |
| 1.18 | Write initial system prompt | Create a basic system prompt: "You are a program management advisor. You help PMs create project documentation." (We'll expand this massively later) | System prompt lives in a separate file you can easily edit | 1.0 |
| 1.19 | Wire useChat hook | In the chat panel component, use `useChat()` hook from Vercel AI SDK | No errors on page load | 1.5 |
| 1.20 | Display messages | Render user messages and AI messages in the chat area with different styles | You type "Hello" → Claude responds → both messages show in the chat | 2.0 |
| 1.21 | Streaming display | AI response streams in token by token (not all at once) | You can see the response appearing word by word | 1.0 |
| 1.22 | Auto-scroll | Chat area scrolls to bottom as new messages appear | Long conversations stay scrolled to the latest message | 1.0 |
| 1.23 | Input handling | Enter key sends message, button click sends message, input clears after send, disable while AI is responding | All input behaviors work naturally | 1.5 |
| 1.24 | Error handling | If API call fails, show a user-friendly error message (not a crash) | Temporarily break your API key → see a nice error message, not a white screen | 1.0 |
| 1.25 | Git commit | Commit all chat wiring | Clean commit | 0.5 |

**Checkpoint:** You have a working chat app powered by Claude. You can have a conversation. It streams. It handles errors. This is a real, functional product at this point — just without the PM-specific features.

---

#### Day 5: Session State Foundation (4 hrs)

Set up the data structures that will track what the user has done so far.

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 1.26 | Define session state type | Create TypeScript types for session: `currentStage`, `artifacts[]`, `projectContext{}` | Types compile without errors | 1.0 |
| 1.27 | Create state management | Use React Context or Zustand to hold session state across components | State is accessible in both chat panel and sidebar | 1.5 |
| 1.28 | Wire progress bar to state | Progress bar highlights based on `currentStage` value | Manually change stage in code → progress bar updates | 1.0 |
| 1.29 | Git commit + Week 1 review | Commit, push, review what you built | All code on remote, app runs cleanly | 0.5 |

---

**✅ PHASE 1 COMPLETE — End of Week 1**

**What you have:** A working chat application with a two-panel layout, streaming AI responses, a progress bar, and session state management. The AI responds as a generic assistant (not PM-specific yet).

**What you don't have yet:** PM-specific behavior, artifact generation, document downloads.

---

### PHASE 2: Stage 1 Working End-to-End (Week 2)

**Goal:** Implement Stage 1 (Discover & Intake) completely — from the PM's first message through to a generated Project Brief artifact appearing in the sidebar. This proves out the entire data flow: user input → AI conversation → structured artifact → sidebar display.

**Why this matters:** Once one stage works end-to-end, the remaining 5 stages follow the same pattern. This is the hardest stage because you're building all the plumbing.

---

#### Day 1–2: System Prompt Engineering (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 2.1 | Create prompt file structure | Create `/lib/prompts/` folder with separate files for each layer: `core-identity.ts`, `knowledge-base.ts`, `stage-instructions.ts`, `artifact-schemas.ts` | Files exist, export string constants | 1.0 |
| 2.2 | Write Layer 1: Core Identity | Write the "You are a senior program management advisor..." prompt. Define tone, adaptive behavior, conversation style. | Paste into Claude directly and test — does it feel like a PM advisor? | 2.0 |
| 2.3 | Write Layer 2: Knowledge Base | Convert your existing templates (Charter, Risk Register, Stakeholder, etc.) into structured reference text the AI can use | Large text block with all template structures embedded | 2.0 |
| 2.4 | Write Stage 1 instructions | Write specific instructions for Discover & Intake: what to ask, how to detect structured vs. unstructured input, when to classify project type | Test by pasting into Claude — does it run a good discovery conversation? | 2.0 |
| 2.5 | Write artifact schema for Project Brief | Define a JSON schema the AI should output when it has enough info to generate the Project Brief | Example JSON looks correct, matches what you'd want in a brief | 0.5 |
| 2.6 | Git commit | Commit all prompt work | Clean commit | 0.5 |

**Checkpoint:** You have a sophisticated system prompt that makes Claude act like a PM advisor. You've tested it manually (by pasting into Claude) and the conversation quality is good.

---

#### Day 2–3: Stage-Aware Conversation (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 2.7 | Assemble full system prompt | Combine all 4 layers into a single system prompt that's sent with each API call | System prompt is sent on every chat request | 1.0 |
| 2.8 | Add stage context to prompt | Dynamically inject current stage + what's been collected so far into the system prompt | Console.log shows the right context being sent | 1.5 |
| 2.9 | Implement stage detection | AI signals when it has enough info to generate an artifact (via a special tag or JSON block in its response) | When you provide enough project details, the AI's response includes a structured signal | 2.0 |
| 2.10 | Parse AI response for artifacts | On the frontend, detect when the AI response contains an artifact signal and extract the structured data | Console.log shows parsed artifact data when AI generates one | 2.0 |
| 2.11 | Update session state on artifact | When an artifact is detected, add it to the session state's artifact list | `artifacts` array in state grows as conversation progresses | 1.0 |
| 2.12 | Git commit | Commit stage awareness work | Clean commit | 0.5 |

**Checkpoint:** The AI conversation is now stage-aware. When you describe a project well enough, the AI produces structured data for the Project Brief. The app detects it and stores it.

---

#### Day 3–4: Artifact Sidebar Display (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 2.13 | Build artifact card component | Create a reusable card component: icon, title, status badge, preview button, download button (disabled for now) | Card renders with dummy data | 1.5 |
| 2.14 | Wire sidebar to session state | Sidebar reads from `artifacts` array and renders a card for each | When artifact is added to state, card appears in sidebar automatically | 1.5 |
| 2.15 | Build artifact preview modal | Clicking "Preview" opens a modal/drawer showing the artifact content formatted nicely | Click preview → modal shows Project Brief content in readable format | 2.0 |
| 2.16 | Add artifact update detection | If the AI refines an artifact (user provides more info), the sidebar card updates | Tell the AI "actually the budget is $500K not $300K" → brief updates in sidebar | 1.5 |
| 2.17 | Stage transition | When Stage 1 artifacts are complete, AI suggests moving to Stage 2 (and progress bar updates) | Progress bar moves from Stage 1 to Stage 2 | 1.0 |
| 2.18 | Git commit | Commit sidebar work | Clean commit | 0.5 |

**Checkpoint:** Stage 1 works end-to-end! You chat about a project → AI asks discovery questions → Project Brief appears in the sidebar → you can preview it → the app moves to Stage 2.

---

#### Day 4–5: Rate Limiting & Auth Gate (8 hrs)

Building this early since you flagged it as important.

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 2.19 | IP-based rate limiting | Add rate limiting middleware to `/api/chat` route: max N sessions per IP per day | Hit the limit → get a "Rate limit exceeded" message instead of a response | 2.5 |
| 2.20 | Password gate | Add a simple password entry screen that appears before the app loads. Password stored as env variable (`DEMO_PASSWORD`) | Wrong password → can't access app. Right password → normal use | 2.5 |
| 2.21 | Session timeout | Auto-end session after 2 hours of inactivity with a friendly message | Leave app for 2 hours → next action shows "Session expired, start a new conversation" | 1.5 |
| 2.22 | Git commit + Week 2 review | Commit, push, test full flow | End-to-end Stage 1 works with security controls | 1.5 |

---

**✅ PHASE 2 COMPLETE — End of Week 2**

**What you have:** A functional PM advisor app with Stage 1 working completely, artifacts appearing in a sidebar, rate limiting, and password protection. This is a demoable product.

**What you don't have yet:** Stages 2–6, document downloads, deployment.

---

### PHASE 3: All 6 Stages Working (Week 3)

**Goal:** Implement the remaining 5 conversation stages. Since the plumbing is done (Phase 2), each stage is now about: (1) writing the stage-specific prompt instructions, (2) defining artifact schemas, and (3) testing the conversation flow.

**Pace: ~1 stage per day.** Stages 2–4 are more complex (more artifacts); Stages 5–6 are lighter.

---

#### Day 1: Stage 2 — Define & Scope (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 3.1 | Write Stage 2 prompt instructions | Instructions for: objectives setting, scope definition, success criteria, business case, assumptions/constraints | Test in isolation — AI guides user through scope definition well | 2.0 |
| 3.2 | Define artifact schemas | JSON schemas for: Charter, Scope Statement, Business Case Summary, Success Criteria/KPIs | Schemas capture all required fields from your templates | 1.5 |
| 3.3 | Add bias detection prompts | Integrate optimism bias check, planning fallacy check, confirmation bias check into Stage 2 AI behavior | AI flags when estimates seem too optimistic or assumptions are unchallenged | 1.5 |
| 3.4 | Test full Stage 1→2 flow | Walk through a real project from Stage 1 into Stage 2 | Artifacts for both stages appear in sidebar; conversation flows naturally | 2.5 |
| 3.5 | Git commit | Commit Stage 2 | Clean commit | 0.5 |

---

#### Day 2: Stage 3 — Structure & Plan (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 3.6 | Write Stage 3 prompt instructions | Instructions for: WBS generation, dependency mapping, timeline, budget estimation, resource planning | AI walks user through work breakdown and planning | 2.0 |
| 3.7 | Define artifact schemas | JSON schemas for: WBS, Schedule/Timeline, Budget Estimate, Resource Plan | Schemas capture hierarchical WBS structure and tabular budget/resource data | 2.0 |
| 3.8 | Industry-agnostic templates | Ensure WBS templates and risk categories adapt to any industry based on Stage 1 classification | Test with software project, marketing project, and construction project — each gets different WBS templates | 2.0 |
| 3.9 | Test Stage 1→2→3 flow | Full walkthrough | Three stages worth of artifacts in sidebar | 1.5 |
| 3.10 | Git commit | Commit Stage 3 | Clean commit | 0.5 |

---

#### Day 3: Stage 4 — Stakeholders & Governance (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 3.11 | Write Stage 4 prompt instructions | Instructions for: stakeholder identification, power-interest analysis, RACI development, communication planning, governance | AI helps user map stakeholders and build RACI matrix | 2.0 |
| 3.12 | Define artifact schemas | JSON schemas for: Stakeholder Register, RACI Matrix, Communication Plan, Governance Structure | Schemas match your Stakeholder Management template structure | 1.5 |
| 3.13 | Cross-reference earlier stages | AI references WBS (Stage 3) deliverables when building RACI, references scope (Stage 2) when identifying stakeholders | RACI rows correspond to actual WBS items; stakeholders map to scope items | 2.0 |
| 3.14 | Test Stage 1→2→3→4 flow | Full walkthrough through 4 stages | Four stages of artifacts; cross-references are consistent | 2.0 |
| 3.15 | Git commit | Commit Stage 4 | Clean commit | 0.5 |

---

#### Day 4: Stage 5 — Risk & Quality (7 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 3.16 | Write Stage 5 prompt instructions | Instructions for: risk identification (using your 5 categories), risk assessment, quality planning, change management | AI produces categorized risks with probability/impact ratings | 2.0 |
| 3.17 | Define artifact schemas | JSON schemas for: Risk Register, Quality Management Plan, Change Management Plan | Risk Register schema matches your existing template structure | 1.5 |
| 3.18 | Wire bias detection into risk assessment | AI uses Bias Detection Framework to challenge user's risk ratings (e.g., "You've rated all risks as Low — could availability bias be at play?") | AI pushes back on suspiciously uniform or low risk ratings | 1.5 |
| 3.19 | Test through 5 stages | Full walkthrough | Five stages of consistent artifacts | 1.5 |
| 3.20 | Git commit | Commit Stage 5 | Clean commit | 0.5 |

---

#### Day 5: Stage 6 — Package & Kickoff + Context Management (9 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 3.21 | Write Stage 6 prompt instructions | Instructions for: completeness review, consistency check, SOW/PID assembly, kickoff preparation | AI runs a "final check" identifying gaps and inconsistencies | 2.0 |
| 3.22 | Define artifact schemas | JSON schemas for: SOW/PID, Kickoff Agenda, Completeness Report | SOW pulls from all prior artifacts; completeness report flags gaps | 1.5 |
| 3.23 | Implement progressive summarization | As conversation grows long, compress earlier stage conversations into structured summaries to manage context window | Console.log shows compressed context; later stages still have full access to earlier artifact data | 3.0 |
| 3.24 | Full 6-stage walkthrough | Test the entire journey start to finish with a realistic project | All 15 artifacts generated, cross-referenced, and consistent | 2.0 |
| 3.25 | Git commit + Week 3 review | Commit, push | All 6 stages working in conversation | 0.5 |

---

**✅ PHASE 3 COMPLETE — End of Week 3**

**What you have:** The full 6-stage conversational journey works. All ~15 artifacts are generated and displayed in the sidebar. The AI adapts by industry and project type. Bias detection is woven in.

**What you don't have yet:** Downloadable documents (.docx, .xlsx), the final .zip bundle, or deployment.

---

### PHASE 4: Document Generation & Export (Week 4)

**Goal:** Turn the JSON artifact data into real, downloadable documents. This is where the app goes from "cool demo" to "actually useful tool."

---

#### Day 1–2: Word Document Generation (10 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 4.1 | Install docx-js | `npm install docx` (server-side document generation library) | Package installs without errors | 0.5 |
| 4.2 | Build document generator framework | Create `/lib/generators/` with a base document generator class that handles common formatting (fonts, headers, page numbers, margins) | Base class renders a blank but properly formatted .docx | 2.0 |
| 4.3 | Generator: Project Brief | Template that turns the Project Brief JSON into a formatted 1-page Word doc | Download .docx → opens in Word/Google Docs looking professional | 1.5 |
| 4.4 | Generator: Project Charter | Template for the comprehensive charter (longest doc — headings, tables, sections) | Download .docx → matches your Program Charter Template structure | 2.0 |
| 4.5 | Generator: Scope Statement | Template for in-scope/out-of-scope/assumptions/constraints | Download .docx → clean, readable scope doc | 1.0 |
| 4.6 | Generator: Business Case | Template for the business case summary | Download .docx → includes cost-benefit table | 1.0 |
| 4.7 | Wire download buttons | Clicking "Download" on any artifact card triggers document generation and download | Click → .docx file downloads to your computer | 1.5 |
| 4.8 | Git commit | Commit generator work | Clean commit | 0.5 |

---

#### Day 2–3: More Document Generators (10 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 4.9 | Generator: WBS | Hierarchical work breakdown structure with indentation and numbering | .docx shows nested WBS tree | 1.5 |
| 4.10 | Generator: Schedule/Timeline | Table format with milestones, dates, owners | .docx shows timeline table | 1.0 |
| 4.11 | Generator: Resource Plan | Table format with roles, allocation, skills | .docx shows resource table | 1.0 |
| 4.12 | Generator: Stakeholder Register | Table with power/interest classification | .docx shows stakeholder grid | 1.0 |
| 4.13 | Generator: RACI Matrix | Matrix format with R/A/C/I cells | .docx shows proper RACI matrix | 1.5 |
| 4.14 | Generator: Communication Plan | Table format matching your template | .docx shows communication table | 1.0 |
| 4.15 | Generator: Governance Structure | Decision authority table + escalation paths | .docx shows governance doc | 1.0 |
| 4.16 | Generator: Quality Plan | Standards, reviews, CI mechanisms | .docx shows quality plan | 1.0 |
| 4.17 | Git commit | Commit generators | Clean commit | 0.5 |

---

#### Day 4: Spreadsheet Generation (6 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 4.18 | Install ExcelJS | `npm install exceljs` | Package installs without errors | 0.5 |
| 4.19 | Generator: Risk Register (.xlsx) | Spreadsheet with columns matching your Risk Register template (ID, Category, Description, Probability, Impact, Score, Mitigation, Contingency, Owner, Status) | .xlsx opens in Excel with formatted headers, conditional formatting on scores | 2.5 |
| 4.20 | Generator: Budget Estimate (.xlsx) | Spreadsheet with budget categories, amounts, contingency, totals with formulas | .xlsx opens with working SUM formulas | 2.0 |
| 4.21 | Git commit | Commit spreadsheet generators | Clean commit | 0.5 |

---

#### Day 5: Final Documents + ZIP Bundle (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 4.22 | Generator: Change Management Plan | .docx with change control process, approval thresholds | .docx shows change management doc | 1.0 |
| 4.23 | Generator: SOW / PID | Master document that pulls from all prior artifacts — the comprehensive project initiation document | .docx is a complete SOW with all sections populated from conversation | 2.0 |
| 4.24 | Generator: Kickoff Agenda | .docx with meeting agenda, talking points, pre-read list | .docx shows ready-to-use kickoff agenda | 1.0 |
| 4.25 | Build ZIP bundler | "Download All" button packages every generated document into a single .zip file | Click → downloads `ProjectName_Documentation.zip` containing all files | 2.0 |
| 4.26 | Generator: Completeness Report | Short .docx listing what was generated, what gaps remain, recommendations | .docx shows completeness summary | 1.0 |
| 4.27 | Git commit + Week 4 review | Commit, push, full test | All 15 artifacts download correctly, ZIP bundle works | 1.0 |

---

**✅ PHASE 4 COMPLETE — End of Week 4**

**What you have:** A fully functional app. Chat through 6 stages, see artifacts in sidebar, download any artifact as .docx or .xlsx, download everything as a .zip. Rate limiting and password protection in place.

**What you don't have yet:** Production deployment, final polish, testing.

---

### PHASE 5: Polish, Deploy, Launch (Week 5)

**Goal:** Make it production-ready, deploy to your server, and open it up for demo use.

---

#### Day 1–2: UI Polish & UX Improvements (10 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 5.1 | Loading states | Add loading spinners/skeletons while AI is thinking and while documents generate | No blank states or janky transitions | 1.5 |
| 5.2 | Empty states | Design helpful empty states for sidebar ("Start a conversation to generate project documents") | New user sees clear guidance | 1.0 |
| 5.3 | Error messages | User-friendly error messages for all failure cases (API error, rate limit, timeout) | Intentionally break things → all errors show friendly messages | 1.5 |
| 5.4 | Welcome screen | First-time experience: brief explanation of what the app does, example prompts to try | New user understands what to do immediately | 1.5 |
| 5.5 | Mobile responsiveness | Ensure the app is usable on tablets (sidebar becomes a toggle/drawer) | Test on iPad-size viewport — still works | 1.5 |
| 5.6 | Keyboard shortcuts | Enter to send, Escape to close modals, basic accessibility | Keyboard-only navigation works for core flows | 1.0 |
| 5.7 | Visual polish | Consistent spacing, colors, typography review | App looks professional, not like a prototype | 1.5 |
| 5.8 | Git commit | Commit polish work | Clean commit | 0.5 |

---

#### Day 3: Testing (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 5.9 | Happy path test: Software project | Walk through entire 6-stage journey for an IT software project | All artifacts generated, accurate, consistent | 1.5 |
| 5.10 | Happy path test: Marketing project | Walk through entire journey for a marketing campaign project | Industry-agnostic recommendations, appropriate WBS and risks | 1.5 |
| 5.11 | Happy path test: Org change project | Walk through entire journey for an organizational change program | Different risks, different stakeholders, appropriate templates | 1.5 |
| 5.12 | Edge case: Paste existing brief | Test pasting a pre-written brief — does AI detect what's there and skip ahead? | AI acknowledges existing content, asks only about gaps | 1.0 |
| 5.13 | Edge case: Jump between stages | Try going back to an earlier stage to update something | AI handles revisions, updates affected artifacts | 1.0 |
| 5.14 | Document quality review | Open every generated .docx and .xlsx — check formatting, content accuracy, consistency | All documents open cleanly, content matches conversation | 1.0 |
| 5.15 | Git commit | Commit any fixes from testing | Clean commit | 0.5 |

---

#### Day 4: Server Deployment (8 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 5.16 | Prepare server | Install Node.js v20 on your Linux server, install PM2 (`npm install -g pm2`) | `node --version` and `pm2 --version` work on server | 1.0 |
| 5.17 | Clone repo to server | `git clone` your repo to the server, `npm install`, `npm run build` | Build completes without errors | 1.0 |
| 5.18 | Configure environment | Create `.env` on server with `ANTHROPIC_API_KEY` and `DEMO_PASSWORD` | `.env` file exists with correct values | 0.5 |
| 5.19 | Start with PM2 | `pm2 start npm --name "brief-to-project" -- start` | `pm2 status` shows app running, app responds on port 3000 | 1.0 |
| 5.20 | Configure nginx | Set up nginx reverse proxy: your-domain.com → localhost:3000 | Navigate to your-domain.com → see the app | 2.0 |
| 5.21 | SSL certificate | Install Let's Encrypt SSL certificate via certbot | https://your-domain.com works with valid certificate (green lock) | 1.0 |
| 5.22 | Verify production | Test the full flow on the production URL | Everything works as it did locally | 1.0 |
| 5.23 | Git commit | Any deployment config files | Clean commit | 0.5 |

---

#### Day 5: Launch Prep & Documentation (6 hrs)

| # | Task | What You'll Do | How You'll Know It Worked | Est. Hours |
|---|------|---------------|--------------------------|------------|
| 5.24 | Write README | Update project README with: what it is, how to install, how to configure, how to deploy | A new developer could set it up by following the README | 1.5 |
| 5.25 | Set production rate limits | Configure final rate limits (e.g., 10 sessions/IP/day) and set demo password | Rate limiting works, password gate works in production | 1.0 |
| 5.26 | Monitoring setup | Set up PM2 log monitoring (`pm2 logs`), basic uptime check | You can see logs, get notified if app crashes and restarts | 1.0 |
| 5.27 | Backup API key management | Document how to rotate the Anthropic API key if needed | Process is documented, you know how to do it | 0.5 |
| 5.28 | Final production test | Full 6-stage walkthrough on production, including ZIP download | Everything works on the live URL | 1.0 |
| 5.29 | Share the link! | Send to reviewers / portfolio / demo audience | People can access and use the app | 0.5 |
| 5.30 | Git tag v1.0 | `git tag v1.0.0` and push | Version is tagged in repo | 0.5 |

---

**✅ PHASE 5 COMPLETE — End of Week 5**

**What you have:** A live, production-ready Brief-to-Project app deployed on your server. Password-protected, rate-limited, SSL-secured. Full 6-stage journey with ~15 downloadable artifacts. Industry-agnostic. Ready for demo use.

---

## 4. Risk Register (Project-Level)

| Risk ID | Risk | Probability | Impact | Mitigation | Phase Affected |
|---------|------|-------------|--------|------------|----------------|
| R-01 | System prompt engineering takes longer than expected (getting AI behavior right is iterative) | High | Medium | Budget extra time in Phase 2; test prompts in Claude directly before coding | Phase 2 |
| R-02 | Document generation formatting issues (docx-js quirks) | Medium | Medium | Use simple formatting; test each generator immediately; follow SKILL.md rules | Phase 4 |
| R-03 | Context window limitations with long conversations | Medium | High | Progressive summarization built into Phase 3; test with long conversations early | Phase 3 |
| R-04 | Scope creep (wanting to add features beyond MVP) | High | High | Strict MVP scope; maintain a "Post-MVP" list; resist the urge | All phases |
| R-05 | Learning curve with Next.js/React as a beginner | Medium | Medium | Follow tutorials step by step; ask Claude for help; don't try to understand everything at once | Phase 1 |
| R-06 | Anthropic API rate limits during development | Low | Low | Use test conversations; don't loop API calls; cache during testing | All phases |
| R-07 | Server configuration issues during deployment | Medium | Low | Server is already available; nginx + PM2 are well-documented | Phase 5 |
| R-08 | AI produces inconsistent artifacts across stages | Medium | High | Cross-reference testing in Phase 3; consistency check in Stage 6 prompt | Phase 3 |

---

## 5. Success Criteria

The MVP is "done" when:

| Criterion | Measurement | Target |
|-----------|-------------|--------|
| 6-stage journey works | Test with 3 different project types | All 3 produce complete, consistent artifacts |
| All ~15 artifacts generate | Count artifacts in sidebar at end of journey | ≥ 14 artifacts produced |
| Documents download correctly | Open every .docx and .xlsx in Word/Excel/Google Docs | All open without errors, content matches conversation |
| ZIP bundle works | Download and extract .zip | All files present, none corrupted |
| Rate limiting active | Exceed limit from same IP | Get blocked after limit is reached |
| Password gate works | Try accessing without password | Cannot access app content |
| SSL active | Check browser address bar | Shows lock icon, valid certificate |
| Industry-agnostic | Test with non-software project | Appropriate terminology and recommendations |
| Session cost | Check Anthropic dashboard after test session | < $1.50 per full session |

---

## 6. What's Explicitly NOT in the MVP

These are deferred to post-launch to protect the 5-week timeline:

| Feature | Why Deferred | Priority for Later |
|---------|-------------|-------------------|
| File upload (drag & drop existing docs) | Adds complexity to parsing and ingestion | High — first post-MVP feature |
| Session persistence (save & resume) | Requires database (SQLite/Postgres) | High |
| User authentication (accounts) | Overkill for demo | Medium |
| Template customization (upload org templates) | Complex UI and storage | Medium |
| Integration with Jira/Asana/MS Project | External API complexity | Low |
| Analytics dashboard | Requires data collection and storage | Low |
| PDF generation (direct) | Can be added alongside docx later | Medium |

---

## 7. Daily Workflow Recommendation

Since you're a coding beginner going full-time, here's a suggested daily rhythm:

| Time | Activity | Why |
|------|----------|-----|
| **9:00–9:15** | Review today's tasks from this plan | Know exactly what you're building today |
| **9:15–12:00** | Build (focused coding block 1) | Deep work while fresh |
| **12:00–1:00** | Break | You need this — coding fatigue is real |
| **1:00–3:00** | Build (focused coding block 2) | Continue morning's work or move to next task |
| **3:00–3:30** | Test what you built | Don't wait until end of day to test |
| **3:30–5:00** | Build / Fix / Learn | Fix issues from testing, or learn what you need for tomorrow |
| **5:00–5:15** | Git commit + notes | Always end the day with a clean commit and a note about where you left off |

**Beginner-specific tips:**
- When stuck for > 30 minutes, ask Claude for help. Copy-paste the error message and the relevant code.
- Don't try to understand every line of boilerplate code. Focus on understanding the parts YOU write.
- Test after every task, not after every phase. Small feedback loops catch issues early.
- It's normal for tasks to take 2x the estimated time. The buffer is built into the plan.

---

## 8. Decision Points for Deliverable 3

Before I proceed to **Deliverable 3 (System Prompt & Knowledge Base)**, I'd like your input on:

1. **Does the 5-week timeline feel right?** Given full-time commitment, this is ambitious but achievable. Any weeks where you know you'll have less availability?

2. **Phase order preference?** The plan builds UI first, then stages, then documents. Would you prefer a different sequence (e.g., getting document generation working earlier)?

3. **Which project type should we use for testing?** I recommend picking one real project idea you'd actually use this for — it'll make testing much more meaningful than made-up examples.

4. **System prompt priority for Deliverable 3:** Should Deliverable 3 be the complete, production-ready system prompt (all 6 stages, all artifact schemas), or would you prefer it start with just Stages 1–2 so you can iterate?

5. **Any concerns about the daily workflow or task granularity?** Too detailed? Not detailed enough? Want me to break anything down further?

---

*Awaiting your review before proceeding to Deliverable 3: System Prompt & Knowledge Base Configuration.*
