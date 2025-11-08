# Implementation Plan: Search Autocomplete Enhancement

**Branch**: `002-search-autocomplete` | **Date**: 2025-11-08 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/002-search-autocomplete/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enhance the existing Movie Flix landing page with autocomplete functionality that displays movie suggestions as users type, enabling discovery without exact title knowledge. Users can select from a text-only dropdown (Title + Year format) to view full details. Technical approach: Add debounced input handling (300ms delay, min 2 chars), integrate OMDb broad search API endpoint (`s` parameter for suggestions, existing `t` parameter for details), implement keyboard-navigable dropdown component (Up/Down/Enter/Escape), maintain existing React hooks architecture with new `useAutocomplete` hook for suggestion state. Zero Testing Policy applies—validation via manual localhost verification only.

## Technical Context

**Language/Version**: TypeScript 5.x (via Vite project scaffolding)  
**Primary Dependencies**: React 18.x, Vite 5.x, Tailwind CSS 3.x (inherited from 001-landing-page)  
**Storage**: In-memory (React state for autocomplete suggestions + selected movie), localStorage (theme preference only)  
**Testing**: Zero Testing Policy applies per constitution—manual verification on localhost:5173 only  
**Target Platform**: Web browser (Chrome, Firefox, Safari, Edge - modern versions)  
**Project Type**: Single-page web application (SPA) - enhancement to existing 001-landing-page  
**Performance Goals**: <2s suggestions display (includes 300ms debounce + API time), <1s detail fetch, <3s max timeout  
**Constraints**: <50KB bundle size increase, 300ms debounce delay, min 2 chars query length, max 5 suggestions displayed  
**Scale/Scope**: Single-user local development, +2 components (SuggestionsDropdown, keyboard nav logic), +1 hook (useAutocomplete), +1 API integration (OMDb broad search)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Verification Required**:
- [x] Tech stack alignment verified (No changes—still TypeScript + React + Vite + Tailwind CSS per Principle I)
- [x] Testing policy compliance confirmed (Zero Testing Policy applies—manual localhost validation only per Principle III)
- [x] Architecture patterns align with modularity/simplicity principles (Component-based React, custom hooks pattern extended per Principle II)
- [x] Security requirements addressed (Existing API key in `.env` continues to work for broad search endpoint per Security section)
- [x] Performance targets documented (<2s suggestions, <1s details, <3s timeout, <50KB bundle increase per Principle V)
- [x] Accessibility requirements noted (Keyboard navigation, ARIA labels for dropdown, WCAG 2.1 AA compliance per Principle V)
- [x] API integration follows constitution guidelines (OMDb broad search `s` parameter with error handling, existing in-memory caching extended per Principle II)
- [x] Mobile-first responsive design (Dropdown full-width on mobile ≤640px, 44px touch targets via Tailwind breakpoints per Principle II)
- [x] Code quality standards defined (ESLint, Prettier, Conventional Commits continue to apply per Principle IV)

**All gates PASSED** ✅ - No constitution violations. This is an enhancement that extends existing architecture without introducing new dependencies or complexity. Proceeding to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/002-search-autocomplete/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── omdb-broad-search-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Navbar.tsx              # (existing) Fixed navbar with logo + theme toggle
│   ├── SearchBar.tsx           # (MODIFIED) Add dropdown integration, keyboard handlers
│   ├── SuggestionsDropdown.tsx # (NEW) Autocomplete dropdown with keyboard navigation
│   ├── MovieCard.tsx           # (existing) Individual movie result card
│   ├── ResultsGrid.tsx         # (existing) Grid layout for movie cards
│   └── LoadingSpinner.tsx      # (existing) "Searching..." indicator
├── hooks/
│   ├── useTheme.tsx            # (existing) Theme toggle + localStorage logic
│   ├── useMovieSearch.tsx      # (MODIFIED) Extend for autocomplete suggestion selection
│   └── useAutocomplete.tsx     # (NEW) Debounced input + broad search API + suggestion state
├── types/
│   └── movie.ts                # (MODIFIED) Add SearchSuggestion, BroadSearchResponse interfaces
├── utils/
│   ├── api.ts                  # (MODIFIED) Add searchMovieBroad() function for `s` parameter
│   └── helpers.ts              # (existing) Plot truncation utility
├── App.tsx                     # (MODIFIED) Integrate autocomplete state management
├── main.tsx                    # (existing) Vite entry point
└── index.css                   # (existing) Tailwind CSS imports

public/
└── vite.svg                    # (existing) Default Vite icon

