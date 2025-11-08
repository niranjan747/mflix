# Data Model: Search Autocomplete Enhancement

**Feature**: 002-search-autocomplete  
**Date**: 2025-11-08  
**Base Feature**: Extends `001-landing-page` data model

## Overview

This document extends the existing Movie Flix data model with entities for autocomplete functionality. All entities are TypeScript interfaces living in `src/types/movie.ts` (alongside existing `Movie`, `SearchState`, `Theme` types from base feature).

---

## Entity: SearchSuggestion

**Purpose**: Represents a single movie suggestion returned by the OMDb broad search API (`s` parameter) for display in the autocomplete dropdown.

**Source**: OMDb API response object within `Search` array

**Lifecycle**: Created on broad search API response → Displayed in dropdown → Discarded when user types new query or closes dropdown

### Attributes

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `Title` | `string` | Yes | Non-empty | Movie title as returned by OMDb API (e.g., "Inception") |
| `Year` | `string` | Yes | Non-empty | Release year as returned by OMDb API (e.g., "2010") |
| `imdbID` | `string` | Yes | Pattern: `tt\d{7,8}` | Unique IMDb identifier used to fetch full details when suggestion clicked |
| `Type` | `string` | Yes | Must equal `"movie"` | Content type filter (always "movie" due to API `type=movie` parameter per FR-005) |
| `Poster` | `string` | No | URL or "N/A" | Poster image URL - **not used** in dropdown (text-only per clarification Q3), included for completeness |

### TypeScript Interface

```typescript
interface SearchSuggestion {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie";
  Poster: string;
}
```

### Relationships

- **One-to-One with Movie**: `imdbID` links to full `Movie` entity fetched via detail API when user selects suggestion
- **Many within BroadSearchResponse**: Array of 0-10 suggestions (spec displays first 5 per FR-006)

### Validation Rules

1. **Minimum Query Length**: Only fetch suggestions when input ≥2 characters (FR-003)
2. **Display Limit**: Show maximum 5 suggestions even if API returns 10 (FR-006)
3. **Uniqueness**: `imdbID` guarantees no duplicate entries (handles identical titles with different years per edge case)
4. **Ordering**: Display suggestions in API-returned order (FR-007)

---

## Entity: BroadSearchResponse

**Purpose**: Represents the full response structure from OMDb broad search API endpoint

**Source**: Direct mapping of OMDb API JSON response for `s` parameter queries

**Lifecycle**: Created on API fetch → Parsed to extract `Search` array → Discarded after suggestions rendered

### Attributes

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `Search` | `SearchSuggestion[]` | Conditional | Empty array if no results | Array of movie suggestions (0-10 items). Only present when `Response` is "True" |
| `totalResults` | `string` | Conditional | Numeric string | Total matches found by OMDb (e.g., "148"). Only present when `Response` is "True" |
| `Response` | `string` | Yes | `"True"` or `"False"` | API success indicator. "False" means error occurred |
| `Error` | `string` | Conditional | Non-empty when `Response` is "False" | Human-readable error message (e.g., "Movie not found!", "Too many results.") |

### TypeScript Interface

```typescript
interface BroadSearchResponse {
  Search?: SearchSuggestion[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}
```

### Relationships

- **Contains Many SearchSuggestions**: `Search` array holds 0-10 suggestions
- **Alternative to Movie**: When `Response` is "False", no `Search` array exists; `Error` field explains failure

### Validation Rules

1. **Success Case**: `Response === "True"` → `Search` array exists (may be empty if no matches)
2. **Error Case**: `Response === "False"` → `Error` string exists, `Search` undefined
3. **Empty Results**: `Response === "True"` + `Search.length === 0` → Display "No movies found—try broader terms!" (FR-012)
4. **Timeout Handling**: If fetch aborted after 10s, treat as error case (FR-020, FR-035)

---

## Entity Extensions (Modified from Base Feature)

### Movie (existing, no changes)

**Status**: No modifications required. Existing interface from `001-landing-page` continues to work for detail fetch after suggestion selection.

**Usage**: When user clicks suggestion with `imdbID`, existing `searchMovie()` function (modified to `searchMovieDetail()`) fetches full `Movie` object using `t` parameter.

---

### SearchState (existing, EXTENDED)

**Purpose**: Manages state for both autocomplete suggestions and selected movie details

