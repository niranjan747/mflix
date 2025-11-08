# Implementation Tasks: Movie Flix Landing Page

**Feature**: 001-landing-page  
**Branch**: `001-landing-page`  
**Date**: 2025-11-08  
**Source**: [spec.md](spec.md), [plan.md](plan.md)

---

## Overview

This document breaks down the Movie Flix landing page implementation into discrete, executable tasks organized by user story priority. Each phase is independently testable and delivers incremental value.

**Total Tasks**: 23  
**User Stories**: 3 (P1: Search, P2: Theme, P3: Responsive)  
**Zero Testing Policy**: Manual validation via quickstart.md only (no automated test tasks)

---

## Implementation Strategy

### MVP Scope (Phase 3 Only)
**Minimum Viable Product** = User Story 1 (Search and View Movie Details) only.
- Delivers core value: Movie search with OMDb API
- Can be validated independently using quickstart.md Test 1.1-1.6
- Recommended for initial development iteration

### Incremental Delivery
1. **Phase 1**: Project setup and environment configuration
2. **Phase 2**: Foundational infrastructure (TypeScript types, API client, utilities)
3. **Phase 3**: User Story 1 - Search functionality (MVP)
4. **Phase 4**: User Story 2 - Theme toggle (enhancement)
5. **Phase 5**: User Story 3 - Responsive design (polish)
6. **Phase 6**: Final polish and accessibility

Each phase is a complete, testable increment per constitution's modularity principle.

---

## Dependencies & Execution Order

### Story Completion Order
```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation)
    ↓
Phase 3 (User Story 1 - P1) ← MVP Completion Point
    ↓
Phase 4 (User Story 2 - P2) ← Independent of Phase 3
    ↓
Phase 5 (User Story 3 - P3) ← Requires Phase 3 (tests responsive layout with movie cards)
    ↓
Phase 6 (Polish)
```

**Parallelization Opportunities**:
- Phase 4 (User Story 2) can start immediately after Phase 2 (independent of Phase 3)
- Within each phase: Tasks marked [P] can run in parallel

**Blocking Dependencies**:
- Phase 2 MUST complete before any user story phase (provides shared types, utilities)
- Phase 5 requires Phase 3 (responsive grid layout needs movie cards to test)

---

## Phase 1: Setup & Environment

**Objective**: Initialize project environment and configuration files required for development.

**Independent Test Criteria**: 
- Run `npm install` successfully
- Run `npm run dev` and see Vite dev server start on localhost:5173
- Verify `.env` file exists with `VITE_OMDB_API_KEY=3a5d28b8`
- Verify `.gitignore` excludes `.env`

### Tasks

