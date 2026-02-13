CLAUDE.md — Brief-to-Project App
What This Project Is
A conversational AI-powered web app that guides program managers from an initial project idea through to a complete, downloadable project documentation package. The AI acts as a sidecar advisor — not a form wizard — adapting to the PM's experience level, industry, and project type.
My Role (Josh)
I am the product manager and product owner. I am a coding beginner. I will:

Review code before it's committed
Provide clarification when asked
Test features as they're built
Make product decisions
Approve or request changes to approach

Important: Always explain what you're about to do in plain language BEFORE doing it. Break work into small steps so I can follow along and course correct often. After completing each task, tell me how to test/verify it worked.
Tech Stack (Approved)
LayerTechnologyNotesFrameworkNext.js 14+ (App Router)TypeScript, Tailwind CSSUI Componentsshadcn/uiCopy-into-codebase model, not a dependencyAI IntegrationVercel AI SDK (ai + @ai-sdk/anthropic)useChat hook for streamingLLMAnthropic Claude Sonnet 4.5Via Anthropic APIDocument Gendocx (npm package, aka docx-js)Server-side .docx creationSpreadsheetsexceljsServer-side .xlsx creationStateReact state + ContextNo database for MVPHostingSelf-hosted Node.js + nginx + PM2Linux server, Let's Encrypt SSL
Architecture Summary
The app has two main visual areas:

Chat Panel (left side): Conversational interface where the PM talks to the AI
Artifact Sidebar (right side): Shows generated documents as cards with preview/download

A progress bar at the bottom tracks which of the 6 stages the PM is in.
The 6 Stages
StageNameKey Artifacts Produced1Discover & IntakeProject Brief, Project Classification2Define & ScopeCharter, Scope Statement, Business Case, KPIs3Structure & PlanWBS, Schedule, Budget, Resource Plan4Stakeholders & GovernanceStakeholder Register, RACI, Comms Plan, Governance5Risk & QualityRisk Register, Quality Plan, Change Mgmt Plan6Package & KickoffSOW/PID, Kickoff Agenda, Full Documentation Package (.zip)
Data Flow
User types message
  → Frontend sends to /api/chat (with system prompt + conversation history + session state)
  → Claude processes and responds (streaming)
  → Frontend displays response token-by-token
  → If response contains artifact data (structured JSON), parse it
  → Add/update artifact in session state
  → Sidebar re-renders with new artifact card
  → When user clicks "Download", call /api/generate-artifact
  → Server generates .docx/.xlsx from artifact JSON using docx/exceljs
  → File downloads to user's browser
Cost Controls

Rate limiting: max sessions per IP per day (configurable via env var)
Password gate: DEMO_PASSWORD env var, required before accessing app
Session timeout: 2 hours
Model: Sonnet 4.5 (~$0.90/session estimated)

Project Plan Reference
The full task-level plan is in docs/PROJECT_PLAN.md. It has 5 phases across 5 weeks with ~60 tasks. Each task has:

A task number (e.g., 1.1, 1.2)
A description of what to build
A "How You'll Know It Worked" verification step
An estimated time

Work through the plan in order unless I say otherwise. When starting a new task, reference it by number (e.g., "Starting task 1.4: Create Next.js app").
Architecture Reference
The full technical architecture is in docs/ARCHITECTURE.md. Reference it for:

Detailed user journey and stage descriptions
Artifact schemas and formats
System prompt architecture (4 layers)
Non-functional requirements
Deployment architecture

Test Project for Development
When building and testing the AI conversation, use this sample project:

Project Name: "ShopFlow UX Transformation"
Type: Software / Digital — E-commerce platform UX/UI overhaul
Description: Complete redesign of an existing e-commerce platform's user experience. Includes new brand identity implementation, new component library (design system), and simplification of the customer journey based on identified pain points (cart abandonment, checkout friction, poor mobile experience, inconsistent navigation).
Budget: $850,000
Timeline: 8 months
Team Size: 12–15 people (mix of designers, frontend devs, backend devs, QA, PM)
Key Stakeholders: VP of Product, VP of Marketing, Head of Engineering, Customer Success Lead, external branding agency
Methodology: Hybrid (Agile sprints for development, Waterfall gates for brand approval milestones)

Use this project consistently when testing conversation flow, artifact generation, and document quality.
Code Style Preferences

Use TypeScript for all files (no plain JS)
Use functional components with hooks (no class components)
Use named exports (not default exports) where practical
Keep files small — if a component grows past ~150 lines, suggest splitting it
Comment non-obvious code, but don't over-comment
Use meaningful variable names (no single-letter vars except loop counters)
Tailwind for styling (no separate CSS files unless necessary)

File Structure (Target)
brief-to-project/
├── CLAUDE.md                    ← You are here
├── docs/
│   ├── ARCHITECTURE.md          ← Deliverable 1
│   └── PROJECT_PLAN.md          ← Deliverable 2
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← Root layout
│   │   ├── page.tsx             ← Main app page
│   │   ├── globals.css          ← Tailwind global styles
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts     ← Chat API endpoint
│   │       └── generate-artifact/
│   │           └── route.ts     ← Document generation endpoint
│   ├── components/
│   │   ├── ui/                  ← shadcn/ui components
│   │   ├── chat/
│   │   │   ├── chat-panel.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   └── chat-input.tsx
│   │   ├── sidebar/
│   │   │   ├── artifact-sidebar.tsx
│   │   │   ├── artifact-card.tsx
│   │   │   └── artifact-preview.tsx
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   └── progress-bar.tsx
│   │   └── auth/
│   │       └── password-gate.tsx
│   ├── lib/
│   │   ├── prompts/
│   │   │   ├── core-identity.ts
│   │   │   ├── knowledge-base.ts
│   │   │   ├── stage-instructions.ts
│   │   │   └── artifact-schemas.ts
│   │   ├── generators/
│   │   │   ├── base-generator.ts
│   │   │   ├── charter-generator.ts
│   │   │   ├── risk-register-generator.ts
│   │   │   └── ... (one per artifact type)
│   │   ├── types/
│   │   │   ├── session.ts
│   │   │   ├── artifacts.ts
│   │   │   └── stages.ts
│   │   └── utils/
│   │       ├── rate-limiter.ts
│   │       └── context-manager.ts
│   └── hooks/
│       ├── use-session.ts
│       └── use-artifacts.ts
├── public/                      ← Static assets
├── .env.local                   ← API keys (git-ignored)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
Commands Reference
bash# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run linter

# Deployment (on Linux server)
pm2 start npm --name "brief-to-project" -- start
pm2 status           # Check if running
pm2 logs             # View logs
pm2 restart brief-to-project  # Restart
Rules for Claude Code

Ask before creating files in new directories — confirm the path with me first.
One task at a time — complete a task, show me how to verify, then move on.
Don't skip ahead — follow the project plan order unless I ask otherwise.
Explain errors in plain language — if something breaks, tell me what happened and why before proposing a fix.
Commit messages — use format: feat(phase-X): task X.Y - brief description
Never hardcode the API key — always use environment variables.
Test instructions — after each task, give me a simple "try this to verify" instruction.