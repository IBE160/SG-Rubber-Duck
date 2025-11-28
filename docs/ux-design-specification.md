# UX Design Specification — IBE160 Simulator

## Scope and sources
- Basert på: `product-brief-ibe160-2025-11-13.md`, wireframes (`project-setup-wireframe-v2.md`, `simulation-wireframe.md`, `analysis-wireframe.md`), og teknisk arkitektur (React/Vite + FastAPI/PostgreSQL + CPM/AI).
- Primærflyt: Project Setup → Simulation → Analysis med AI-veiledning og KPI-innsikt.

## Brukerreiser
- **Setup:** Opprett/velg prosjekt, bygg WBS (navn, varighet, avhengigheter), legg til risikoer/ressurser, valider og start simulering.
- **Simulation:** Følg realtids Gantt, KPI-kort og event logg; styr Play/Pause/Stop og simuleringshastighet.
- **Analysis:** Les KPI-resultater, AI-insights, event logg og anbefalinger; start ny simulering med justeringer.

## Skjermer og kjerneelementer
- **Project Setup (v2)**
  - Layout: 3 paneler (Prosjektliste 30% / WBS 50% / Detaljer 20%).
  - WBS tree-table med in-place redigering, indent/outdent, dependency picker, Add Task.
  - Detaljpanel med faner: Budget, Risks, Resources; Start Simulation-knapp i footer (disabled til validering OK).
- **Simulation**
  - Header med navn og kontroller (Play/Pause/Stop, hastighet).
  - Øvre panel: dynamisk Gantt (kritisk sti markert, risikohendelser med ikoner/tooltip).
  - Nedre panel: faner for KPI dashboard (SV, CV, REI + minitrender) og Event logg (timestamp + beskrivelse).
- **Analysis**
  - KPI-kort (Final Cost/Dur/Risk count) med fargekoding.
  - AI Assistant-seksjon (oppsummering, nøkkelårsaker, anbefalinger; ekspanderbare detaljer).
  - Tabber for Final Gantt, Cost breakdown, Risk analysis, Event logg; knapp for “Run New Simulation”.

## Interaksjons- og tilstandsregler
- Validering i Setup: disable Start-knapp ved manglende varighet/avhengigheter eller sirkulære deps; vis tooltip med grunn.
- Risks/Resources: modaler med påkrevde felt; sannsynlighet/impact med valg (Low/Med/High).
- Simulation: Play/Pause toggler animasjoner; Stop navigerer til Analysis; hastighets-slider (1x/2x/4x).
- Analysis: anbefalinger kan klikkes for å vise datagrunnlag (risiko, oppgave, tidslinje).

## Tilgjengelighet og designprinsipper
- Fargekontrast ≥ WCAG AA på tekst; fokusring på interaktive elementer.
- Tastaturnavigasjon for tabeller (WBS, event logg) og kontroller (Play/Pause).
- Konsistent spacing-grid (8 px base), komponenter med tydelige stater (hover/focus/active/disabled).
- Lesbar typografi (sans, 16 px base), hierarki via størrelse/vekt, ikke farge alene.

## I/T/N-funksjoner
- **In scope:** WBS redigering, risiko/ressurs-annotering, realtids Gantt, KPI dashboard, AI anbefalinger.
- **Out of scope (MVP):** Multi-tenant admin, avansert ressursoptimalisering, offline-modus.
- **Risikoer:** Gantt-integrasjon og dataflyt til KPI/AI; avhenger av stabil WebSocket/HTTP-kanal.
