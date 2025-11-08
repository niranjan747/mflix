# Research: Movie Flix Landing Page

**Feature**: 001-landing-page  
**Date**: 2025-11-08  
**Phase**: 0 - Technical Research

## Purpose

Resolve technical unknowns and establish best practices for implementing the Movie Flix landing page using React, TypeScript, Vite, and Tailwind CSS with OMDb API integration.

## Research Questions & Findings

### 1. React Hooks for State Management

**Question**: Which React hooks pattern best supports simple movie search state (loading, results, error) and theme persistence?

**Decision**: Use `useState` for component state and `useEffect` for side effects (API calls, localStorage). Create custom hooks `useMovieSearch` and `useTheme` for encapsulation.

**Rationale**:
- Constitution mandates "simple React hooks" (Principle II) - avoid external state libraries unless specs demand
- `useState` + `useEffect` sufficient for 3 state variables: `loading`, `movieData`, `error`
- Custom hooks promote reusability and testability (though Zero Testing Policy means manual verification only)
- localStorage access via `useEffect` with dependency array `[]` ensures theme loads on mount

**Alternatives Considered**:
- **Zustand/Redux**: Rejected - overkill for simple local state, violates constitution's simplicity principle
- **useReducer**: Rejected - unnecessary complexity for 3 boolean/object state variables
- **Context API**: Rejected - no prop drilling issues with single-page flat component tree

**Implementation Pattern**:
```typescript
// useMovieSearch.tsx
const useMovieSearch = () => {
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const searchMovie = async (query: string) => {
    // API fetch logic with 10s timeout
  };
  
  return { loading, movieData, error, searchMovie };
};
```

---

### 2. OMDb API Error Handling Patterns

**Question**: What's the robust pattern for handling OMDb API errors (rate limits, 404s, timeouts, invalid keys) per constitution requirements?

**Decision**: Use try-catch with `AbortController` for 10-second timeout, specific error messages for user, console logging in development mode only.

**Rationale**:
- Spec requires 10s timeout (FR-014), user-friendly messages (FR-013), console-only errors (FR-014)
- `AbortController` is native browser API, no external dependency
- Check `response.Response` field from OMDb (`"False"` indicates error, `"Error"` field has message)

**Alternatives Considered**:
- **axios with timeout**: Rejected - adds 11KB dependency, Vite project defaults to `fetch`
- **Promise.race with setTimeout**: Rejected - less clean than AbortController, deprecated pattern

**Implementation Pattern**:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch(url, { signal: controller.signal });
  const data = await response.json();
  
  if (data.Response === "False") {
    // OMDb returned error (e.g., "Movie not found!")
    throw new Error(data.Error || "Movie not found—try another!");
  }
  
  return data;
} catch (err) {
  if (err.name === 'AbortError') {
    console.error('API timeout after 10s');
    throw new Error("Search failed—check connection");
  }
  console.error('API error:', err);
  throw new Error("Search failed—check connection");
} finally {
  clearTimeout(timeoutId);
}
```

---

### 3. Tailwind Dark Mode Implementation

**Question**: How to implement light/dark theme toggle with Tailwind's `dark:` prefix and localStorage persistence?

**Decision**: Use Tailwind's `class` strategy (add `dark` class to `<html>` element) + localStorage key `theme` with values `"light"` | `"dark"`.

**Rationale**:
- Tailwind supports `media` (OS preference) or `class` (manual toggle) - constitution requires user toggle control, so `class` strategy
- Faster than CSS variables, better TypeScript integration
- localStorage ensures persistence across reloads (FR-003)

**Alternatives Considered**:
- **Media query strategy**: Rejected - doesn't support manual user toggle
- **CSS custom properties**: Rejected - more verbose, slower in Tailwind workflow
- **sessionStorage**: Rejected - doesn't persist across browser sessions

**Configuration** (tailwind.config.js):
```javascript
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

**Implementation Pattern**:
```typescript
// useTheme.tsx
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return { theme, toggleTheme };
};
```

---

### 4. Image Lazy Loading with Missing Poster Handling

**Question**: Best practice for lazy-loading OMDb poster images while handling missing/invalid URLs (FR-011, FR-015)?

**Decision**: Use native `loading="lazy"` attribute + `onError` handler to swap in film reel icon (via Tailwind CSS or inline SVG).

**Rationale**:
- Native lazy loading is zero-config, supported in modern browsers (Chrome 76+, Firefox 75+)
- No external library needed (e.g., react-lazyload), faster bundle size
- `onError` event fires when OMDb returns `"N/A"` or invalid URL
- Tailwind doesn't include icons—use heroicons (React) or inline SVG for film reel

**Alternatives Considered**:
- **Intersection Observer API**: Rejected - unnecessary complexity when native `loading="lazy"` exists
- **react-lazyload library**: Rejected - adds dependency, increases bundle size
- **Placeholder image URL**: Rejected - requires hosting/external image, increases load time

