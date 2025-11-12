# Brainstorming Session Results

**Session Date:** 2025-11-12
**Facilitator:** Business Analyst Mary
**Participant:** BIP

## Executive Summary

**Topic:** Advanced Project Management Tool Features

**Session Goals:** 
- Interactive WBS builder with live validation of dependencies and cycles
- CPM calculation with critical-path visualization and task-level float/slack
- Heuristic resource leveling (peak shaving, prioritization by criticality)
- Risk engine (Bernoulli events) + Monte Carlo runs with seed for reproducibility
- Live Gantt + “what-if” timeline where users can drag/adjust and see KPI impact in real time
- KPI dashboard (SV, CV, REI) with trend lines and threshold coloring

**Techniques Used:** First Principles Thinking, "What If" Scenarios, Morphological Analysis

**Total Ideas Generated:** 61

### Key Themes Identified:

*   **Separation of Concerns:** The clear distinction between WBS (scope) and Activity Network (schedule logic) was a foundational insight from "First Principles Thinking" and carried through the scaling discussion.
*   **Scalability and Performance:** A constant consideration, especially highlighted in "What If" scenarios, leading to principles like "local, not global" validation and "optimistic by default."
*   **Truthfulness and Transparency:** The need for the UI to accurately reflect the underlying data model and provide clear explanations (microcopy, evidence over animation) was a strong theme.
*   **Progressive Complexity/Maturity:** The morphological analysis consistently presented options from basic to expert, suggesting a phased approach to feature development.
*   **Integration and Traceability:** The mapping between WBS and activities, and the desire for integrated risk/cost/schedule analysis, shows a strong need for a cohesive system.
*   **User Experience at Scale:** Command palettes, intent modals, and virtualized views are crucial for usability in complex projects.

## Technique Sessions

### First Principles Thinking: Interactive WBS Builder

**Core Principle:** The WBS is a scope tree (the "what"), and the Activity Network is a schedule DAG (the "how/when"). Dependencies belong in the Activity Network, not the WBS.

**User Interaction Design:**
When a user attempts to create a "dependency" between WBS elements A and B in the WBS view:
-   **Backend Action:** The tool should *not* create a link in the WBS tree. Instead, it should create a schedule dependency in the Activity Network, tied to A and B via their mapped activities/milestones.
-   **Example Implementation:** Create "Finish" and "Start" milestones under work packages B and A respectively, and then create a Finish-to-Start dependency between them in the network view.
-   **UI Representation:** The UI should visually represent this as a schedule-level dependency (e.g., a faint, distinct link) to maintain truthfulness, making it clear it's not a structural WBS link.

### "What If" Scenarios: Scaling to 50,000 WBS Elements / 200,000 Activities

**Problems Identified at Scale:**
-   **"Live validation" after every edit:** Full-graph cycle checks, float recomputes, and KPI recalculations become nonlinear and stall.
-   **Pickers & browsing:** Selecting from thousands of items is unmanageable; rendering large trees without virtualization causes performance issues.
-   **Auto-created milestones:** Naively creating thousands of milestones bloats the graph.
-   **Global data fetches:** Pulling parameters for "quick details" thrashes caches and causes heavy I/O.
-   **Locks & contention:** Coarse locks block teams.

**New First Principles for Scale:**
-   **Scope ≠ Logic:** WBS remains a tree (scope browser); all dependencies live in the schedule DAG.
-   **Local, not global:** Validate and recompute only the impacted component.
-   **Optimistic by default:** Accept user intent immediately; confirm fast or revert with precise explanation.
-   **Bounded work per action:** Operations have tight upper bounds or become queued jobs.
-   **Search-first, viewport-second:** Users jump via search/commands; UI shows a small, virtualized slice.
-   **Truthful microcopy:** UI names the model touched and surfaces provenance.
-   **Evidence over animation:** Show the why/where of changes (cycle path, affected tasks).
-   **Predictable SLOs:** Explicit engineering targets; UX communicates async operations.