**Modifications**: Add `suggestions` field to track autocomplete dropdown state alongside existing `movieData`

### Updated TypeScript Interface

```typescript
interface SearchState {
  loading: boolean;                    // (existing) True during API fetch (both broad + detail)
  movieData: Movie | null;              // (existing) Selected movie's full details
  suggestions: SearchSuggestion[];      // (NEW) Current autocomplete suggestions (0-5 items)
  error: string | null;                 // (existing) Error message for display
}
```

### State Transitions

| Trigger | `loading` | `suggestions` | `movieData` | `error` | Notes |
|---------|-----------|---------------|-------------|---------|-------|
| User types (≥2 chars) | `true` | `[]` (old cleared) | `null` (cleared) | `null` | Debounce starts |
| Broad search succeeds | `false` | `[...results]` | `null` | `null` | Populate dropdown |
| Broad search fails | `false` | `[]` | `null` | `"Search hiccup—retry soon"` | FR-019 error |
| User selects suggestion | `true` | `[]` (dropdown closes) | `null` | `null` | Detail fetch starts |
| Detail fetch succeeds | `false` | `[]` | `{...movie}` | `null` | Display MovieCard |
| Detail fetch fails | `false` | `[]` | `null` | `"Search hiccup—retry soon"` | FR-020 error |
| User presses Escape | `false` | `[]` (dropdown closes) | (unchanged) | `null` | FR-011 |
| Click outside dropdown | `false` | `[]` (dropdown closes) | (unchanged) | `null` | FR-010 |
| User types <2 chars | `false` | `[]` | `null` | `null` | Clear all |

---

## State Management Architecture

### Hook: useAutocomplete (NEW)

**Responsibility**: Manage autocomplete-specific state (suggestions, debouncing, broad search API calls)

**State**:
```typescript
const [query, setQuery] = useState<string>("");
const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

**Effects**:
1. Debounce effect: `useEffect(() => { ... }, [query])` - Trigger broad search 300ms after typing stops
2. Click-outside effect: `useEffect(() => { ... }, [])` - Close dropdown on external clicks

**Exposed API**:
```typescript
{
  query,
  setQuery,
  suggestions,
  loading,
  error,
  clearSuggestions: () => void,
  selectSuggestion: (imdbID: string) => void
}
```

---

### Hook: useMovieSearch (EXTENDED)

**Responsibility**: Extend existing hook to handle suggestion selection → detail fetch

**Modifications**:
- Add `searchMovieDetail(imdbID: string)` function (calls existing OMDb `t` parameter endpoint)
- Existing `searchState` continues to manage `movieData` + `error`

**Integration Point**:
- When user clicks suggestion in `SuggestionsDropdown`, it calls `useAutocomplete.selectSuggestion(imdbID)`
- `selectSuggestion` calls `useMovieSearch.searchMovieDetail(imdbID)`
- Detail fetch populates `movieData`, triggers `MovieCard` render

---

## Data Flow Diagram

```
User Input
    ↓
SearchBar (query state)
    ↓
useAutocomplete hook
    ↓ (debounce 300ms, min 2 chars)
searchMovieBroad(query) API call
    ↓
BroadSearchResponse
    ↓ (extract Search array, limit to 5)
SearchSuggestion[] → suggestions state
    ↓
SuggestionsDropdown component
    ↓ (user clicks suggestion)
selectSuggestion(imdbID)
    ↓
searchMovieDetail(imdbID) API call
    ↓
Movie → movieData state
    ↓
MovieCard component
```

---

## Validation Summary

**Total Entities**: 3 (2 new + 1 extended)  
- SearchSuggestion (new)
- BroadSearchResponse (new)
- SearchState (extended)

**Validation Rules Defined**: 11  
- Query length minimum (2 chars)
- Suggestion display limit (5 items)
- Timeout thresholds (3s user-facing, 10s API abort)
- Uniqueness guarantees (imdbID)
- State transition completeness (7 transitions documented)

**Constitution Compliance**:
- ✅ Simple data structures (plain TypeScript interfaces, no classes)
- ✅ In-memory state only (React hooks, no localStorage for suggestions)
- ✅ Type safety enforced (strict TypeScript interfaces)
- ✅ No external state libraries (Zustand/Redux rejected per research Q5)

**Next Artifact**: Generate API contracts in `contracts/omdb-broad-search-api.md`