**Implementation Pattern**:
```tsx
// MovieCard.tsx
const [imgError, setImgError] = useState(false);

<img
  src={movie.Poster !== "N/A" ? movie.Poster : undefined}
  alt={movie.Title}
  loading="lazy"
  onError={() => setImgError(true)}
  className={imgError ? "hidden" : "w-full h-64 object-cover"}
/>
{(imgError || movie.Poster === "N/A") && (
  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
    {/* Film reel icon SVG or heroicons */}
    <FilmIcon className="w-16 h-16 text-gray-400" />
  </div>
)}
```

---

### 5. Responsive Grid Layout with Tailwind Breakpoints

**Question**: What Tailwind utility classes achieve 1-column (mobile), 2-column (tablet), 3-column (desktop) grid per FR-009?

**Decision**: Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` on results container.

**Rationale**:
- Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- FR-009 specifies 320px (mobile) = 1 col, 768px (tablet) = 2 cols, 1024px+ (desktop) = 3 cols
- `gap-4` (16px) provides visual breathing room between cards
- Mobile-first approach (default `grid-cols-1`, then override at breakpoints)

**Alternatives Considered**:
- **Flexbox**: Rejected - CSS Grid simpler for equal-width columns
- **Custom breakpoints**: Rejected - Tailwind defaults align with spec requirements

**Implementation Pattern**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {movieData && <MovieCard movie={movieData} />}
</div>
```

---

### 6. Plot Text Truncation (300 Characters)

**Question**: Client-side vs CSS truncation for plot text (FR-012)?

**Decision**: Use JavaScript `.slice(0, 300) + "..."` for exact character control, not CSS `line-clamp` (which truncates by lines, not characters).

**Rationale**:
- FR-012 specifies 300 *characters*, not lines
- CSS `line-clamp` is line-based, varies by font size and container width (imprecise)
- JavaScript guarantees exact 300-char cutoff regardless of styling

**Alternatives Considered**:
- **CSS `line-clamp`**: Rejected - imprecise character count
- **Server-side truncation**: Rejected - no backend, OMDb API doesn't support truncation param

**Implementation Pattern**:
```typescript
const truncatePlot = (plot: string): string => {
  return plot.length > 300 ? plot.slice(0, 300) + "..." : plot;
};

// In MovieCard component
<p className="text-sm text-gray-600 dark:text-gray-300">
  {truncatePlot(movie.Plot)}
</p>
```

---

### 7. Environment Variable Access in Vite

**Question**: How to securely access `VITE_OMDB_API_KEY` per FR-008 security requirements?

**Decision**: Create `.env` file in project root with `VITE_OMDB_API_KEY=3a5d28b8`, access via `import.meta.env.VITE_OMDB_API_KEY`.

**Rationale**:
- Vite requires `VITE_` prefix to expose env vars to client code (security by default)
- `import.meta.env` is Vite's native API (not `process.env` like Node.js)
- Add `.env` to `.gitignore` to prevent key exposure in version control

**Alternatives Considered**:
- **Hardcode in source**: Rejected - violates FR-008 and security section of constitution
- **Backend proxy**: Rejected - no backend per architecture, adds unnecessary complexity

**Setup**:
1. Create `.env`:
   ```
   VITE_OMDB_API_KEY=3a5d28b8
   ```
2. Add to `.gitignore`:
   ```
   .env
   ```
3. Access in code:
   ```typescript
   const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
   const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${query}`;
   ```

---

### 8. TypeScript Interfaces for OMDb API Response

**Question**: What TypeScript interface structure handles OMDb API response fields + missing data?

**Decision**: Define `Movie` interface with optional fields for missing data scenarios.

**Implementation**:
```typescript
// types/movie.ts
export interface Movie {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;           // Can be "N/A"
  imdbRating: string;       // Can be "N/A"
  Response?: string;        // "True" or "False"
  Error?: string;           // Present if Response is "False"
}
```

**Rationale**:
- Matches OMDb API response schema (capitalized keys)
- Optional `Response` and `Error` for error handling
- `Poster` and `imdbRating` are strings (can be "N/A"), require runtime checks

---

## Summary

All technical unknowns resolved. Ready for Phase 1 (data modeling + contracts).

**Key Decisions**:
1. Custom hooks (`useMovieSearch`, `useTheme`) for state management
2. `AbortController` for 10s API timeout
3. Tailwind `class` strategy for dark mode
4. Native `loading="lazy"` + `onError` for images
5. Tailwind grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
6. JavaScript `.slice()` for 300-char plot truncation
7. Vite `.env` with `VITE_OMDB_API_KEY`
8. TypeScript `Movie` interface with optional fields

**No additional research needed** - proceeding to Phase 1.
