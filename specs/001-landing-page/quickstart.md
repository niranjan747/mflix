# Quickstart: Movie Flix Landing Page Manual Validation

**Feature**: 001-landing-page  
**Date**: 2025-11-08  
**Purpose**: Manual validation checklist for Zero Testing Policy compliance

---

## Prerequisites

1. **Node.js**: v18+ installed (`node --version`)
2. **Package Manager**: npm or yarn
3. **Browser**: Chrome, Firefox, Safari, or Edge (latest version)
4. **Environment**: `.env` file created with `VITE_OMDB_API_KEY=3a5d28b8`

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

**Expected Output**: Dependencies installed successfully (React, Vite, Tailwind CSS, TypeScript)

---

### 2. Create Environment File

Create `.env` in project root:

```bash
# Windows PowerShell
New-Item .env -ItemType File
```

Add content:
```
VITE_OMDB_API_KEY=3a5d28b8
```

**Verify**: `.env` file exists in root directory, not committed to git (check `.gitignore`)

---

### 3. Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
VITE v5.x.x ready in XXX ms

➜ Local:   http://localhost:5173/
➜ Network: use --host to expose
```

**Verify**: Server starts on port 5173, no errors in terminal

---

## Manual Validation Checklist

### ✅ User Story 1: Search and View Movie Details (P1 - MVP)

#### Test 1.1: Successful Movie Search (Enter Key)
- [ ] **Action**: Open `http://localhost:5173/`
- [ ] **Action**: Type "Inception" in search bar
- [ ] **Action**: Press Enter key
- [ ] **Expected**: Loading indicator appears ("Searching..." with spinner)
- [ ] **Expected**: Movie card displays within 2 seconds showing:
  - Poster image (loaded lazily)
  - Title: "Inception (2010)"
  - Plot snippet (truncated if >300 chars)
  - IMDb rating (e.g., "8.8")
- [ ] **Pass/Fail**: ___________

#### Test 1.2: Successful Movie Search (Button Click)
- [ ] **Action**: Reload page
- [ ] **Action**: Type "The Matrix" in search bar
- [ ] **Action**: Click search button (magnifying glass icon)
- [ ] **Expected**: Movie card displays for "The Matrix"
- [ ] **Pass/Fail**: ___________

#### Test 1.3: Movie Not Found
- [ ] **Action**: Type "NonexistentMovieTitle12345" in search bar
- [ ] **Action**: Press Enter
- [ ] **Expected**: Message displays "Movie not found—try another!"
- [ ] **Expected**: No broken UI or console errors
- [ ] **Pass/Fail**: ___________

#### Test 1.4: Whitespace Trimming
- [ ] **Action**: Type "   Interstellar   " (with leading/trailing spaces)
- [ ] **Action**: Press Enter
- [ ] **Expected**: Search succeeds, query trimmed to "Interstellar"
- [ ] **Expected**: Movie card displays correctly
- [ ] **Pass/Fail**: ___________

#### Test 1.5: Multiple Searches
- [ ] **Action**: Search for "Inception"
- [ ] **Action**: Wait for results to display
- [ ] **Action**: Search for "Avatar"
- [ ] **Expected**: Previous "Inception" results are replaced by "Avatar" results
- [ ] **Expected**: No duplicate cards or stale data
- [ ] **Pass/Fail**: ___________

#### Test 1.6: Loading State
- [ ] **Action**: Search for any movie
- [ ] **Expected**: "Searching..." text appears below search bar immediately
- [ ] **Expected**: Subtle spinner icon visible during API request
- [ ] **Expected**: Loading indicator disappears when results load or error occurs
- [ ] **Pass/Fail**: ___________

---

### ✅ User Story 2: Theme Personalization (P2)

#### Test 2.1: Default Light Theme
- [ ] **Action**: Open `http://localhost:5173/` in incognito/private window (no localStorage)
- [ ] **Expected**: Light theme active by default:
  - White background
  - Dark text
  - Sun icon on theme toggle button
- [ ] **Pass/Fail**: ___________

#### Test 2.2: Toggle to Dark Theme
- [ ] **Action**: Click theme toggle button (sun icon)
- [ ] **Expected**: UI switches to dark theme instantly (<100ms):
  - Dark background
  - Light text
  - Moon icon on theme toggle button
