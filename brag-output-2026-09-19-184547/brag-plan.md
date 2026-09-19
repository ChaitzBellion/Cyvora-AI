# Brag Plan: Cyvora AI

## What is this app?
Cyvora AI is an authenticated, persistent technical AI copilot for cloud engineering, Linux, DevOps, code, databases, and developer workflows. A user asks a technical question, receives a structured Gemini-backed answer with markdown and code, and can preserve the resulting conversation or solution for later work.

## The angle
**From incident to reusable engineering memory.** Open on the kind of problem that interrupts an engineer's day: a Cloud Run service returning HTTP 504s while connecting to Cloud SQL. Cyvora AI turns that problem into a focused diagnosis and an executable-looking mitigation, then shows how the answer can become part of a repeatable workflow or saved Knowledge library. The edit should feel premium and precise, with the real dark workspace UI doing the explaining.

## Hook (first 2-3 seconds)
A stark diagnostic prompt types into the real Cyvora Workspace: `HTTP 504s on Cloud Run + Cloud SQL. What is the bottleneck?` The prompt is followed by a compact red/amber incident cue and the line **"A real technical problem deserves a clearer next step."** This is a problem-led hook, not a claim that Cyvora automatically fixes infrastructure.

## Key moments (the middle)
- The Workspace receives a structured response labelled `Cyvora AI Copilot`, with a root-cause breakdown and a visible `Direct VPC Egress` mitigation.
- The response includes a real bash code block from the implemented Cloud Run example, showing that the product produces actionable technical guidance and formatted code.
- The answer can be saved to the implemented Knowledge area, where a concrete saved item such as `GCP Cloud Run with Serverless VPC Connector Timeout Fix` appears with category, tags, and a code snippet.
- A quick Workflows glimpse shows implemented reusable blueprints such as `Cloud Troubleshooter`, `Code Explainer & Refactor`, and `SQL Generator & Optimizer`.

## Outro / punchline
Land on the CY mark and the exact positioning line **"Cyvora AI — your technical AI copilot."** Add the brand relationship beneath it: **"Cyvora Studio"** and a restrained CTA: **"Turn the next technical problem into a clearer next step."** Do not promise autonomous remediation, production deployment, guaranteed correctness, or generic task automation.

## User flow worth showing
Authenticated entry into the Workspace -> ask a cloud troubleshooting question -> receive a structured assistant response with a code block -> save the response to Knowledge / revisit it through persistent History. A secondary reusable path is Workspace -> launch a configured Workflow -> return to the Workspace with the workflow context.

## Tone
- Preset: polished
- Creative direction: premium technical product film for an engineering tool
- Interpretation: Confident, clean, and futuristic without hype. Use restrained cyan accents, deep obsidian surfaces, crisp monospace details, deliberate UI motion, and enough hold time for every technical line to be read.

## Format: vertical — 1080x1920
## Duration: 19.6 seconds target
## Intended platforms: Instagram Reels, Instagram Stories, YouTube Shorts

## Visual identity (from the project)
- Background: `#0A0A0B` in the application body and workspace
- Secondary surface: `#0E0E10` / composer surface `#161618`
- Accent: cyan family, primarily Tailwind `cyan-400` / `cyan-500`, with blue gradient on the CY mark
- Text: `#CBD5E1` body and `#FFFFFF` / `#E2E8F0` headings
- Borders: `#1E293B` and `#2D2D33`
- Display font: `Plus Jakarta Sans` (Google Fonts)
- Body font: `Plus Jakarta Sans`
- Technical font: `JetBrains Mono`
- Strongest visual element: the real Workspace chat surface: prompt, `Cyvora AI Copilot` response label, cyan model badge, formatted markdown, and code snippet card.
- Background treatment: subtle dotted `bg-tech-grid` plus restrained `bg-tech-glow`; avoid turning these into abstract filler shots.

## Share copy (draft)
Cyvora AI turns real cloud, code, Linux, DevOps, and data problems into structured technical guidance you can keep and reuse. Built by Cyvora Studio.

