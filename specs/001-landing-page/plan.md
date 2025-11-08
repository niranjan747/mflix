# Implementation Plan: Movie Flix Landing Page

**Branch**: `001-landing-page` | **Date**: 2025-11-08 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-landing-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a responsive landing page for Movie Flix that enables users to search for movies via the OMDb API and view results (poster, title, year, plot, rating) in a clean, mobile-first interface. Includes light/dark theme toggle with localStorage persistence. Technical approach: React SPA with TypeScript, Tailwind CSS styling, Vite dev server, and client-side state management using React hooks. Zero Testing Policy applies—validation via manual localhost verification only.

## Technical Context

**Language/Version**: TypeScript 5.x (via Vite project scaffolding)  
**Primary Dependencies**: React 18.x, Vite 5.x, Tailwind CSS 3.x  
**Storage**: In-memory (React state for API responses), localStorage (theme preference only)  
**Testing**: Zero Testing Policy applies per constitution—manual verification on localhost:5173 only  
**Target Platform**: Web browser (Chrome, Firefox, Safari, Edge - modern versions)  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: <2s page load, <100ms theme toggle, <10s full search workflow  
**Constraints**: <1MB bundle size, API timeout 10s, no backend/database  
**Scale/Scope**: Single-user local development, ~5 components, 1 API integration (OMDb)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Verification Required**:
- [x] Tech stack alignment verified (TypeScript + React + Vite + Tailwind CSS per Principle I)
- [x] Testing policy compliance confirmed (Zero Testing Policy applies—manual localhost validation only per Principle III)
- [x] Architecture patterns align with modularity/simplicity principles (component-based React, simple hooks state management per Principle II)
- [x] Security requirements addressed (API key in `.env`, accessed via `import.meta.env` per Security section)
- [x] Performance targets documented (<2s load, <100ms theme toggle, <1MB bundle per Principle V)
- [x] Accessibility requirements noted (WCAG 2.1 AA, semantic HTML, ARIA labels, keyboard navigation per Principle V)
- [x] API integration follows constitution guidelines (OMDb API with error handling, in-memory caching per Principle II)
- [x] Mobile-first responsive design (320px-4K via Tailwind breakpoints per Principle II)
- [x] Code quality standards defined (ESLint, Prettier, Conventional Commits per Principle IV)

**All gates PASSED** ✅ - No constitution violations. Proceeding to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Navbar.tsx           # Fixed navbar with logo + theme toggle
│   ├── SearchBar.tsx        # Search input + button
│   ├── MovieCard.tsx        # Individual movie result card
│   ├── ResultsGrid.tsx      # Grid layout for movie cards
│   └── LoadingSpinner.tsx   # "Searching..." indicator
├── hooks/
│   ├── useTheme.tsx         # Theme toggle + localStorage logic
│   └── useMovieSearch.tsx   # OMDb API fetch + state management
├── types/
│   └── movie.ts             # TypeScript interfaces for Movie data
├── utils/
│   └── api.ts               # OMDb API client with error handling
├── App.tsx                  # Main application component
├── main.tsx                 # Vite entry point
└── index.css                # Tailwind CSS imports

public/
└── vite.svg                 # Default Vite icon (can replace with logo)

