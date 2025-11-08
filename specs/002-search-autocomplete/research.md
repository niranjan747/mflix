# Research: Search Autocomplete Enhancement

**Feature**: 002-search-autocomplete  
**Date**: 2025-11-08  
**Status**: Complete ✅

## Research Questions

### 1. How should debounced input be implemented in React?

**Decision**: Use `setTimeout` + `clearTimeout` pattern within `useEffect` hook monitoring input changes

**Rationale**:
- Native JavaScript approach, no external dependencies (lodash.debounce would violate constitution's simplicity principle)
- React `useEffect` cleanup function automatically cancels pending timers when input changes
- 300ms delay balances responsiveness vs. API call reduction

**Implementation Pattern**:
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    if (query.length >= 2) {
      fetchSuggestions(query);
    }
  }, 300);
  
  return () => clearTimeout(timer);
}, [query]);
```

**Alternatives Considered**:
- **lodash.debounce**: Rejected - adds 24KB to bundle, constitution requires minimizing dependencies
- **use-debounce library**: Rejected - external dependency for simple pattern, 3KB overhead
- **AbortController per keystroke**: Rejected - over-engineered, debounce simpler and achieves same API call reduction

---

### 2. What is the OMDb API endpoint for broad search?

**Decision**: `http://www.omdbapi.com/?apikey=${key}&s=${query}&type=movie`

**Rationale**:
- Official OMDb API documented endpoint for search (vs. single title fetch with `t` parameter)
- `s` parameter returns array of results (vs. `t` returning single object)
- `type=movie` filter ensures only movies (no TV series/episodes) per spec requirement FR-005
- Returns max 10 results per page, spec limits display to first 5 (FR-006)

**Response Structure**:
```json
{
  "Search": [
    {"Title": "Inception", "Year": "2010", "imdbID": "tt1375666", "Type": "movie", "Poster": "..."},
    ...
  ],
  "totalResults": "148",
  "Response": "True"
}
```

**Error Response**:
```json
{
  "Response": "False",
  "Error": "Movie not found!"
}
```

**Alternatives Considered**:
- **TMDb API**: Rejected - requires separate API key, not specified in constitution
- **IMDb scraping**: Rejected - violates terms of service, unreliable

---

### 3. How should keyboard navigation be implemented for dropdown?

**Decision**: Track `focusedIndex` state with Up/Down arrow event handlers, Enter to select, Escape to close

**Rationale**:
- Standard autocomplete UX pattern (Google search, browser address bars)
- WCAG 2.1 AA compliance requires keyboard navigation (constitution Principle V)
- React state (`focusedIndex: number`) enables visual highlighting via conditional CSS classes

**Implementation Pattern**:
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    setFocusedIndex((prev) => (prev + 1) % suggestions.length);
  } else if (e.key === 'ArrowUp') {
    setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  } else if (e.key === 'Enter' && focusedIndex >= 0) {
    selectSuggestion(suggestions[focusedIndex]);
  } else if (e.key === 'Escape') {
    closeSuggestions();
  }
};
```

**Accessibility Enhancements**:
- `role="listbox"` on dropdown container
- `role="option"` + `aria-selected` on each suggestion item
- `aria-activedescendant` on input pointing to focused suggestion ID

**Alternatives Considered**:
- **Tab key navigation**: Rejected - Tab should move focus to next form element, not within dropdown
- **Mouse-only interaction**: Rejected - violates WCAG 2.1 AA keyboard accessibility requirement
- **downshift library**: Rejected - 11KB bundle size, constitution requires simple custom hooks

---

### 4. How should dropdown visibility be managed (click outside, Escape)?

**Decision**: Combine `useRef` for dropdown element + `useEffect` with global click listener, Escape key handler

**Rationale**:
- `useRef` enables React to check if click target is inside/outside dropdown DOM node
- Global `document.addEventListener('mousedown')` captures all clicks (including outside React tree)
- Escape key handler already needed for keyboard navigation (question 3), reuse same pattern

**Implementation Pattern**:
```typescript
const dropdownRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      closeSuggestions();
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

**Alternatives Considered**:
- **Backdrop overlay**: Rejected - adds unnecessary DOM element, click-outside pattern simpler
- **Blur event on input**: Rejected - fires before suggestion click registers, breaks selection
- **react-outside-click-handler**: Rejected - external dependency for simple pattern

---

### 5. Should suggestions be cached to reduce API calls?

**Decision**: No client-side caching beyond debouncing (300ms delay already reduces calls)

**Rationale**:
- Spec requires fresh results per query (no stale data tolerance specified)
- OMDb API has 1000 req/day limit, but debouncing + 2-char minimum + 5-result limit keep usage reasonable
- In-memory cache would complicate state management (cache invalidation, size limits) without clear benefit
- Constitution Principle II emphasizes simplicity—add caching only if API quota becomes actual problem