- [X] T001 Verify Vite + React + TypeScript project structure exists (already scaffolded)
- [X] T002 [P] Create `.env` file in project root with `VITE_OMDB_API_KEY=3a5d28b8`
- [X] T003 [P] Add `.env` to `.gitignore` to prevent API key exposure
- [X] T004 [P] Update `tailwind.config.js` to enable dark mode with class strategy (`darkMode: 'class'`)
- [X] T005 [P] Update `src/index.css` to include Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`)
- [X] T006 Run `npm install` to verify all dependencies (React, Vite, Tailwind CSS, TypeScript)

**Validation**: Run `npm run dev` and verify server starts on localhost:5173 with default Vite landing page.

---

## Phase 2: Foundational Infrastructure

**Objective**: Create shared TypeScript types, API client, and utility functions needed by all user stories.

**Independent Test Criteria**: 
- All TypeScript files compile without errors (`npm run build`)
- Can import types from `src/types/movie.ts` in other files
- API client function signature matches data model expectations

**Blocking Status**: MUST complete before Phase 3, 4, 5.

### Tasks

- [X] T007 [P] Create `src/types/movie.ts` with `Movie` interface (Title, Year, Plot, Poster, imdbRating, Response, Error)
- [X] T008 [P] Create `SearchState` interface in `src/types/movie.ts` (loading, movieData, error)
- [X] T009 [P] Create `Theme` type in `src/types/movie.ts` (`"light" | "dark"`)
- [X] T010 [P] Create `src/utils/api.ts` with `searchMovie(query: string)` function using AbortController for 10s timeout
- [X] T011 [P] Implement OMDb API error handling in `src/utils/api.ts` (404, 401, 429, timeout, network failures)
- [X] T012 [P] Create `src/utils/helpers.ts` with `truncatePlot(plot: string, maxLength: number)` function

**Validation**: Run `npm run build` and verify TypeScript compilation succeeds with no errors.

---

## Phase 3: User Story 1 - Search and View Movie Details (P1 - MVP)

**User Story**: As a casual movie enthusiast, I want to search for a movie by title and immediately see its details so that I can quickly access movie information.

**Priority**: P1 (MVP)

**Independent Test Criteria**: 
- Open localhost:5173, type "Inception", press Enter
- Verify movie card displays with poster, title "Inception (2010)", plot, rating
- Verify loading indicator appears during search
- Verify error message displays for "NonexistentMovieTitle12345"
- All criteria validated via quickstart.md Tests 1.1-1.6

### Tasks

- [X] T013 [P] [US1] Create `src/hooks/useMovieSearch.tsx` with `useState` for loading, movieData, error
- [X] T014 [P] [US1] Implement `searchMovie` async function in `useMovieSearch.tsx` hook using `src/utils/api.ts`
- [X] T015 [P] [US1] Create `src/components/SearchBar.tsx` with input field, search button, and form submit handler
- [X] T016 [P] [US1] Implement whitespace trimming and empty query validation in `SearchBar.tsx`
- [X] T017 [P] [US1] Create `src/components/LoadingSpinner.tsx` displaying "Searching..." text with spinner icon
- [X] T018 [US1] Create `src/components/MovieCard.tsx` displaying Title, Year, Plot (truncated), Poster, imdbRating
- [X] T019 [US1] Implement poster placeholder logic in `MovieCard.tsx` (film reel icon when Poster === "N/A" or onError)
- [X] T020 [US1] Integrate `useMovieSearch` hook into `src/App.tsx` and render SearchBar + LoadingSpinner + MovieCard
- [X] T021 [US1] Add error message display in `App.tsx` when search fails ("Movie not found" or "Search failed")

**Validation**: Follow quickstart.md Tests 1.1-1.6 (Enter key search, button click, not found, whitespace trim, multiple searches, loading state).

**MVP Completion Point**: After this phase, app delivers core value (movie search).

---

## Phase 4: User Story 2 - Theme Personalization (P2)

**User Story**: As a user who browses movies at different times of day, I want to toggle between light and dark themes so that I can reduce eye strain.

**Priority**: P2

**Independent Test Criteria**: 
- Open localhost:5173, verify light theme by default
- Click theme toggle, verify instant switch to dark theme
- Reload page, verify theme persists from localStorage
- All criteria validated via quickstart.md Tests 2.1-2.5

**Can Start After**: Phase 2 (independent of Phase 3)

### Tasks

- [X] T022 [P] [US2] Create `src/hooks/useTheme.tsx` with `useState` for theme and localStorage read on mount
- [X] T023 [P] [US2] Implement `toggleTheme` function in `useTheme.tsx` (swap light/dark, update localStorage, toggle `<html>` class)
- [X] T024 [US2] Create `src/components/Navbar.tsx` with "Movie Flix" logo and theme toggle button (sun/moon icon)
- [X] T025 [US2] Integrate `useTheme` hook into `Navbar.tsx` and wire toggle button to `toggleTheme` function
- [X] T026 [US2] Add dark mode Tailwind classes to `App.tsx` root container (`dark:bg-gray-900 dark:text-white`)
- [X] T027 [US2] Add dark mode variants to `SearchBar.tsx`, `MovieCard.tsx`, `LoadingSpinner.tsx` components

**Validation**: Follow quickstart.md Tests 2.1-2.5 (default light, toggle to dark, toggle back, dark persistence, light persistence).

---

## Phase 5: User Story 3 - Mobile-Responsive Browsing (P3)

**User Story**: As a mobile user, I want the landing page to be fully responsive and functional on my phone or tablet.

**Priority**: P3

**Independent Test Criteria**: 
- Open DevTools responsive mode, test 320px (1-column), 768px (2-column), 1024px (3-column)
- Verify touch targets ≥44px on mobile
- All criteria validated via quickstart.md Tests 3.1-3.4

**Can Start After**: Phase 3 (requires MovieCard component to test responsive grid)

### Tasks

- [X] T028 [P] [US3] Create `src/components/ResultsGrid.tsx` with Tailwind grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`)
- [X] T029 [P] [US3] Update `App.tsx` to wrap MovieCard in ResultsGrid component
- [X] T030 [P] [US3] Add responsive padding to SearchBar.tsx (`px-4 md:px-8 lg:px-16`)
- [X] T031 [P] [US3] Ensure search button and theme toggle have minimum 44px touch targets for mobile