**UI Redesign for Scale (Fast & Truthful):**
-   **Navigation & Layout:** Virtualized WBS panel (collapsed by default, local context only); action bar for WBS nodes ("Add schedule dependency...", "Open in Schedule", "View dependencies"); command palette for quick jumps.
-   **Creating "A depends on B":**
    -   **Intent Modal:** Relation selector (FS/SS/FF/SF, lag), type-ahead search for target package, granularity options ("Package milestones (recommended)" vs "Pick activities").
    -   **Optimistic Toast:** "Link created; validating..."
    -   **Inline Badge on A:** "Schedule link → B (FS,0d)".
    -   **Outcome State (~2s):** Success ("Validated. Δ dates in 42 tasks. View diff.") or Revert ("Cycle detected: A→…→B→A. Link removed. Open cycle." - with button to focus Schedule view on path).
    -   **Large Lists:** Show top N candidates + search; never render 10k items.
-   **Reading Dependencies in WBS:** "Schedule links (summary)" section (derived, not editable); click opens Schedule filtered to activities. Microcopy clarifies: "These are activity-level links summarized at package level. The WBS structure is unchanged."
-   **Batch Mode:** Queue multiple package links, then Validate & Apply as one transaction.
-   **Feedback & Accessibility:** Badges show source, age, partition; keyboard-first interaction.

### Morphological Analysis: Dimensions and Options for Advanced Project Management Tool Features

**Dimension 1: Scope Definition**
-   **Option A — Static Outline (Basic):** Hierarchical list of deliverables, edited like a doc/tree. Validation: Tree shape only, uniqueness of IDs.
-   **Option B — Structured WBS + Dictionary (Core):** Proper deliverable-oriented WBS with lightweight WBS Dictionary. Validation: 100% rule checklist, mutual exclusivity prompt, required dictionary fields.
-   **Option C — Interactive WBS with Mapping (Advanced):** WBS as scope backbone mapped to activities/cost objects, with integrity checks. Features: One-click map/unmap activities, coverage reports, read-only schedule badges, versioned edits. Validation: WBS invariants + mapping integrity.
-   **Option D — Governance-Grade WBS (Expert):** Enterprise scope system with templates, variants, baselines, and change control. Features: Template library, baselines & change requests, cross-project code scheme management, read-only integrations. Validation: All of C + baseline consistency, policy checks, change governance.

**Dimension 2: Schedule Logic**
-   **Option A — Manual Activity List (Basic):** Flat list of activities with user-entered dates; no logic engine. Validation: Required fields, date sanity.
-   **Option B — Precedence Basics + CPM (Core):** Activity DAG with FS links, single calendar. Computes dates, float, critical path. Validation: Acyclic graph, connectivity, no negative lags.
-   **Option C — Full Precedence & Constraints (Advanced CPM):** Rich precedence model (FS/SS/FF/SF, lags), multiple calendars, date constraints. Features: Incremental recompute, path analysis. Validation: Acyclic DAG, constraint sanity, calendar consistency.
-   **Option D — Constraint-Rich Logic & What-If Engine (Expert):** Enterprise-grade CPM with deeper constraints, external links, quality checks, scenario manager. Validation: Formal schedule checks, deterministic diffs.

**Dimension 3: Resource Management**
-   **Option A — Simple Assignment (Basic):** Attach named resources to activities; no capacity logic. Validation: Fields present, positive quantities.
-   **Option B — Capacity-Aware Warnings (Core):** Track availability and raise conflicts; schedule dates unchanged. Features: Resource calendars & capacities, over-allocation detection, material availability alerts. Validation: Flag conflicts, utilization reports.
-   **Option C — Heuristic Leveling (Advanced):** Auto-adjust start dates to remove over-allocations using fast rules; respects schedule logic. Features: Priority rules, moves activities within float, multi-resource handling, leveling report. Validation: Never break precedence/calendars, bound search.
-   **Option D — Capacity Planning & Optimization (Expert):** RCPSP-style engine with skills, crews, splits, cost/schedule trade-offs; supports scenarios. Features: Solvers (heuristics + metaheuristics), scenario manager, Pareto view. Validation: Hard constraints never violated, soft constraints tracked.