- [ ] **Pass/Fail**: ___________

#### Test 2.3: Toggle Back to Light Theme
- [ ] **Action**: Click theme toggle button (moon icon)
- [ ] **Expected**: UI switches back to light theme instantly
- [ ] **Pass/Fail**: ___________

#### Test 2.4: Theme Persistence (Dark)
- [ ] **Action**: Set theme to dark
- [ ] **Action**: Reload page (`Ctrl+R` or `Cmd+R`)
- [ ] **Expected**: Dark theme persists after reload
- [ ] **Verify**: localStorage key `theme` = `"dark"` (check DevTools)
- [ ] **Pass/Fail**: ___________

#### Test 2.5: Theme Persistence (Light)
- [ ] **Action**: Set theme to light
- [ ] **Action**: Reload page
- [ ] **Expected**: Light theme persists after reload
- [ ] **Verify**: localStorage key `theme` = `"light"` (check DevTools)
- [ ] **Pass/Fail**: ___________

---

### ✅ User Story 3: Mobile-Responsive Browsing (P3)

#### Test 3.1: Mobile Layout (320px)
- [ ] **Action**: Open DevTools (`F12`)
- [ ] **Action**: Enable responsive mode (`Ctrl+Shift+M` or `Cmd+Shift+M`)
- [ ] **Action**: Set viewport to 320px width
- [ ] **Expected**: 
  - Search bar displays full-width
  - Movie card displays in single-column layout (1 column)
  - Touch targets ≥44px (search button, theme toggle)
- [ ] **Action**: Perform a search
- [ ] **Expected**: Results render correctly in 1-column grid
- [ ] **Pass/Fail**: ___________

#### Test 3.2: Tablet Layout (768px)
- [ ] **Action**: Set viewport to 768px width
- [ ] **Expected**: Movie cards display in 2-column grid
- [ ] **Pass/Fail**: ___________

#### Test 3.3: Desktop Layout (1024px+)
- [ ] **Action**: Set viewport to 1024px width
- [ ] **Expected**: Movie cards display in 3-column grid
- [ ] **Pass/Fail**: ___________

#### Test 3.4: 4K Display (2560px)
- [ ] **Action**: Set viewport to 2560px width
- [ ] **Expected**: Layout remains functional (3-column grid scales appropriately)
- [ ] **Pass/Fail**: ___________

---

### ✅ Edge Cases

#### Test 4.1: Empty Search Query
- [ ] **Action**: Clear search input
- [ ] **Action**: Press Enter (or click search button)
- [ ] **Expected**: No API call made (check Network tab)
- [ ] **Expected**: Optional: Subtle validation hint appears
- [ ] **Pass/Fail**: ___________

#### Test 4.2: Whitespace-Only Query
- [ ] **Action**: Type "     " (only spaces)
- [ ] **Action**: Press Enter
- [ ] **Expected**: No API call made (trimmed to empty string)
- [ ] **Pass/Fail**: ___________

#### Test 4.3: Missing Poster Image
- [ ] **Action**: Search for a movie with missing poster (e.g., obscure indie film)
- [ ] **Expected**: Film reel icon or movie clapperboard placeholder displays instead of broken image
- [ ] **Expected**: Card layout remains intact
- [ ] **Pass/Fail**: ___________

#### Test 4.4: Long Plot Text
- [ ] **Action**: Search for a movie with long plot (e.g., "The Lord of the Rings")
- [ ] **Expected**: Plot text truncated at 300 characters with "..." ellipsis
- [ ] **Verify**: Character count in DevTools ≤303 (300 + "...")
- [ ] **Pass/Fail**: ___________

#### Test 4.5: Special Characters in Title
- [ ] **Action**: Search for "Amélie" (with accented character)
- [ ] **Expected**: Search succeeds, results display correctly
- [ ] **Expected**: URL encoding handled automatically by fetch API
- [ ] **Pass/Fail**: ___________