## Audio direction
- Role: polished rhythmic bed with sparse interface accents
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` as the candidate bundled track
- Music treatment: start low under the hook, rise through the response reveal, duck slightly while code is readable, then resolve under the final brand lockup.
- Music cue guidance: use the bundled cue file `brag/skills/brag/assets/music/cues/happy-beats-business-moves-vol-10-by-ende-dot-app.music-cues.md`; estimated tempo 109.96 BPM. Strong cues include 15.82s, 18.01s, 18.55s, and 20.19s. The 15.82s cue is the best planned brand-transition target; exact composition timing may move nearby for readability.
- Audio-reactive treatment: subtle; let existing cyan glow, response emphasis, and logo presence breathe slightly with the music. No waveform, equalizer, particles, or strobing.
- SFX posture: sparse and professional; soft typing/click cues for the prompt and save action, one restrained impact for the response reveal, and a quiet logo resolve.
- Audio-coupled moments: prompt typing, response card reveal, code-line or cursor emphasis, save-to-Knowledge action, final CY mark landing.
- Restraint rule: audio must never make the diagnostic scenario feel like an emergency alarm or imply that Cyvora has automatically repaired the system.

## Storyboard

### Scene 1 — The incident — 0.0-2.6s (2.6s)
The vertical frame opens on the real Workspace visual language: obsidian background, dotted grid, cyan glow, and a tight crop of the Message Composer. A realistic prompt types in: `HTTP 504s on Cloud Run + Cloud SQL. What is the bottleneck?`

On-screen text: **"A real technical problem deserves a clearer next step."** Small supporting label: `Example scenario / Cloud Run + Cloud SQL / 504`

Voiceover/narration: none. /brag was invoked without `--voice`, so the composition stays voice-agnostic.

Visual/UI/asset: Recreate the implemented `MessageComposer` with its `Cyvora Ultra Copilot` badge and real prompt placeholder/context. Use the Cloud Run troubleshooting copy from `INITIAL_SUGGESTED_PROMPTS` or `INITIAL_CONVERSATIONS` as clearly labelled seeded/example source material, not as evidence of a live production incident.

Sequential/interaction: yes — prompt text types in once and holds; do not reveal multiple full sentences too quickly.
Audio intent: quiet typing texture, low pulse begins.
Audio-coupled idea: typing accents only; no alarm sound.
Transition mood: clean hard cut with a cyan cursor trace -> Scene 2

### Scene 2 — Cyvora AI, in context — 2.6-5.1s (2.5s)
The Workspace expands to show the conversation header, `Cyvora Ultra Engine` badge, user prompt, and the assistant response beginning to arrive. The response label `Cyvora AI Copilot` and model metadata are legible.

On-screen text: **"Cyvora AI is a technical copilot for the problems engineers actually bring to work."** Secondary labels appear as compact chips: `Cloud` `Linux` `DevOps` `Code` `SQL`

Voiceover/narration: none.

Visual/UI/asset: Recreate `WorkspacePage` and `ChatArea`; use the actual domain labels and the assistant label from the source. Do not show a generic AI avatar or invented dashboard.

Sequential/interaction: yes — the response card enters first, then the domain chips settle one by one with a readable hold.
Audio intent: music opens up; one restrained response reveal accent.
Audio-coupled idea: response card lands on a nearby beat; chips use quieter ticks.
Transition mood: soft slide / response-card push -> Scene 3

### Scene 3 — From question to diagnosis — 5.1-9.3s (4.2s)
The response card becomes the hero. Scroll or crop through the implemented assistant answer: `Root Cause Breakdown`, connector throughput saturation, database connection pool exhaustion, and the `Direct VPC Egress` recommendation. Keep only the first few lines visible at a time.

On-screen text: **"Structured diagnosis. Clear trade-offs. A next step you can inspect."** Emphasized in-product phrase: `Modern Alternative: Direct VPC Egress`

Voiceover/narration: none.

Visual/UI/asset: Use the seeded conversation in `INITIAL_CONVERSATIONS` and the actual markdown rendering behavior in `ChatArea`. Show the `Cyvora AI Copilot` label, cyan headings, and response card styling.

Sequential/interaction: yes — root-cause heading, two contributing factors, then the recommendation reveal sequentially; each full line holds long enough to read.
Audio intent: confident mid-track lift; no exaggerated “breakthrough” hit.
Audio-coupled idea: one major reveal near the 7.35-7.79s beat window, with natural timing if it improves readability.
Transition mood: vertical wipe into code -> Scene 4

### Scene 4 — Guidance you can use — 9.3-12.8s (3.5s)
A clean close-up of the real code block fills the center: `switch-to-direct-vpc.sh` with the visible `gcloud run deploy`, `--vpc-egress private-ranges-only`, `--min-instances`, and region lines. A small cursor highlights the command without suggesting execution.

On-screen text: **"From explanation to an actionable technical blueprint."** Small label: `Markdown + code output`

Voiceover/narration: none.

Visual/UI/asset: Use the actual seeded bash block in `INITIAL_CONVERSATIONS` / `INITIAL_SAVED_KNOWLEDGE` and the `CodeSnippet` surface rendered by `ChatArea` and `KnowledgePage`.

Sequential/interaction: yes — filename first, then the command block, then a subtle highlight on the VPC flag; keep the full code readable and do not fake a terminal run.
Audio intent: music ducks slightly so the code feels precise.
Audio-coupled idea: soft key/click accents aligned to the code emphasis, not every line.
Transition mood: clean horizontal slide -> Scene 5

### Scene 5 — Keep the useful parts — 12.8-16.2s (3.4s)
Make `Save to Knowledge` the clear primary action. The assistant action bar holds on the implemented `Save to Knowledge` affordance, then transitions to one readable Saved Knowledge card for `GCP Cloud Run with Serverless VPC Connector Timeout Fix`. Only after the card is established, use the final beat as a narrow secondary glimpse of the Workflows view with one or two compact cards, led by `Cloud Troubleshooter`.

On-screen text: **"Save the solution."** Primary label: `Saved Knowledge`. Secondary end beat: `Reusable workflows` with a small `Cloud Troubleshooter` card.

Voiceover/narration: none.

Visual/UI/asset: Use `ChatArea` assistant actions and one `KnowledgePage` card as the dominant visual. Use `WorkflowsPage` only for a brief secondary glimpse. The save action should be shown as a user-triggered UI transition, not claimed as automatic knowledge extraction.

Sequential/interaction: yes — save action holds first, the Knowledge card becomes readable, then one or two workflow cards appear briefly at reduced scale; do not present all three workflow examples at once.
Audio intent: rhythmic sequence with three restrained UI ticks.
Audio-coupled idea: card arrivals can use every other beat around 13.11-14.20s; preserve text readability over beat precision.
Transition mood: soft crossfade into brand -> Scene 6

### Scene 6 — Cyvora Studio close — 16.2-19.6s (3.4s)
The UI recedes into the deep obsidian field. The CY mark from `Navbar` / `EmptyState` resolves in cyan-to-blue, followed by the product and studio names.

On-screen text: **"Cyvora AI"**
Second line: **"Your technical AI copilot."**
Final lockup: **"Cyvora Studio"**
CTA: `Turn the next technical problem into a clearer next step.`

Voiceover/narration: none.

Visual/UI/asset: Reuse the implemented CY mark treatment and exact brand relationship `Part of Cyvora Studio` from `Navbar` / `LandingPage`; do not invent a separate logo asset.

Sequential/interaction: yes — CY mark, product name, positioning line, then studio lockup and CTA; final copy holds through the end.
Audio intent: resolve confidently, then leave a short clean tail.
Audio-coupled idea: target the nearby 15.82s or 18.01s/18.55s strong cue for the logo transition after timing is finalized; final lockup may settle naturally after the cue.
Transition mood: soft crossfade / final hold

**Music mood for this video:** upbeat-polished, restrained, technical
**Audio summary:** A low, modern rhythmic bed supports a problem-led opening, lifts through the structured answer, ducks for code legibility, then resolves under a clean Cyvora Studio brand lockup.

## Accuracy boundaries and approval notes
- Data provenance: Scenes 1, 3, 4, and the Knowledge card in Scene 5 use deterministic seeded/example content from `src/data/mockData.ts` so the story is repeatable. Scenes 2 and the Save-to-Knowledge interaction represent implemented live behavior, but a live Gemini response requires Firebase authentication, server configuration, and the Gemini API. Scene 6 uses implemented brand UI language rather than runtime data.
- Capability verification: The storyboard only shows implemented capabilities: authenticated chat requests to `/api/chat`, markdown/code rendering, persistent conversations, user-triggered Save to Knowledge, user-facing Knowledge search/filter/cards, reusable workflow launch, and custom workflow CRUD. It does not show arbitrary upload, autonomous execution, or infrastructure deployment.
- Saved Knowledge and Workflows are implemented user-facing functionality, not static examples: `KnowledgePage` supports search, filtering, viewing, starring, deleting, and adding items; `WorkflowsPage` supports launching workflows, creating/editing/deleting custom workflows, filtering/searching, and enabling/disabling custom workflows. `App.tsx` wires these actions to Firestore and Workspace state.
- The Cloud Run / Cloud SQL troubleshooting sequence is explicitly labelled `Example scenario` in Scene 1 and is sourced from seeded conversation data. It must not be presented as a real incident Cyvora diagnosed or as a verified production outcome.
- The video should say Cyvora AI provides technical guidance, structured answers, code, reusable workflows, saved knowledge, and persistent conversations. It should not say Cyvora automatically fixes incidents, deploys infrastructure, executes shell commands, guarantees correctness, or replaces engineers.
- The attachment chooser in `MessageComposer` is explicitly a sample-context placeholder. It should not be shown as arbitrary file upload or live log ingestion.
- The actual Gemini response depends on Firebase authentication, server configuration, and the Gemini API. For a deterministic promotional composition, use the seeded UI/data as the visual source or a captured authenticated UI state approved by the product owner.
- The seeded content includes phrases such as `Verified for GCP 2026` in the landing preview; omit that phrase from the video unless its provenance and desired claim are explicitly approved.
- Authentication/security can be visible only as a supporting context if needed. It should not take time away from the core product workflow in a 15-20 second cut.
