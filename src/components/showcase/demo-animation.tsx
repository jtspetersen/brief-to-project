"use client";

import { useState, useEffect, useCallback } from "react";
import { BriefKitLogo } from "@/components/ui/briefkit-logo";
import {
  IconUser,
  IconAiAdvisor,
  IconDocuments,
  IconDownload,
  STAGE_ICONS,
} from "@/components/ui/icons";

// ── Types ───────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ArtifactEntry {
  title: string;
  stage: number;
  format: string;
}

interface DemoState {
  messages: ChatMessage[];
  artifacts: ArtifactEntry[];
  activeStage: number;
  isTyping: boolean;
  showPreview: ArtifactEntry | null;
  showPackage: boolean;
  contentFading: boolean;
  containerFading: boolean;
}

const INITIAL: DemoState = {
  messages: [],
  artifacts: [],
  activeStage: 1,
  isTyping: false,
  showPreview: null,
  showPackage: false,
  contentFading: false,
  containerFading: false,
};

interface TimelineStep {
  delay: number;
  action: (prev: DemoState) => DemoState;
}

// ── Act 1: Stage 1 — Discover & Intake ──────────────────────────────

const ACT1_USER: ChatMessage = {
  role: "user",
  text: "I'm planning an e-commerce UX redesign. Budget is $850K, timeline 8 months, team of 12\u201315.",
};

const ACT1_AI: ChatMessage = {
  role: "assistant",
  text: "Great start! This is a significant digital transformation. Let me draft your **Project Brief** based on what you've shared.",
};

const ART_BRIEF: ArtifactEntry = { title: "Project Brief", stage: 1, format: "DOCX" };

// ── Act 2: Stage 3 — Structure & Plan ───────────────────────────────

const ACT2_USER: ChatMessage = {
  role: "user",
  text: "Let's map out the work breakdown and build a timeline for all the major deliverables.",
};

const ACT2_AI: ChatMessage = {
  role: "assistant",
  text: "I've structured your **WBS** with 6 work packages and built a phased **Schedule** aligned to your 8-month window.",
};

const ART_WBS: ArtifactEntry = { title: "Work Breakdown Structure", stage: 3, format: "DOCX" };
const ART_SCHEDULE: ArtifactEntry = { title: "Project Schedule", stage: 3, format: "XLSX" };

// ── Act 3: Stage 6 — Package & Kickoff ──────────────────────────────

const ACT3_USER: ChatMessage = {
  role: "user",
  text: "Everything looks complete. Package it all up for the kickoff meeting!",
};

const ACT3_AI: ChatMessage = {
  role: "assistant",
  text: "Your full documentation package is ready — **15 artifacts** across all 6 stages, bundled as a .zip download.",
};

// Additional artifacts that appear in the sidebar for Stage 6
const ART_CHARTER: ArtifactEntry = { title: "Project Charter", stage: 2, format: "DOCX" };
const ART_RACI: ArtifactEntry = { title: "RACI Matrix", stage: 4, format: "DOCX" };
const ART_RISK: ArtifactEntry = { title: "Risk Register", stage: 5, format: "XLSX" };
const ART_SOW: ArtifactEntry = { title: "Statement of Work", stage: 6, format: "DOCX" };
const ART_KICKOFF: ArtifactEntry = { title: "Kickoff Agenda", stage: 6, format: "DOCX" };

// ── Timeline ────────────────────────────────────────────────────────

const CROSS_FADE_OUT = 600;
const CROSS_FADE_IN = 600;