.env                            # (existing) Environment variables (VITE_OMDB_API_KEY)
```

**Structure Decision**: Enhancement to existing single-page web application using established Vite + React + TypeScript structure. No new directories or build tools—only new/modified components within existing `src/` hierarchy. Autocomplete logic follows same hooks pattern as base feature (custom React hook for state + API integration). Tailwind CSS styling continues via `index.css`. Zero testing policy means no `tests/` directory.

## Complexity Tracking

> **No constitution violations detected** - This section is empty because all design decisions align with the constitution. No complexity justification required.

---

## Phase 0: Research

**Objective**: Answer open questions about implementation before making code changes.

**Status**: ✅ **COMPLETE**

**Research Questions Answered**: 8 (see `research.md`)

### Key Findings

1. **Debounced Input**: `setTimeout` + `clearTimeout` in `useEffect` cleanup (300ms delay, no external libraries)
2. **OMDb Broad Search API**: `?s=${query}&type=movie&apikey=${key}` returns array of SearchSuggestion objects
3. **Keyboard Navigation**: Track `focusedIndex` state with Up/Down/Enter/Escape handlers, ARIA attributes for accessibility
4. **Click-Outside Detection**: `useRef` + global `mousedown` event listener pattern
5. **No Client-Side Caching**: Debouncing + 2-char minimum sufficient for quota management (research Q5)
6. **SearchBar Integration**: Modify existing SearchBar to conditionally render SuggestionsDropdown child component
7. **API Timeout**: Reuse 10s AbortController timeout from base feature (3s user-facing per FR-035)
8. **Duplicate Titles**: "Title (Year)" format + `imdbID` uniqueness handles edge case

**Artifacts Created**: 
- `specs/002-search-autocomplete/research.md` - Full research documentation with 8 questions/answers

**Constitution Re-Check**: No violations introduced. Research validates constitution compliance (no external dependencies, simple patterns).

---

## Phase 1: Design & Contracts

**Objective**: Define data models, API contracts, and manual validation workflow before task breakdown.

**Status**: ✅ **COMPLETE**

### Phase 1 Artifacts

1. **Data Model** (`data-model.md`):
   - **SearchSuggestion** interface: Title, Year, imdbID, Type, Poster
   - **BroadSearchResponse** interface: Search (array), totalResults, Response, Error
   - **SearchState** (extended): Added `suggestions: SearchSuggestion[]` field
   - **useAutocomplete** hook: New hook for suggestion state + debouncing + broad search API
   - State transition table: 7 transitions documented (typing, success, error, selection, Escape, click-outside)

2. **API Contracts** (`contracts/omdb-broad-search-api.md`):
   - **OMDb Broad Search Contract**: GET `?s=${query}&type=movie&apikey=${key}` endpoint
   - Success/error responses, rate limits (1000 req/day), timeout handling (10s AbortController)
   - Security: API key in .env, URL encoding for special chars
   - Performance: 200-500ms typical, <2s target (FR-027, SC-002)
   - Error scenarios: 404, 401, 429, timeout, network failure

3. **Manual Validation Workflow** (`quickstart.md`):
   - 41 manual test cases across 6 categories:
     - Autocomplete Suggestions (16 tests)
     - Keyboard Navigation (8 tests)
     - Selection & Detail Fetch (6 tests)
     - Responsive Design (4 tests)
     - Performance (3 tests)
     - Accessibility (4 tests)
   - Setup instructions (verify branch, start dev server)
   - Pass/fail checklist for localhost:5173 validation (Zero Testing Policy compliance)

**Agent Context Update**:
- [x] Executed `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
- [x] Updated `.github/copilot-instructions.md` with:
  - Language: TypeScript 5.x (via Vite project scaffolding)
  - Framework: React 18.x, Vite 5.x, Tailwind CSS 3.x (inherited from 001-landing-page)
  - Database: In-memory (React state for autocomplete suggestions + selected movie), localStorage (theme preference only)
  - Project type: Single-page web application (SPA) - enhancement to existing 001-landing-page

### Constitution Re-Check (Post-Design)

**Verification Required**:
- [x] Tech stack alignment verified (No changes—still TypeScript + React + Vite + Tailwind CSS per Principle I)
- [x] Testing policy compliance confirmed (quickstart.md enforces manual validation, 41 test cases, no automated tests per Principle III)
- [x] Architecture patterns align with modularity/simplicity principles (Data model uses simple interfaces, hooks pattern extended per Principle II)
- [x] Security requirements addressed (API contract specifies .env usage, URL encoding per Security section)
- [x] Performance targets documented (quickstart.md validates <2s suggestions, <1s details, <3s timeout per FR-027, FR-033, SC-002, SC-003, SC-009)
- [x] Accessibility requirements noted (quickstart.md includes ARIA attributes, keyboard navigation, color contrast tests per Principle V)
- [x] API integration follows constitution guidelines (OMDb broad search contract documents error handling, timeout, rate limits per Principle II)
- [x] Mobile-first responsive design (quickstart.md validates 320px/768px/1920px breakpoints, 44px touch targets per Principle II)
- [x] Code quality standards defined (TypeScript interfaces enforce type safety, ESLint continues to apply per Principle IV)

**All gates PASSED** ✅ - No constitution violations introduced during design phase.

### Phase 1 Summary

**Artifacts Created**: 4 (research.md, data-model.md, contracts/omdb-broad-search-api.md, quickstart.md)  
**Total Research Questions**: 8  
**Total Data Entities**: 3 (2 new: SearchSuggestion, BroadSearchResponse + 1 extended: SearchState)  
**External Dependencies Documented**: 1 (OMDb Broad Search API)  
**Manual Test Cases**: 41  
**Constitution Violations**: 0

**Next Phase**: Phase 2 (Task Breakdown) - Execute `/speckit.tasks` command to generate `tasks.md` with actionable implementation steps.


