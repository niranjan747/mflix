# Tasks: Search Autocomplete Enhancement

**Feature Branch**: `002-search-autocomplete`  
**Input**: Design documents from `/specs/002-search-autocomplete/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/omdb-broad-search-api.md ✅

**Tests**: ⚠️ **Zero Testing Policy** applies per constitution - NO automated test tasks included. Manual validation via `quickstart.md` (41 test cases) after implementation.

**Organization**: Tasks grouped by user story to enable independent implementation and validation.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and prepare for autocomplete enhancement

- [x] T001 Verify current build passes (npm run build) and bundle size baseline (<216.46 KB)
- [x] T002 Verify `.env` file contains `VITE_OMDB_API_KEY=3a5d28b8`
- [x] T003 Verify current dev server runs (npm run dev on localhost:5173)

**Checkpoint**: Base feature 001-landing-page confirmed working before modifications begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Add `SearchSuggestion` interface to `src/types/movie.ts` (Title, Year, imdbID, Type, Poster)
- [x] T005 [P] Add `BroadSearchResponse` interface to `src/types/movie.ts` (Search, totalResults, Response, Error)
- [x] T006 Extend `SearchState` interface in `src/types/movie.ts` to include `suggestions: SearchSuggestion[]` field
- [x] T007 Implement `searchMovieBroad(query: string)` function in `src/utils/api.ts` using `s` parameter, `type=movie`, 10s AbortController timeout, URL encoding
- [x] T008 Verify API function returns `BroadSearchResponse` type and handles success/error/no-results/timeout cases per contract

**Checkpoint**: Foundation ready - TypeScript interfaces and broad search API function available for all user stories

---

## Phase 3: User Story 1 - Autocomplete Suggestions (Priority: P1) 🎯 MVP

**Goal**: Display movie suggestions as user types, enabling discovery without exact title knowledge

**Independent Validation**: Type "matrix" in search bar → Dropdown appears with 5+ suggestions (format: "Title (Year)") within 2 seconds → Press Escape → Dropdown closes. Manual verification per `quickstart.md` Category 1 tests (TC-001 to TC-016).

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `src/hooks/useAutocomplete.tsx` with state: query, suggestions, loading, error (use `useState`)
- [x] T010 [P] [US1] Create `src/components/SuggestionsDropdown.tsx` as presentational component accepting `suggestions`, `loading`, `error`, `onSelect`, `onClose` props
- [x] T011 [US1] Implement debounce logic in `useAutocomplete.tsx`: `useEffect` with `setTimeout(300ms)` and cleanup, trigger only when `query.length >= 2`
- [x] T012 [US1] Implement broad search API call in `useAutocomplete.tsx`: call `searchMovieBroad(query)`, update `suggestions` state, handle success/error/no-results per research Q2
- [x] T013 [US1] Add `clearSuggestions()` function to `useAutocomplete.tsx` to reset `suggestions` to empty array
- [x] T014 [US1] Render suggestion items in `SuggestionsDropdown.tsx` with format "{Title} ({Year})" per FR-009, map with `key={movie.imdbID}`
- [x] T015 [US1] Display "No movies found—try broader terms!" message in `SuggestionsDropdown.tsx` when `suggestions.length === 0` and no loading/error per FR-014
- [x] T016 [US1] Display "Searching..." loading indicator in `SuggestionsDropdown.tsx` when `loading === true` per FR-015
- [x] T017 [US1] Display "Search hiccup—retry soon" error message in `SuggestionsDropdown.tsx` when `error !== null` per FR-025
- [x] T018 [US1] Modify `src/components/SearchBar.tsx` to integrate `useAutocomplete` hook (import and call with query state)
- [x] T019 [US1] Conditionally render `<SuggestionsDropdown>` in `SearchBar.tsx` below input when `suggestions.length > 0 || loading || error` per research Q6
- [x] T020 [US1] Style `SuggestionsDropdown.tsx` with Tailwind CSS: absolute positioning below input, white bg (dark:bg-gray-800), border, shadow, max 5 items visible
- [x] T021 [US1] Limit displayed suggestions to first 5 items from `suggestions` array per FR-006 (slice in `SuggestionsDropdown.tsx`)
- [x] T022 [US1] Add console.error logging for API errors in `useAutocomplete.tsx` per FR-027 (development mode only)
- [x] T023 [US1] Implement Escape key handler in `SearchBar.tsx` to call `clearSuggestions()` when dropdown visible per FR-013

**Checkpoint**: User Story 1 complete - Typing "inception" shows dropdown with 5 suggestions, Escape closes dropdown, error states handled

---

## Phase 4: User Story 2 - Select and View Details (Priority: P2)

**Goal**: Enable clicking suggested movie to fetch and display full details without typing complete title

**Independent Validation**: Type "matrix" → Click "The Matrix (1999)" from dropdown → Dropdown closes and detailed card appears with plot, poster, rating, runtime, genre within 1 second. Manual verification per `quickstart.md` Category 2 (TC-017 to TC-024) and Category 3 (TC-025 to TC-030).

### Implementation for User Story 2

- [x] T024 [US2] Add `searchMovieDetail(imdbID: string)` function to `src/hooks/useMovieSearch.tsx` that calls existing OMDb `t` parameter API (or `i` parameter with imdbID)
- [x] T025 [US2] Implement `selectSuggestion(imdbID: string)` function in `useAutocomplete.tsx` that calls `clearSuggestions()` and triggers detail fetch
- [x] T026 [US2] Add `onSelect` prop to `SuggestionsDropdown.tsx` (type: `(imdbID: string) => void`) and attach to `onClick` handler for each suggestion item
- [x] T027 [US2] Wire up `onSelect` callback in `SearchBar.tsx`: pass `selectSuggestion` function from `useAutocomplete` to `SuggestionsDropdown` component
- [x] T028 [US2] Integrate `useMovieSearch` hook in `SearchBar.tsx` (or lift to `App.tsx` if needed for state sharing) to manage `movieData` state
- [x] T029 [US2] Call `searchMovieDetail(imdbID)` from `selectSuggestion` implementation in `useAutocomplete.tsx` per research Q6 integration pattern
- [x] T030 [US2] Verify dropdown closes immediately after click by checking `suggestions` array cleared before detail fetch begins per FR-021
- [x] T031 [US2] Clear existing `movieData` when user types new query (add logic to `useEffect` in `SearchBar.tsx` watching query changes) per FR-024
- [x] T032 [US2] Display "Search hiccup—retry soon" error if detail fetch fails in `useMovieSearch.tsx` per FR-026, log to console per FR-027
- [x] T033 [US2] Implement keyboard navigation: add `focusedIndex` state to `useAutocomplete.tsx` (type: `number`, default: `-1`)
- [x] T034 [US2] Add `onKeyDown` handler in `SearchBar.tsx` for Up/Down arrow keys to update `focusedIndex` with circular navigation per research Q3
- [x] T035 [US2] Visual highlight focused suggestion in `SuggestionsDropdown.tsx`: apply `bg-blue-100 dark:bg-blue-900` CSS class when `index === focusedIndex` per FR-019
- [x] T036 [US2] Implement Enter key handler in `SearchBar.tsx`: if `focusedIndex >= 0`, call `selectSuggestion(suggestions[focusedIndex].imdbID)` per FR-018
- [x] T037 [US2] Add ARIA attributes to `SuggestionsDropdown.tsx`: `role="listbox"` on container, `role="option"` + `aria-selected={index === focusedIndex}` on items per research Q3
- [x] T038 [US2] Add `aria-activedescendant` attribute to search input in `SearchBar.tsx` pointing to focused suggestion ID for accessibility

**Checkpoint**: User Story 2 complete - Clicking suggestion loads detailed card, keyboard navigation (Up/Down/Enter) works, ARIA attributes present

---

## Phase 5: User Story 3 - Responsive Dropdown UI (Priority: P3)

**Goal**: Ensure autocomplete dropdown adapts to screen sizes (mobile to desktop) with proper touch targets

**Independent Validation**: Open DevTools responsive mode → Set viewport to 320px width → Type "star wars" → Dropdown spans full width, suggestion items have ≥44px height, tappable. Test 768px tablet, 1920px desktop, dark mode. Manual verification per `quickstart.md` Category 4 (TC-031 to TC-034).

### Implementation for User Story 3

- [x] T039 [US3] Add responsive width styles to `SuggestionsDropdown.tsx`: `w-full` on mobile (≤640px), constrained width on desktop using Tailwind breakpoints per FR-030
- [x] T040 [US3] Set minimum touch target height on suggestion items in `SuggestionsDropdown.tsx`: `min-h-[44px]` Tailwind class per FR-031
- [x] T041 [US3] Add dark mode styles to `SuggestionsDropdown.tsx`: `dark:bg-gray-800` background, `dark:text-white` text, `dark:border-gray-700` border per FR-032
- [x] T042 [US3] Add hover states to suggestion items: `hover:bg-gray-100 dark:hover:bg-gray-700` per research Q3 accessibility enhancements
- [x] T043 [US3] Test dropdown layout on 320px mobile viewport: verify full-width, no horizontal scroll, touch targets ≥44px (manual test per quickstart.md TC-031)
- [x] T044 [US3] Test dropdown layout on 768px tablet viewport: verify appropriate sizing, touch targets ≥44px (manual test per quickstart.md TC-032)
- [x] T045 [US3] Test dropdown layout on 1920px desktop: verify doesn't overflow, reasonable max-width constraint (manual test per quickstart.md TC-033)
- [x] T046 [US3] Test dark mode styling: verify dropdown matches navbar/search bar dark theme (manual test per quickstart.md TC-034)

**Checkpoint**: User Story 3 complete - Dropdown adapts to all screen sizes, touch targets meet 44px minimum, dark mode styling consistent

---

## Phase 6: Additional Functional Requirements

**Purpose**: Complete remaining FR requirements not covered by core user stories

- [x] T047 [P] Implement click-outside detection in `SearchBar.tsx`: use `useRef` for dropdown element + `useEffect` with global `mousedown` listener per research Q4
- [x] T048 [P] Hide dropdown on search button click in `SearchBar.tsx`: call `clearSuggestions()` before executing full search per FR-016 (clarification Q2)
- [ ] T049 Test 3-second timeout threshold: throttle network in DevTools → Type query → Verify "Search hiccup—retry soon" appears if response exceeds 3s total (manual test per quickstart.md TC-036, FR-035, SC-009)
- [ ] T050 Test special characters handling: Type "Amélie" → Verify URL encoding works, results returned (manual test per quickstart.md TC-014, edge case)
- [ ] T051 Test duplicate titles disambiguation: Type "the thing" → Verify dropdown shows "The Thing (1982)" and "The Thing (2011)" as separate items (manual test per research Q8, edge case)
- [x] T052 Verify bundle size increase <50KB: Run `npm run build` → Compare dist/ size to baseline from T001 → Confirm increase under 50KB per SC-008

**Checkpoint**: All functional requirements (FR-001 to FR-035) implemented and testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation before feature completion

- [x] T053 Code cleanup: Remove console.logs (except error logging per FR-027), unused imports, debug comments
- [x] T054 Accessibility audit: Verify WCAG 2.1 AA color contrast (manual test per quickstart.md TC-038), keyboard-only navigation (TC-037), screen reader compatibility (TC-039, TC-040)
- [x] T055 Performance validation: Run all quickstart.md Category 5 tests (TC-035 <2s suggestions, TC-036 <1s details, TC-037 <50KB bundle)
- [x] T056 Cross-browser testing: Test on Chrome, Firefox, Safari, Edge (manual verification per constitution target platform)
- [ ] T057 Run full quickstart.md validation: Execute all 41 test cases across 6 categories, document pass/fail in quickstart.md sign-off section
- [x] T058 Update README.md: Add "Search Autocomplete" feature description, mention keyboard navigation (Up/Down/Enter/Escape)
- [x] T059 Final build verification: Run `npm run build` → Verify 0 TypeScript errors per SC-007, bundle size within limits per SC-008
- [x] T060 Commit final changes with message: "feat: add search autocomplete with keyboard navigation (002-search-autocomplete)"

**Checkpoint**: Feature complete and validated - Ready for manual validation sign-off and merge to main

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - verify existing base feature works
- **Phase 2 (Foundational)**: Depends on Setup completion - **BLOCKS all user stories**
  - Must complete T004-T008 (TypeScript interfaces + API function) before ANY user story begins
- **Phase 3 (User Story 1 - P1)**: Depends on Foundational phase completion
  - Can start after T004-T008 complete
  - **MVP scope** - deliver this first for maximum value
- **Phase 4 (User Story 2 - P2)**: Depends on Foundational phase completion
  - Can start after T004-T008 complete
  - **Parallel opportunity**: Can work on T024-T038 in parallel with Phase 3 if team capacity allows
  - T024-T038 depend on `useAutocomplete` hook from T009, so partial dependency on Phase 3
- **Phase 5 (User Story 3 - P3)**: Depends on Foundational phase completion
  - Can start after T004-T008 complete
  - **Best done after Phase 3 + Phase 4**: Responsive styling easier to test with full functionality
- **Phase 6 (Additional FR)**: Depends on Phases 3, 4, 5 completion for full testing context
- **Phase 7 (Polish)**: Depends on all previous phases - final validation

### User Story Dependencies

- **User Story 1 (T009-T023)**: Can start after Foundational (T004-T008) - No dependencies on other stories
  - **Independent validation**: Type "matrix" → See dropdown → Press Escape
- **User Story 2 (T024-T038)**: Can start after Foundational (T004-T008)
  - **Partial dependency**: T024-T038 integrate with `useAutocomplete` from T009, so best done after US1 T009 complete
  - **Independent validation**: Type "matrix" → Click suggestion → See detailed card
- **User Story 3 (T039-T046)**: Can start after Foundational (T004-T008)
  - **Best after US1 + US2**: Responsive styling easier to verify with full functionality from US1 and US2
  - **Independent validation**: Responsive mode 320px → Type query → Dropdown full-width, 44px touch targets

### Within Each User Story

**User Story 1 (Autocomplete Suggestions)**:
1. T009 (useAutocomplete hook) + T010 (SuggestionsDropdown component) can run in parallel [P]
2. T011-T013 (debounce, API, clear logic) depend on T009
3. T014-T017 (dropdown rendering) depend on T010
4. T018-T019 (SearchBar integration) depend on T009, T010, T011-T013
5. T020-T023 (styling, Escape handler) depend on T018-T019

**User Story 2 (Selection & Details)**:
1. T024 (searchMovieDetail function) can run in parallel with T025 (selectSuggestion) [P potential]
2. T026-T029 (selection wiring) sequential after T024-T025
3. T030-T032 (state management, error handling) sequential after T026-T029
4. T033 (focusedIndex state) can run in parallel with T030-T032 [P]
5. T034-T038 (keyboard nav + ARIA) sequential after T033

**User Story 3 (Responsive UI)**:
1. T039 (responsive width) can run in parallel with T040 (touch targets) and T041 (dark mode) [P, P, P]
2. T042 (hover states) can run in parallel with T039-T041 [P]
3. T043-T046 (manual testing) sequential after T039-T042

### Parallel Opportunities

**Phase 2 (Foundational)**:
- T004 (SearchSuggestion interface) + T005 (BroadSearchResponse interface) can run in parallel [P]
- T006 (extend SearchState) depends on completion of T004 (SearchSuggestion must exist first)
- T007 (API function) can run in parallel with T004-T006 [P]

**Phase 3 (User Story 1)**:
- T009 (useAutocomplete hook) + T010 (SuggestionsDropdown component) can run in parallel [P]

**Phase 4 (User Story 2)**:
- T033 (focusedIndex state) can run in parallel with T030-T032 (state management) [P]

**Phase 5 (User Story 3)**:
- T039, T040, T041, T042 (all styling tasks) can run in parallel [P, P, P, P]

**Phase 6 (Additional FR)**:
- T047 (click-outside) + T048 (search button hide) can run in parallel [P, P]

**Cross-Story Parallelism**:
- If team has 2+ developers: After Foundational phase complete, can work on User Story 1 and User Story 2 simultaneously
- Developer A: T009-T023 (User Story 1)
- Developer B: T024-T038 (User Story 2) - starts after T009 complete (useAutocomplete hook dependency)

---

## Parallel Example: Foundational Phase

```bash
# Launch TypeScript interfaces together:
Task T004: "Add SearchSuggestion interface to src/types/movie.ts"
Task T005: "Add BroadSearchResponse interface to src/types/movie.ts"
Task T007: "Implement searchMovieBroad() in src/utils/api.ts"