const TIMELINE: TimelineStep[] = [
  // ─── ACT 1: Discover ─────────────────────────────────────────
  // User message appears
  { delay: 1000, action: (s) => ({ ...s, messages: [ACT1_USER] }) },
  // AI thinking
  { delay: 1400, action: (s) => ({ ...s, isTyping: true }) },
  // AI responds + Project Brief artifact
  {
    delay: 2400,
    action: (s) => ({
      ...s,
      isTyping: false,
      messages: [ACT1_USER, ACT1_AI],
      artifacts: [ART_BRIEF],
    }),
  },
  // Hold for reading
  { delay: 2200, action: (s) => s },

  // ─── CROSS-FADE → ACT 2: Plan ────────────────────────────────
  // Fade out chat (keep artifacts in state for carry-over)
  { delay: CROSS_FADE_OUT, action: (s) => ({ ...s, contentFading: true }) },
  // New chat + advance stage, preserve accumulated artifacts
  {
    delay: CROSS_FADE_IN,
    action: (s) => ({
      ...INITIAL,
      artifacts: s.artifacts,
      activeStage: 3,
      contentFading: false,
    }),
  },
  // User message about planning
  { delay: 600, action: (s) => ({ ...s, messages: [ACT2_USER] }) },
  // AI thinking
  { delay: 1400, action: (s) => ({ ...s, isTyping: true }) },
  // AI responds + WBS + Schedule added to existing artifacts
  {
    delay: 2400,
    action: (s) => ({
      ...s,
      isTyping: false,
      messages: [ACT2_USER, ACT2_AI],
      artifacts: [...s.artifacts, ART_WBS, ART_SCHEDULE],
    }),
  },
  // Show WBS preview
  { delay: 1600, action: (s) => ({ ...s, showPreview: ART_WBS }) },
  // Hold preview visible
  { delay: 2800, action: (s) => s },

  // ─── CROSS-FADE → ACT 3: Package ─────────────────────────────
  // Fade out content (preview stays in state, fades with the wrapper)
  {
    delay: CROSS_FADE_OUT,
    action: (s) => ({ ...s, contentFading: true }),
  },
  // New chat + advance to stage 6, carry all artifacts + add remaining docs
  {
    delay: CROSS_FADE_IN,
    action: (s) => ({
      ...INITIAL,
      artifacts: [...s.artifacts, ART_CHARTER, ART_RACI, ART_RISK, ART_SOW, ART_KICKOFF],
      activeStage: 6,
      contentFading: false,
    }),
  },
  // User message about packaging
  { delay: 600, action: (s) => ({ ...s, messages: [ACT3_USER] }) },
  // AI thinking
  { delay: 1400, action: (s) => ({ ...s, isTyping: true }) },
  // AI responds
  {
    delay: 2200,
    action: (s) => ({
      ...s,
      isTyping: false,
      messages: [ACT3_USER, ACT3_AI],
    }),
  },
  // Package ready overlay
  { delay: 1200, action: (s) => ({ ...s, showPackage: true }) },
  // Hold package
  { delay: 3000, action: (s) => s },

  // ─── FADE OUT → LOOP ─────────────────────────────────────────
  { delay: 800, action: (s) => ({ ...s, containerFading: true }) },
  { delay: 1200, action: () => ({ ...INITIAL }) },
];

// ── Sub-components ──────────────────────────────────────────────────