**Usage Estimation**:
- Average search session: 3-5 queries = 3-5 API calls
- 10 sessions/day = 30-50 API calls (well under 1000 limit)

**Alternatives Considered**:
- **React Query**: Rejected - 39KB bundle size, overkill for single API endpoint
- **localStorage cache**: Rejected - persistence not needed, session-only usage pattern
- **LRU cache (in-memory)**: Rejected - premature optimization, no evidence of quota issues

**Future Consideration**: If API quota exceeded, implement simple Map-based cache with 5-minute TTL

---

### 6. How should the dropdown integrate with existing SearchBar component?

**Decision**: Modify SearchBar to conditionally render SuggestionsDropdown below input, pass query state + handlers via props

**Rationale**:
- Keeps SearchBar as single source of input state (controlled component pattern)
- SuggestionsDropdown becomes presentational component receiving suggestions + selection callback
- Follows React composition pattern (SearchBar owns input, delegates rendering to SuggestionsDropdown)

**Component Hierarchy**:
```
App
└── SearchBar (stateful - owns query, debounce, API calls)
    └── SuggestionsDropdown (presentational - receives suggestions, onSelect)
```

**Data Flow**:
1. User types → SearchBar updates query state
2. Debounce timer triggers → SearchBar calls `searchMovieBroad()` API
3. API response → SearchBar updates `suggestions` state
4. SearchBar passes `suggestions` + `onSelect` to SuggestionsDropdown
5. User clicks suggestion → `onSelect` fires → SearchBar calls `searchMovieDetail()`

**Alternatives Considered**:
- **Separate AutocompleteInput component**: Rejected - duplicates input logic, breaks existing SearchBar usage
- **Context API for suggestions**: Rejected - overkill for parent-child communication, props sufficient
- **Render prop pattern**: Rejected - unnecessary abstraction, direct composition clearer

---

### 7. What timeout value should apply to broad search API calls?

**Decision**: Reuse existing 10-second timeout from base spec, apply to both broad search (`s`) and detail fetch (`t`)

**Rationale**:
- Clarification session established 3-second **total** user-facing timeout (FR-035, SC-009)
- This includes 300ms debounce + network time
- 10-second **AbortController timeout** for API calls provides buffer beyond user expectation
- Consistent timeout across all OMDb endpoints simplifies error handling

**Timeout Breakdown**:
- 300ms: Debounce delay (user stops typing)
- 0-2700ms: API response window (ideally <1700ms per FR-033)
- 2700-3000ms: Grace period before timeout error shown
- 10000ms: Hard abort of hanging requests (safety net)

**Implementation**:
```typescript
// Reuse existing AbortController pattern from useMovieSearch
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  // ... handle response
} catch (error) {
  if (error.name === 'AbortError') {
    // Show "Search hiccup—retry soon" per FR-020
  }
}
```

**Alternatives Considered**:
- **3-second AbortController timeout**: Rejected - too aggressive, doesn't account for slow networks
- **No timeout**: Rejected - risks hanging requests consuming memory
- **Different timeouts for broad vs. detail**: Rejected - inconsistent UX, complicates code

---

### 8. How should the dropdown handle identical movie titles with different years?

**Decision**: Display format "Title (Year)" for all suggestions, rely on OMDb's returned `imdbID` for uniqueness

**Rationale**:
- Spec requirement FR-009 mandates "Title (Year)" format for disambiguation
- OMDb API returns `imdbID` as unique identifier (e.g., "tt1375666" for Inception 2010)
- Edge case documented: "The Thing (1982)" vs "The Thing (2011)" both appear as distinct options
- Year suffix provides user-facing disambiguation without extra API calls

**Rendering Pattern**:
```typescript
{suggestions.map((movie) => (
  <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
    {movie.Title} ({movie.Year})
  </li>
))}
```

**Alternatives Considered**:
- **Title-only display**: Rejected - violates FR-009, fails edge case test
- **Fetch full details on hover**: Rejected - unnecessary API calls, slow UX
- **Show poster thumbnails**: Rejected - clarification session decided text-only (Q3)

---

## Research Summary

**Total Questions Answered**: 8  
**External Dependencies Identified**: 0 (all solutions use native React + TypeScript)  
**Constitution Violations**: 0 (all decisions align with simplicity, zero testing, performance principles)  
**Key Technologies Confirmed**:
- React hooks: `useState`, `useEffect`, `useRef`
- Native JavaScript: `setTimeout`, `fetch`, `AbortController`
- TypeScript: Interface extensions for `SearchSuggestion`, `BroadSearchResponse`
- Tailwind CSS: Dropdown styling with dark mode, responsive breakpoints

**Next Phase**: Generate data-model.md, contracts/, and quickstart.md artifacts.