# Then sequentially:
Task T006: "Extend SearchState interface (depends on T004 SearchSuggestion existing)"
Task T008: "Verify API function (depends on T007 complete)"
```

---

## Parallel Example: User Story 1

```bash
# Launch hook and component together:
Task T009: "Create useAutocomplete hook in src/hooks/useAutocomplete.tsx"
Task T010: "Create SuggestionsDropdown component in src/components/SuggestionsDropdown.tsx"

# After T009 complete:
Task T011: "Implement debounce logic in useAutocomplete.tsx"
Task T012: "Implement API call in useAutocomplete.tsx"
Task T013: "Add clearSuggestions function in useAutocomplete.tsx"

# After T010 complete (can overlap with T011-T013):
Task T014: "Render suggestion items in SuggestionsDropdown.tsx"
Task T015: "Display no-results message in SuggestionsDropdown.tsx"
Task T016: "Display loading indicator in SuggestionsDropdown.tsx"
Task T017: "Display error message in SuggestionsDropdown.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. **Complete Phase 1**: Setup (T001-T003) - Verify base feature works
2. **Complete Phase 2**: Foundational (T004-T008) - **CRITICAL** - TypeScript interfaces + API function ready
3. **Complete Phase 3**: User Story 1 (T009-T023) - Autocomplete suggestions with debouncing, error handling, Escape key
4. **STOP and VALIDATE**: Manual test per quickstart.md Category 1 (TC-001 to TC-016) - Type "matrix" → See dropdown → Verify debouncing → Press Escape
5. **Deploy/Demo MVP**: Autocomplete suggestions working, discovery enabled