#### Test 4.6: API Timeout (Simulated)
- [ ] **Action**: Enable DevTools Network throttling (Slow 3G)
- [ ] **Action**: Perform a search
- [ ] **Expected**: If response takes >10 seconds, timeout error triggers
- [ ] **Expected**: Message displays "Search failed—check connection"
- [ ] **Expected**: Console logs timeout error (development only)
- [ ] **Pass/Fail**: ___________

#### Test 4.7: Network Offline
- [ ] **Action**: Enable DevTools Offline mode
- [ ] **Action**: Perform a search
- [ ] **Expected**: Message displays "Search failed—check connection"
- [ ] **Expected**: Console logs network error
- [ ] **Pass/Fail**: ___________

---

### ✅ Performance Validation

#### Test 5.1: Initial Page Load
- [ ] **Action**: Open `http://localhost:5173/` with DevTools Performance tab
- [ ] **Action**: Record page load
- [ ] **Expected**: Page loads and renders navbar + search bar in <2 seconds
- [ ] **Verify**: Check Performance timeline
- [ ] **Pass/Fail**: ___________

#### Test 5.2: Theme Toggle Speed
- [ ] **Action**: Click theme toggle button
- [ ] **Expected**: UI updates within 100ms (instant to human perception)
- [ ] **Verify**: No visible lag or flicker
- [ ] **Pass/Fail**: ___________

#### Test 5.3: Search Workflow
- [ ] **Action**: Measure time from search submission to result display
- [ ] **Expected**: Results appear in <10 seconds total (including API response time)
- [ ] **Expected**: Client-side rendering completes in <2 seconds (excluding API)
- [ ] **Pass/Fail**: ___________

#### Test 5.4: Image Lazy Loading
- [ ] **Action**: Search for a movie
- [ ] **Action**: Check Network tab for poster image request
- [ ] **Expected**: Image loads progressively (lazy attribute works)
- [ ] **Expected**: Page remains interactive while image loads
- [ ] **Pass/Fail**: ___________

---

### ✅ Accessibility Validation

#### Test 6.1: Keyboard Navigation
- [ ] **Action**: Use Tab key to navigate
- [ ] **Expected**: Can reach search input, search button, theme toggle via keyboard
- [ ] **Expected**: Enter key submits search from input field
- [ ] **Pass/Fail**: ___________

#### Test 6.2: ARIA Labels
- [ ] **Action**: Inspect search input and theme toggle in DevTools
- [ ] **Expected**: Appropriate ARIA labels present (e.g., `aria-label="Search for movies"`)
- [ ] **Pass/Fail**: ___________

#### Test 6.3: Alt Text for Images
- [ ] **Action**: Inspect poster image in DevTools
- [ ] **Expected**: `alt` attribute set to movie title
- [ ] **Pass/Fail**: ___________

#### Test 6.4: Color Contrast
- [ ] **Action**: Use WAVE browser extension or DevTools Accessibility tab
- [ ] **Expected**: Text-to-background contrast ratio ≥4.5:1 (WCAG AA)
- [ ] **Pass/Fail**: ___________

---

## Console Error Check

After completing all tests:
- [ ] **Action**: Review browser console
- [ ] **Expected**: No unhandled errors or warnings (except intentional API error logs during edge case tests)
- [ ] **Pass/Fail**: ___________

---

## Bundle Size Validation

```bash
npm run build
```

- [ ] **Action**: Check `dist/` folder size after build
- [ ] **Expected**: Total bundle size <1MB (per constitution)
- [ ] **Verify**: Run `du -sh dist/` (macOS/Linux) or check folder properties (Windows)
- [ ] **Pass/Fail**: ___________

---

## Summary

**Total Tests**: 35  
**Passed**: _____ / 35  
**Failed**: _____ / 35

**Blocker Issues** (must fix before merge):
- [ ] None / List issues:

**Minor Issues** (can defer):
- [ ] None / List issues:

**Date Validated**: ___________  
**Validator Name**: ___________

---

## Next Steps

- If all tests pass → Proceed to `/speckit.tasks` to generate task list
- If blockers exist → Fix issues and re-run failed tests
- If minor issues → Document in GitHub issues, proceed with caution

---

**Note**: This manual validation replaces automated testing per Zero Testing Policy (Constitution Principle III). All acceptance criteria validated via localhost observation.