**Validation**: Follow quickstart.md Tests 3.1-3.4 (320px mobile, 768px tablet, 1024px desktop, 2560px 4K).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Objective**: Apply final polish, accessibility improvements, and performance optimizations across all user stories.

**Independent Test Criteria**: 
- All quickstart.md accessibility tests pass (keyboard nav, ARIA labels, alt text, color contrast)
- `npm run build` produces bundle <1MB
- No console errors during manual validation

### Tasks

- [X] T032 [P] Add ARIA labels to SearchBar input (`aria-label="Search for movies"`) and search button
- [X] T033 [P] Add ARIA label to theme toggle button in Navbar.tsx (`aria-label="Toggle dark mode"`)
- [X] T034 [P] Add `alt` attribute to poster images in MovieCard.tsx (set to movie title)
- [X] T035 [P] Add `loading="lazy"` attribute to poster images in MovieCard.tsx
- [X] T036 [P] Verify color contrast ratios in both light and dark themes (≥4.5:1 per WCAG AA)
- [X] T037 Run `npm run build` and verify total bundle size <1MB
- [X] T038 Run ESLint and Prettier to enforce code quality standards
- [ ] T039 Complete all 35 manual tests in quickstart.md and document results

**Validation**: All quickstart.md tests (35 total) pass, bundle size <1MB, no console errors.

---

## Parallel Execution Examples

### Within Phase 2 (All tasks parallelizable):
```bash
# Can work on simultaneously (different files):
- T007: types/movie.ts (Movie interface)
- T010: utils/api.ts (API client)
- T012: utils/helpers.ts (truncatePlot function)
```

### Within Phase 3 (User Story 1):
```bash
# Parallelizable (different files):
- T013: hooks/useMovieSearch.tsx
- T015: components/SearchBar.tsx
- T017: components/LoadingSpinner.tsx

# Sequential (dependencies):
- T018: MovieCard.tsx (needs types from T007)
- T019: Poster placeholder logic (needs T018 complete)
- T020: App.tsx integration (needs T013, T015, T017, T018 complete)
```

### Phase 4 vs Phase 5 Parallelization:
```bash
# After Phase 2 completes, can work on these independently:
Phase 4 (Theme): T022-T027 (no dependency on search functionality)
Phase 5 (Responsive): T028-T031 (requires Phase 3 MovieCard to test grid)

# Recommendation: Complete Phase 3 first for MVP, then parallelize Phase 4 & 5
```

---

## Summary

**Total Tasks**: 39  
**Parallelizable Tasks**: 24 (marked with [P])  
**MVP Tasks**: T001-T021 (Phases 1-3, 21 tasks)  
**Enhancement Tasks**: T022-T039 (Phases 4-6, 18 tasks)

**Task Breakdown by User Story**:
- User Story 1 (P1 - MVP): 9 tasks (T013-T021)
- User Story 2 (P2): 6 tasks (T022-T027)
- User Story 3 (P3): 4 tasks (T028-T031)
- Setup/Foundation: 12 tasks (T001-T012)
- Polish: 8 tasks (T032-T039)

**Estimated Effort**:
- MVP (Phases 1-3): 4-6 hours
- Full Feature (Phases 1-6): 8-10 hours

**Next Steps**:
1. Start with Phase 1 (Setup) - 15 minutes
2. Complete Phase 2 (Foundation) - 1 hour
3. Implement Phase 3 (MVP) - 3-4 hours
4. Validate MVP with quickstart.md Tests 1.1-1.6
5. Proceed to Phases 4-6 or iterate on MVP based on feedback

---

**Note**: All tasks follow Zero Testing Policy - no automated test creation. Validation via manual execution of quickstart.md checklist only.