**MVP Scope**: T001-T023 (23 tasks) - Delivers core autocomplete value without selection or responsive features

### Incremental Delivery

1. **Foundation**: Complete Phase 1 + Phase 2 (T001-T008) → Verify interfaces + API ready
2. **Increment 1 (MVP)**: Add User Story 1 (T009-T023) → **Validate independently**: Type "inception" → See 5 suggestions → Press Escape → Deploy/Demo ✅
3. **Increment 2**: Add User Story 2 (T024-T038) → **Validate independently**: Click "The Matrix (1999)" → See detailed card → Keyboard nav works → Deploy/Demo ✅
4. **Increment 3**: Add User Story 3 (T039-T046) → **Validate independently**: Responsive mode 320px → Dropdown full-width → 44px touch targets → Dark mode works → Deploy/Demo ✅
5. **Increment 4**: Add Phase 6 + Phase 7 (T047-T060) → Final polish → Full 41-test validation → Deploy/Demo ✅

**Each increment adds value independently and is manually testable per Zero Testing Policy**

### Parallel Team Strategy

With 2 developers:

1. **Together**: Complete Phase 1 + Phase 2 (T001-T008) - Foundation ready
2. **Developer A**: User Story 1 (T009-T023) - Autocomplete suggestions
3. **Developer B**: Wait for T009 complete, then start User Story 2 (T024-T038) - Selection & keyboard nav
4. **Together** (or either): User Story 3 (T039-T046) - Responsive UI (quick styling tasks)
5. **Together**: Phase 6 + Phase 7 (T047-T060) - Final polish and validation

