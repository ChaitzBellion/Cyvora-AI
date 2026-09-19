# Hyperframes Composition Brief: Cyvora AI

## Objective
Create a short promotional launch video for Cyvora AI under the Cyvora Studio brand. The film must explain the implemented product clearly: an authenticated technical AI copilot that turns engineering questions into structured answers with code, reusable workflows, persistent conversations, and saved Knowledge.

## Output
- Composition directory: `brag-output-2026-09-19-184547/composition/` (not created in this planning-only pass)
- Rendered video: `brag-output-2026-09-19-184547/brag.mp4` (do not create until approved)
- Format: vertical — 1080x1920, 9:16
- Duration: approximately 19.6 seconds
- Intended platforms: Instagram Reels, Instagram Stories, YouTube Shorts

## Source Material
- Project root: `c:\Users\HP\OneDrive\Documents\Personal Financial Planner\Cyvora AI Needs modifications`
- Primary files read:
  - `index.html`
  - `README.md`
  - `package.json`
  - `src/index.css`
  - `src/pages/LandingPage.tsx`
  - `src/pages/WorkspacePage.tsx`
  - `src/pages/WorkflowsPage.tsx`
  - `src/pages/KnowledgePage.tsx`
  - `src/pages/HistoryPage.tsx`
  - `src/components/workspace/ChatArea.tsx`
  - `src/components/workspace/MessageComposer.tsx`
  - `src/components/workspace/EmptyState.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/data/mockData.ts`
  - `src/services/geminiService.ts`
  - `server.ts`
  - `src/types/index.ts`
- Product name: `Cyvora AI`
- Brand: `Cyvora Studio`
- Tagline / strongest claim: `Turn technical problems into actionable solutions.`
- Core description: `Cyvora AI is your AI technology copilot for cloud, code, Linux, DevOps, data, and generative AI.`
- Key UI moment to recreate: the Workspace prompt and assistant response, including `Cyvora AI Copilot`, structured headings, a markdown code block, and the `Save to Knowledge` action.
- Concrete seeded scenario: Cloud Run HTTP 504 troubleshooting with Cloud SQL, Serverless VPC Access, and Direct VPC Egress.
- Copy that must appear verbatim or remain close to source:
  - `Cyvora AI`
  - `Cyvora Studio`
  - `Cyvora AI Copilot`
  - `Turn technical problems into actionable solutions.`
  - `Cloud Troubleshooter`
  - `Saved Knowledge`
  - `AI Workflows`
- Copy to avoid unless separately approved: `Verified for GCP 2026`, autonomous-fix language, guaranteed correctness, production execution/deployment claims, arbitrary file-upload claims.

## Creative Direction
- Tone preset: `polished`
- Creative direction: premium technical product film for an engineering tool
- Interpretation: Deep obsidian UI, cyan technical accents, blue-cyan CY mark, precise motion, clean vertical framing, and restrained audio. Confidence comes from showing the working product and real technical content rather than hype.
- Angle: From incident to reusable engineering memory. A specific Cloud Run/Cloud SQL problem enters the Workspace, becomes a structured diagnosis and code-backed recommendation, and then becomes a saved solution or reusable workflow.
- Hook: `A real technical problem deserves a clearer next step.` Show the real Workspace composer typing `HTTP 504s on Cloud Run + Cloud SQL. What is the bottleneck?`, with an `Example scenario` label.
- Outro / punchline: `Cyvora AI — your technical AI copilot.` Then `Cyvora Studio` and `Turn the next technical problem into a clearer next step.`
- Avoid:
  - Generic SaaS language such as `streamline your workflow`
  - Abstract AI graphics detached from the UI
  - Claims of automatic remediation, command execution, guaranteed results, or file ingestion beyond implemented behavior
  - Showing the attachment placeholder as a real upload pipeline
  - Replacing the product's dark cyan/obsidian visual language with a generic redesign

## Visual Identity
- Background: `#0A0A0B`
- Secondary surfaces: `#0E0E10`, `#161618`
- Text: `#CBD5E1`, `#E2E8F0`, `#FFFFFF`
- Accent: cyan-400/cyan-500 family, with cyan-to-blue CY mark
- Borders: `#1E293B`, `#2D2D33`
- Display font: `Plus Jakarta Sans`
- Body font: `Plus Jakarta Sans`
- Technical font: `JetBrains Mono`
- Visual references from the project:
  - `bg-tech-grid` dotted technical background
  - `bg-tech-glow` subtle cyan radial glow
  - CY mark from `Navbar` and `EmptyState`
  - Workspace composer and chat cards
  - assistant code block / `CodeSnippet` surface
  - Knowledge cards and workflow cards

## Storyboard
Use `brag-output-2026-09-19-184547/brag-plan.md` as the creative contract.

