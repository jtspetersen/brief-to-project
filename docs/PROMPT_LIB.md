Section B: Kickoff Prompt
Paste this as your first message to Claude Code after setting up the CLAUDE.md file.

--- START OF KICKOFF PROMPT ---
Hi Claude! Let's build the Brief-to-Project app. 

You should have a CLAUDE.md file in this folder with the full project context — please read it first.

I'm Josh, the product manager. I'm a coding beginner, so please explain things in plain language and break work into small steps. After each step, tell me how to verify it worked before moving on.

Let's start with Phase 1, Day 1 from the project plan: Dev Environment Setup.

Here's where I am right now:
- I have this empty folder open in VS Code
- I have Claude Code (you) running
- I have an Anthropic API key ready
- I have Node.js installed (if not, tell me how to check and install it)
- I have Git installed (if not, tell me how to check and install it)

Please start with Task 1.4: Create the Next.js app. Walk me through it step by step. After it's set up, we'll move to Task 1.5 (shadcn/ui) and continue down the list.

For reference, the full architecture is in docs/ARCHITECTURE.md and the full project plan is in docs/PROJECT_PLAN.md. If those files don't exist yet, let me know and we'll create them before starting.
--- END OF KICKOFF PROMPT ---

Section C: Follow-Up Prompts for Each Phase
These are prompts you can use to kick off each subsequent phase after completing the previous one. You don't need these on day 1 — save them for later.

Phase 2 Kickoff (after Phase 1 is complete)
Phase 1 is complete — I have a working chat app with the layout, streaming AI responses, and session state management.

Let's start Phase 2: Stage 1 Working End-to-End.

Begin with Task 2.1: Create the prompt file structure in /lib/prompts/. We need separate files for:
- core-identity.ts (the AI's persona)
- knowledge-base.ts (PM templates and frameworks)
- stage-instructions.ts (per-stage behavior)
- artifact-schemas.ts (JSON schemas for artifacts)

Start by creating the folder and the core-identity.ts file with the "senior program management advisor" identity. Walk me through what you're writing and why.

Phase 3 Kickoff (after Phase 2 is complete)
Phase 2 is complete — Stage 1 (Discover & Intake) works end-to-end. The AI asks discovery questions, generates a Project Brief artifact, and it appears in the sidebar. Rate limiting and password gate are in place.

Let's start Phase 3: All 6 Stages Working.

Begin with Task 3.1: Write the Stage 2 (Define & Scope) prompt instructions. Reference the ARCHITECTURE.md Stage 2 details for what activities and artifacts this stage covers.

The key artifacts for Stage 2 are:
- Project Charter
- Scope Statement
- Business Case Summary
- Success Criteria / KPIs

Start with the prompt instructions, then we'll define the artifact schemas.

Phase 4 Kickoff (after Phase 3 is complete)
Phase 3 is complete — all 6 stages of the conversation work. The AI walks the PM through discovery, scoping, planning, stakeholders, risk, and packaging. All ~15 artifacts appear in the sidebar.

Let's start Phase 4: Document Generation & Export.

Begin with Task 4.1: Install the docx package for Word document generation. Then Task 4.2: Build the base document generator framework in /lib/generators/.

The base generator should handle common formatting:
- US Letter page size (not A4)
- Arial font, 12pt default
- 1-inch margins
- Page numbers in footer
- Consistent heading styles (H1 = 16pt bold, H2 = 14pt bold)

Walk me through creating the base class, then we'll build the first specific generator (Project Brief).

Phase 5 Kickoff (after Phase 4 is complete)
Phase 4 is complete — all artifacts can be downloaded as .docx or .xlsx files, and the ZIP bundler packages everything together.

Let's start Phase 5: Polish, Deploy, Launch.

Begin with Task 5.1: Loading states. Let's add loading spinners/skeletons for:
1. While the AI is thinking (before first token arrives)
2. While a document is being generated for download
3. While the ZIP bundle is being created

Show me what shadcn/ui components we can use for this, then implement them.

Section D: Useful Mid-Build Prompts
These are prompts for common situations you'll encounter during development.

When Something Breaks
I'm getting this error:
[paste the error message here]

It happened when I was working on Task [X.Y]. 

Here's what I did right before the error:
[describe what you did]

Please explain what went wrong in plain language, then walk me through fixing it.

When You Want to Test
I just finished Task [X.Y]. Walk me through how to test it:
1. What should I do in the browser?
2. What should I see?
3. What would tell me something is wrong?

When You Want a Code Review
Before we move on, can you review what we've built so far in [folder/file path]?

Check for:
- Any obvious bugs or issues
- Code that's unnecessarily complex for a beginner to understand
- Missing error handling
- Things that will cause problems later

Give me a summary of what's good and what should be fixed.

When You Want to Understand Something
I don't fully understand what [concept/code/pattern] does. Can you explain it to me like I'm new to programming? Use an analogy if that helps. I don't need to become an expert — I just need to understand enough to make good decisions as the PM.

When You Want to See Progress
Give me a status check:
- Which tasks from the project plan have we completed?
- Which task are we currently on?
- Are we ahead or behind the estimated timeline?
- Any risks or concerns about upcoming tasks?

When the AI Conversation Quality Isn't Right
I'm not happy with how the AI is behaving in the chat. Here's what's wrong:
[describe the problem — e.g., "it's asking too many questions before giving useful output" or "it's not adapting to the project type"]

Let's look at the relevant prompt file and adjust it. Show me the current prompt text, explain what's causing the behavior, and suggest a fix. Let me approve the change before you make it.