**Critical Path**: T001-T008 (Foundational) → T009 (useAutocomplete hook) → T024-T038 (User Story 2 depends on T009)

---

## Manual Validation Checklist

**Source**: `quickstart.md` - 41 test cases across 6 categories

After implementation complete, execute manual validation:

1. **Category 1 - Autocomplete Suggestions** (TC-001 to TC-016): Basic display, debounce, empty results, <2 chars, special chars, rate limit, timeout, etc.
2. **Category 2 - Keyboard Navigation** (TC-017 to TC-024): Arrow keys, Enter, Escape, cycling, mouse/keyboard sync
3. **Category 3 - Selection & Detail Fetch** (TC-025 to TC-030): Click suggestion, detail API, error handling, card clearing
4. **Category 4 - Responsive Design** (TC-031 to TC-034): 320px mobile, 768px tablet, 1920px desktop, dark mode
5. **Category 5 - Performance** (TC-035 to TC-037): <2s suggestions, <1s details, <50KB bundle increase
6. **Category 6 - Accessibility** (TC-037 to TC-041): ARIA attributes, keyboard-only, color contrast WCAG 2.1 AA

**Sign-Off**: Record pass/fail results in quickstart.md validation template after T057 execution.

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] labels**: Map tasks to user stories (US1, US2, US3) for traceability
- **Zero Testing Policy**: No automated tests per constitution - all validation manual via quickstart.md
- **TypeScript**: All interfaces must have strict types, no `any` types allowed
- **Commit frequency**: Commit after each task or logical group (e.g., T009-T010 together, T011-T013 together)
- **Checkpoints**: Stop after each phase to validate independently before proceeding
- **MVP scope**: T001-T023 delivers core value (autocomplete suggestions) - can stop here for early feedback
- **Bundle size**: Track after T001 (baseline), verify again after T052 and T059 (<50KB increase per SC-008)
- **Dark mode**: All new UI components must support dark mode per FR-032 (use Tailwind `dark:` classes)
- **Accessibility**: ARIA attributes mandatory per research Q3 (WCAG 2.1 AA compliance per constitution)
- **Error messages**: All user-facing errors use "Search hiccup—retry soon" phrasing per FR-025, FR-026
- **Console logging**: Development-only per FR-027 (consider conditional based on environment)

---

## Total Task Count: 60

**Breakdown by Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 5 tasks (BLOCKS all user stories)
- Phase 3 (User Story 1 - P1): 15 tasks
- Phase 4 (User Story 2 - P2): 15 tasks
- Phase 5 (User Story 3 - P3): 8 tasks
- Phase 6 (Additional FR): 6 tasks
- Phase 7 (Polish): 8 tasks

**Breakdown by User Story**:
- User Story 1 (Autocomplete Suggestions): 15 tasks (T009-T023)
- User Story 2 (Selection & Details): 15 tasks (T024-T038)
- User Story 3 (Responsive UI): 8 tasks (T039-T046)
- Shared/Foundation: 22 tasks (T001-T008, T047-T060)

**Parallel Opportunities Identified**: 9 tasks marked [P] (15% can run in parallel with careful coordination)

**Independent Test Criteria**:
- User Story 1: Type "matrix" → See 5 suggestions → Press Escape (quickstart.md Category 1)
- User Story 2: Click "The Matrix (1999)" → See detailed card (quickstart.md Category 2 + 3)
- User Story 3: Responsive mode 320px → Full-width dropdown, 44px targets (quickstart.md Category 4)

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (T001-T023) - 23 tasks deliver core autocomplete value
