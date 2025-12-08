# Project Plan

## Instruksjoner

1. Der hvor det står {prompt / user-input-file}, kan dere legge inn en egen prompt eller filnavn for å gi ekstra instruksjoner. Hvis dere ikke ønsker å legge til ekstra instruksjoner, kan dere bare fjerne denne delen.
2. Hvis jeg har skrevet noe der allerede, f.eks. "Root Cause Analysis and Solution Design for Player Inactivity", så kan dere bytte ut min prompt med deres egen.


## Fase 0

- [x] /run-agent-task analyst *workflow-init
  - [x] File: bmm-workflow-status.yaml
- [x] Brainstorming
  - [x] /run-agent-task analyst *brainstorm "Root Cause Analysis and Solution Design for Player Inactivity"
    - [x] File: brainstorming-session-results-2025-11-12.md
  - [x] /run-agent-task analyst *brainstorm "User Flow Deviations & Edge Cases"
    - [x] File: brainstorming-session-results-2025-11-12_1.md
  - [x] /run-agent-task analyst *brainstorm "Brainstorm what it means to have a paid user"
    - [x] File: brainstorming-session-results-2025-11-12.md
- [x] Research
  - [x] /run-agent-task analyst *research "Which AI library should we use for orchestrating LLM interactions?"
    - [x] File: research-user-2025-11-12.md
- [x] Product Brief
  - [x] /run-agent-task analyst *product-brief "Read the two brainstorming sessions the research session and the @proposal.md file, and create a product brief for the project."
    - [x] File: product-brief-ibe160-2025-11-13.md

## Fase 1

- [x] Planning
  - [x] /run-agent-task pm *prd
    - [x] File: prd.md
  - [x] /run-agent-task pm *validate-prd
    - [x] File: validation-report-20251126.md
  - [x] /run-agent-task ux-designer *create-ux-design {prompt / user-input-file}
    - [x] File: ux-design-specification.md
    - [x] File: ux-color-themes.html
    - [x] File: ux-design-directions.html
  - [x] /run-agent-task ux-designer *validate-ux-design {prompt / user-input-file}
    - [x] File: ux-validation-report.md

## Fase 2

- [x] Solutioning
  - [x] /run-agent-task architect *create-architecture {prompt / user-input-file}
    - [x] File: architecture.md
  - [x] /run-agent-task pm *create-epics-and-stories {prompt / user-input-file}
    - [x] File: epics.md
  - [x] /run-agent-task tea *test-design {prompt / user-input-file}
    - [x] File: test-design.md
  - [x] /run-agent-task architect *solutioning-gate-check {prompt / user-input-file}
    - [x] File: solutioning-gate-check.md

## Fase 3

- [x] Implementation
  - [x] /run-agent-task sm *sprint-planning {prompt / user-input-file}
    - [x] File: sprint-artifacts/sprint-status.yaml
  - foreach epic in sprint planning:
    - [x] /run-agent-task sm create-epic-tech-context {prompt / user-input-file}
      - [x] File: sprint-artifacts/tech-spec-epic-{{epic_id}}.md
    - [x] /run-agent-task sm validate-epic-tech-context {prompt / user-input-file}
    - foreach story in epic:
      - [x] /run-agent-task sm *create-story {prompt / user-input-file}
        - [x] File: sprint-artifacts/{{story_key}}.md
      - [x] /run-agent-task sm *validate-create-story {prompt / user-input-file}
      - [x] /run-agent-task sm *create-story-context {prompt / user-input-file}
        - [x] File: sprint-artifacts/{{story_key}}.context.xml
      - [x] /run-agent-task sm *validate-story-context {prompt / user-input-file}
      - [x] /run-agent-task sm *story-ready-for-dev {prompt / user-input-file}
      while code-review != approved:
        - [x] /run-agent-task dev *develop-story {prompt / user-input-file}
        - [x] /run-agent-task dev *code-review {prompt / user-input-file}
      - [x] /run-agent-task dev *story-done {prompt / user-input-file}
      - [x] /run-agent-task sm *test-review {prompt / user-input-file}
    - [x] /run-agent-task sm *epic-retrospective {prompt / user-input-file}

### Story S1.1 — Initialize FastAPI app (Epic E1)
- [x] Files: sprint-artifacts/S1.1.md, sprint-artifacts/S1.1.context.md
- [x] /run-agent-task dev *develop-story "Start FastAPI with root/health, config via env"
- [x] /run-agent-task dev *develop-story "Add project PATCH (budget/contingency) + resource CRUD + schema migration"
- [x] /run-agent-task dev *develop-story "Connect frontend resources to real API with create/update/delete"
- [x] /run-agent-task qa *test "Backend smoke (pytest test_main.py) incl. simulation engine smoke"
- [x] /run-agent-task dev *code-review "Review S1.1 implementation"
- [x] /run-agent-task dev *story-done "Mark S1.1 done after review"
- [x] /run-agent-task sm *test-review "Post-review validation"
- [x] /run-agent-task sm *epic-retrospective "Document learnings for Epic E1/E2/E3 baseline"




## BMAD workflow

<img src="images/bmad-workflow.svg" alt="BMAD workflow">
