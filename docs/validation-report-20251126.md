# Validation Report

**Document:** `docs/prd.md`
**Checklist:** `.bmad/bmm/workflows/2-plan-workflows/prd/checklist.md`
**Date:** onsdag 26. november 2025

## Summary
- Overall: 0/many (0%) - Did not proceed with full validation due to critical failure.
- Critical Issues: 1

## Critical Failures (Auto-Fail)

- [✗] **No epics.md file exists** (two-file output required)
  - **Evidence:** The file `docs/epics.md` was not found. The PRD validation requires both `prd.md` and `epics.md` to exist to check for requirement traceability.
  - **Impact:** It is impossible to validate the traceability of requirements (FRs) to implementation epics and stories. This is a critical gap in the planning process.

## Recommendations
1.  **Must Fix:** Generate the `epics.md` file by running the `*create-epics-and-stories` workflow. This file should contain the breakdown of the Functional Requirements from the PRD into epics and user stories.
