<!--
SYNC IMPACT REPORT - Constitution Update
=========================================
Version Change: Initial version → 1.0.0
Ratification Date: 2025-11-08
Last Amendment: 2025-11-08

Modified/Added Principles:
- NEW: I. Tech Stack Adherence (Vite + TypeScript + Tailwind CSS)
- NEW: II. API Integration & Data Handling (OMDb API with API key 3a5d28b8)
- NEW: III. Zero Testing Policy (NON-NEGOTIABLE)
- NEW: IV. Code Quality & Maintainability (ESLint, Prettier, Conventional Commits)
- NEW: V. User Experience & Accessibility (WCAG 2.1 AA, Performance)

Added Sections:
- Project Vision and Scope
- Security & Environment Management
- Development Workflow & Governance

Templates Requiring Updates:
✅ plan-template.md - Updated to reflect zero-testing policy in constitution check
✅ spec-template.md - Updated to clarify testing sections are documentation only
✅ tasks-template.md - Updated to remove all test-related tasks and emphasis

Follow-up TODOs:
- None - all placeholders filled with concrete values
-->

# Movie Database App Constitution

## Project Vision and Scope

**Core Purpose**: Build a lightweight, intuitive web application for users to search, view, and explore movie details (title, plot, ratings, posters) using the OMDb API. Focus on single-page application (SPA) functionality without unnecessary complexity.

**Target Users**: Casual movie enthusiasts seeking quick, ad-free access to movie information on `localhost` during development/testing, with potential for future deployment.

**Out of Scope**: User authentication, persistent storage (beyond in-memory caching), social features, advanced analytics, or **any form of automated or manual testing**—iterations remain minimal and API-centric.

**Guiding Ethos**: "Simple queries, rich insights." Every feature must enhance discoverability without overwhelming the interface.

## Core Principles

### I. Tech Stack Adherence

**MUST Requirements**:
- Use **Vite** for scaffolding and build tooling—leverage hot module replacement (HMR) for rapid local development on `localhost:5173` (default port).
- Implement all logic in **TypeScript** for type safety, catching errors early and enabling better IDE support.
- Style exclusively with **Tailwind CSS** for utility-first, responsive design—avoid custom CSS unless absolutely necessary for API-sourced images or dynamic layouts.

**Rationale**: This stack ensures modern development velocity (Vite), compile-time safety (TypeScript), and consistent, maintainable styling (Tailwind). Deviations undermine tooling integration and developer experience.

### II. API Integration & Data Handling

**MUST Requirements**:
- All data fetches MUST use the OMDb RESTful API endpoint (`http://www.omdbapi.com/?apikey=3a5d28b8&t=${title}` or similar) with proper error handling for rate limits, invalid keys, or 404 responses.
- Cache API responses in-memory (via React state or simple store) to minimize calls during development; do NOT persist to localStorage unless specified in future specs.
- Sanitize and validate API responses—handle missing fields like `Poster` or `imdbRating` to prevent UI breakage.
- Respect OMDb's user-contributed content: Display attributions where relevant and avoid scraping beyond provided fields.
- Follow component-based architecture (e.g., SearchBar, MovieCard, ResultsList) for reusability.
- Keep state management simple (React hooks: `useState`, `useEffect`); escalate to libraries like Zustand only if specs demand it.
- Ensure mobile-first responsiveness with Tailwind's breakpoints, targeting screens from 320px to 4K.

**Rationale**: The OMDb API is the single source of truth. Proper error handling and caching prevent poor user experiences and API abuse. Component modularity enables incremental feature delivery.

### III. Zero Testing Policy (NON-NEGOTIABLE)

**ABSOLUTE PROHIBITION**: Under no circumstances shall any tests be written, implemented, or required. This includes (but is not limited to):
- Unit tests
- Integration tests
- End-to-end (E2E) tests
- Smoke tests
- Contract tests
- Manual test plans or checklists
- Any other form of automated or manual testing

**Validation Method**: Validation occurs solely through:
1. Spec-driven development adherence
2. Manual local verification on `localhost`
3. TypeScript type-checking at compile time