**Dimension 4: Risk Modeling**
-   **Option A — Basic Risk Register (Qualitative):** Structured list of risks with owners and mitigation notes; no numeric propagation. Features: Qualitative scoring, links to WBS elements. Validation: Required fields, owner assigned.
-   **Option B — Semi-Quantitative Register (Light Quant):** Add lightweight numbers that drive deterministic adjustments or what-if toggles. Features: Three-point estimates, risk effects as delta rules, sensitivity charts, scenario toggles. Validation: Units + ranges consistent, effects target real objects.
-   **Option C — Monte Carlo (Schedule- or Cost-Only) with Risk Events (Core Quant):** Stochastic simulation of either schedule or cost with independent draws; risk events injected. Features: Distributions per duration/cost, Bernoulli risk events, P10/P50/P80 dates, criticality index, sensitivity. Validation: No changes to precedence/resource constraints, reproducibility via seeds.
-   **Option D — Integrated Cost–Schedule Risk Analysis (CSRA) + Scenarios (Advanced):** Full Monte Carlo on both schedule and cost with correlations, calendars, conditional/triggered risks, and scenario management. Features: Joint simulation, mitigation portfolios, scenario manager, advanced diagnostics. Validation: Strict mapping/type checks, correlation matrices, SLO-controlled run budgets.

**Dimension 5: Timeline Visualization**
-   **Option A — Milestone/Date List (Basic):** Sortable list of key dates and simple progress flags. Features: Milestones with target/forecast/actual dates, traffic-light status, quick filters.
-   **Option B — Static Gantt / Calendar View (Core):** Read-only bars over time with lanes by WBS or team. Features: Activity bars, critical path highlight, collapse/expand by WBS, zoom levels.
-   **Option C — Interactive Gantt (Advanced):** Users can edit durations/links and see local recalculations. Features: Drag to move/resize activities, create links, multi-zoom, baseline compare, incremental recompute.
-   **Option D — “What-If” Sandbox & Overlays (Expert):** Scenario-capable, insight-rich timeline for analysis and decisions. Features: Scenario branches, overlays (risk, resource stress), delta view, partial locking, batch apply.

**Dimension 6: Performance Analytics**
-   **Option A — Simple Progress & Milestone Tracking (Basic):** Straightforward status reporting without earned value. Features: % complete, traffic-light KPIs, snapshot history.
-   **Option B — Earned Value “Lite” (Core):** Basic EV metrics with one baseline. Features: PV/EV/AC, SV/CV, SPI/CPI, S-curves, forecasts, WBS roll-ups.
-   **Option C — Full KPI & Trend Analytics (Advanced):** Rich dashboarding across schedule, cost, risk—with multi-baseline support and diagnostics. Features: Multi-baseline compare, drill-down, control thresholds, trend analytics, data quality panel.
-   **Option D — Predictive & Prescriptive Analytics (Expert):** Forecasting and “next best action” built on leading indicators; ties to scenarios. Features: Forecast finish dates/EAC with confidence, leading indicators, driver analysis, prescriptions, anomaly detection.

## Idea Categorization

### Immediate Opportunities

_Ideas ready to implement now_

**Quick wins (build in weeks)**

*   **Scope Definition:** B – Structured WBS + Dictionary (deliverables + acceptance criteria; mapping later).
*   **Schedule Logic:** B – Precedence Basics + CPM (FS links, single calendar, cycle detection, critical path).
*   **Resource Management:** B – Capacity-Aware Warnings (utilization, over-allocation flags; no auto-moves).
*   **Risk Modeling:** A – Basic Risk Register → B – Semi-Quant (three-point ranges, deterministic tornado).
*   **Timeline Visualization:** B – Static Gantt/Calendar (baseline overlay, critical highlight, virtualized rows).
*   **Performance Analytics:** B – EV “Lite” (PV/EV/AC, SPI/CPI, S-curves) + A – Simple Progress where baseline isn’t ready.

**Why these?** Minimal new algorithms, clear user value, easy to test.
First shippable pattern: one focused page per dimension, CSV import/export, and crisp acceptance checks.

### Future Innovations

_Ideas requiring development/research_

**Promising concepts (1–2 quarters to mature)**