Scene summary:
1. The incident — 2.6s — prompt types into Workspace; hook about specific production problems.
2. Cyvora AI, in context — 2.5s — Workspace response arrives; technical domain chips appear.
3. From question to diagnosis — 4.2s — real seeded response headings and Direct VPC Egress recommendation.
4. Guidance you can use — 3.5s — real bash code block; highlight without simulating execution.
5. Keep the useful parts — 3.4s — readable Save to Knowledge action and saved Cloud Run solution; workflows are only a brief secondary glimpse.
6. Cyvora Studio close — 3.4s — CY mark, product name, positioning line, studio lockup, CTA.

Total: 19.6 seconds.

## Audio
- Audio role: polished rhythmic bed with sparse professional accents
- Audio arc: low pulse under the problem hook, lift for response and diagnosis, duck for code readability, then resolve under the final brand lockup
- Music: candidate `brag/skills/brag/assets/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3`
- Music treatment: start low; lift around the response reveal; duck subtly under Scene 4; fade/resolve below the final lockup
- Music cue guidance: bundled preset `brag/skills/brag/assets/music/cues/happy-beats-business-moves-vol-10-by-ende-dot-app.music-cues.md`, estimated 109.96 BPM. Strong cues available at 15.82s, 18.01s, 18.55s, and 20.19s. Prefer a nearby strong cue for the brand transition only if it does not compromise the 19.6s target or text readability.
- Audio-reactive treatment: subtle only; use music energy to gently vary existing glow, response emphasis, or logo presence. No waveform/equalizer/particle treatment.
- Audio-coupled moments:
  - Scene 1 prompt — restrained typing ticks
  - Scene 2 response reveal — one soft interface accent
  - Scene 4 code emphasis — sparse key/click accents
  - Scene 5 save/card sequence — three low-volume UI ticks, not one per text line
  - Scene 6 logo — quiet resolve
- SFX selection guidance: choose motion-matched, low-risk, polished UI sounds; keep repeated events quiet and leave space for technical copy.
- SFX analysis guidance: consult `brag/skills/brag/assets/sfx/sfx-analysis.md` or JSON during composition if SFX are added.
- Exact SFX choice: Hyperframes chooses filenames, timing, density, and volume after the visual animation exists.
- Audio files: copy the chosen music and any selected SFX into `brag-output-2026-09-19-184547/composition/assets/` only after approval and composition begins.

## Hyperframes Instructions
Load the current Hyperframes composition skills when implementation is approved: `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, and `hyperframes-cli`. Use the current Hyperframes conventions and run `hyperframes check` before any render.

Requirements:
- Keep the final composition vertical at 1080x1920 and approximately 19.6 seconds.
- Show actual Cyvora UI language and seeded product content, especially the Workspace and Cloud Run troubleshooting response.
- Keep all technical copy readable; motion should create energy, not shorten reading time.
- Use only the product claims supported by the source files.
- Do not render or create `composition/` during this planning pass.
- When composition begins, use local assets where possible and preserve the dark obsidian/cyan visual identity.
- Use the music cue metadata as optional guidance only; readability and product clarity take priority.

## Data Provenance and Capability Confirmation
- Scenes 1, 3, 4, and the Knowledge card in Scene 5 use deterministic seeded/example content from `src/data/mockData.ts` for repeatable composition.
- Scene 2 depicts the implemented live path: authenticated `sendChatMessage` calls `/api/chat`, and the server verifies Firebase identity before requesting Gemini. A live response is environment-dependent; use approved seeded UI or an authenticated capture for deterministic production footage.
- Scene 5 depicts implemented user-facing behavior. `ChatArea` exposes `Save to Knowledge`; `App.tsx` persists the resulting item through `createKnowledgeDoc`. `KnowledgePage` supports search, filtering, viewing, starring, deletion, and manual saving.
- Workflows are implemented functionality, not static cards. `WorkflowsPage` supports launch, search/filter, custom workflow creation/editing/deletion, and enable/disable controls; `App.tsx` persists custom workflow changes through Firestore and configures the Workspace when a workflow is launched. In the video, show this only as a brief secondary glimpse after the Knowledge card.
- The Cloud Run / Cloud SQL sequence is an explicitly labelled example/seeded scenario from the repository. It is not a claim that Cyvora diagnosed a real production incident or achieved a verified production fix.
- Every shown capability is limited to implemented behavior: authenticated technical chat, markdown/code output, persistent conversations, user-triggered Knowledge saving, Knowledge management, and reusable workflow configuration. Do not show arbitrary uploads, autonomous remediation, command execution, or deployment.

## Approval Dependencies
- Confirm the proposed 19.6-second story and the Cloud Run/Cloud SQL example are the desired launch narrative.
- Confirm whether deterministic seeded UI is acceptable for the final video, or whether an authenticated live UI capture is required.
- Confirm the bundled music candidate and whether the final should remain silent or add SFX; voiceover is currently disabled.
- Confirm the final CTA wording, especially `Turn the next technical problem into a clearer next step.`