**Rationale**: This principle is absolute and overrides any conflicting suggestions, tools, or industry best practices. Testing overhead is deemed incompatible with the project's rapid iteration goals. Type safety and manual verification are the exclusive quality gates.

**Templates Impact**: All template references to "tests" (in spec.md, plan.md, tasks.md) serve as documentation-only placeholders for user stories and acceptance criteria—NOT instructions to write executable tests.

### IV. Code Quality & Maintainability

**Standards**:
- Write clean, readable code: Use **ESLint** and **Prettier** (integrated via Vite) for consistent formatting—enforce camelCase, single quotes, and semi-colons.
- Modularize files: One component/logic file per feature (e.g., `src/components/MovieSearch.tsx`), with barrel exports in `index.ts`.
- Commit messages MUST follow **Conventional Commits** format (e.g., `feat: add search functionality`, `fix: handle missing poster images`).

**Error Handling and Resilience**:
- Gracefully handle failures (network errors, invalid searches) with user-friendly messages like "Movie not found—try another title!"
- Log errors to console in development but suppress in production builds.

**Rationale**: Consistency reduces cognitive load. Error handling prevents user frustration. Conventional commits enable clear changelog generation and semantic versioning.

### V. User Experience & Accessibility

**Design Philosophy**: Minimalist and intuitive—use Tailwind's neutral palette (grays, whites) with movie-themed accents (e.g., film-strip borders).

**Accessibility Requirements**:
- Follow **WCAG 2.1 AA** standards: Semantic HTML, ARIA labels for dynamic content (e.g., `alt` for posters), keyboard-navigable search.
- Ensure color contrast ratios ≥4.5:1 for text; validate with tools like WAVE.

**Performance Targets**:
- Optimize for <2 second load times: Lazy-load images via `loading="lazy"`, debounce search inputs.
- Bundle size MUST remain under 1MB—leverage Vite's tree-shaking.

**Rationale**: Accessibility is a legal and ethical requirement. Performance directly impacts user satisfaction and SEO rankings (for future deployment).

## Security & Environment Management

**MUST Requirements**:
- Never expose the OMDb API key (`3a5d28b8`) directly in client-side code—use environment variables via `.env` file and access through Vite's `import.meta.env`.
- Validate user inputs (search queries) to prevent injection risks, though risk is low for this read-only API.

**Rationale**: Environment variable protection is a security fundamental. Input validation is defense-in-depth, even for low-risk scenarios.

## Development Workflow & Governance

**Iteration Process**:
- Use **Spec-Driven Development** via Spec-Kit: Specifications first, then AI-assisted plans/implementations.
- All changes MUST be validated against this constitution.
- Manual runs on `localhost` serve as the sole verification method (no automated tests per Principle III).

**Decision-Making**:
- If a choice conflicts with principles (e.g., adding a heavy library), default to the simplest viable option that upholds these principles.
- Escalate ambiguities via project notes or team discussion.
- The Zero Testing Policy (Principle III) is non-negotiable and takes precedence in all cases.

**Review Cadence**:
- Weekly ESLint runs to catch code quality drift.
- Bi-weekly constitution audits to ensure adherence.

**Sustainability**:
- Promote inclusive language in code and comments.
- Encourage contributions aligned with open-source OMDb community spirit.

## Governance

This constitution supersedes all other practices, tools, and external recommendations. Amendments require:
1. Documentation of change rationale in a Sync Impact Report.
2. Update of all dependent templates and documentation.
3. Version bump per semantic versioning rules (see below).

**Versioning Policy**:
- **MAJOR** (X.0.0): Backward-incompatible principle removals or redefinitions (e.g., reversing the zero-testing policy).
- **MINOR** (X.Y.0): New principle/section added or materially expanded guidance (e.g., adding a new tech stack requirement).
- **PATCH** (X.Y.Z): Clarifications, wording improvements, typo fixes, non-semantic refinements.

**Compliance Review**:
- All pull requests and specs must verify alignment with this constitution.
- Complexity (e.g., introducing state management libraries) must be justified in plan.md complexity tracking tables.
- Use `.specify/memory/constitution.md` as the authoritative governance reference.

**Version**: 1.0.0 | **Ratified**: 2025-11-08 | **Last Amended**: 2025-11-08
