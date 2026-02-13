# Changelog

All notable changes to BriefKit are documented in this file.

## [1.0.0] - 2026-02-13

### Initial Release

BriefKit v1.0.0 — a conversational AI app that guides project managers from a project idea to a complete, downloadable documentation package across 6 structured stages.

### Features

#### Core Chat Experience
- Conversational AI advisor powered by Claude Sonnet 4.5
- Real-time streaming responses with typing indicators
- Smart auto-scroll that respects manual scrolling
- Auto-focus input after AI finishes responding
- Stage-aware system prompts with 4-layer architecture (identity, knowledge base, stage instructions, artifact schemas)
- Progressive context summarization to manage token usage across long sessions

#### 6-Stage Guided Journey
- **Stage 1 — Discover & Intake**: Project Brief, Project Classification
- **Stage 2 — Define & Scope**: Charter, Scope Statement, Business Case, Success Criteria & KPIs
- **Stage 3 — Structure & Plan**: WBS, Schedule, Budget, Resource Plan
- **Stage 4 — Stakeholders & Governance**: Stakeholder Register, RACI Matrix, Communication Plan, Governance Structure
- **Stage 5 — Risk & Quality**: Risk Register, Quality Plan, Change Management Plan
- **Stage 6 — Package & Kickoff**: SOW/PID, Kickoff Agenda, Completeness Report, Full Documentation Package (.zip)

#### Document Generation & Export
- 20+ artifact types with dedicated document generators
- Word (.docx) generation with professional formatting — titles, headings, tables, bullet lists
- Excel (.xlsx) generation for Budget and Risk Register with styled headers and auto-column widths
- Individual document download from artifact cards
- ZIP bundle download of all documents at once
- Null-safe generators that handle missing or partial AI data gracefully

#### Artifact Detection & Parsing
- Fenced code block detection (```artifact``` format)
- Unfenced JSON fallback for when AI omits fencing
- Optional title field with DEFAULT_TITLES fallback map
- Automatic project name extraction from artifacts
- Stage transition markers ([STAGE:N]) with auto-advance
- Inline artifact cards in chat with "Document generated — see sidebar" notices

#### Document Sidebar
- Scrollable artifact list with card-based UI
- Preview modal with full data rendering (strings, arrays, nested objects)
- Download button per artifact
- "Download All (.zip)" bundle button when 2+ documents exist
- Stage advance banner when key artifacts are complete

#### UI & Branding
- BriefKit brand identity with warm amber color palette
- DM Serif Display (headings), Plus Jakarta Sans (body), JetBrains Mono (code) typography
- Custom SVG logo component
- Light and dark mode with OS auto-detection via next-themes
- Mobile-responsive layout with bottom sheet sidebar drawer
- Keyboard shortcuts: Enter to send, Escape to close modals
- Professional progress bar tracking all 6 stages
- Loading states, empty states, and user-friendly error messages

#### Demo Access System
- Public showcase/landing page with feature walkthrough
- Token-based demo access (replaces simple password gate)
- Demo request form with email notification
- Token generation, listing, and revocation CLI scripts
- Cookie-based session persistence

#### Cost Controls & Security
- IP-based rate limiting (configurable via RATE_LIMIT_MAX env var)
- Session timeout (2 hours of inactivity)
- Anthropic API rate limit detection with user-friendly error messages
- API key via environment variable (never hardcoded)

### Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **AI**: Vercel AI SDK v6 with @ai-sdk/anthropic
- **Documents**: docx (Word) and exceljs (Excel) generation
- **Bundling**: JSZip for multi-document ZIP export
- **Fonts**: Google Fonts via next/font