*   **Scope Definition:** C – Interactive WBS with Mapping (activity→WBS integrity, coverage reports, read-only schedule badges).
*   **Schedule Logic:** C – Full Precedence & Constraints (SS/FF/SF, multi-calendar, date constraints, incremental recompute).
*   **Resource Management:** C – Heuristic Leveling (priority rules, bounded moves, readable leveling report).
*   **Risk Modeling:** C – Monte Carlo (schedule or cost) + risk events (P-dates, S-curves, criticality & drivers, seeds).
*   **Timeline Visualization:** C – Interactive Gantt (drag/edit with local recalculation, conflict toasts) and D – What-If Sandbox (light) for side-by-side diffs.
*   **Performance Analytics:** C – Full KPI & Trend (multi-baseline, variance attribution, data-quality panel).

**Why these?** They compound trust—traceability, explainable automation, real probabilistic answers—without requiring heavy infra or multi-agent systems.

### Moonshots

_Ambitious, transformative concepts_

**Bold moonshots (multi-quarter, big payoff)**

*   **Scope Definition:** D – Governance-Grade WBS (templates, baselines, change control across programs).
*   **Schedule Logic:** D – Constraint-rich logic & what-if engine with cross-project links, formal checks, scenario governance.
*   **Resource Management:** D – RCPSP-style optimization (skills/crews, task splits, multi-mode, overtime cost curves, metaheuristics).
*   **Risk Modeling:** D – Integrated Cost-Schedule (CSRA) with correlations, conditional risks, scenario portfolios, mitigation ROI.
*   **Timeline Visualization:** D – What-If Sandbox with overlays (risk/criticality/resource stress heatmaps, decision sheets).
*   **Performance Analytics:** D – Predictive & Prescriptive (leading-indicator forecasts, driver attribution, next-best actions tied to scenarios).

**Why these?** They require serious compute, data governance, and UX for explanation—but unlock executive-grade decisions and automation.

### Insights and Learnings

_Key realizations from the session_

*   The initial feature request for "live validation of dependencies and cycles" in a WBS builder was fundamentally flawed from a first principles perspective. The validation belongs in the schedule logic, not the WBS structure itself.
*   Designing for extreme scale (50k WBS elements, 200k activities) requires a complete shift in design philosophy, moving away from synchronous, global operations to asynchronous, local, and optimistic approaches.
*   The user's detailed breakdown of each dimension in the morphological analysis provides a clear roadmap for phased implementation, allowing for a minimum viable product that can evolve into an expert-level system.
*   The importance of clear communication in the UI (microcopy, visual cues) to convey complex underlying model behavior without overwhelming the user.

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Scope Definition: B – Structured WBS + Dictionary

- Rationale: It's a ground foundation pillar in a project. It's a very vital function that works well.
- Next steps: 
    1.  Finalize Data Models
    2.  Create UI/UX Mockups
    3.  Develop Backend API
    4.  Build Frontend Components
    5.  Write and Run Tests
- Resources needed: AI coding
- Timeline: 2 weeks

#### #2 Priority: Timeline Visualization: B – Static Gantt/Calendar

- Rationale: Key element in a project.
- Next steps: 
    1.  Define Data Requirements
    2.  Select Charting Library
    3.  Develop UI Mockups
    4.  Implement Backend API
    5.  Build Frontend Component
    6.  Write and Run Tests
- Resources needed: AI coding
- Timeline: 2 weeks

#### #3 Priority: Schedule Logic: B – Precedence Basics + CPM

- Rationale: Key element.
- Next steps: 
    1.  Finalize Data Models
    2.  Implement CPM Algorithm
    3.  Implement Graph Validation
    4.  Develop Backend API
    5.  Integrate with UI
    6.  Write and Run Tests
- Resources needed: AI coding
- Timeline: 2 weeks

## Reflection and Follow-up

### What Worked Well

The implementation on different options on the different subjects (Morphological Analysis).

### Areas for Further Exploration

None at the moment.

### Recommended Follow-up Techniques

None at the moment.

### Questions That Emerged

None at the moment.

### Next Session Planning

- **Suggested topics:** None at the moment.
- **Recommended timeframe:** None at the moment.
- **Preparation needed:** None at the moment.

---

_Session facilitated using the BMAD CIS brainstorming framework_