function MiniMessage({ msg, isNew }: { msg: ChatMessage; isNew: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""} ${
        isNew ? "animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out" : ""
      }`}
    >
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? <IconUser size={10} /> : <IconAiAdvisor size={10} />}
      </div>
      <div
        className={`max-w-[80%] rounded-lg px-2.5 py-1.5 text-[10px] leading-snug ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

function MiniTyping() {
  return (
    <div className="flex gap-2 animate-in fade-in duration-500 ease-out">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <IconAiAdvisor size={10} />
      </div>
      <div className="flex items-center gap-0.5 rounded-lg bg-muted px-3 py-1.5">
        <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function MiniArtifactCard({ art, isNew }: { art: ArtifactEntry; isNew: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-border/50 bg-card px-2 py-1.5 ${
        isNew ? "animate-in fade-in duration-500 ease-out" : ""
      }`}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
        <IconDocuments size={10} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium leading-tight">{art.title}</p>
        <p className="text-[8px] text-muted-foreground">
          Stage {art.stage} &middot; {art.format}
        </p>
      </div>
    </div>
  );
}

// ── Preview content per artifact type ───────────────────────────────

interface PreviewSection {
  heading: string;
  fields?: { label: string; value: string }[];
  bullets?: string[];
}

const PREVIEW_CONTENT: Record<string, PreviewSection[]> = {
  "Project Brief": [
    {
      heading: "Overview",
      fields: [
        { label: "Project Name", value: "ShopFlow UX Transformation" },
        { label: "Sponsor", value: "VP of Product" },
        { label: "Methodology", value: "Hybrid (Agile + Waterfall)" },
      ],
    },
    {
      heading: "Parameters",
      fields: [
        { label: "Budget", value: "$850,000" },
        { label: "Timeline", value: "8 months (Mar\u2013Oct 2026)" },
        { label: "Team Size", value: "12\u201315 people" },
      ],
    },
    {
      heading: "Key Objectives",
      bullets: [
        "Reduce cart abandonment by 35%",
        "Launch new design system across all touchpoints",
        "Improve mobile conversion rate by 50%",
      ],
    },
  ],
  "Work Breakdown Structure": [
    {
      heading: "Work Packages",
      fields: [
        { label: "WP-1", value: "Discovery & Research" },
        { label: "WP-2", value: "Design System & Brand" },
        { label: "WP-3", value: "Frontend Development" },
        { label: "WP-4", value: "Backend Integration" },
        { label: "WP-5", value: "QA & Performance" },
        { label: "WP-6", value: "Launch & Rollout" },
      ],
    },
    {
      heading: "Key Milestones",
      bullets: [
        "Design approval gate \u2014 Week 8",
        "Component library v1.0 \u2014 Week 16",
        "UAT sign-off \u2014 Week 28",
        "Production launch \u2014 Week 32",
      ],
    },
  ],
};

function MiniPreview({ art }: { art: ArtifactEntry }) {
  const sections = PREVIEW_CONTENT[art.title] ?? PREVIEW_CONTENT["Project Brief"]!;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-[2px] animate-in fade-in duration-500 ease-out">
      <div className="mx-4 w-full max-w-[300px] rounded-lg border bg-card shadow-lg animate-in zoom-in-95 duration-500 ease-out">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <IconDocuments size={10} />
          </div>
          <div>
            <p className="text-[11px] font-semibold">{art.title}</p>
            <p className="text-[8px] text-muted-foreground">
              Stage {art.stage} &middot; {art.format} &middot; Draft
            </p>
          </div>
        </div>
        <div className="space-y-2 px-3 py-2.5">
          {sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary/70">
                {section.heading}
              </p>
              {section.fields ? (
                <div className="space-y-0.5">
                  {section.fields.map((field) => (
                    <div key={field.label} className="flex items-baseline justify-between gap-2">
                      <p className="text-[8px] text-muted-foreground">{field.label}</p>
                      <p className="text-right text-[9px] font-medium text-foreground">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : section.bullets ? (
                <ul className="space-y-0.5 pl-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-1 text-[9px] text-foreground"
                    >
                      <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniPackage() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-[2px] animate-in fade-in duration-700 ease-out">
      <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-700 ease-out">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5B7C50] text-white shadow-lg shadow-[#5B7C50]/30">
          <IconDownload size={24} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Package Ready</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            15 documents &middot; Download .zip
          </p>
        </div>
      </div>
    </div>
  );
}

const STAGE_LABELS = ["Discover", "Define", "Plan", "Govern", "Risk", "Package"];

function MiniProgressBar({ activeStage }: { activeStage: number }) {
  return (
    <div className="mx-auto flex max-w-md items-center justify-center gap-0.5 px-4 py-2">
      {STAGE_LABELS.map((label, i) => {
        const stageNum = i + 1;
        const StageIcon = STAGE_ICONS[i];
        const isComplete = stageNum < activeStage;
        const isActive = stageNum === activeStage;

        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-0">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-700 ease-in-out ${
                  isComplete
                    ? "bg-[#5B7C50] text-white"
                    : isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_6px_rgba(249,168,66,0.4)]"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <StageIcon size={8} />
              </div>
              <span
                className={`text-[7px] leading-tight transition-colors duration-700 ease-in-out ${
                  isActive ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < 5 && (
              <div
                className={`mx-0.5 h-px flex-1 transition-colors duration-700 ease-in-out ${
                  isComplete ? "bg-[#5B7C50]" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────

export function DemoAnimation() {
  const [state, setState] = useState<DemoState>(INITIAL);
  const [prevArtifactCount, setPrevArtifactCount] = useState(0);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  const runTimeline = useCallback(() => {
    let elapsed = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (const step of TIMELINE) {
      elapsed += step.delay;
      const timeout = setTimeout(() => {
        setState((prev) => {
          const next = step.action(prev);
          // Track counts for "isNew" animations
          if (next.contentFading || next === prev) {
            // Fading out or no-op hold — keep existing counts
          } else if (next.messages.length === 0) {
            // Chat was reset (cross-fade in) — reset message count,
            // but keep artifact count so carried-over docs don't re-animate
            setPrevMessageCount(0);
            setPrevArtifactCount(next.artifacts.length);
          } else {
            setPrevMessageCount(prev.messages.length);
            setPrevArtifactCount(prev.artifacts.length);
          }
          return next;
        });
      }, elapsed);
      timeouts.push(timeout);
    }

    // Schedule next loop after a brief pause
    const loopTimeout = setTimeout(() => {
      setPrevMessageCount(0);
      setPrevArtifactCount(0);
      runTimeline();
    }, elapsed + 800);
    timeouts.push(loopTimeout);

    return timeouts;
  }, []);

  useEffect(() => {
    const timeouts = runTimeline();
    return () => timeouts.forEach(clearTimeout);
  }, [runTimeline]);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-display text-center text-2xl text-foreground">
          See It in Action
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Watch BriefKit guide a project from idea to documentation
        </p>

        {/* Demo container — mini app window */}
        <div
          className={`relative mt-8 overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg transition-opacity duration-1000 ease-in-out ${
            state.containerFading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-border/40 bg-card px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#F9A842]/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#5B7C50]/40" />
            </div>
            <div className="flex items-center gap-1.5 pl-2">
              <BriefKitLogo size={14} />
              <span className="font-display text-xs text-foreground">BriefKit</span>
            </div>
          </div>

          {/* App body — cross-fade wrapper */}
          <div
            className={`flex transition-opacity duration-500 ease-in-out ${
              state.contentFading ? "opacity-0" : "opacity-100"
            }`}
            style={{ height: 380 }}
          >
            {/* Chat panel */}
            <div className="flex flex-1 flex-col">
              {/* Messages area */}
              <div className="flex-1 space-y-2.5 overflow-hidden px-3 pt-3 pb-1">
                {state.messages.map((msg, i) => (
                  <MiniMessage key={`${state.activeStage}-${i}`} msg={msg} isNew={i >= prevMessageCount} />
                ))}
                {state.isTyping && <MiniTyping />}
              </div>

              {/* Input bar */}
              <div className="border-t border-border/30 px-3 py-2">
                <div className="flex items-center gap-2 rounded-md border border-input/60 bg-card px-2 py-1">
                  <span className="flex-1 text-[9px] text-muted-foreground/50">
                    Describe your project...
                  </span>
                  <div className="flex h-4 w-4 items-center justify-center rounded bg-primary/20 text-primary">
                    <svg viewBox="0 0 16 16" fill="currentColor" width={8} height={8}>
                      <path d="M2 8.5L8 2.5L14 8.5H10V14H6V8.5H2Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex w-[160px] flex-col border-l border-border/30 bg-card/50">
              <div className="flex shrink-0 items-center gap-1.5 border-b border-border/30 px-2 py-2">
                <IconDocuments size={12} className="text-muted-foreground" />
                <span className="text-[10px] font-semibold text-foreground">Documents</span>
                {state.artifacts.length > 0 && (
                  <span className="ml-auto rounded-full bg-primary/10 px-1.5 text-[9px] font-medium text-primary">
                    {state.artifacts.length}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto p-2">
                {state.artifacts.length === 0 ? (
                  <p className="py-4 text-center text-[9px] text-muted-foreground/50">
                    Documents will appear here
                  </p>
                ) : (
                  state.artifacts.map((art, i) => (
                    <MiniArtifactCard
                      key={art.title}
                      art={art}
                      isNew={i >= prevArtifactCount}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Preview overlay — inside cross-fade wrapper so it fades with content */}
            {state.showPreview && <MiniPreview art={state.showPreview} />}
          </div>

          {/* Progress bar — always visible during cross-fades */}
          <div className="border-t border-border/30">
            <MiniProgressBar activeStage={state.activeStage} />
          </div>

          {/* Package overlay — outside cross-fade, fades with container */}
          {state.showPackage && <MiniPackage />}
        </div>
      </div>
    </section>
  );
}
