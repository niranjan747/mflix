# Data Model: Movie Flix Landing Page

**Feature**: 001-landing-page  
**Date**: 2025-11-08  
**Phase**: 1 - Data Design

## Purpose

Define TypeScript interfaces and state structures for the Movie Flix landing page, capturing entities from the specification and OMDb API integration.

## Entities

### 1. Movie (External API Response)

**Source**: OMDb API (`http://www.omdbapi.com/?apikey=...&t=...`)

**Description**: Represents a single movie's metadata returned from OMDb API search.

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `Title` | `string` | Yes | Movie title | Non-empty string |
| `Year` | `string` | Yes | Release year (e.g., "2010") | 4-digit string |
| `Plot` | `string` | Yes | Movie plot/synopsis | Truncate at 300 chars if length > 300 |
| `Poster` | `string` | Yes | Poster image URL or "N/A" | Check if equals "N/A" or onError |
| `imdbRating` | `string` | Yes | IMDb rating (e.g., "8.8") or "N/A" | Display as-is (text format) |
| `Response` | `string` | No | API success indicator: "True" or "False" | Used for error detection |
| `Error` | `string` | No | Error message if Response is "False" | Display user-friendly version |

**Relationships**: None (single entity, no foreign keys)

**State Transitions**: N/A (immutable API response)

**TypeScript Interface**:
```typescript
export interface Movie {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;           // Can be "N/A"
  imdbRating: string;       // Can be "N/A"
  Response?: string;        // "True" | "False"
  Error?: string;           // Present when Response is "False"
}
```

---

### 2. SearchState (Client-Side State)

**Source**: React component state (managed by `useMovieSearch` hook)

**Description**: Tracks the current search operation status, results, and errors.

**Fields**:

| Field | Type | Required | Description | Initial Value |
|-------|------|----------|-------------|---------------|
| `loading` | `boolean` | Yes | True while API request is in flight | `false` |
| `movieData` | `Movie \| null` | Yes | Movie object if search succeeds, null otherwise | `null` |
| `error` | `string \| null` | Yes | Error message for user display, null if no error | `null` |

**State Transitions**:
1. **Idle** → **Loading**: User submits search → `loading = true`, `error = null`, `movieData = null`
2. **Loading** → **Success**: API returns data → `loading = false`, `movieData = {...}`, `error = null`
3. **Loading** → **Error**: API fails/timeout → `loading = false`, `movieData = null`, `error = "Search failed—check connection"`
4. **Success/Error** → **Loading**: New search submitted → return to transition 1

**TypeScript Interface**:
```typescript
export interface SearchState {
  loading: boolean;
  movieData: Movie | null;
  error: string | null;
}
```

---

### 3. ThemePreference (LocalStorage Persistence)

**Source**: localStorage key `theme`

**Description**: User's selected color scheme (light or dark), persisted across sessions.

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `theme` | `"light" \| "dark"` | Yes | Current theme | Default to "light" if not in localStorage |

**Storage Format**:
- **Key**: `"theme"`
- **Value**: `"light"` or `"dark"` (string)

**State Transitions**:
1. **Initial Load**: Read from localStorage → if key exists, use value; else default to "light"
2. **Toggle**: User clicks theme button → swap "light" ↔ "dark", save to localStorage, update DOM class

**TypeScript Type**:
```typescript
export type Theme = "light" | "dark";
```

---

## Validation Rules

### Movie Entity
1. **Plot Truncation**: If `Plot.length > 300`, truncate to 300 characters and append "..."
2. **Poster Handling**: If `Poster === "N/A"` or image fails to load, display film reel icon placeholder
3. **Rating Display**: If `imdbRating === "N/A"`, display as-is (no special handling, per spec assumption)
4. **Error Detection**: If `Response === "False"`, extract `Error` field for user message

### SearchState
1. **Mutual Exclusivity**: Only one of `movieData` or `error` can be non-null at a time
2. **Loading Constraint**: `loading = true` implies `movieData = null` and `error = null` (reset previous state)

### ThemePreference
1. **Persistence**: Every theme change MUST write to localStorage immediately
2. **DOM Sync**: `theme === "dark"` MUST add `dark` class to `<html>`, remove on "light"

---

## Data Flow

```
User Input (Search Query)
    ↓
useMovieSearch Hook
    ↓
API Fetch (10s timeout)
    ↓
[SUCCESS]                    [FAILURE]
    ↓                            ↓
Parse Movie JSON          Set error message
    ↓                            ↓
Validate/Truncate Plot    Update SearchState
    ↓                            ↓
Update SearchState        Display error UI
    ↓
Display MovieCard
```

```
User Click (Theme Toggle)
    ↓
useTheme Hook
    ↓
Toggle theme value ("light" ↔ "dark")
    ↓
Write to localStorage
    ↓
Update <html> class attribute
    ↓
Tailwind CSS applies dark: variants
```

---

## Edge Case Handling

| Scenario | Validation | User Feedback |
|----------|------------|---------------|
| Empty search query | Prevent API call if `query.trim() === ""` | Optional: subtle validation hint |
| API timeout (>10s) | AbortController cancels request | Display "Search failed—check connection" |
| Invalid API key | OMDb returns `Response: "False"` | Display "Search failed—check connection" |
| Movie not found | OMDb returns `Response: "False", Error: "Movie not found!"` | Display "Movie not found—try another!" |
| Missing poster | `Poster === "N/A"` or `onError` event | Display film reel icon |
| Long plot text | `Plot.length > 300` | Truncate to 300 chars + "..." |
| localStorage unavailable | `getItem` throws error | Default to "light" theme, no persistence |

---

## No Database Schema

Per constitution and spec, there is **no backend or database**. All data is:
- **Transient** (API responses in React state, cleared on reload)
- **Client-only** (localStorage for theme preference only)

---

## Summary

Three primary data structures:
1. **Movie**: OMDb API response format (TypeScript interface)
2. **SearchState**: Client-side search operation state
3. **ThemePreference**: localStorage-persisted user preference

All validation rules defined. No complex relationships or state machines. Ready for Phase 1 contracts generation.