.env                         # Environment variables (VITE_OMDB_API_KEY)
```

**Structure Decision**: Single-page web application using default Vite + React + TypeScript structure. No backend or separate API layer needed—OMDb API called directly from client. Component-based architecture with custom hooks for theme and search logic. Tailwind CSS via `index.css` import. Zero testing policy means no `tests/` directory.

## Complexity Tracking

## Complexity Tracking

> **No constitution violations detected** - This section is empty because all design decisions align with the constitution. No complexity justification required.

---

## Phase 0: Research

**Objective**: Answer open questions about implementation before making code changes.

**Status**: ✅ **COMPLETE**

**Research Questions Answered**: 8 (see `research.md`)

### Key Findings

1. **State Management**: Custom React hooks (`useMovieSearch`, `useTheme`) sufficient per constitution—no external libraries needed (Zustand/Redux would violate Principle II: Simplicity First)
2. **API Timeout**: AbortController with 10s timeout per clarification session
3. **Dark Mode**: Tailwind CSS dark mode with class strategy (`dark:bg-gray-900`)
4. **Image Loading**: Native lazy loading (`loading="lazy"`) for poster images
5. **Responsive Grid**: Tailwind grid with breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
6. **Plot Truncation**: JavaScript `slice(0, 300)` on client-side
7. **Environment Variables**: Vite `.env` file with `VITE_` prefix, accessed via `import.meta.env.VITE_OMDB_API_KEY`
8. **Type Safety**: TypeScript interfaces for Movie, SearchState, Theme in `src/types/movie.ts`

**Artifacts Created**: 
- `specs/001-landing-page/research.md` - Full research documentation with 8 questions/answers

**Constitution Re-Check**: No violations introduced. Research validates constitution compliance.

---

## Phase 1: Design & Contracts

**Objective**: Define data models, API contracts, and manual validation workflow before task breakdown.

**Status**: ✅ **COMPLETE**

### Phase 1 Artifacts

1. **Data Model** (`data-model.md`):
   - **Movie** interface: Title, Year, Plot, Poster, imdbRating, Type, imdbID
   - **SearchState** interface: loading (boolean), movieData (Movie | null), error (string | null)
   - **Theme** type: `"light" | "dark"`
   - Validation rules for plot truncation, poster fallback, loading state transitions

2. **API Contracts** (`contracts/omdb-api.md`):
   - **OMDb API Contract**: GET request format, success/error responses, rate limits (1000 req/day), timeout handling (10s AbortController), security (API key in .env)
   - Error scenarios: 404 (movie not found), 401 (invalid API key), 429 (rate limit), timeout
   - Response fields: Title, Year, Plot, Poster, imdbRating, Type, imdbID, Response

3. **Manual Validation Workflow** (`quickstart.md`):
   - 35 manual test cases across 6 categories (Search, Theme, Responsive, Edge Cases, Performance, Accessibility)
   - Setup instructions (install deps, create .env, start dev server)
   - Pass/fail checklist for localhost:5173 validation (Zero Testing Policy compliance)

**Agent Context Update**:
- [x] Executed `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
- [x] Added TypeScript 5.x, React 18.x, Vite 5.x, Tailwind CSS 3.x to `.github/copilot-instructions.md`
- [x] Added database info: In-memory (React state), localStorage (theme only)

### Constitution Re-Check (Post-Design)

**Verification Required**:
- [x] Tech stack alignment verified (No changes—still TypeScript + React + Vite + Tailwind CSS per Principle I)
- [x] Testing policy compliance confirmed (quickstart.md enforces manual validation, no automated tests per Principle III)
- [x] Architecture patterns align with modularity/simplicity principles (Data model uses simple interfaces, hooks pattern per Principle II)
- [x] Security requirements addressed (API contract specifies .env usage, no hardcoded keys per Security section)
- [x] Performance targets documented (quickstart.md validates <2s load, <100ms theme toggle, <1MB bundle per Principle V)
- [x] Accessibility requirements noted (quickstart.md includes ARIA labels, keyboard navigation, color contrast tests per Principle V)
- [x] API integration follows constitution guidelines (OMDb contract documents error handling, timeout, rate limits per Principle II)
- [x] Mobile-first responsive design (quickstart.md validates 320px/768px/1024px/2560px breakpoints per Principle II)
- [x] Code quality standards defined (TypeScript interfaces enforce type safety per Principle IV)

**All gates PASSED** ✅ - No constitution violations introduced during design phase.

### Phase 1 Summary

**Artifacts Created**: 3 (research.md, data-model.md, contracts/omdb-api.md, quickstart.md)  
**Total Research Questions**: 8  
**Total Data Entities**: 3 (Movie, SearchState, Theme)  
**External Dependencies Documented**: 1 (OMDb API)  
**Manual Test Cases**: 35  
**Constitution Violations**: 0

**Next Phase**: Phase 2 (Task Breakdown) - Execute `/speckit.tasks` command to generate `tasks.md` with actionable implementation steps.

````
